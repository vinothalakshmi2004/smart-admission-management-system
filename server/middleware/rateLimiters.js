const rateLimit = require('express-rate-limit');

const message = (text) => ({ message: text });

// Login / register: 20 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: message('Too many login attempts. Please try again in 15 minutes.'),
});

// Public forms (enquiry, contact): 10 submissions per 15 minutes per IP
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: message('Too many submissions. Please try again later.'),
});

module.exports = { authLimiter, formLimiter };
