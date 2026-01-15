require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const qrController = require('./controllers/qrController');
const requestIp = require('request-ip');
const useragent = require('express-useragent');

const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Socket.IO

const app = express();
app.set('trust proxy', true);
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

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

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve temporary files on Vercel from /tmp
if (process.env.VERCEL === '1') {
    app.use('/uploads', express.static('/tmp/uploads'));
}

// Routes
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Redirect Route
app.get('/:shortId', qrController.redirectQR);

// Basic Route
app.get('/', (req, res) => {
    res.send('QR Code Generator API is running');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});