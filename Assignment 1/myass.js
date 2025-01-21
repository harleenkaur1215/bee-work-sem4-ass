const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to capture request details and log them to a file
app.use((req, res, next) => {
    const requestDetails = {
        timestamp: new Date().toISOString(),
        ipAddress: req.ip,
        url: req.originalUrl,
        protocol: req.protocol.toUpperCase(),
        httpMethod: req.method,
        hostname: req.hostname,
    };

    console.log('--- Incoming Request Details ---');
    console.log('Timestamp:', requestDetails.timestamp);
    console.log('IP Address:', requestDetails.ipAddress);
    console.log('URL:', requestDetails.url);
    console.log('Protocol:', requestDetails.protocol);
    console.log('HTTP Method:', requestDetails.httpMethod);
    console.log('Hostname:', requestDetails.hostname);
    console.log('--------------------------------');

    // Prepare log entry as a JSON string with a newline
    const logEntry = JSON.stringify(requestDetails) + '\n';

    // Append log entry to requests.log
    const logFilePath = path.join(__dirname, 'requests.log');
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    next(); // Pass control to the next middleware or route handler
});

// Route handlers
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/about', (req, res) => {
    res.send('About Us');
});

// Dynamic route
app.get('/profile/:commentId/:Id', (req, res) => {
    const { commentId, Id } = req.params;
    res.send(`Comment ID: ${commentId} and ID: ${Id}`);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
