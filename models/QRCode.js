const mongoose = require('mongoose');
const shortid = require('shortid');

const QRCodeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'text', 'url', 'wifi', 'vcard', 'email', 'sms', 'map', 'phone', 'website',
            'app-store', 'menu', 'coupon', 'business-card', 'business-page',
            'bio-page', 'survey', 'lead-generation', 'rating', 'reviews',
            'social-media', 'pdf', 'multiple-links', 'password-protected',
            'event', 'product-page', 'dynamic-url', 'video', 'image', 'custom-type', 'static', 'more'
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
    customComponents: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    basicInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    rating: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    reviews: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    form: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    customFields: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    thankYou: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    businessInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    menu: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    openingHours: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    timings: { type: mongoose.Schema.Types.Mixed },
    social: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    links: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    infoFields: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    eventSchedule: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    venue: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    contactInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    productContent: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    video: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    feedback: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    images: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    dynamicUrl: {
        type: String, // Or Mixed, but usually string for simple redirect
        default: ''
    },
    socialLinks: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    pdf: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    shareOption: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
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
    facilities: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    contact: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    personalInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    categories: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    exchange: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    coupon: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
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
        location: String,
        locationConfidence: {
            type: String,
            enum: ['high', 'medium', 'low', 'unknown', 'dev'],
            default: 'unknown'
        },
    }],
    scanCount: {
        type: Number,
        default: 0
    },
    password: { type: String, default: null },
    passwordExpiry: { type: Date, default: null },
    scanLimitEnabled: { type: Boolean, default: false },
    scanLimit: { type: Number, default: null },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Dynamic Data Getter: Automatically fixes hardcoded URLs based on current environment
QRCodeSchema.path('data').get(function (v) {
    if (typeof v === 'string' && v.includes('/view/')) {
        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        // Replace everything before /view/ with the current frontendUrl
        return v.replace(/https?:\/\/[^\/]+/, frontendUrl);
    }
    return v;
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
