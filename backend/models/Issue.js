const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Potholes', 'Street Lights', 'Garbage Collection', 'Water Supply', 'Drainage', 'Public Property Damage', 'Other']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: false
      },
      longitude: {
        type: Number,
        required: false
      }
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending',
    index: true
  },
  media: {
    images: [{
      url: String,
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    videos: [{
      url: String,
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  updates: [{
    message: {
      type: String,
      required: true
    },
    updatedBy: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: String,
    default: null
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  resolvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
issueSchema.index({ userId: 1, createdAt: -1 });
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ category: 1 });
issueSchema.index({ urgency: 1 });
issueSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

// Virtual for getting days since report
issueSchema.virtual('daysSinceReport').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to add update
issueSchema.methods.addUpdate = function(message, updatedBy, newStatus) {
  this.updates.push({
    message,
    updatedBy,
    status: newStatus || this.status,
    createdAt: new Date()
  });

  if (newStatus) {
    this.status = newStatus;
    
    if (newStatus === 'resolved') {
      this.resolvedAt = new Date();
    } else if (newStatus === 'rejected') {
      this.rejectedAt = new Date();
    }
  }
};

// Pre-save middleware to set priority based on urgency
issueSchema.pre('save', function(next) {
  if (this.isModified('urgency')) {
    const urgencyMap = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    this.priority = urgencyMap[this.urgency] || 1;
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
