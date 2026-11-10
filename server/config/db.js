const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connection Established!`);
        console.log(`🔗 Host: ${conn.connection.host}`);
        console.log(`📦 DB Name: ${conn.connection.name}`);

        // Final sanity check
        if (conn.connection.name === 'test' && !process.env.MONGO_URI.includes('test')) {
            console.warn("⚠️  Warning: Mongoose connected to 'test' database. Check your connection string!");
        }
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
