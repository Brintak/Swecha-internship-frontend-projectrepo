// Database connection configuration using Mongoose
const mongoose = require('mongoose');
const dns = require('dns');

// Use reliable DNS servers (Google / Cloudflare) to prevent querySrv ECONNREFUSED on local Wi-Fi / ISP
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_todo_db');
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Make sure your local MongoDB server is running or provide a valid MONGODB_URI in .env');
    // We don't necessarily exit immediately so that APIs can respond with informative 503 DB errors
  }
};

module.exports = connectDB;
