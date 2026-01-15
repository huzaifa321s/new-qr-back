const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
    allowRegistration: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    defaultScanLimit: {
        type: Number,
        default: 0 // 0 means unlimited
    },
    supportEmail: {
        type: String,
        default: 'support@qrinsight.com'
    },
    appName: {
        type: String,
        default: 'HumanTek QR Studio'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Ensure only one settings document exists
SystemSettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
