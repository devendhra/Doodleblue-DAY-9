const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {

    const MONGODB_URI = process.env.MONGODB_URI;


    if(!MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);    // Ctrl + C to stop the server
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);    // Ctrl + C to stop the server
    }
};

module.exports = connectDB;
