const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register (For setup/demo purposes mainly)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role });
    
    // Auto-login after register
    const token = generateToken(user.id, user.role);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.cookie('token', token, { httpOnly: true });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
