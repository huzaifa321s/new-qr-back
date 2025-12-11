const { put, del } = require('@vercel/blob');

/**
 * Upload QR code image to Vercel Blob Storage
 * @param {Buffer} imageBuffer - QR code image buffer
 * @param {string} filename - Filename for the blob
 * @returns {Promise<string>} - Blob URL
 */
async function uploadQRImage(imageBuffer, filename) {
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

/**
 * Delete QR code image from Vercel Blob Storage
 * @param {string} blobUrl - URL of the blob to delete
 */
async function deleteQRImage(blobUrl) {
    try {
        if (blobUrl) {
            await del(blobUrl);
        }
    } catch (error) {
        console.error('Error deleting from Vercel Blob:', error);
        // Don't throw - deletion failure shouldn't break the flow
    }
}

module.exports = {
    uploadQRImage,
    deleteQRImage
};
