// Seat Matrix seeder
//   npm run seed           -> adds every standard course (60 seats) that is not in the database yet
//   npm run seed -- -d     -> deletes ALL courses (asks for --yes to confirm)
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Course = require('./models/Course');
const DEPARTMENT_COURSES = require('./data/departments');
const { escapeRegex } = require('./utils/admission');

const durationFor = (name) => (/^(m\.|mba|mca|msw)/i.test(name) ? '2 Years' : '3 Years');

const importCourses = async () => {
    let added = 0;
    for (const [department, courses] of Object.entries(DEPARTMENT_COURSES)) {
        for (const name of courses) {
            const exists = await Course.exists({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
            if (exists) continue;
            await Course.create({ name, department, duration: durationFor(name), totalSeats: 60, filledSeats: 0 });
            added += 1;
        }
    }
    console.log(`✅ Seat Matrix ready: ${added} course(s) added.`);
};

const destroyCourses = async () => {
    if (!process.argv.includes('--yes')) {
        console.log('This deletes ALL courses. Run again with: npm run seed -- -d --yes');
        return;
    }
    const { deletedCount } = await Course.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount} course(s).`);
};

(async () => {
    try {
        await connectDB();
        if (process.argv.includes('-d')) await destroyCourses();
        else await importCourses();
    } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
