const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream'); // For log rotation

// Create an Express application
const app = express();

// Directory for logs
const logDirectory = path.join(__dirname, 'logs');

// Ensure the log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating log stream (rotate after 1MB)
const logStream = rfs.createStream('requests.log', {
  size: '1M',               // Rotate after 1MB
  interval: '1d',            // Rotate every day
  compress: 'gzip',          // Compress old log files
  path: logDirectory
});

// Define the custom logging format with additional details
morgan.token('timestamp', () => new Date().toISOString());
morgan.token('ip', (req) => req.ip);
morgan.token('method', (req) => req.method);
morgan.token('url', (req) => req.originalUrl);
morgan.token('protocol', (req) => req.protocol);
morgan.token('hostname', (req) => req.hostname);
morgan.token('user-agent', (req) => req.get('User-Agent'));
morgan.token('query', (req) => JSON.stringify(req.query)); // Log query parameters
morgan.token('headers', (req) => JSON.stringify(req.headers)); // Log headers

// Setup Morgan middleware to log requests in JSON format with enhanced details
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    timestamp: tokens.timestamp(req, res),
    ip: tokens.ip(req, res),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    protocol: tokens.protocol(req, res),
    hostname: tokens.hostname(req, res),
    'user-agent': tokens['user-agent'](req, res),
    query: tokens.query(req, res),
    headers: tokens.headers(req, res)
  });
}, { stream: logStream }));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Define a route to test query parameters and headers logging
app.get('/test', (req, res) => {
  res.json({
    message: "This is a test route",
    queryParams: req.query,
    headers: req.headers
  });
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
