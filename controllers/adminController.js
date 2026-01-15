const User = require('../models/User');
const QRCodeModel = require('../models/QRCode');
const SystemSettings = require('../models/SystemSettings');

// Get System Stats (Dashboard)
exports.getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const qrCount = await QRCodeModel.countDocuments();
        
        // Aggregate total scans across all QRs
        const scanStats = await QRCodeModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalScans: { $sum: "$scanCount" }
                }
            }
        ]);
        
        const totalScans = scanStats.length > 0 ? scanStats[0].totalScans : 0;

        res.json({
            users: userCount,
            qrs: qrCount,
            scans: totalScans
        });
    } catch (err) {
        console.error('Error fetching system stats:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get Settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update Settings
exports.updateSettings = async (req, res) => {
    try {
        const { allowRegistration, maintenanceMode, defaultScanLimit, supportEmail, appName } = req.body;
        
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings({});
        }

        if (allowRegistration !== undefined) settings.allowRegistration = allowRegistration;
        if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
        if (defaultScanLimit !== undefined) settings.defaultScanLimit = defaultScanLimit;
        if (supportEmail !== undefined) settings.supportEmail = supportEmail;
        if (appName !== undefined) settings.appName = appName;
        
        settings.updatedBy = req.user.id;
        await settings.save();

        res.json(settings);
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
