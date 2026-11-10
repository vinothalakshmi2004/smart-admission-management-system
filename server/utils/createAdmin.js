const Staff = require('../models/Staff');

// Creates the first admin account if no admin exists yet.
// Set ADMIN_EMAIL, ADMIN_PASSWORD (and optionally ADMIN_NAME) in .env.
const createDefaultUsers = async () => {
    try {
        const adminExists = await Staff.exists({ role: 'admin' });
        if (adminExists) {
            console.log('ℹ️  Admin account already exists.');
            return;
        }

        const isProduction = process.env.NODE_ENV === 'production';
        const email = (process.env.ADMIN_EMAIL || (isProduction ? '' : 'rvs@admin.com')).trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'rvs@123');

        if (!email || !password) {
            console.warn('⚠️  No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart to create one.');
            return;
        }
        if (password.length < 6) {
            console.warn('⚠️  ADMIN_PASSWORD must be at least 6 characters. Admin account not created.');
            return;
        }

        await Staff.create({
            name: process.env.ADMIN_NAME || 'RVS Admin',
            email,
            password,
            role: 'admin',
        });
        console.log(`✅ Default admin created: ${email}`);
        if (!process.env.ADMIN_PASSWORD) {
            console.warn('⚠️  Using the development admin password. Set ADMIN_PASSWORD in .env before going live.');
        }
    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
    }
};

module.exports = createDefaultUsers;
