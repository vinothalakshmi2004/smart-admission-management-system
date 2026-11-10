const asyncHandler = require('express-async-handler');
const Admission = require('../models/Admission');
const Course = require('../models/Course');
const Student = require('../models/Student');
const razorpay = require('../utils/razorpay');
const { findCourseByName } = require('../utils/admission');

const badRequest = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

const amountDue = (application) =>
    Number(application.totalFees) ||
    (application.admissionFees || 0) + (application.oneTimeFees || 0) + (application.semesterFees || 0);

/** Load the student's own application and check it can be paid now. */
const loadPayableApplication = async (applicationId, studentId) => {
    const application = await Admission.findById(applicationId);
    if (!application) throw badRequest('Application not found', 404);
    if (application.studentId.toString() !== studentId.toString()) throw badRequest('Not authorized', 403);
    if (application.paymentStatus === 'Paid') throw badRequest('Fees are already paid for this application');
    if (application.status !== 'Approved') throw badRequest('Fees can be paid only after the application is approved');

    const courseDoc = await findCourseByName(application.course);
    if (courseDoc && courseDoc.totalSeats > 0 && courseDoc.filledSeats >= courseDoc.totalSeats) {
        throw badRequest(`Sorry, no seats are left in ${application.course}`);
    }
    return application;
};

/**
 * Mark an application as paid exactly once, then count the seat.
 * Safe to call twice: the second call changes nothing.
 */
const markApplicationPaid = async (applicationId, details, io) => {
    const updated = await Admission.findOneAndUpdate(
        { _id: applicationId, paymentStatus: { $ne: 'Paid' } },
        {
            $set: {
                paymentStatus: 'Paid',
                paymentMethod: details.method,
                razorpayOrderId: details.orderId,
                razorpayPaymentId: details.paymentId,
                paidAmount: details.amount,
                paidAt: new Date(),
            },
        },
        { new: true }
    );
    if (!updated) return { application: await Admission.findById(applicationId), alreadyPaid: true };

    await Student.updateOne({ _id: updated.studentId }, { paymentStatus: 'Paid' });

    const courseDoc = await findCourseByName(updated.course);
    if (courseDoc) {
        const course = await Course.findByIdAndUpdate(courseDoc._id, { $inc: { filledSeats: 1 } }, { new: true });
        if (io && course) {
            io.emit('seats_updated', { course: course.name, filledSeats: course.filledSeats, totalSeats: course.totalSeats });
        }
    } else {
        console.warn(`Payment for "${updated.course}": course not found in Seat Matrix, seat not counted`);
    }
    if (io) io.emit('status_updated', { _id: updated._id, studentId: updated.studentId, status: updated.status });
    return { application: updated, alreadyPaid: false };
};

// @desc    Is online payment available? (key id is public)
// @route   GET /api/payments/config
// @access  Public
const getPaymentConfig = (req, res) => {
    const enabled = razorpay.isConfigured();
    res.json({
        enabled,
        testMode: enabled && razorpay.isTestMode(),
        keyId: enabled ? process.env.RAZORPAY_KEY_ID : null,
        // Without keys, a simulated payment is allowed only during development
        demoPayment: !enabled && process.env.NODE_ENV !== 'production',
    });
};

// @desc    Create a Razorpay order for an approved application
// @route   POST /api/payments/order   body: { applicationId }
// @access  Private/Student (owner)
const createPaymentOrder = asyncHandler(async (req, res) => {
    if (!razorpay.isConfigured()) throw badRequest('Online payment is not set up yet. Please contact the admission office.', 503);

    const application = await loadPayableApplication(req.body.applicationId, req.user._id);
    const amount = Math.round(amountDue(application) * 100); // paise
    if (amount < 100) throw badRequest('Fee amount is not set for this application');

    const order = await razorpay.createOrder({
        amount,
        receipt: `adm_${application._id}`,
        notes: { applicationId: String(application._id), studentId: String(application.studentId), course: application.course },
    });

    application.razorpayOrderId = order.id;
    await application.save();

    res.status(201).json({
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        testMode: razorpay.isTestMode(),
        prefill: {
            name: application.studentName,
            email: application.email,
            // Razorpay expects +<country code><number>
            contact: /^\d{10}$/.test(application.contactNumber) ? `+91${application.contactNumber}` : application.contactNumber,
        },
        description: `Admission fees - ${application.course}`,
    });
});

// @desc    Verify a Razorpay payment and confirm the admission
// @route   POST /api/payments/verify
//          body: { applicationId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// @access  Private/Student (owner)
const verifyPayment = asyncHandler(async (req, res) => {
    if (!razorpay.isConfigured()) throw badRequest('Online payment is not set up', 503);

    const { applicationId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;

    const application = await Admission.findById(applicationId);
    if (!application) throw badRequest('Application not found', 404);
    if (application.studentId.toString() !== req.user._id.toString()) throw badRequest('Not authorized', 403);

    // Already confirmed (e.g. the browser sent verify twice)
    if (application.paymentStatus === 'Paid') {
        if (application.razorpayPaymentId === paymentId) return res.json(application);
        throw badRequest('Fees are already paid for this application');
    }

    if (!orderId || orderId !== application.razorpayOrderId) throw badRequest('Payment does not match this application');
    if (!razorpay.isValidSignature(orderId, paymentId, signature)) throw badRequest('Payment verification failed');

    // Double-check with Razorpay: right order, right amount, money received
    let payment = await razorpay.fetchPayment(paymentId);
    const expected = Math.round(amountDue(application) * 100);
    if (payment.order_id !== orderId || Number(payment.amount) !== expected) {
        throw badRequest('Payment amount does not match the fees');
    }
    if (payment.status === 'authorized') {
        payment = await razorpay.capturePayment(paymentId, payment.amount);
    }
    if (payment.status !== 'captured') {
        throw badRequest(`Payment not completed (status: ${payment.status})`);
    }

    const { application: updated } = await markApplicationPaid(
        application._id,
        {
            method: String(payment.method || 'online').toUpperCase(),
            orderId,
            paymentId,
            amount: payment.amount / 100,
        },
        req.io
    );
    res.json(updated);
});

module.exports = { getPaymentConfig, createPaymentOrder, verifyPayment, markApplicationPaid, loadPayableApplication };
