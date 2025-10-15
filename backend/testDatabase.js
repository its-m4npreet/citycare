const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Test Issue model
    const Issue = require('./models/Issue');
    const User = require('./models/User');
    
    console.log('\n🔍 Testing Issue model...');
    
    // Check if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Count documents
    const userCount = await User.countDocuments();
    const issueCount = await Issue.countDocuments();
    
    console.log('\n📊 Document counts:');
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Issues: ${issueCount}`);
    
    if (issueCount > 0) {
      console.log('\n📋 Sample issues:');
      const sampleIssues = await Issue.find().limit(3).select('title status createdAt');
      sampleIssues.forEach(issue => {
        console.log(`  - ${issue.title} (${issue.status}) - ${issue.createdAt}`);
      });
    }
    
    console.log('\n✅ Database test completed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
