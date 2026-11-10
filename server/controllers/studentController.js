const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Store student application form data
// @route   POST /api/students/apply
// @access  Public (Registration + Application)
const applyStudent = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Handle uploaded files
    const communityCertificate = req.files && req.files['communityCertificate']
        ? req.files['communityCertificate'][0].path
        : undefined;
    const marksheet = req.files && req.files['marksheet']
        ? req.files['marksheet'][0].path
        : undefined;

    const studentData = {
        ...req.body,
        ...(communityCertificate && { communityCertificate }),
        ...(marksheet && { marksheet })
    };

    // Check if student already exists
    let student = await Student.findOne({ email });

    if (student) {
        // Update existing student with application details
        Object.assign(student, studentData);
        await student.save();
        res.status(200).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
            message: 'Application updated successfully'
        });
    } else {
        // Create new student with all application details
        student = await Student.create(studentData);

        if (student) {
            res.status(201).json({
                _id: student._id,
                name: student.name,
                email: student.email,
                token: generateToken(student._id),
                message: 'Application and Registration successful'
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    }
});

// @desc    Authenticate student & login
// @route   POST /api/students/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student && (await student.matchPassword(password))) {
        res.json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
            role: 'student'
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

module.exports = {
    applyStudent,
    loginStudent
};
