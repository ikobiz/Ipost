const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(express.json());

/* Serve index.html from root */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* GET all posts */
app.get('/posts', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read posts.' });
    try {
      const posts = JSON.parse(data);
      res.json(posts);
    } catch {
      res.status(500).json({ error: 'Corrupted posts file.' });
    }
  });
});

/* POST a new post */
app.post('/posts', (req, res) => {
  const { username, content } = req.body;
  if (!username?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Username and content are required.' });
  }

  const newPost = { username: username.trim(), content: content.trim() };

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let posts = [];
    if (!err && data) {
      try {
        posts = JSON.parse(data);
      } catch {
        return res.status(500).json({ error: 'Corrupted posts file.' });
      }
    }

    posts.push(newPost);

    fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save post.' });
      res.status(201).json({ message: 'Post saved.' });
    });
  });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
