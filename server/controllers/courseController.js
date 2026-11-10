const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        res.json(course);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const { name, description, duration, eligibility, fees, totalSeats, filledSeats } = req.body;

    const course = new Course({
        name,
        description,
        duration,
        eligibility,
        fees,
        totalSeats: totalSeats || 60,
        filledSeats: filledSeats || 0
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const { name, description, duration, eligibility, fees, totalSeats, filledSeats } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
        course.name = name || course.name;
        course.description = description || course.description;
        course.duration = duration || course.duration;
        course.eligibility = eligibility || course.eligibility;
        course.fees = fees || course.fees;
        course.totalSeats = totalSeats !== undefined ? totalSeats : course.totalSeats;
        course.filledSeats = filledSeats !== undefined ? filledSeats : course.filledSeats;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
