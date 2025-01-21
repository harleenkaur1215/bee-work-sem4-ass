const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to capture request details and write to a file
app.use((req, res, next) => {
    // Capture request details
    const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname
    };

    // Convert object to JSON string and add a newline
    const logString = JSON.stringify(logEntry) + '\n';

    // Define the log file path
    const logFilePath = path.join(__dirname, 'requests.log');

    // Append log entry to the file
    fs.appendFile(logFilePath, logString, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    next(); // Proceed to the next middleware or route handler
});

// Sample routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express logging app!');
});

app.get('/about', (req, res) => {
    res.send('About Us Page');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
