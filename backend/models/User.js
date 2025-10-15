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
  }
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

module.exports = mongoose.model('User', userSchema);
