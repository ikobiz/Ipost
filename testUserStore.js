const { addUser, validateUser, updateLastLogin, readUsers } = require('./userStore');

// Add a new user
console.log('Add user:', addUser('illia', 'test123')); // should be true

// Try adding the same user again
console.log('Add duplicate:', addUser('illia', 'test123')); // should be false

// Validate correct password
console.log('Valid login:', validateUser('illia', 'test123')); // should be true

// Validate incorrect password
console.log('Invalid login:', validateUser('illia', 'wrongpass')); // should be false

// Update last login timestamp
console.log('Update login time:', updateLastLogin('illia')); // should be true

// View current users
console.log('Current users:', readUsers());
