const express = require('express');
const router = express.Router();
const { applyStudent, loginStudent, getStudentDocument } = require('../controllers/studentController');
const { protect, studentOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');

// Application with documents (logged-in students only)
router.post(
    '/apply',
    protect,
    studentOnly,
    upload.fields([
        { name: 'communityCertificate', maxCount: 1 },
        { name: 'marksheet', maxCount: 1 },
    ]),
    applyStudent
);

router.post('/login', authLimiter, loginStudent);

// Uploaded documents are private: served only through this route
router.get('/:id/documents/:type', protect, getStudentDocument);

module.exports = router;
