const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createIssue,
  getAllIssues,
  getUserIssues,
  getIssueById,
  updateIssue,
  addIssueUpdate,
  deleteIssue,
  getDashboardStats
} = require('../controllers/issueController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

// Issue routes
router.post('/', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 }
]), createIssue);

router.get('/', getAllIssues);
router.get('/stats/dashboard', getDashboardStats);
router.get('/user/:clerkId', getUserIssues);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.post('/:id/updates', addIssueUpdate);
router.delete('/:id', deleteIssue);

module.exports = router;
