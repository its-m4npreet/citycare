# CityCare Backend API

Complete backend API for CityCare civic issue reporting system.

## 🚀 Features

- User management with Clerk authentication
- Issue reporting and tracking
- File uploads (images and videos)
- Real-time statistics
- RESTful API design
- MongoDB database
- Complete CRUD operations

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── userController.js    # User operations
│   └── issueController.js   # Issue operations
├── models/
│   ├── User.js              # User schema
│   └── Issue.js             # Issue schema
├── routes/
│   ├── userRoutes.js        # User API routes
│   └── issueRoutes.js       # Issue API routes
├── middleware/
│   ├── errorHandler.js      # Error handling
│   └── validateRequest.js   # Request validation
├── uploads/                 # File upload directory
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md               # This file
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with your MongoDB connection. Update these values if needed:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### 3. Create Uploads Directory

```bash
mkdir uploads
```

### 4. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profile` | Create or update user profile |
| GET | `/profile/:clerkId` | Get user by Clerk ID |
| GET | `/stats/:clerkId` | Get user statistics |
| PUT | `/address/:clerkId` | Update user address |
| DELETE | `/profile/:clerkId` | Delete user |

### Issue Routes (`/api/issues`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new issue (with file upload) |
| GET | `/` | Get all issues (with filters) |
| GET | `/stats/dashboard` | Get dashboard statistics |
| GET | `/user/:clerkId` | Get user's issues |
| GET | `/:id` | Get single issue by ID |
| PUT | `/:id` | Update issue |
| POST | `/:id/updates` | Add update to issue |
| DELETE | `/:id` | Delete issue |

## 📝 API Usage Examples

### 1. Create User Profile

```javascript
POST /api/users/profile
Content-Type: application/json

{
  "clerkId": "user_123abc",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "imageUrl": "https://example.com/avatar.jpg",
  "phone": "+1234567890"
}
```

### 2. Create Issue (with file upload)

```javascript
POST /api/issues
Content-Type: multipart/form-data

{
  "clerkId": "user_123abc",
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Potholes",
  "location": "123 Main St, City",
  "urgency": "high",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "images": [file1, file2],  // File uploads
  "videos": [file3]           // File uploads
}
```

### 3. Get User's Issues

```javascript
GET /api/issues/user/user_123abc?status=pending
```

### 4. Update Issue

```javascript
PUT /api/issues/650abc123def456
Content-Type: application/json

{
  "status": "in-progress",
  "description": "Updated description"
}
```

### 5. Add Issue Update

```javascript
POST /api/issues/650abc123def456/updates
Content-Type: application/json

{
  "message": "Work has started on fixing this issue",
  "updatedBy": "Admin",
  "status": "in-progress"
}
```

### 6. Get Dashboard Statistics

```javascript
GET /api/issues/stats/dashboard

Response:
{
  "success": true,
  "data": {
    "totalIssues": 150,
    "pendingIssues": 45,
    "inProgressIssues": 30,
    "resolvedIssues": 75,
    "breakdown": [...]
  }
}
```

## 🗄️ Database Schemas

### User Schema

```javascript
{
  clerkId: String (required, unique),
  email: String (required, unique),
  firstName: String (required),
  lastName: String,
  imageUrl: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: String (user/admin/moderator),
  isActive: Boolean,
  stats: {
    totalReports: Number,
    resolvedReports: Number,
    pendingReports: Number
  },
  timestamps: true
}
```

### Issue Schema

```javascript
{
  userId: ObjectId (ref: User),
  clerkId: String (required),
  title: String (required),
  description: String (required),
  category: String (enum),
  location: {
    address: String (required),
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  urgency: String (low/medium/high/critical),
  status: String (pending/in-progress/resolved/rejected),
  media: {
    images: Array,
    videos: Array
  },
  updates: Array,
  assignedTo: String,
  priority: Number (1-5),
  resolvedAt: Date,
  timestamps: true
}
```

## 🔧 Frontend Integration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Example fetch in React:

```javascript
// Create issue
const createIssue = async (formData) => {
  const data = new FormData();
  data.append('clerkId', user.id);
  data.append('title', formData.title);
  data.append('description', formData.description);
  // ... add other fields
  
  if (formData.image) {
    data.append('images', formData.image);
  }
  
  const response = await fetch('http://localhost:5000/api/issues', {
    method: 'POST',
    body: data
  });
  
  return await response.json();
};

// Get user issues
const getUserIssues = async (clerkId) => {
  const response = await fetch(`http://localhost:5000/api/issues/user/${clerkId}`);
  return await response.json();
};
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Your frontend application

Example cURL command:
```bash
curl -X POST http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{"clerkId":"user_123","email":"test@example.com","firstName":"Test"}'
```

## 🐛 Error Handling

All endpoints return consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 📊 Response Format

Success responses:

```javascript
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "pagination": { ... } // For list endpoints
}
```

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting
- Add authentication middleware
- Validate and sanitize all inputs
- Set proper CORS policies

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **multer** - File uploads
- **express-validator** - Input validation

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Use environment-specific MongoDB URI
6. Enable HTTPS

## 📞 Support

For issues or questions, check:
- MongoDB connection
- Port availability (5000)
- Environment variables
- Node.js version (v14+ required)

## ✅ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` file
3. ✅ Create uploads folder: `mkdir uploads`
4. ✅ Start server: `npm run dev`
5. ✅ Test with Postman or frontend
6. ✅ Integrate with frontend application
