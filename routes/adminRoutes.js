const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
};

// @route   GET api/admin/stats
// @desc    Get system-wide statistics
// @access  Admin
router.get('/stats', auth, adminCheck, adminController.getSystemStats);

// @route   GET api/admin/settings
// @desc    Get system settings
// @access  Admin
router.get('/settings', auth, adminCheck, adminController.getSettings);

// @route   PUT api/admin/settings
// @desc    Update system settings
// @access  Admin
router.put('/settings', auth, adminCheck, adminController.updateSettings);

module.exports = router;
