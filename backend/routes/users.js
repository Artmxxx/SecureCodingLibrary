const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');

// List all users (Admin only) - Vulnerability Potential: Broken Access Control if we remove isAdmin
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'] // Exclude password
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent deleting self (optional but good UX) or verify logic
    // if (req.user.id === user.id) return res.status(400).json({message: "Cannot delete self"});

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
