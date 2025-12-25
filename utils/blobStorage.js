const fs = require('fs');
const path = require('path');
const { put, del } = require('@vercel/blob');

// Ensure uploads directory exists for local development
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Upload QR code image (Local or Vercel Blob based on Env)
 * @param {Buffer} imageBuffer - QR code image buffer
 * @param {string} filename - Filename for the blob/file
 * @returns {Promise<string>} - File URL
 */
async function uploadQRImage(imageBuffer, filename) {
    const mode = process.env.UPLOAD_MODE || 'prod'; // Default to prod if not set
    console.log("mode", mode);
    if (mode === 'dev' || mode === 'local') {
        // --- LOCAL STORAGE MODE ---
        try {
            // Strip any folder prefixes from filename for local storage simplicity if needed
            // But we can keep structure if we want.
            // filename comes in as "qr-codes/shortid.png" usually.
            // We should make sure the directory exists if it has a path.

            const filePath = path.join(__dirname, '..', 'uploads', filename);
            const fileDir = path.dirname(filePath);

            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }

            await fs.promises.writeFile(filePath, imageBuffer);

            // Return Local URL
            // Assuming server runs on localhost:3000 or similar.
            // We need a base URL. For now we returns a relative path or absolute URL if we can guess.
            // Better to return a relative URL path that the frontend can prepend base URL to, OR returns a full URL if we have HOST env.
            // Based on standard simple setup:
            const host = process.env.VITE_API_URL || 'http://localhost:3000';
            // We serve 'uploads' directory at '/uploads' route.
            return `${host}/uploads/${filename}`;
        } catch (error) {
            console.error('Error saving to Local Storage:', error);
            throw error;
        }

    } else {
        // --- VERCEL BLOB MODE (PROD) ---
        try {
            const blob = await put(filename, imageBuffer, {
                access: 'public',
                contentType: 'image/png'
            });
            return blob.url;
        } catch (error) {
            console.error('Error uploading to Vercel Blob:', error);
            throw error;
        }
    }
}

/**
 * Delete QR code image (Local or Vercel)
 * @param {string} fileUrl - URL of the file/blob to delete
 */
async function deleteQRImage(fileUrl) {
    const mode = process.env.UPLOAD_MODE || 'prod';

    if (mode === 'dev' || mode === 'local') {
        // --- LOCAL DELETE ---
        try {
            // Extract filename from URL
            // e.g. http://localhost:3000/qr-codes/abc.png -> qr-codes/abc.png
            // This is tricky if full URL is passed.
            // Let's try to parse it.
            const urlObj = new URL(fileUrl);
            const relativePath = urlObj.pathname.substring(1); // remove leading /
            const filePath = path.join(__dirname, '..', 'uploads', relativePath);

            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            console.error('Error deleting local file:', error);
        }
    } else {
        // --- VERCEL DELETE ---
        try {
            if (fileUrl) {
                await del(fileUrl);
            }
        } catch (error) {
            console.error('Error deleting from Vercel Blob:', error);
            // Don't throw - deletion failure shouldn't break the flow
        }
    }
}

module.exports = {
    uploadQRImage,
    uploadFile: uploadQRImage, // Alias for generic use
    deleteQRImage,
    deleteFile: deleteQRImage // Alias for generic use
};
