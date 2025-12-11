const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// @route   POST /api/upload/logo
// @desc    Upload logo image
router.post('/logo', uploadController.uploadLogo, uploadController.handleLogoUpload);

// @route   POST /api/upload/background
// @desc    Upload background image
router.post('/background', uploadController.uploadBackground, uploadController.handleBackgroundUpload);

// @route   POST /api/upload/video
// @desc    Upload video
router.post('/video', uploadController.uploadVideo, uploadController.handleVideoUpload);

// @route   POST /api/upload/status
// @desc    Upload status image
router.post('/status', uploadController.uploadStatus, uploadController.handleStatusUpload);

// @route   POST /api/upload/image
// @desc    Upload generic image
router.post('/image', uploadController.uploadImage, uploadController.handleImageUpload);

// @route   POST /api/upload/pdf
// @desc    Upload PDF
router.post('/pdf', uploadController.uploadPdf, uploadController.handlePdfUpload);

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;
