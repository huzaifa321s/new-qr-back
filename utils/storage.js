const { put } = require('@vercel/blob');

exports.uploadImage = async (buffer, filename) => {
    try {
        const blob = await put(filename, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });
        return blob.url;
    } catch (err) {
        console.error('Error uploading to Vercel Blob:', err);
        throw err;
    }
};
