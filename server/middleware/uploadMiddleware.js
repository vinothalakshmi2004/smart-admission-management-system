const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Absolute path so uploads work whatever folder the server is started from.
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXT = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename(req, file, cb) {
        // Random, unguessable name: <field>-<32 hex chars>.<ext>
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${crypto.randomBytes(16).toString('hex')}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXT.includes(ext) && ALLOWED_MIME.includes(file.mimetype)) {
        return cb(null, true);
    }
    const err = new Error('Only PDF, JPG, and PNG files are allowed');
    err.statusCode = 400;
    return cb(err);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: 2 },
});

module.exports = { upload, UPLOAD_DIR };
