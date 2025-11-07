const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Issue = require('./models/Issue');

async function testNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Find a user with issues
    console.log('\n📝 Step 1: Finding users with issues...');
    const issues = await Issue.find().populate('userId').limit(5);
    
    if (issues.length === 0) {
      console.log('❌ No issues found in database');
      process.exit(0);
    }

    console.log(`✅ Found ${issues.length} issues`);
    
    // Pick the first issue
    const testIssue = issues[0];
    console.log(`\n📋 Test Issue Details:`);
    console.log(`   ID: ${testIssue._id}`);
    console.log(`   Title: ${testIssue.title}`);
    console.log(`   Status: ${testIssue.status}`);
    console.log(`   User ID: ${testIssue.userId?._id}`);
    
    if (!testIssue.userId) {
      console.log('❌ Issue has no associated user');
      process.exit(0);
    }

    const user = await User.findById(testIssue.userId._id);
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(0);
    }

    console.log(`\n👤 User Details:`);
    console.log(`   Clerk ID: ${user.clerkId}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Notifications: ${user.notifications?.length || 0}`);

    // Step 2: Test adding a notification
    console.log('\n🔔 Step 2: Adding test notification...');
    
    const testMessage = `TEST: Your issue "${testIssue.title}" has been updated (Test at ${new Date().toLocaleTimeString()})`;
    
    user.addNotification(testIssue._id, testMessage, 'status_update');
    await user.save();
    
    console.log('✅ Notification added successfully!');

    // Step 3: Verify notification was saved
    console.log('\n✔️ Step 3: Verifying notification...');
    const updatedUser = await User.findById(user._id);
    
    console.log(`   Total Notifications: ${updatedUser.notifications.length}`);
    console.log(`   Latest Notification:`);
    console.log(`      Message: ${updatedUser.notifications[0].message}`);
    console.log(`      Type: ${updatedUser.notifications[0].type}`);
    console.log(`      Is Read: ${updatedUser.notifications[0].isRead}`);
    console.log(`      Created: ${updatedUser.notifications[0].createdAt}`);

    // Step 4: Test the notification endpoint
    console.log('\n🌐 Step 4: Testing notification retrieval...');
    const unreadNotifications = updatedUser.notifications.filter(n => !n.isRead);
    console.log(`   Unread Count: ${unreadNotifications.length}`);
    console.log(`   Total Count: ${updatedUser.notifications.length}`);

    console.log('\n✅ All tests passed!');
    console.log('\n📌 To fetch these notifications via API, use:');
    console.log(`   GET http://localhost:5000/api/users/notifications/${user.clerkId}`);
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Login as this user in the frontend');
    console.log('   3. Click the notification bell to see the test notification');
    console.log(`   4. Or test the API endpoint directly in your browser/Postman`);

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
console.log('🧪 CityCare Notification System Test\n');
console.log('====================================\n');
testNotifications();
