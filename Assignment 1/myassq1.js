// Import the express module
const express = require('express');

// Create an instance of an Express app
const app = express();

// Define the port number
const PORT = 3000;

// Create a simple route
app.get('/', (req, res) => {
    res.send('Hello, Express.js server is running successfully!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
