const asyncHandler = require('express-async-handler');
const Admission = require('../models/Admission');
const Course = require('../models/Course');

// @desc    Create a new admission application
// @route   POST /api/applications
// @access  Private/Student
const createApplication = asyncHandler(async (req, res) => {
    // 1. Check if user is logged in
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user missing' });
    }

    const {
        department, course, studentName, contactNumber, twelfthMark,
        twelfthGroup, schoolName, fatherName, motherName, dob, email, aadharNumber
    } = req.body;

    // 2. Validate all required fields
    const required = [
        'department', 'course', 'studentName', 'contactNumber',
        'twelfthMark', 'twelfthGroup', 'schoolName', 'fatherName',
        'motherName', 'dob', 'email', 'aadharNumber'
    ];

    const missing = required.filter(field => !req.body[field] && req.body[field] !== 0);
    if (missing.length > 0) {
        return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
    }

    // 3. Prevent duplicate applications
    const alreadyApplied = await Admission.findOne({
        studentId: req.user._id,
        course,
        department
    });

    if (alreadyApplied) {
        return res.status(400).json({ message: 'You already have an application for this course' });
    }

    // 4. Create and Save
    try {
        const admission = new Admission({
            studentId: req.user._id,
            ...req.body,
            twelfthMark: Number(twelfthMark)
        });

        console.log("Saving admission to DB...");
        const savedApplication = await admission.save();

        console.log("✅ Admission Saved Successfully!");

        // 5. Emit real-time notification to admin
        if (req.io) {
            req.io.emit('new_application', savedApplication.toObject());
        }

        return res.status(201).json(savedApplication);
    } catch (error) {
        console.error("❌ Admission Save Error:", error);
        if (error.name === 'ValidationError') {
            const msg = Object.values(error.errors).map(e => e.message).join(', ');
            return res.status(400).json({ message: `Validation Error: ${msg}` });
        }
        return res.status(500).json({ message: 'Server error saving application', error: error.message });
    }
});

// @desc    Get logged in student's applications
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Admission.find({ studentId: req.user._id });
    res.json(applications);
});

// @desc    Get all admission applications (Admin/Staff)
// @route   GET /api/applications
// @access  Private/Admin
const getApplications = asyncHandler(async (req, res) => {
    const applications = await Admission.find({})
        .populate('studentId', 'name email contactNumber')
        .sort({ createdAt: -1 });
    res.json(applications);
});

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = asyncHandler(async (req, res) => {
    const application = await Admission.findById(req.params.id).populate('studentId', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Authorization check
    const isAdmin = req.userType === 'admin' || req.user.role === 'admin' || req.user.role === 'staff';
    const isOwner = application.studentId && application.studentId._id.toString() === req.user._id.toString();

    if (isAdmin || isOwner) {
        return res.json(application);
    }
    return res.status(403).json({ message: 'Not authorized to view this application' });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status, adminComments } = req.body;
    const application = await Admission.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status || application.status;
    application.adminComments = adminComments || application.adminComments;
    const updated = await application.save();

    if (req.io) req.io.emit('status_updated', updated.toObject());
    res.json(updated);
});

// @desc    Update payment status
// @route   PUT /api/applications/:id/pay
// @access  Private/Student
const updatePaymentStatus = asyncHandler(async (req, res) => {
    const application = await Admission.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const oldPaymentStatus = application.paymentStatus;

    application.paymentStatus = 'Paid';
    application.paymentMethod = req.body.paymentMethod || 'Online';
    const updated = await application.save();

    // ── Seat Management Logic (Now on Payment) ──
    if (oldPaymentStatus !== 'Paid') {
        const courseDoc = await Course.findOne({ name: application.course });
        if (courseDoc) {
            courseDoc.filledSeats = (courseDoc.filledSeats || 0) + 1;
            await courseDoc.save();

            // Emit update for real-time seat tracking
            if (req.io) req.io.emit('seats_updated', { course: courseDoc.name, filledSeats: courseDoc.filledSeats });
        }
    }

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
    createApplication,
    getMyApplications,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    updatePaymentStatus,
    getAdmissionCount,
};
