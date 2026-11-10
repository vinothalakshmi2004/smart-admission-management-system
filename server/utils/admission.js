const Course = require('../models/Course');

const ADMISSION_FEE = 5000;
const ONE_TIME_FEE = 10000;

// Semester fee by keyword in the course/department name (used when the
// course in the Seat Matrix has no fee of its own).
const SEMESTER_FEE_MAP = {
    'computer science': 30000,
    commerce: 22000,
    electronics: 25000,
    maths: 22000,
    mathematics: 22000,
    language: 18000,
    'english literature': 22000,
    management: 60000,
    science: 25000,
};
const PG_KEYWORDS = ['master', 'm.sc', 'm.a', 'm.com', 'mba', 'mca', 'pg'];
const DEFAULT_SEMESTER_FEE = 25000;

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Find a course by name, ignoring case and surrounding spaces.
const findCourseByName = (name) => {
    if (!name) return null;
    return Course.findOne({ name: new RegExp(`^\\s*${escapeRegex(String(name).trim())}\\s*$`, 'i') });
};

const getSemesterFee = (course = '', department = '', courseDoc = null) => {
    if (courseDoc && Number(courseDoc.fees) > 0) return Number(courseDoc.fees);

    const combined = `${course} ${department}`.toLowerCase();
    if (PG_KEYWORDS.some((k) => combined.includes(k))) return 35000;
    for (const [key, fee] of Object.entries(SEMESTER_FEE_MAP)) {
        if (combined.includes(key)) return fee;
    }
    return DEFAULT_SEMESTER_FEE;
};

const computeFees = (course, department, courseDoc) => ({
    admissionFees: ADMISSION_FEE,
    oneTimeFees: ONE_TIME_FEE,
    semesterFees: getSemesterFee(course, department, courseDoc),
});

module.exports = { findCourseByName, computeFees, escapeRegex };
