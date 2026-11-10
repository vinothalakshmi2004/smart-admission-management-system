const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    eligibility: {
        type: String,
        required: false,
    },
    // Optional fields
    fees: {
        type: Number,
        required: false,
    },
    totalSeats: {
        type: Number,
        default: 60,
        min: [0, 'Total seats cannot be negative'],
    },
    filledSeats: {
        type: Number,
        default: 0,
        min: [0, 'Filled seats cannot be negative'],
    },
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
