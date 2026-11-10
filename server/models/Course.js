const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    filledSeats: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
