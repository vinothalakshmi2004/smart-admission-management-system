const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const createDefaultUsers = require('./utils/createAdmin');

// ── Required settings ──
const missing = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missing.length) {
    console.error(`❌ Missing required setting(s) in .env: ${missing.join(', ')}`);
    process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;

// Browser origins allowed to call the API from another address.
// Comma-separated, e.g. CLIENT_URL=https://admissions.example.com
const allowedOrigins = (process.env.CLIENT_URL || (isProduction ? '' : 'http://localhost:5173,http://localhost:4173'))
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

const corsOrigin = (origin, callback) => {
    // Same-origin requests and tools without an Origin header are fine;
    // other origins get no CORS headers, so the browser blocks them.
    callback(null, !origin || allowedOrigins.includes(origin));
};

connectDB().then(() => createDefaultUsers());

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
});

if (isProduction) app.set('trust proxy', 1); // correct client IPs behind a hosting proxy

// ── Core middleware ──
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                // Razorpay Checkout loads its script and opens its payment window in an iframe
                scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
                connectSrc: ["'self'", 'ws:', 'wss:', 'https://*.razorpay.com', ...allowedOrigins],
                frameSrc: ['https://api.razorpay.com', 'https://checkout.razorpay.com'],
                objectSrc: ["'none'"],
                // Helmet adds upgrade-insecure-requests by default. On a plain-HTTP host,
                // Safari/iPhone then fails to load the CSS/JS (blank page), so it is opt-in.
                upgradeInsecureRequests: process.env.FORCE_HTTPS === 'true' ? [] : null,
            },
        },
    })
);
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Give controllers access to Socket.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ── API routes ──
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found' }));

// ── React app (production build) ──
// Uploaded documents are NOT served publicly; see GET /api/students/:id/documents/:type
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
    app.use(express.static(clientDist, { index: false, maxAge: isProduction ? '1h' : 0 }));
    app.get(/^\/(?!api\/|socket\.io\/).*/, (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
} else {
    app.get('/', (req, res) => res.send('API is running...'));
}

// ── Error handling (must be after routes) ──
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
    let message = err.message || 'Server error';

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        message = err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be 5 MB or smaller' : `Upload error: ${err.message}`;
    } else if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Record not found';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    } else if (err.type === 'entity.too.large') {
        statusCode = 413;
        message = 'Request is too large';
    }

    if (statusCode >= 500) console.error(err);
    res.status(statusCode).json({
        message: statusCode >= 500 && isProduction ? 'Server error. Please try again later.' : message,
        stack: isProduction ? undefined : err.stack,
    });
});

// ── Socket.io ──
io.on('connection', (socket) => {
    if (!isProduction) console.log('Client connected', socket.id);
});

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
