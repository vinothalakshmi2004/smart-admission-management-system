const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
const createDefaultUsers = require('./utils/createAdmin');
connectDB().then(() => {
    createDefaultUsers(); // Create default users on server startup if not exists
});

const app = express();

// Create HTTP server and Socket.io BEFORE routes
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins in dev (Vite runs on 5173, CRA on 3000)
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Core Middleware
app.use(express.json()); // body-parser for JSON
app.use(express.urlencoded({ extended: true })); // support URL-encoded bodies
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Socket.io Middleware — attach io to every request (MUST be before routes)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/contact', contactRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (MUST be AFTER routes)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Socket.io connection events
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

