import axios from 'axios';

export const generateQR = async (data) => {
    try {
        const response = await axios.post('/api/qr/generate', data, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error generating QR:', error);
        throw error;
    }
};

export const createDynamicQR = async (data) => {
    try {
        const response = await axios.post('/api/qr/dynamic', data);
        return response.data;
    } catch (error) {
        console.error('Error creating dynamic QR:', error);
        throw error;
    }
};
