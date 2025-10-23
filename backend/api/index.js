const serverless = require('serverless-http');

let app;

try {
  app = require('../server');
} catch (err) {
  // Log synchronous require errors (will appear in Vercel build logs)
  console.error('Error requiring ../server:', err && err.stack ? err.stack : err);
  throw err;
}

try {
  module.exports = serverless(app);
} catch (err) {
  // Log initialization errors for the serverless wrapper
  console.error('Error initializing serverless handler:', err && err.stack ? err.stack : err);
  throw err;
}
