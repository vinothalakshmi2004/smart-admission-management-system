const asyncHandler = require('express-async-handler');
const Admission = require('../models/Admission');
const Student = require('../models/Student');
const razorpay = require('../utils/razorpay');
const { findCourseByName, computeFees, escapeRegex } = require('../utils/admission');
const { loadPayableApplication, markApplicationPaid } = require('./paymentController');

const STATUSES = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Not Eligible'];
const CLOSED_STATUSES = ['Rejected', 'Cancelled', 'Not Eligible'];
const PAYMENT_METHODS = ['DEMO', 'CARD', 'UPI', 'NET'];

const badRequest = (message) => {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
};

const clean = (value) => (value === undefined || value === null ? '' : String(value).trim());

/**
 * Validate an application for a student and return the data to save.
 * Throws a 400 error with a readable message when something is wrong.
 */
const prepareApplication = async (student, body) => {
    const data = {
        department: clean(body.department),
        course: clean(body.course),
        contactNumber: clean(body.contactNumber) || clean(student.contactNumber),
        fatherName: clean(body.fatherName),
        motherName: clean(body.motherName),
        dob: clean(body.dob),
        twelfthMark: clean(body.twelfthMark),
        twelfthGroup: clean(body.twelfthGroup),
        schoolName: clean(body.schoolName),
        aadharNumber: clean(body.aadharNumber).replace(/\s+/g, ''),
    };

    const labels = {
        department: 'department', course: 'course', contactNumber: 'contact number',
        fatherName: "father's name", motherName: "mother's name", dob: 'date of birth',
        twelfthMark: '12th mark', twelfthGroup: '12th group', schoolName: 'school name',
        aadharNumber: 'Aadhar number',
    };
    const missing = Object.keys(labels).filter((k) => !data[k]);
    if (missing.length) {
        throw badRequest(`Please fill in: ${missing.map((k) => labels[k]).join(', ')}`);
    }

    if (!/^\d{10}$/.test(data.contactNumber)) throw badRequest('Contact number must be 10 digits');
    if (!/^\d{12}$/.test(data.aadharNumber)) throw badRequest('Aadhar number must be 12 digits');

    const mark = Number(data.twelfthMark);
    if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
        throw badRequest('12th mark must be a percentage between 0 and 100');
    }
    data.twelfthMark = mark;

    const dob = new Date(data.dob);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) throw badRequest('Please enter a valid date of birth');
    data.dob = dob;

    // One active application per course
    const existing = await Admission.findOne({
        studentId: student._id,
        course: new RegExp(`^${escapeRegex(data.course)}$`, 'i'),
        status: { $nin: CLOSED_STATUSES },
    });
    if (existing) throw badRequest('You already have an application for this course');

    // Seat check (only when the course is set up in the Seat Matrix)
    const courseDoc = await findCourseByName(data.course);
    if (courseDoc && courseDoc.totalSeats > 0 && courseDoc.filledSeats >= courseDoc.totalSeats) {
        throw badRequest(`No seats left in ${courseDoc.name}`);
    }

    return { data, courseDoc };
};

/** Create the Admission record from prepared data and notify dashboards. */
const createAdmissionRecord = async (student, { data, courseDoc }, io) => {
    const admission = await Admission.create({
        studentId: student._id,
        studentName: student.name,
        email: student.email,
        ...data,
        course: courseDoc ? courseDoc.name : data.course,
        ...computeFees(data.course, data.department, courseDoc),
    });

    // Only ids go over the socket: every connected browser receives it.
    if (io) io.emit('new_application', { _id: admission._id });
    return admission;
};

// @desc    Create a new admission application (JSON, no documents)
// @route   POST /api/applications
// @access  Private/Student
const createApplication = asyncHandler(async (req, res) => {
    const prepared = await prepareApplication(req.user, req.body);
    const admission = await createAdmissionRecord(req.user, prepared, req.io);
    res.status(201).json(admission);
});

// @desc    Get logged in student's applications
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Admission.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(applications);
});

// @desc    Get all admission applications
// @route   GET /api/applications
// @access  Private/Staff or Admin
const getApplications = asyncHandler(async (req, res) => {
    const applications = await Admission.find({})
        .populate('studentId', 'name email contactNumber communityCertificate marksheet')
        .sort({ createdAt: -1 });
    res.json(applications);
});

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (owner, staff or admin)
const getApplicationById = asyncHandler(async (req, res) => {
    const application = await Admission.findById(req.params.id).populate('studentId', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const isOffice = req.userType === 'admin' || req.userType === 'staff';
    const isOwner = application.studentId && application.studentId._id.toString() === req.user._id.toString();
    if (isOffice || isOwner) return res.json(application);
    return res.status(403).json({ message: 'Not authorized to view this application' });
});

// @desc    Update application status and remarks
// @route   PUT /api/applications/:id/status
// @access  Private/Staff or Admin
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status, adminComments } = req.body;
    const application = await Admission.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status !== undefined) {
        if (!STATUSES.includes(status)) throw badRequest(`Status must be one of: ${STATUSES.join(', ')}`);
        application.status = status;
    }
    if (adminComments !== undefined) {
        application.adminComments = String(adminComments).trim().slice(0, 1000);
    }
    const updated = await application.save();

    await Student.updateOne({ _id: application.studentId }, { status: updated.status });

    if (req.io) {
        req.io.emit('status_updated', {
            _id: updated._id,
            studentId: updated.studentId,
            status: updated.status,
        });
    }
    res.json(updated);
});

// @desc    DEMO payment for development without Razorpay keys.
//          Disabled in production and whenever Razorpay is configured.
// @route   PUT /api/applications/:id/pay
// @access  Private/Student (owner)
const updatePaymentStatus = asyncHandler(async (req, res) => {
    if (razorpay.isConfigured() || process.env.NODE_ENV === 'production') {
        throw badRequest('Please pay online through Razorpay');
    }
    const method = String(req.body.paymentMethod || 'DEMO').toUpperCase();
    if (!PAYMENT_METHODS.includes(method)) throw badRequest('Unknown payment method');

    const application = await loadPayableApplication(req.params.id, req.user._id);
    const { application: updated } = await markApplicationPaid(
        application._id,
        { method, amount: application.totalFees },
        req.io
    );
    res.json(updated);
});

// @desc    Get total confirmed (paid) admissions count
// @route   GET /api/applications/stats/count
// @access  Public
const getAdmissionCount = asyncHandler(async (req, res) => {
    const count = await Admission.countDocuments({ paymentStatus: 'Paid' });
    res.json({ totalAdmissions: count });
});

module.exports = {
    prepareApplication,
    createAdmissionRecord,
    createApplication,
    getMyApplications,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    updatePaymentStatus,
    getAdmissionCount,
};
