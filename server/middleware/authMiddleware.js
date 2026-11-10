const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.toLowerCase().startsWith('bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

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
                    req.user.role = 'student';
                }
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
});

const admin = (req, res, next) => {
    if (req.user && (req.userType === 'admin' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
