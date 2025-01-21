const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();

// Create a write stream (in append mode) for the requests.log file
const logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });

// Define the custom logging format
morgan.token('timestamp', () => new Date().toISOString());
morgan.token('ip', (req) => req.ip);
morgan.token('method', (req) => req.method);
morgan.token('url', (req) => req.originalUrl);
morgan.token('protocol', (req) => req.protocol);
morgan.token('hostname', (req) => req.hostname);

// Setup Morgan middleware to log requests in JSON format
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    timestamp: tokens.timestamp(req, res),
    ip: tokens.ip(req, res),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    protocol: tokens.protocol(req, res),
    hostname: tokens.hostname(req, res)
  });
}, { stream: logStream }));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
