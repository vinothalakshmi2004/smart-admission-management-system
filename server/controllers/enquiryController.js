const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/Enquiry');

// @desc    Submit a new enquiry
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = asyncHandler(async (req, res) => {
    const {
        studentName,
        mobileNumber,
        email,
        fatherName,
        dob,
        schoolName,
        twelfth_group,
        course1,
        course2,
        course3,
    } = req.body;

    if (!studentName || !mobileNumber || !email || !fatherName || !dob || !schoolName || !twelfth_group || !course1 || !course2 || !course3) {
        res.status(400);
        throw new Error('Please enter all required fields');
    }

    const enquiry = new Enquiry({
        studentName,
        mobileNumber,
        email,
        fatherName,
        dob,
        schoolName,
        twelfth_group,
        course1,
        course2,
        course3,
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
});

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
});

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
        await enquiry.deleteOne();
        res.json({ message: 'Enquiry removed' });
    } else {
        res.status(404);
        throw new Error('Enquiry not found');
    }
});

module.exports = {
    submitEnquiry,
    getEnquiries,
    deleteEnquiry,
};
