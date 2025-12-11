require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const qrController = require('./controllers/qrController');
const requestIp = require('request-ip');
const useragent = require('express-useragent');

const app = express();
const port = process.env.PORT || 3000;

// Connect Database
connectDB().catch(err => {
    console.error('Failed to connect to database:', err);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestIp.mw());
app.use(useragent.express());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Redirect Route
app.get('/:shortId', qrController.redirectQR);

// Basic Route
app.get('/', (req, res) => {
    res.send('QR Code Generator API is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});