const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const userPayload = require('../utils/userPayload');

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

// @desc    Login (checks Staff first, then Student)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const email = normaliseEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const staff = await Staff.findOne({ email });
    if (staff && (await staff.matchPassword(password))) {
        return res.json(userPayload(staff, staff.role));
    }

    const student = await Student.findOne({ email });
    if (student && (await student.matchPassword(password))) {
        return res.json(userPayload(student, 'student'));
    }

    res.status(401);
    throw new Error('Invalid email or password');
});

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = normaliseEmail(req.body.email);
    const contactNumber = String(req.body.contactNumber || '').trim();
    const { password } = req.body;

    if (!name || !email || !contactNumber || !password) {
        res.status(400);
        throw new Error('Please provide name, email, contact number, and password');
    }
    if (!/^\d{10}$/.test(contactNumber)) {
        res.status(400);
        throw new Error('Contact number must be 10 digits');
    }
    if (String(password).length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    if ((await Student.findOne({ email })) || (await Staff.findOne({ email }))) {
        res.status(400);
        throw new Error('Email already registered. Please log in or use a different email.');
    }

    try {
        const student = await Student.create({ name, email, contactNumber, password });
        res.status(201).json(userPayload(student, 'student'));
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            throw new Error('Email already registered. Please use a different email.');
        }
        throw error;
    }
});

// @desc    Change own password
// @route   PUT /api/auth/password
// @access  Private (any logged-in user)
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide your current and new password');
    }
    if (String(newPassword).length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    const Model = req.userType === 'student' ? Student : Staff;
    const account = await Model.findById(req.user._id);
    if (!account || !(await account.matchPassword(currentPassword))) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    account.password = newPassword; // hashed by the pre-save hook
    await account.save();
    res.json({ message: 'Password changed successfully' });
});

module.exports = { authUser, registerUser, changePassword };
