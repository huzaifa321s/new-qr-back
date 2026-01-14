const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');

// @route   POST api/qr/static
// @desc    Create a static QR code
// @access  Public (No auth required for static QRs usually, but can be changed)
router.post('/static', qrController.createStaticQR);

// @route   POST api/qr/dynamic
// @desc    Create a dynamic QR code
// @access  Private
router.post('/dynamic', auth, qrController.createDynamicQR);

// @route   POST api/qr/preview
// @desc    Generate QR preview
// @access  Public
router.post('/preview', qrController.generatePreview);

// @route   GET api/qr/list
// @desc    List all QR codes (Admin sees all, User sees theirs)
// @access  Private
router.get('/list', auth, qrController.listQRs);

// @route   PUT api/qr/:id
// @desc    Update a QR code
// @access  Private
router.put('/:id', auth, qrController.updateQR);

// @route   GET api/qr/:shortId
// @desc    Get single QR data (Public for scanning)
// @access  Public
router.get('/:shortId', qrController.getQR);

// @route   GET api/qr/detail/:id
// @desc    Get single QR by Mongo ID
// @access  Private
router.get('/detail/:id', auth, qrController.getQRById);

// @route   POST api/qr/scan/:shortId
// @desc    Track QR scan (direct access)
// @access  Public
router.post('/scan/:shortId', qrController.trackScan);

// @route   DELETE api/qr/:id
// @desc    Delete QR code
// @access  Private
router.delete('/:id', auth, qrController.deleteQR);

// @route   GET api/qr/:shortId/download
// @desc    Download stored QR code image
// @access  Public
router.get('/download/:shortId', qrController.downloadStoredQR);

module.exports = router;

