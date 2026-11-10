const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors'); // Removed dependency
// I'll skip colors dependency.
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();

        const admin = await User.create({
            name: 'College Admin',
            email: 'admin@college.com',
            password: 'password123',
            role: 'admin',
            contactNumber: '0000000000',
        });

        const courses = [
            {
                name: 'B.Sc Computer Science',
                description: 'Bachelor of Science in Computer Science. Focuses on programming, algorithms, and data structures.',
                duration: '3 Years',
                eligibility: '12th Pass with Mathematics',
                fees: 30000
            },
            {
                name: 'BCA (Bachelor of Computer Applications)',
                description: 'Undergraduate degree in Computer Applications. Focuses on software development and IT.',
                duration: '3 Years',
                eligibility: '12th Pass',
                fees: 35000
            },
            {
                name: 'M.Sc Computer Science',
                description: 'Master of Science in Computer Science. Advanced topics in CS.',
                duration: '2 Years',
                eligibility: 'B.Sc CS or BCA',
                fees: 40000
            },
            {
                name: 'MCA (Master of Computer Applications)',
                description: 'Postgraduate degree in Computer Applications. Professional course.',
                duration: '2 Years',
                eligibility: 'Any Degree with Maths',
                fees: 45000
            }
        ];

        await Course.insertMany(courses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
