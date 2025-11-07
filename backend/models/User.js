const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    totalReports: {
      type: Number,
      default: 0
    },
    resolvedReports: {
      type: Number,
      default: 0
    },
    pendingReports: {
      type: Number,
      default: 0
    }
  },
  notifications: [{
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['status_update', 'comment', 'resolved', 'rejected'],
      default: 'status_update'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance (avoid duplicates with unique fields above)
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

// Method to update user stats
userSchema.methods.updateStats = async function() {
  const Issue = mongoose.model('Issue');
  
  const stats = await Issue.aggregate([
    { $match: { userId: this._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  this.stats.totalReports = stats.reduce((sum, stat) => sum + stat.count, 0);
  this.stats.resolvedReports = stats.find(s => s._id === 'resolved')?.count || 0;
  this.stats.pendingReports = stats.find(s => s._id === 'pending')?.count || 0;

  await this.save();
};

// Method to add notification
userSchema.methods.addNotification = function(issueId, message, type = 'status_update') {
  this.notifications.unshift({
    issueId,
    message,
    type,
    isRead: false,
    createdAt: new Date()
  });
  
  // Keep only the last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50);
  }
};

module.exports = mongoose.model('User', userSchema);
