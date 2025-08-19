const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const POSTS_FILE = path.join(__dirname, 'posts.json');

// Load posts from file
let posts = [];
try {
  const data = fs.readFileSync(POSTS_FILE, 'utf8');
  posts = JSON.parse(data);
} catch (err) {
  console.error('Could not read posts.json:', err);
}

// Save posts to file
function savePosts() {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

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
  savePosts();
  res.status(201).json(post);
});

// GET /posts — retrieve all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
