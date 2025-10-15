const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    if (error.message && error.message.includes('whitelist')) {
      console.error('🔐 Tip: Ensure your current IP is added to the MongoDB Atlas IP Access List.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
