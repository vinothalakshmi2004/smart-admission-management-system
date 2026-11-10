const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const { escapeRegex } = require('../utils/admission');

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
const TEXT_FIELDS = ['name', 'department', 'description', 'duration', 'eligibility'];

// Copy only known fields from the request; numbers are checked.
const applyCourseFields = async (course, body, res) => {
    for (const field of TEXT_FIELDS) {
        if (body[field] !== undefined) course[field] = String(body[field]).trim();
    }
    for (const field of ['fees', 'totalSeats', 'filledSeats']) {
        if (body[field] === undefined || body[field] === '') continue;
        const value = Number(body[field]);
        if (!Number.isFinite(value) || value < 0) {
            res.status(400);
            throw new Error(`${field} must be a number of 0 or more`);
        }
        course[field] = field === 'fees' ? value : Math.floor(value);
    }
    if (!course.name) {
        res.status(400);
        throw new Error('Course name is required');
    }
    if (course.filledSeats > course.totalSeats) {
        res.status(400);
        throw new Error('Filled seats cannot be more than total seats');
    }
    const duplicate = await Course.findOne({
        _id: { $ne: course._id },
        name: new RegExp(`^${escapeRegex(course.name)}$`, 'i'),
    });
    if (duplicate) {
        res.status(400);
        throw new Error('A course with this name already exists');
    }
};

const createCourse = asyncHandler(async (req, res) => {
    const course = new Course({ totalSeats: 60, filledSeats: 0 });
    await applyCourseFields(course, req.body, res);
    const createdCourse = await course.save();
    if (req.io) req.io.emit('seats_updated', { course: createdCourse.name, filledSeats: createdCourse.filledSeats, totalSeats: createdCourse.totalSeats });
    res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    await applyCourseFields(course, req.body, res);
    const updatedCourse = await course.save();
    if (req.io) req.io.emit('seats_updated', { course: updatedCourse.name, filledSeats: updatedCourse.filledSeats, totalSeats: updatedCourse.totalSeats });
    res.json(updatedCourse);
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
