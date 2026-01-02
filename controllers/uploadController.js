const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { saveTemporary, deleteFile } = require('../utils/blobStorage');

// Configure multer storage
// Use Memory Storage to get the buffer, then let 'blobStorage.js' decide 
// whether to save to Disk (Dev) or Vercel (Prod)
const storage = multer.memoryStorage();

// File filter (unchanged)
const fileFilter = (req, file, cb) => {
    // ... (Keep existing filter logic)
    if (file.fieldname === 'video') {
        const allowedTypes = /mp4|webm|ogg|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'));
        }
    } else if (file.fieldname === 'pdf') {
        if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    } else {
        const allowedTypes = /jpeg|jpg|png|gif|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
};

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased limit for videos/PDFs
    fileFilter: fileFilter
});

// Upload logo
exports.uploadLogo = upload.single('logo');
exports.handleLogoUpload = async (req, res) => {
    try {

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        // In dev/local mode: save to temp folder for persistence
        // In production (Vercel): return Base64 for stateless preview
        const isVercel = process.env.VERCEL === '1';

        if (!isVercel) {
            // Local development - save to temp folder
            const fileUrl = await saveTemporary(req.file.buffer, filename);
            res.json({ success: true, url: fileUrl, filename: filename });
        } else {
            // Production (Vercel) - return Base64 for stateless preview
            const base64Url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            res.json({ success: true, url: base64Url, filename: filename });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Upload background
exports.uploadBackground = upload.single('background');
exports.handleBackgroundUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        const isVercel = process.env.VERCEL === '1';

        if (!isVercel) {
            const fileUrl = await saveTemporary(req.file.buffer, filename);
            res.json({ success: true, url: fileUrl, filename: filename });
        } else {
            const base64Url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            res.json({ success: true, url: base64Url, filename: filename });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Upload video
exports.uploadVideo = upload.single('video');
exports.handleVideoUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        const fileUrl = await saveTemporary(req.file.buffer, filename);

        res.json({ success: true, url: fileUrl, filename: filename });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Upload status (image)
exports.uploadStatus = upload.single('status');
exports.handleStatusUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        const isVercel = process.env.VERCEL === '1';

        if (!isVercel) {
            const fileUrl = await saveTemporary(req.file.buffer, filename);
            res.json({ success: true, url: fileUrl, filename: filename });
        } else {
            const base64Url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            res.json({ success: true, url: base64Url, filename: filename });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Delete file
exports.deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        // Construct URL for deletion (generic handler expects URL)
        // Or if deleteFile supports generic path info:
        // Actually blobStorage.deleteQRImage tries to parse URL.
        // But for local delete logic in blobStorage, it expects a URL or needs to be adapted.

        // If we are Local, we can recreate the URL roughly:
        const host = process.env.VITE_API_URL || 'http://localhost:3000';
        const fileUrl = `${host}/uploads/${filename}`;

        // OR better: Update blobStorage.deleteQRImage to handle just filename or check mode explicitly.
        // For now, let's pass the URL.

        await deleteFile(fileUrl); // Using the alias we created

        res.json({ success: true, message: 'File deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Delete failed' });
    }
};

// Upload generic image
exports.uploadImage = upload.single('image');
exports.handleImageUpload = async (req, res) => {
    try {
        console.log("condition true")
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        const isVercel = process.env.VERCEL === '1';

        if (!isVercel) {
            const fileUrl = await saveTemporary(req.file.buffer, filename);
            res.json({ success: true, url: fileUrl, filename: filename });
        } else {
            const base64Url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            res.json({ success: true, url: base64Url, filename: filename });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

// Upload PDF
exports.uploadPdf = upload.single('pdf');
exports.handlePdfUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);

        const fileUrl = await saveTemporary(req.file.buffer, filename);

        res.json({ success: true, url: fileUrl, filename: filename });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};
