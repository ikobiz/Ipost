const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Temporary in-memory post store
let posts = [];

// POST /posts — create a new post
app.post('/posts', (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ error: 'Username and content are required.' });
  }

  const post = {
    id: posts.length + 1,
    username,
    content,
    timestamp: new Date()
  };

  posts.push(post);
  res.status(201).json(post);
});

// GET /posts — retrieve all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
