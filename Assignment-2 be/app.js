const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// GET /posts → Display all blog posts
app.get('/posts', (req, res) => {
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts.json:', err);
            return res.status(500).send('Error reading posts.');
        }
        const posts = JSON.parse(data);
        res.render('home', { posts });
    });
});

// GET /post → Display a single post based on query parameter
app.get('/post', (req, res) => {
    const postId = parseInt(req.query.id);
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts.json:', err);
            return res.status(500).send('Error reading posts.');
        }
        const posts = JSON.parse(data);
        const post = posts.find(p => p.id === postId);
        if (!post) {
            return res.status(404).send('Post not found.');
        }
        res.render('post', { post });
    });
});

// GET /add-post → Render the form to add a new post
app.get('/add-post', (req, res) => {
    res.render('addpost');
});

// POST /add-post → Add a new post
app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts.json:', err);
            return res.status(500).send('Error reading posts.');
        }
        const posts = JSON.parse(data);
        const newPost = {
            id: posts.length + 1,
            title,
            content,
            date: new Date().toISOString()
        };
        posts.push(newPost);
        fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to posts.json:', err);
                return res.status(500).send('Error saving post.');
            }
            res.redirect('/posts');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});