const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, 'users.json');

// Safely read users.json
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

// Safely write to users.json
function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing users.json:', err);
  }
}

// Add a new user (plain password for now)
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

// Validate user login
function validateUser(username, passwordHash) {
  const users = readUsers();
  const user = users[username];
  if (!user) return false;
  return user.passwordHash === passwordHash;
}

// Update last login timestamp
function updateLastLogin(username) {
  const users = readUsers();
  if (!users[username]) return false;
  users[username].lastLogin = new Date().toISOString();
  writeUsers(users);
  return true;
}

module.exports = {
  readUsers,
  writeUsers,
  addUser,
  validateUser,
  updateLastLogin
};
