const fs = require('fs');
const path = require('path');
const { put, del } = require('@vercel/blob');

// Detect if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Base directory for uploads (Local vs Vercel /tmp)
const UPLOAD_ROOT = isVercel
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '..', 'uploads');

const TEMP_DIR = path.join(UPLOAD_ROOT, 'temp');

// Helper to ensure directory exists at runtime (Crucial for Vercel /tmp)
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Initial check for local dev
if (!isVercel) {
    [UPLOAD_ROOT, TEMP_DIR].forEach(ensureDir);
}

/**
 * Save file strictly to local temporary storage
 * Always used for initial uploads in both dev and prod (on Vercel, this is ephemeral)
 */
async function saveTemporary(imageBuffer, filename) {
    try {
        ensureDir(TEMP_DIR); // Always ensure dir exists before writing in /tmp
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
    // CHECK 1: Is it a Base64 Data URI?
    if (tempUrl && tempUrl.startsWith('data:')) {
        try {
            console.log('🚀 Promoting Base64 image to Vercel Blob...');
            // Extract content type and base64 data
            const matches = tempUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                console.warn('⚠️ Invalid Base64 string format');
                return tempUrl;
            }

            const contentType = matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const ext = contentType.split('/')[1] || 'png';
            const filename = `upload-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;

            // Always upload to Blob in prod mode, or keep local in dev mode
            const mode = process.env.UPLOAD_MODE || 'prod';

            if (mode === 'dev' || mode === 'local') {
                // Ensure root uploads dir exists
                if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

                const permPath = path.join(UPLOAD_ROOT, filename);
                await fs.promises.writeFile(permPath, buffer);
                const host = process.env.VITE_API_URL || 'http://localhost:3000';
                console.log(`✅ Base64 Saved Locally: ${host}/uploads/${filename}`);
                return `${host}/uploads/${filename}`;
            } else {
                const blob = await put(filename, buffer, {
                    access: 'public',
                    contentType: contentType
                });
                console.log(`✅ Base64 Promoted to Blob: ${blob.url}`);
                return blob.url;
            }
        } catch (err) {
            console.error('Error promoting Base64 to permanent:', err);
            return tempUrl;
        }
    }

    // CHECK 2: Is it a Local Temp URL?
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
            console.log(`🚀 Promoting local file to Vercel Blob: ${filename}`);
            const blob = await put(filename, buffer, {
                access: 'public',
                contentType: filename.endsWith('.pdf') ? 'application/pdf' :
                    filename.endsWith('.mp4') ? 'video/mp4' : 'image/png'
            });
            permanentUrl = blob.url;
            console.log(`✅ File promoted successfully: ${permanentUrl}`);
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
