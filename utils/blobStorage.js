const fs = require('fs');
const path = require('path');
const { put, del } = require('@vercel/blob');

// Ensure uploads directory and temp subdirectory exist
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');
const TEMP_DIR = path.join(UPLOAD_ROOT, 'temp');

[UPLOAD_ROOT, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Save file strictly to local temporary storage
 * Always used for initial uploads in both dev and prod (on Vercel, this is ephemeral)
 */
async function saveTemporary(imageBuffer, filename) {
    try {
        const filePath = path.join(TEMP_DIR, filename);
        await fs.promises.writeFile(filePath, imageBuffer);

        const host = process.env.VITE_API_URL || 'http://localhost:3000';
        return `${host}/uploads/temp/${filename}`;
    } catch (error) {
        console.error('Error saving temporary file:', error);
        throw error;
    }
}

/**
 * Upload QR code image (Local or Vercel Blob based on Env)
 */
async function uploadQRImage(imageBuffer, filename) {
    const mode = process.env.UPLOAD_MODE || 'prod';
    if (mode === 'dev' || mode === 'local') {
        try {
            const filePath = path.join(UPLOAD_ROOT, filename);
            const fileDir = path.dirname(filePath);
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }
            await fs.promises.writeFile(filePath, imageBuffer);
            const host = process.env.VITE_API_URL || 'http://localhost:3000';
            return `${host}/uploads/${filename}`;
        } catch (error) {
            console.error('Error saving to Local Storage:', error);
            throw error;
        }
    } else {
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
 * Promote a local temp file to Vercel Blob (Permanent)
 */
async function promoteToPermanent(tempUrl) {
    if (!tempUrl || !tempUrl.includes('/uploads/temp/')) {
        return tempUrl; // Already permanent or not a temp file
    }

    try {
        const filename = tempUrl.split('/uploads/temp/').pop();
        const filePath = path.join(TEMP_DIR, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Temp file not found for promotion: ${filePath}`);
            return tempUrl;
        }

        const buffer = await fs.promises.readFile(filePath);

        // Always upload to Blob in prod mode, or keep local in dev mode
        const mode = process.env.UPLOAD_MODE || 'prod';
        let permanentUrl;

        if (mode === 'dev' || mode === 'local') {
            // In dev, just move from temp to root uploads
            const permPath = path.join(UPLOAD_ROOT, filename);
            await fs.promises.writeFile(permPath, buffer);
            const host = process.env.VITE_API_URL || 'http://localhost:3000';
            permanentUrl = `${host}/uploads/${filename}`;
        } else {
            // In prod, upload to Vercel Blob
            const blob = await put(filename, buffer, {
                access: 'public',
                contentType: filename.endsWith('.pdf') ? 'application/pdf' :
                    filename.endsWith('.mp4') ? 'video/mp4' : 'image/png'
            });
            permanentUrl = blob.url;
        }

        // Cleanup temp file
        try {
            await fs.promises.unlink(filePath);
        } catch (e) {
            console.warn('Failed to cleanup temp file:', e.message);
        }

        return permanentUrl;
    } catch (error) {
        console.error('Error promoting file to permanent:', error);
        return tempUrl; // Return original on failure to avoid breaking flow
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
    saveTemporary,
    promoteToPermanent,
    uploadQRImage,
    uploadFile: uploadQRImage,
    deleteQRImage,
    deleteFile: deleteQRImage
};
