const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');

// FIX #5: Path Traversal - Remediated
// We strictly validate inputs against an allowlist to prevent accessing unauthorized files.
router.get('/logs', verifyToken, isAdmin, (req, res) => {
    const filename = req.query.file || 'app.log';
    
    // REMEDIATION: Strict Allowlist
    const ALLOWED_FILES = ['app.log', 'error.log'];
    
    if (!ALLOWED_FILES.includes(filename)) {
        return res.status(400).json({ message: 'Invalid or unauthorized log file.' });
    }

    // Since 'filename' is now strictly controlled, path traversal is impossible here.
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
