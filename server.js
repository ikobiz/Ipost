const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// File paths
const USERS_FILE = path.join(__dirname, 'users.json');
const POSTS_FILE = path.join(__dirname, 'posts.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// --- User Utilities ---
function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return {};
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return {};
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing users.json:', err);
  }
}

function addUser(username, passwordHash) {
  const users = readUsers();
  if (!username || !passwordHash || users[username]) return false;

  users[username] = {
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLogin: null
  };

  writeUsers(users);
  return true;
}

function validateUser(username, passwordHash) {
  const users = readUsers();
  const user = users[username];
  if (!user) return false;
  return user.passwordHash === passwordHash;
}

function updateLastLogin(username) {
  const users = readUsers();
  if (!users[username]) return false;
  users[username].lastLogin = new Date().toISOString();
  writeUsers(users);
  return true;
}

// --- Post Utilities ---
function readPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) return [];
    const data = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading posts.json:', err);
    return [];
  }
}

function writePosts(posts) {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Error writing posts.json:', err);
  }
}

// --- Routes ---

// Serve index.html explicitly (optional but safe)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (addUser(username, password)) {
    res.status(200).send('Registered successfully');
  } else {
    res.status(400).send('Username taken or invalid input');
  }
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (validateUser(username, password)) {
    updateLastLogin(username);
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/api/my-posts', (req, res) => {
  const username = req.session.username;
  if (!username) return res.status(401).send({ error: 'Not logged in' });

  const allPosts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
  const userPosts = allPosts.filter(post => post.user === username);
  res.send(userPosts);
});


// Create Post
app.post('/posts', (req, res) => {
  const { user, content } = req.body;
  if (!user || !content) return res.status(400).send('Missing user or content');

  const posts = readPosts();
  posts.push({
    user,
    content,
    timestamp: new Date().toISOString()
  });

  writePosts(posts);
  res.status(200).send('Post saved');
});

// Get Posts
app.get('/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


// Change Password
app.post('/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).send('Missing fields');
  }

  const users = readUsers();
  const user = users[username];

  if (!user || user.passwordHash !== currentPassword) {
    return res.status(401).send('Invalid current password');
  }

  user.passwordHash = newPassword;
  writeUsers(users);
  res.status(200).send('Password updated successfully');
});
