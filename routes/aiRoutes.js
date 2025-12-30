const express = require('express');
const router = express.Router();
const { generateQRConfig } = require('../controllers/aiController');

router.post('/generate', generateQRConfig);

module.exports = router;
