const mongoose = require('mongoose');

/**
 * Establishes a MongoDB connection if MONGODB_URI is present.
 * Safe for serverless environments:
 * - Does nothing (no exit) when MONGODB_URI is not set.
 * - Reuses an existing connection if already connected.
 * - Throws errors to the caller instead of exiting the process.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set. Skipping MongoDB connection in this environment.');
    return;
  }

  // Reuse existing connection in long-running environments
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Recommended options can be added here if needed
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    if (error.message && error.message.includes('whitelist')) {
      console.error('� Tip: Ensure your current IP is added to the MongoDB Atlas IP Access List.');
    }
    // Throw and let the caller decide how to handle the error. Avoid process.exit in serverless.
    throw error;
  }
};

module.exports = connectDB;
