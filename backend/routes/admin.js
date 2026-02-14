const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');

// VULNERABILITY #5: Path Traversal (Medium)
// Admin can view logs, but the filename is not sanitized.
// Attack: /api/admin/logs?file=../../.env
router.get('/logs', verifyToken, isAdmin, (req, res) => {
    const filename = req.query.file || 'app.log';
    
    // In a real app, strict validation should be here:
    // if (!['app.log', 'error.log'].includes(filename)) ...

    // Flawed implementation: just joining path
    // The 'logs' directory is assumed to be at the project root or backend root
    const logDir = path.join(__dirname, '../logs');
    
    // Ensure log directory exists for validity
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    // Create a dummy log file if not exists
    if (!fs.existsSync(path.join(logDir, 'app.log'))) {
        fs.writeFileSync(path.join(logDir, 'app.log'), '[INFO] Server started\n[INFO] User 1 logged in');
    }

    const filePath = path.join(logDir, filename);

    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            res.json({ filename, content });
        } else {
            res.status(404).json({ message: 'Log file not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error reading file' });
    }
});

module.exports = router;
