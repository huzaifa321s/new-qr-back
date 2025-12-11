const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// @route   POST api/qr/dynamic
// @desc    Create a dynamic QR code
// @access  Public
router.post('/dynamic', qrController.createDynamicQR);

// @route   GET api/qr/list
// @desc    List all QR codes
// @access  Public
router.get('/list', qrController.listQRs);

// @route   PUT api/qr/:id
// @desc    Update a QR code
// @access  Public
router.put('/:id', qrController.updateQR);

// @route   GET api/qr/:shortId
// @desc    Get single QR data
// @access  Public
router.get('/:shortId', qrController.getQR);

// @route   DELETE api/qr/:id
// @desc    Delete QR code
// @access  Public
router.delete('/:id', qrController.deleteQR);

// @route   GET api/qr/:shortId/download
// @desc    Download stored QR code image
// @access  Public
router.get('/:shortId/download', qrController.downloadStoredQR);

module.exports = router;
