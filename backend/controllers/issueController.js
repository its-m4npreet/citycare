const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Public
exports.createIssue = async (req, res) => {
  try {
    const {
      clerkId,
      title,
      description,
      category,
      location,
      urgency,
      coordinates
    } = req.body;

    // Validate required fields
    if (!clerkId || !title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Find user by clerkId
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please create a profile first.'
      });
    }

    // Parse coordinates if it's a string
    let parsedCoordinates = {};
    if (coordinates) {
      if (typeof coordinates === 'string') {
        try {
          const parsed = JSON.parse(coordinates);
          // Convert lat/lng to latitude/longitude format
          parsedCoordinates = {
            latitude: parsed.lat || parsed.latitude,
            longitude: parsed.lng || parsed.longitude
          };
        } catch (e) {
          console.warn('Failed to parse coordinates:', e);
        }
      } else {
        // Convert lat/lng to latitude/longitude format
        parsedCoordinates = {
          latitude: coordinates.lat || coordinates.latitude,
          longitude: coordinates.lng || coordinates.longitude
        };
      }
    }

    // Create issue object
    const issueData = {
      userId: user._id,
      clerkId,
      title,
      description,
      category,
      location: {
        address: location,
        coordinates: parsedCoordinates
      },
      urgency: urgency || 'medium',
      media: {
        images: [],
        videos: []
      }
    };

    console.log('Creating issue with data:', JSON.stringify(issueData, null, 2));

    // Handle file uploads if present
    if (req.files) {
      if (req.files.images) {
        issueData.media.images = req.files.images.map(file => ({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        }));
      }
      if (req.files.videos) {
        issueData.media.videos = req.files.videos.map(file => ({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        }));
      }
    }

    // Create the issue
    const issue = await Issue.create(issueData);
    
    console.log('✅ Issue created successfully:', issue._id);

    // Update user stats
    await user.updateStats();
    
    console.log('✅ User stats updated');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: issue
    });
  } catch (error) {
    console.error('❌ Error in createIssue:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating issue',
      error: error.message
    });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
exports.getAllIssues = async (req, res) => {
  try {
    const { status, category, urgency, limit = 50, page = 1 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get issues with pagination
    const issues = await Issue.find(filter)
      .populate('userId', 'firstName lastName email imageUrl')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Issue.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: issues,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllIssues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message
    });
  }
};

// @desc    Get lightweight issue locations (coords + minimal fields)
// @route   GET /api/issues/locations
// @access  Public
exports.getIssueLocations = async (req, res) => {
  try {
    const { status, category, urgency, limit = 1000, page = 1 } = req.query;
    const limitInt = Number.parseInt(limit, 10) || 1000;
    const pageInt = Number.parseInt(page, 10) || 1;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    const skip = (pageInt - 1) * limitInt;

    // Select only necessary fields for safety
    const issues = await Issue.find(filter)
      .select('_id title category status urgency location')
      .sort({ createdAt: -1 })
      .limit(limitInt)
      .skip(skip)
      .lean();

    // Normalize legacy coordinate fields (lat/lng) to latitude/longitude
    const normalized = (issues || []).map((it) => {
      const location = it && it.location ? it.location : {};
      const coordinates = location && location.coordinates ? location.coordinates : {};
      const rawLat = (typeof coordinates.latitude === 'number' || typeof coordinates.latitude === 'string')
        ? coordinates.latitude
        : coordinates.lat;
      const rawLng = (typeof coordinates.longitude === 'number' || typeof coordinates.longitude === 'string')
        ? coordinates.longitude
        : coordinates.lng;
      const latitude = typeof rawLat === 'string' ? Number(rawLat) : rawLat;
      const longitude = typeof rawLng === 'string' ? Number(rawLng) : rawLng;
      return {
        _id: it._id,
        title: it.title,
        category: it.category,
        status: it.status,
        urgency: it.urgency,
        location: {
          address: location && location.address ? location.address : '',
          coordinates: { latitude, longitude },
        },
      };
    });

    // Filter out those without valid numeric coordinates
    const withCoords = normalized.filter((it) =>
      Number.isFinite(it?.location?.coordinates?.latitude) &&
      Number.isFinite(it?.location?.coordinates?.longitude)
    );

    res.status(200).json({ success: true, data: withCoords, count: withCoords.length });
  } catch (error) {
    console.error('Error in getIssueLocations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue locations',
      error: error.message,
    });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/user/:clerkId
// @access  Public
exports.getUserIssues = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { status } = req.query;

    console.log('🔍 getUserIssues - clerkId:', clerkId);
    console.log('🔍 getUserIssues - status filter:', status);

    // Build filter
    const filter = { clerkId };
    if (status) filter.status = status;

    console.log('🔍 Query filter:', JSON.stringify(filter, null, 2));

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 });

    console.log('✅ Found issues:', issues.length);

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('❌ Error in getUserIssues:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching user issues',
      error: error.message
    });
  }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Public
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('userId', 'firstName lastName email imageUrl phone');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error in getIssueById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue',
      error: error.message
    });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Public
exports.updateIssue = async (req, res) => {
  try {
    const { title, description, category, location, urgency, status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Update fields
    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (location) issue.location.address = location;
    if (urgency) issue.urgency = urgency;
    if (status) issue.status = status;

    await issue.save();

    // Update user stats if status changed
    if (status) {
      const user = await User.findById(issue.userId);
      if (user) await user.updateStats();
    }

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Error in updateIssue:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue',
      error: error.message
    });
  }
};

// @desc    Add update to issue
// @route   POST /api/issues/:id/updates
// @access  Public
exports.addIssueUpdate = async (req, res) => {
  try {
    const { message, updatedBy, status } = req.body;

    if (!message || !updatedBy) {
      return res.status(400).json({
        success: false,
        message: 'Message and updatedBy are required'
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.addUpdate(message, updatedBy, status);
    await issue.save();

    // Update user stats if status changed
    if (status) {
      const user = await User.findById(issue.userId);
      if (user) await user.updateStats();
    }

    res.status(200).json({
      success: true,
      message: 'Update added successfully',
      data: issue
    });
  } catch (error) {
    console.error('Error in addIssueUpdate:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding update',
      error: error.message
    });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Public
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const userId = issue.userId;
    await Issue.findByIdAndDelete(req.params.id);

    // Update user stats
    const user = await User.findById(userId);
    if (user) await user.updateStats();

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteIssue:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting issue',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/issues/stats/dashboard
// @access  Public
exports.getDashboardStats = async (req, res) => {
  try {
    // If DB is not connected, return zeroed stats to avoid timeouts during startup
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          totalIssues: 0,
          totalUsers: 0,
          pendingIssues: 0,
          inProgressIssues: 0,
          resolvedIssues: 0,
          breakdown: []
        }
      });
    }

    // Get issue stats by status
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIssues = stats.reduce((sum, stat) => sum + stat.count, 0);
    const pendingIssues = stats.find(s => s._id === 'pending')?.count || 0;
    const inProgressIssues = stats.find(s => s._id === 'in-progress')?.count || 0;
    const resolvedIssues = stats.find(s => s._id === 'resolved')?.count || 0;

    // Get total users count
    const User = require('../models/User');
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalIssues,
        totalUsers,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
        breakdown: stats
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
