const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const generateToken = require('../utils/generateToken');

// @desc    Login (checks Staff first, then Student)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Try Staff collection first (admin + staff)
    let user = await Staff.findOne({ email });
    let userType = null;

    if (user && (await user.matchPassword(password))) {
        userType = user.role; // 'admin' or 'staff'
    } else {
        // Try Student collection
        user = await Student.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            userType = 'student';
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userType,
        token: generateToken(user._id),
    });
});

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, contactNumber, password } = req.body;

    // Validate required fields
    if (!name || !email || !contactNumber || !password) {
        res.status(400);
        throw new Error('Please provide name, email, contact number, and password');
    }

    // Check if email already exists in Student collection
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists with this email');
    }

    // Also check Staff collection to prevent duplicate emails
    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
        res.status(400);
        throw new Error('Email already in use');
    }

    try {
        const student = await Student.create({
            name,
            email,
            contactNumber,
            password,
        });

        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            contactNumber: student.contactNumber,
            role: 'student',
            token: generateToken(student._id),
        });
    } catch (error) {
        // Handle MongoDB duplicate key error (E11000)
        if (error.code === 11000) {
            res.status(400);
            throw new Error('Email already registered. Please use a different email.');
        }
        throw error;
    }
});

module.exports = { authUser, registerUser };
