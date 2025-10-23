const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Connect to MongoDB (safe for serverless)
connectDB().catch((err) => {
  // Log the error; do not exit the process in serverless environments
  console.error('Database connection failed during initialization:', err.message || err);
});

// Initialize Express app
const app = express();

// CORS Configuration - Allow frontend to access the API
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

// Basic test route
app.get("/", (req, res) => {
  res.json({
    message: "🎉 CityCare API is running!",
    version: "1.0.0",
    status: "active",
  });
});

// Import Routes
const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
  });
}

// Export app for serverless adapters (Vercel, Netlify, AWS Lambda, etc.)
module.exports = app;
