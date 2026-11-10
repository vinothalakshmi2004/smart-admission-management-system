const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { applyStudent, loginStudent } = require('../controllers/studentController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, and PNG files are allowed'));
        }
    }
});

// Route for student application submission with file uploads
router.post('/apply', upload.fields([
    { name: 'communityCertificate', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 }
]), applyStudent);

// Route for student login
router.post('/login', loginStudent);

module.exports = router;
