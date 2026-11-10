const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    if (!header.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try Staff first, then Student
        let user = await Staff.findById(decoded.id).select('-password');
        if (user) {
            req.user = user;
            req.userType = user.role; // 'admin' or 'staff'
        } else {
            user = await Student.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                req.userType = 'student';
            }
        }
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    return next();
});

const admin = (req, res, next) => {
    if (req.user && req.userType === 'admin') return next();
    return res.status(403).json({ message: 'Not authorized as an admin' });
};

// Admission office: admins and staff
const staffOrAdmin = (req, res, next) => {
    if (req.user && (req.userType === 'admin' || req.userType === 'staff')) return next();
    return res.status(403).json({ message: 'Not authorized: staff or admin only' });
};

const studentOnly = (req, res, next) => {
    if (req.user && req.userType === 'student') return next();
    return res.status(403).json({ message: 'Only students can do this' });
};

module.exports = { protect, admin, staffOrAdmin, studentOnly };
