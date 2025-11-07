const User = require('../models/User');

// @desc    Create or update user profile
// @route   POST /api/users/profile
// @access  Public
exports.createOrUpdateUser = async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, imageUrl, phone, address } = req.body;

    console.log('📝 Received user data:', { clerkId, email, firstName, lastName });

    // Validate required fields
    if (!clerkId || !email || !firstName) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Clerk ID, email, and first name are required',
        received: { clerkId: !!clerkId, email: !!email, firstName: !!firstName }
      });
    }

    // Find user by clerkId or create new
    console.log('🔍 Searching for user with clerkId:', clerkId);
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      console.log('✏️ Updating existing user:', user._id);
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName || user.lastName;
      user.imageUrl = imageUrl || user.imageUrl;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      
      await user.save();

      console.log('✅ User updated successfully:', user._id);
      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: user
      });
    } else {
      // Create new user
      console.log('➕ Creating new user...');
      user = await User.create({
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl,
        phone,
        address
      });

      console.log('✅ User created successfully:', user._id);
      return res.status(201).json({
        success: true,
        message: 'User profile created successfully',
        data: user
      });
    }
  } catch (error) {
    console.error('❌ Error in createOrUpdateUser:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    // Check for duplicate key error (email or clerkId already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error(`Duplicate ${field}:`, error.keyValue[field]);
      
      // If duplicate clerkId, try to find and return the existing user
      if (field === 'clerkId') {
        const existingUser = await User.findOne({ clerkId: error.keyValue.clerkId });
        if (existingUser) {
          console.log('✅ Returning existing user with duplicate clerkId');
          return res.status(200).json({
            success: true,
            message: 'User already exists',
            data: existingUser
          });
        }
      }
      
      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
        field: field
      });
    }
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating/updating user profile',
      error: error.message
    });
  }
};

// @desc    Get user profile by Clerk ID
// @route   GET /api/users/profile/:clerkId
// @access  Public
exports.getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getUserByClerkId:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats/:clerkId
// @access  Public
exports.getUserStats = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update stats before returning
    await user.updateStats();

    res.status(200).json({
      success: true,
      data: user.stats
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

// @desc    Update user address
// @route   PUT /api/users/address/:clerkId
// @access  Public
exports.updateUserAddress = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { street, city, state, zipCode } = req.body;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.address = {
      street: street || user.address?.street,
      city: city || user.address?.city,
      state: state || user.address?.state,
      zipCode: zipCode || user.address?.zipCode
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in updateUserAddress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile/:clerkId
// @access  Public
exports.deleteUser = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications/:clerkId
// @access  Public
exports.getUserNotifications = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { limit = 20, unreadOnly = false } = req.query;

    const user = await User.findOne({ clerkId }).populate({
      path: 'notifications.issueId',
      select: 'title status category'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let notifications = user.notifications;

    // Filter for unread only if requested
    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.isRead);
    }

    // Limit the number of notifications
    notifications = notifications.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: user.notifications.filter(n => !n.isRead).length
    });
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:clerkId/:notificationId/read
// @access  Public
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { clerkId, notificationId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = user.notifications.id(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/:clerkId/read-all
// @access  Public
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.notifications.forEach(notification => {
      notification.isRead = true;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};
