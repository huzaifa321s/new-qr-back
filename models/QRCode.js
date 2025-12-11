const mongoose = require('mongoose');
const shortid = require('shortid');

const QRCodeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'text', 'url', 'wifi', 'vcard', 'email', 'sms',
            'app-store', 'menu', 'coupon', 'business-card', 'business-page',
            'bio-page', 'survey', 'lead-generation', 'rating', 'reviews',
            'social-media', 'pdf', 'multiple-links', 'password-protected',
            'event', 'product-page', 'dynamic-url', 'video', 'image'
        ]
    },
    name: { type: String },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    design: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isDynamic: { type: Boolean, default: false },
    // Business Page Data
    isBusinessPage: { type: Boolean, default: false },
    businessInfo: {
        title: String,
        subtitle: String,
        description: String,
        website: String,
        email: String,
        phone: String,
        address: String
    },
    menu: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    timings: { type: mongoose.Schema.Types.Mixed },
    social: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
        website: String
    },
    appLinks: {
        google: String,
        apple: String,
        buttonType: { type: String, default: 'rectangular' }
    },
    appStatus: {
        launchDate: Date,
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        fileUrl: String
    },
    shortId: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate
    },
    qrImageUrl: {
        type: String,
        default: null
    },
    scans: [{
        timestamp: { type: Date, default: Date.now },
        ip: String,
        device: String,
        os: String,
        browser: String,
        location: String
    }],
    scanCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
