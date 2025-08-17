const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role = 'user' } = req.body;
  const db = getDatabase();

  // Check if user already exists
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    if (row) {
      db.close();
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
      [username, hashedPassword, role], function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to create user' });
      }

      const token = jwt.sign(
        { id: this.lastID, username, role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      db.close();
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: this.lastID, username, role }
      });
    });
  });
});

// Login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDatabase();

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      db.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    db.close();
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  });
});

module.exports = router;

