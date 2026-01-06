const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        // Force Google DNS to resolve SRV records (fixes ECONNREFUSED issues on some networks)
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env file');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.error('Full error:', err);
        // Don't exit - let server continue (might be temporary connection issue)
        // process.exit(1);
    }
};

module.exports = connectDB;
