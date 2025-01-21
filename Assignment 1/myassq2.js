const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to capture request details
app.use((req, res, next) => {
    // Collecting request details
    const requestDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname
    };

    console.log('Request Details:', requestDetails);

    // Proceed to the next middleware or route handler
    next();
});

// Sample routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js app!');
});

app.get('/about', (req, res) => {
    res.send('About Us Page');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
