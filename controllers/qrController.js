const QRCode = require('qrcode');
const { createCanvas, loadImage, registerFont, Path2D } = require('canvas');
const sharp = require('sharp');
const QRCodeModel = require('../models/QRCode');
const shortid = require('shortid');
const axios = require('axios'); // Add axios
const { saveTemporary, deleteQRImage, promoteToPermanent, uploadQRImage } = require('../utils/blobStorage');
const PDFDocument = require('pdfkit');
const waitForDbConnection = require('../utils/waitDBConnection');
// geoip-lite removed to fix Vercel bundle size error (250MB limit exceeded)

// Helper to get client scan details (IP & Geo)
const getScanDetails = async (req) => {
    // 1. Enhanced IP Detection
    let ip = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.clientIp ||
        req.socket.remoteAddress ||
        req.ip;

    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    if (ip && ip.includes(':') && !ip.includes('::')) {
        ip = ip.split(':')[0];
    }

    console.log('📍 Extracted IP:', ip);

    const userAgent = req.useragent;
    let location = 'Unknown';
    let locationConfidence = 'low';

    // 2. PRIORITY 1: Vercel Headers (Most Accurate - 99% correct)
    const vercelCity = req.headers['x-vercel-ip-city'];
    const vercelCountry = req.headers['x-vercel-ip-country'];
    const vercelRegion = req.headers['x-vercel-ip-country-region'];

    if (vercelCity && vercelCountry) {
        const city = decodeURIComponent(vercelCity);
        const country = vercelCountry;
        const region = vercelRegion ? decodeURIComponent(vercelRegion) : '';

        location = region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
        locationConfidence = 'high';
        console.log('✅ Vercel Headers (High Confidence):', location);
    }
    // 3. Localhost
    else if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
        location = 'Karachi, Pakistan (Local Dev)';
        locationConfidence = 'dev';
    }
    // 4. Multi-API with Cross-Verification
    else {
        const geoData = await getAccurateLocation(ip);
        location = geoData.location;
        locationConfidence = geoData.confidence;
    }

    return {
        ip: ip || 'Unknown',
        device: userAgent ? (userAgent.isMobile ? 'Mobile' : 'Desktop') : 'Unknown',
        os: userAgent ? userAgent.os : 'Unknown',
        browser: userAgent ? userAgent.browser : 'Unknown',
        location: location,
        locationConfidence: locationConfidence // 'high', 'medium', 'low', 'unknown'
    };
};

// Cross-Verification System
const getAccurateLocation = async (ip) => {
    const results = [];

    // API 1: ipapi.co (Most Accurate)
    try {
        const res1 = await axios.get(`https://ipapi.co/${ip}/json/`, {
            timeout: 2500,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (res1.data && res1.data.city && res1.data.country_name) {
            results.push({
                api: 'ipapi.co',
                city: res1.data.city,
                region: res1.data.region,
                country: res1.data.country_name,
                countryCode: res1.data.country_code,
                latitude: res1.data.latitude,
                longitude: res1.data.longitude
            });
        }
    } catch (err) {
        console.warn('⚠️ ipapi.co failed:', err.message);
    }

    // API 2: ipwhois.app (Fast & Reliable)
    try {
        const res2 = await axios.get(`https://ipwhois.app/json/${ip}`, {
            timeout: 2500
        });

        if (res2.data && res2.data.success && res2.data.city) {
            results.push({
                api: 'ipwhois.app',
                city: res2.data.city,
                region: res2.data.region,
                country: res2.data.country,
                countryCode: res2.data.country_code,
                latitude: res2.data.latitude,
                longitude: res2.data.longitude
            });
        }
    } catch (err) {
        console.warn('⚠️ ipwhois.app failed:', err.message);
    }

    // API 3: ip-api.com (Backup)
    try {
        const res3 = await axios.get(`http://ip-api.com/json/${ip}`, {
            params: { fields: 'status,city,regionName,country,countryCode,lat,lon' },
            timeout: 2500
        });

        if (res3.data && res3.data.status === 'success' && res3.data.city) {
            results.push({
                api: 'ip-api.com',
                city: res3.data.city,
                region: res3.data.regionName,
                country: res3.data.country,
                countryCode: res3.data.countryCode,
                latitude: res3.data.lat,
                longitude: res3.data.lon
            });
        }
    } catch (err) {
        console.warn('⚠️ ip-api.com failed:', err.message);
    }

    // Cross-Verification Logic
    if (results.length === 0) {
        return { location: 'Unknown', confidence: 'unknown' };
    }

    if (results.length === 1) {
        const data = results[0];
        return {
            location: `${data.city}, ${data.country}`,
            confidence: 'medium'
        };
    }

    // If 2+ APIs, check if they agree
    const cities = results.map(r => r.city.toLowerCase());
    const countries = results.map(r => r.countryCode);

    // Count matches
    const cityMatch = cities.every(c => c === cities[0]);
    const countryMatch = countries.every(c => c === countries[0]);

    if (cityMatch && countryMatch) {
        // All APIs agree - HIGH CONFIDENCE
        const data = results[0];
        console.log(`✅ Cross-verified (${results.length} APIs agree):`, `${data.city}, ${data.country}`);
        return {
            location: `${data.city}, ${data.country}`,
            confidence: 'high'
        };
    }
    else if (countryMatch) {
        // Country matches but city differs - MEDIUM CONFIDENCE
        const data = results[0];
        console.log(`⚠️ Partial match (Country OK, City varies):`, `${data.city}, ${data.country}`);
        return {
            location: `${data.city}, ${data.country}`,
            confidence: 'medium'
        };
    }
    else {
        // APIs disagree - Use most reliable API (ipapi.co priority)
        const preferredApi = results.find(r => r.api === 'ipapi.co') || results[0];
        console.log(`⚠️ APIs disagree. Using ${preferredApi.api}:`, `${preferredApi.city}, ${preferredApi.country}`);
        return {
            location: `${preferredApi.city}, ${preferredApi.country}`,
            confidence: 'low'
        };
    }
};

const SHAPES = {
    frame: {
        circle: "M25 5C13.95 5 5 13.95 5 25s8.95 20 20 20 20-8.95 20-20S36.05 5 25 5zm0 5c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15z",
        // square: REMOVED - Using strict geometry instead
        rounded: "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 5c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12z",
        'leaf-top-right': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zM38 10h-7v5h7c1.1 0 2 .9 2 2v21c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h19v-5H12c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z",
        'leaf-bottom-left': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 35h7v-5h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h26c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H19v5h19c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2z",
        'dot-frame': "M5 5h40v40H5V5zm5 5v30h30V10H10z M25 15 A10 10 0 1 0 25 35 A10 10 0 1 0 25 15",
        dashed: "M5 5h12v5H10v7H5V5z M38 5h7v12h-5v-7h-2V5z M5 38v7h12v-5h-7v-2H5z M38 45h7v-12h-5v7h-2v5z",
        'leaf-bottom-right': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm26 35h-7v-5h7c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h19v5H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h26c1.1 0 2 .9 2 2v21c0 1.1-.9 2-2 2z",
        'leaf-top-left': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 5h7v5h-7c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H19V5h19c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2z",
        'extra-rounded': "M18 5h14c7.18 0 13 5.82 13 13v14c0 7.18-5.82 13-13 13H18c-7.18 0-13-5.82-13-13V18c0-7.18 5.82-13 13-13zm0 5c-4.42 0-8 3.58-8 8v14c0 4.42 3.58 8 8 8h14c4.42 0 8-3.58 8-8V18c0-4.42-3.58-8-8-8H18z"
    },
    ball: {
        dot: "M25 10 A15 15 0 1 1 25 40 A15 15 0 1 1 25 10",
        // square: REMOVED - Using strict geometry instead
        'extra-rounded': "M10 10h30c4.42 0 8 3.58 8 8v14c0 4.42-3.58 8-8 8H10c-4.42 0-8-3.58-8-8V18c0-4.42 3.58-8 8-8z",
        'leaf-1': "M10 25 Q10 10 25 10 L40 10 L40 25 Q40 40 25 40 L10 40 Z",
        'leaf-2': "M10 10 L25 10 Q40 10 40 25 L40 40 L25 40 Q10 40 10 25 Z",
        'leaf-3': "M10 10 L25 10 L40 10 L40 25 Q40 40 25 40 Q10 40 10 25 Z",
        diamond: "M25 5 L45 25 L25 45 L5 25 Z",
        star: "M25 8 L30 18 L41 19 L32 26 L35 37 L25 31 L15 37 L18 26 L9 19 L20 18 Z",
        plus: "M20 10 H30 V20 H40 V30 H30 V40 H20 V30 H10 V20 H20 Z",
        cross: "M15 10 L25 20 L35 10 L40 15 L30 25 L40 35 L35 40 L25 30 L15 40 L10 35 L20 25 L10 15 Z"
    }
};

/**
 * Recursively find strings with /uploads/temp/ and promote them to permanent storage
 * @param {Object|Array} obj - The object to scan
 * @returns {Promise<Object|Array>} - The updated object with permanent URLs
 */
async function findAndPromoteFiles(obj) {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = await findAndPromoteFiles(obj[i]);
        }
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].includes('/uploads/temp/')) {
                obj[key] = await promoteToPermanent(obj[key]);
            } else if (typeof obj[key] === 'object') {
                obj[key] = await findAndPromoteFiles(obj[key]);
            }
        }
    }
    return obj;
}

// Helper to draw rounded rect
function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

// Helper function to generate QR image buffer
async function generateQRImageBuffer(content, design) {
    const qrData = QRCode.create(content, { errorCorrectionLevel: 'H', margin: 0 });
    const modules = qrData.modules.data;
    const moduleCount = qrData.modules.size;

    const size = 1024; // Increased resolution for better quality

    // SAFE MARGIN CALCULATION
    // Minimum 4 modules on each side as per QR spec
    const safeModuleCount = moduleCount + 8;
    const cellSize = size / safeModuleCount;
    const margin = 4 * cellSize;

    // We strictly use calculated cellSize to ensure full usage of canvas
    // Canvas anti-aliasing will handle fractional pixels

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Enable high quality image processing but DISABLE anti-aliasing for Sharpness
    // QR codes should have crisp, sharp edges for scanners
    ctx.quality = 'best';
    ctx.patternQuality = 'best';
    ctx.antialias = 'none'; // IMPORTANT: No anti-aliasing
    ctx.imageSmoothingEnabled = false; // IMPORTANT: No smoothing

    // Background
    ctx.fillStyle = design?.background?.color || '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Helper to check if module is part of eye
    const isEye = (r, c) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= moduleCount - 7) return true;
        if (r >= moduleCount - 7 && c < 7) return true;
        return false;
    };

    // Draw body dots
    ctx.fillStyle = design?.dots?.color || '#000000';
    const dotStyle = design?.dots?.style || 'square';

    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (modules[r * moduleCount + c] && !isEye(r, c)) {
                // Precise coordinate calculation using float
                const x = margin + (c * cellSize);
                const y = margin + (r * cellSize);

                // Exact size, no overlaps needed without anti-aliasing
                const drawSize = Math.ceil(cellSize);

                if (dotStyle === 'dots') {
                    ctx.beginPath();
                    ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (dotStyle === 'rounded') {
                    const radius = cellSize * 0.25;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(x, y, cellSize, cellSize, radius);
                    else drawRoundedRect(ctx, x, y, cellSize, cellSize, radius, true, false);
                    ctx.fill();
                } else if (dotStyle === 'extra-rounded') {
                    const radius = cellSize * 0.5;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(x, y, cellSize, cellSize, radius);
                    else drawRoundedRect(ctx, x, y, cellSize, cellSize, radius, true, false);
                    ctx.fill();
                } else if (dotStyle === 'classy') {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize / 2, y);
                    ctx.lineTo(x + cellSize, y + cellSize / 2);
                    ctx.lineTo(x + cellSize / 2, y + cellSize);
                    ctx.lineTo(x, y + cellSize / 2);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, drawSize, drawSize);
                }
            }
        }
    }

    // Draw eyes
    const drawEye = (startR, startC) => {
        const eyeX = margin + startC * cellSize;
        const eyeY = margin + startR * cellSize;
        const eyeSize = 7 * cellSize;

        const frameColor = design?.cornersSquare?.color || design?.dots?.color || '#000000';
        const ballColor = design?.cornersDot?.color || design?.dots?.color || '#000000';
        const bgColor = design?.background?.color || '#ffffff';

        const frameStyle = design?.cornersSquare?.style || 'square';
        const ballStyle = design?.cornersDot?.style || 'dot';

        // Helper to draw geometric shape
        const drawGeometricEye = (type, style, x, y, size, color) => {
            ctx.fillStyle = color;
            const center = size / 2;
            const radius = size / 2;

            ctx.beginPath();

            if (style === 'circle' || style === 'dot') {
                ctx.arc(x + center, y + center, radius, 0, Math.PI * 2);
            } else if (style === 'rounded') {
                // Moderate rounding
                const r = size * 0.25;
                if (ctx.roundRect) ctx.roundRect(x, y, size, size, r);
                else ctx.rect(x, y, size, size); // Fallback
            } else if (style === 'extra-rounded') {
                // Heavy rounding
                const r = size * 0.45;
                if (ctx.roundRect) ctx.roundRect(x, y, size, size, r);
                else ctx.rect(x, y, size, size);
            } else if (style === 'dashed') {
                // Dashed: 4 "L" shaped corners
                // Outer size 7 modules, Inner 5 modules. Thickness 1 module.
                // We simulate this by drawing 4 rects for the corners?
                // No, "L" shapes.

                const thickness = size / 7; // 1 module
                const legLen = size * 0.35; // ~2.5 modules long (leaving 2m gap in middle)

                // Top-Left L
                ctx.fillRect(x, y, legLen, thickness); // Top bar
                ctx.fillRect(x, y, thickness, legLen); // Left bar

                // Top-Right L
                ctx.fillRect(x + size - legLen, y, legLen, thickness); // Top bar
                ctx.fillRect(x + size - thickness, y, thickness, legLen); // Right bar

                // Bottom-Left L
                ctx.fillRect(x, y + size - thickness, legLen, thickness); // Bottom bar
                ctx.fillRect(x, y + size - legLen, thickness, legLen); // Left bar

                // Bottom-Right L
                ctx.fillRect(x + size - legLen, y + size - thickness, legLen, thickness); // Bottom bar
                ctx.fillRect(x + size - thickness, y + size - legLen, thickness, legLen); // Right bar

                // No fill() needed as we used fillRects
                return;

            } else if (style.startsWith('leaf') || style.startsWith('teardrop')) {
                // Leaf logic: usually 2 opposite corners rounded
                // Radius
                const r = size * 0.4; // 40% rounding for leaf effect
                let radii = [0, 0, 0, 0];

                // Config based on standard Leaf rotations
                // [TL, TR, BR, BL]
                if (style === 'leaf-diag-1') radii = [r, 0, r, 0]; // TR & BL Sharp
                else if (style === 'leaf-diag-2') radii = [0, r, 0, r]; // TL & BR Sharp
                else if (style === 'teardrop-tl') radii = [0, r, r, r]; // TL Sharp
                else if (style === 'leaf-top-right') radii = [r, 0, r, r]; // TR Sharp
                else if (style === 'leaf-top-left') radii = [0, r, r, r]; // TL Sharp
                else if (style === 'leaf-bottom-left') radii = [r, 0, r, 0]; // TL & BR Rounded (Opposite diagonal)
                else if (style === 'leaf-bottom-right') radii = [0, r, 0, r]; // TR & BL Rounded (Diagonal leaf)
                else radii = [r, 0, r, 0];

                if (ctx.roundRect) ctx.roundRect(x, y, size, size, radii);
                else ctx.rect(x, y, size, size);
            } else if (style === 'diamond') {
                const mid = size / 2;
                ctx.moveTo(x + mid, y);
                ctx.lineTo(x + size, y + mid);
                ctx.lineTo(x + mid, y + size);
                ctx.lineTo(x, y + mid);
                ctx.closePath();
            } else if (style === 'star') {
                const cx = x + size / 2;
                const cy = y + size / 2;
                const spikes = 5;
                const outerRadius = size / 2;
                const innerRadius = size / 4;
                let rot = Math.PI / 2 * 3;
                let px = cx;
                let py = cy;
                const step = Math.PI / spikes;

                ctx.moveTo(cx, cy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    px = cx + Math.cos(rot) * outerRadius;
                    py = cy + Math.sin(rot) * outerRadius;
                    ctx.lineTo(px, py);
                    rot += step;

                    px = cx + Math.cos(rot) * innerRadius;
                    py = cy + Math.sin(rot) * innerRadius;
                    ctx.lineTo(px, py);
                    rot += step;
                }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
            } else if (style === 'plus') {
                const thickness = size / 3.5;
                const offset = (size - thickness) / 2;
                ctx.rect(x + offset, y, thickness, size); // V
                ctx.rect(x, y + offset, size, thickness); // H
            } else if (style === 'cross') {
                // X shape
                const thickness = size / 2.5; // Thicker for scannability
                ctx.save();
                ctx.translate(x + size / 2, y + size / 2);
                ctx.rotate(45 * Math.PI / 180);
                ctx.translate(-(x + size / 2), -(y + size / 2));
                const offset = (size - thickness) / 2;
                ctx.rect(x + offset, y, thickness, size);
                ctx.rect(x, y + offset, size, thickness);
                ctx.restore();
            } else {
                // Default Square (includes 'dot-frame' fallback)
                ctx.rect(x, y, size, size);
            }
            ctx.fill();
        };

        // Draw Outer Frame
        // -------------------------
        ctx.fillStyle = frameColor;

        // Handle "Dashed" separately because it doesn't need "Inner Cutout" logic
        // (It's already drawn as thin lines)
        if (frameStyle === 'dashed') {
            drawGeometricEye('frame', frameStyle, eyeX, eyeY, eyeSize, frameColor);
            // Dashed is already "hollow", no need to draw white inner box
        } else {
            // Normal Frames (Solid block with hole)
            drawGeometricEye('frame', frameStyle, eyeX, eyeY, eyeSize, frameColor);

            // Inner cutout
            ctx.fillStyle = bgColor;
            const innerSize = 5 * cellSize;
            const innerOffset = cellSize;

            // For Inner Cutout, we must match the outer style to create a uniform frame
            // e.g. Rounded Outer -> Rounded Inner.
            // But dashed doesn't get here.
            drawGeometricEye('frame', frameStyle, eyeX + innerOffset, eyeY + innerOffset, innerSize, bgColor);
        }


        // Draw Inner Ball
        // -------------------------
        const ballSize = 3 * cellSize; // 3x3 modules
        const ballOffset = 2 * cellSize; // 2 module offset

        drawGeometricEye('ball', ballStyle, eyeX + ballOffset, eyeY + ballOffset, ballSize, ballColor);
    };

    drawEye(0, 0);
    drawEye(0, moduleCount - 7);
    drawEye(moduleCount - 7, 0);

    // Add logo if exists
    const logoUrl = design?.image?.url;

    if (logoUrl) {
        console.log('🖼️ DATA CHECK - Logo URL present');
        try {
            console.log('🖼️ Attempting to load logo for QR');

            let logoImage;

            // Check if it is a Data URI (Base64)
            if (logoUrl.startsWith('data:')) {
                // For Base64, loadImage from canvas can handle it directly
                logoImage = await loadImage(logoUrl);
            } else {
                // For remote URLs, use robust fetch with axios
                const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
                const logoBuffer = Buffer.from(logoResponse.data);
                logoImage = await loadImage(logoBuffer);
            }

            // Clamp logo size to safe maximum (35% of QR width) to preserve scannability
            // Default to 0.2 (20%) if not specified
            const reqSize = design.imageOptions?.imageSize || design.image?.size || 0.2;
            const safeSize = Math.min(Math.max(reqSize, 0.1), 0.35);

            const logoSize = size * safeSize;
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;

            // Force clear background behind logo for better scannability
            if (design.imageOptions?.hideBackgroundDots !== false) {
                ctx.fillStyle = design?.background?.color || '#ffffff';
                // Add padding
                const clearPadding = 4;
                ctx.fillRect(logoX - clearPadding, logoY - clearPadding, logoSize + (clearPadding * 2), logoSize + (clearPadding * 2));
            }

            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            console.log(`✅ Logo drawn successfully (Size ratio: ${safeSize})`);
        } catch (err) {
            console.error('❌ Logo load/draw error:', err.message);
        }
    }

    return canvas.toBuffer('image/png');
}

exports.generateQR = async (req, res) => {
    try {
        const { type, data, design } = req.body;

        // 1. Construct content
        let content = '';
        if (type === 'url' || type === 'text') content = data;
        else if (type === 'wifi') content = `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};;`;
        else if (type === 'email') content = `mailto:${data.email}?subject=${data.subject}&body=${data.body}`;
        else if (type === 'vcard') {
            content = `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName};${data.firstName}\nFN:${data.firstName} ${data.lastName}\nORG:${data.org}\nTITLE:${data.title}\nTEL;TYPE=WORK,VOICE:${data.workPhone}\nTEL;TYPE=CELL,VOICE:${data.mobilePhone}\nEMAIL:${data.email}\nEND:VCARD`;
        }

        // 2. Get Raw QR Data
        const qrData = QRCode.create(content, { errorCorrectionLevel: 'H' });
        const modules = qrData.modules.data;
        const size = qrData.modules.size;

        // 3. Canvas Setup
        const moduleSize = 20; // Pixel size per module
        const margin = 4 * moduleSize;
        const canvasSize = (size * moduleSize) + (2 * margin);
        const canvas = createCanvas(canvasSize, canvasSize);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = design?.color?.light || '#ffffff';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // 4. Draw Modules (Dots/Squares)
        ctx.fillStyle = design?.color?.dark || '#000000';
        const dotStyle = design?.dots?.style || 'square';

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (modules[r * size + c]) {
                    const x = margin + (c * moduleSize);
                    const y = margin + (r * moduleSize);

                    // Finder Patterns
                    const isFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

                    if (isFinder) {
                        ctx.fillRect(x, y, moduleSize, moduleSize);
                    } else {
                        if (dotStyle === 'dots') {
                            ctx.beginPath();
                            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, Math.PI * 2);
                            ctx.fill();
                        } else if (dotStyle === 'rounded') {
                            drawRoundedRect(ctx, x, y, moduleSize, moduleSize, 5, true, false);
                        } else {
                            ctx.fillRect(x, y, moduleSize, moduleSize);
                        }
                    }
                }
            }
        }

        // 5. Logo Overlay
        if (design?.image?.url) {
            try {
                const logo = await loadImage(design.image.url);
                const logoSize = canvasSize * 0.2;
                const logoX = (canvasSize - logoSize) / 2;
                const logoY = (canvasSize - logoSize) / 2;
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
            } catch (e) {
                console.log("Error loading logo", e);
            }
        }

        // 6. Save QR code to storage
        const buffer = canvas.toBuffer('image/png');
        const qrImageUrl = await uploadQRImage(buffer, `qr_${Date.now()}.png`);

        // 7. Create QR code in database
        const qrCode = new QRCodeModel({
            type,
            data: content,
            design: design || {},
            shortId: shortid.generate(),
            qrImageUrl: qrImageUrl
        });

        await qrCode.save();

        // 8. Return the saved QR code data
        res.json({
            success: true,
            qrCode: {
                ...qrCode.toObject(),
                qrImageUrl
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create Dynamic QR
exports.createDynamicQR = async (req, res) => {
    try {
        // Promote any temporary uploads (logo, images, etc.) to permanent storage
        await findAndPromoteFiles(req.body);

        const { type, name, data, design, businessInfo, menu, timings, social, isBusinessPage, appLinks, appStatus, customComponents, coupon, facilities, contact, personalInfo, exchange, openingHours, basicInfo, form, customFields, thankYou, rating, reviews, shareOption, pdf, links, socialLinks, infoFields, eventSchedule, venue, contactInfo, productContent, video, feedback, images, dynamicUrl, password, passwordExpiry, scanLimitEnabled, scanLimit, categories } = req.body;
        // Explicitly promote App Store logo if in production mode
        if (process.env.UPLOAD_MODE === 'prod' && type === 'app-store') {
            if (design?.appLogo?.url && design.appLogo.url.includes('/uploads/temp/')) {
                design.appLogo.url = await promoteToPermanent(design.appLogo.url);
            }
        }
        // Generate shortId first
        const shortId = shortid.generate();
        console.log('design', design)
        // Generate actual QR URL based on type BEFORE saving
        // Generate actual QR URL based on type BEFORE saving
        // Generate actual QR URL based on type BEFORE saving
        // Always use FRONTEND URL for Dynamic QRs to ensure consistent mobile preview
        const frontendUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
        const backendUrl = `${req.protocol}://${req.get('host')}`;

        // For dynamic-url type, point directly to backend redirect for better tracking
        // For other types (content-rich landing pages), point to frontend view
        const qrContent = type === 'dynamic-url'
            ? `${backendUrl}/${shortId}`
            : `${frontendUrl}/view/${shortId}`;

        // Create DB Record with actual QR URL (not placeholder)
        const newQR = new QRCodeModel({
            type,
            name,
            data: qrContent, // Use actual QR URL instead of placeholder
            design,
            businessInfo,
            menu,
            timings,
            social,
            isBusinessPage,
            appLinks,
            appStatus,
            customComponents,
            coupon,
            facilities,
            contact,
            personalInfo,
            exchange,
            openingHours,
            basicInfo,
            form,
            customFields,
            thankYou,
            rating,
            reviews,
            shareOption,
            pdf,
            links,
            socialLinks,
            infoFields,
            eventSchedule,
            venue,
            contactInfo,
            productContent,
            video,
            feedback,
            images,
            dynamicUrl,
            shortId: shortId,
            password,
            passwordExpiry,
            scanLimitEnabled,
            scanLimit,
            categories: type === 'reviews' ? categories : []
        });

        await newQR.save();

        // Generate QR image and upload to Vercel Blob
        try {
            const filename = `qr-codes/${newQR.shortId}-${Date.now()}.png`;

            // ⚠️ IGNORE client-side 'qrImage' for Dynamic QRs where logic depends on new shortId
            // The client cannot know the shortId or final URL during creation, so the image it sends
            // likely contains a placeholder URL (e.g. /app/preview), which is WRONG.
            // We MUST regenerate the image server-side with the correct 'qrContent'.

            // if (req.body.qrImage) { ... }  <-- DISABLED on purpose

            // Use the actual QR content URL we just set
            console.log('🔄 Regenerating QR Image for creation to ensure correct URL:', qrContent);
            const imageBuffer = await generateQRImageBuffer(qrContent, design);

            const blobUrl = await uploadQRImage(imageBuffer, filename);

            // Update QR with image URL
            newQR.qrImageUrl = blobUrl;
            await newQR.save();
        } catch (uploadError) {
            console.error('Error uploading QR image:', uploadError);
            // Continue even if upload fails - QR will render client-side
        }

        // Return the short URL (reuse frontendUrl from above)
        const shortUrl = `${frontendUrl}/view/${newQR.shortId}`;

        res.json({ shortUrl, shortId: newQR.shortId });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create Static QR
exports.createStaticQR = async (req, res) => {
    try {
        // Promote any temporary uploads to permanent storage
        await findAndPromoteFiles(req.body);

        const { type, name, data, design } = req.body;

        // For static QRs, the 'data' is the actual content (e.g. Website URL)
        const shortId = shortid.generate();

        const newQR = new QRCodeModel({
            type, // Use provided type (e.g. 'website', 'text')
            name,
            data, // Direct data for static QRs
            design,
            isDynamic: false,
            shortId: shortId
        });

        await newQR.save();

        // Generate QR image and upload
        try {
            const filename = `qr-codes/static-${newQR.shortId}-${Date.now()}.png`;
            // For static QR, image content is the direct data
            const imageBuffer = await generateQRImageBuffer(data, design);
            const blobUrl = await uploadQRImage(imageBuffer, filename);

            newQR.qrImageUrl = blobUrl;
            await newQR.save();
        } catch (uploadError) {
            console.error('Error uploading Static QR image:', uploadError);
        }

        res.json({ success: true, shortId: newQR.shortId });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Redirect Dynamic QR
exports.redirectQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        console.log("qr/dynamic")
        if (!qr) {
            return res.status(404).send('QR Code not found');
        }

        // Analytics
        const scanData = await getScanDetails(req);

        // Update scans
        qr.scans.push(scanData);
        qr.scanCount = (qr.scanCount || 0) + 1;
        await qr.save();

        // Emit real-time update
        if (req.io) {
            req.io.emit('scan-updated', {
                shortId: qr.shortId,
                scanCount: qr.scanCount,
                _id: qr._id
            });
        }

        // Redirect based on type
        if (qr.type === 'url') {
            return res.redirect(qr.data);
        } else if (qr.type === 'dynamic-url') {
            let target = qr.dynamicUrl || '';
            if (target && !target.startsWith('http')) {
                target = `https://${target}`;
            }
            if (target) return res.redirect(target);
            // Fallback to view page if no URL provided
            const baseUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
            return res.redirect(`${baseUrl}/view/${qr.shortId}?scanned=true`);
        } else if (qr.type === 'video') {
            if (qr.video && qr.video.redirect) {
                return res.redirect(qr.video.url);
            }
            const baseUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
            return res.redirect(`${baseUrl}/view/${qr.shortId}`);
        } else if (qr.type === 'text') {
            return res.send(qr.data);
        } else if (qr.type === 'app-store') {
            // Redirect to App Store landing page
            const baseUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
            return res.redirect(`${baseUrl}/view/${qr.shortId}?scanned=true`);
        } else if (qr.type === 'business-page' || qr.type === 'menu' || qr.type === 'custom-type' || qr.type === 'coupon' || qr.type === 'business-card' || qr.type === 'bio-page' || qr.type === 'lead-generation' || qr.type === 'rating' || qr.type === 'reviews' || qr.type === 'social-media' || qr.type === 'pdf' || qr.type === 'multiple-links' || qr.type === 'password-protected' || qr.type === 'event' || qr.type === 'product-page' || qr.type === 'video' || qr.type === 'image') {
            // Redirect to Business Page / Menu / Custom Type / Coupon / Business Card landing
            const baseUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
            return res.redirect(`${baseUrl}/view/${qr.shortId}?scanned=true`);
        }

        // For other types, you might show a landing page
        res.json(qr.data);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Track Scan (for direct access)
exports.trackScan = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        if (!qr) {
            return res.status(404).send('QR Code not found');
        }

        // Check Expiry
        if (qr.passwordExpiry && new Date() > new Date(qr.passwordExpiry)) {
            return res.status(410).json({ error: 'QR Code has expired' });
        }
        // Check Scan Limit
        if (qr.scanLimitEnabled && qr.scanLimit && qr.scanCount >= qr.scanLimit) {
            return res.status(410).json({ error: 'Scan limit reached' });
        }
        // Analytics
        const scanData = await getScanDetails(req);

        // Update scans
        qr.scans.push(scanData);
        qr.scanCount = (qr.scanCount || 0) + 1;
        await qr.save();

        // Emit real-time update
        if (req.io) {
            req.io.emit('scan-updated', {
                shortId: qr.shortId,
                scanCount: qr.scanCount,
                _id: qr._id
            });
        }

        res.json({ success: true, scanCount: qr.scanCount });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update QR (Editable)
exports.updateQR = async (req, res) => {
    try {
        // Promote any temporary uploads to permanent storage
        await findAndPromoteFiles(req.body);

        const { id } = req.params;
        const { shortId, data, design, businessInfo, menu, timings, social, appLinks, appStatus, facilities, contact, personalInfo, coupon, customComponents, exchange, openingHours, basicInfo, form, customFields, thankYou, rating, reviews, shareOption, pdf, links, socialLinks, infoFields, eventSchedule, venue, contactInfo, productContent, video, feedback, images, dynamicUrl } = req.body;

        const qr = await QRCodeModel.findById(id);
        if (!qr) return res.status(404).send('QR Code not found');

        const oldImageUrl = qr.qrImageUrl;
        const oldShortId = qr.shortId;
        const isShortIdChanged = shortId && shortId !== oldShortId;

        // 1. Uniqueness check for new shortId
        if (isShortIdChanged) {
            const existing = await QRCodeModel.findOne({ shortId });
            if (existing) {
                return res.status(400).json({ message: 'Short ID already exists' });
            }
            qr.shortId = shortId;

            // Update the redirect link if it's a dynamic QR
            const frontendUrl = (process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
            const backendUrl = `${req.protocol}://${req.get('host')}`;

            qr.data = qr.type === 'dynamic-url'
                ? `${backendUrl}/${shortId}`
                : `${frontendUrl}/view/${shortId}`;
        }

        // 2. Update other fields
        if (data !== undefined && !isShortIdChanged) qr.data = data;
        if (design !== undefined) qr.design = design;
        if (req.body.name !== undefined) qr.name = req.body.name;
        if (businessInfo !== undefined) qr.businessInfo = businessInfo;
        if (menu !== undefined) qr.menu = menu;
        if (timings !== undefined) qr.timings = timings;
        if (social !== undefined) qr.social = social;
        if (appLinks !== undefined) qr.appLinks = appLinks;
        if (appStatus !== undefined) qr.appStatus = appStatus;
        if (facilities !== undefined) qr.facilities = facilities;
        if (contact !== undefined) qr.contact = contact;
        if (personalInfo !== undefined) qr.personalInfo = personalInfo;
        if (coupon !== undefined) qr.coupon = coupon;
        if (customComponents !== undefined) qr.customComponents = customComponents;
        if (exchange !== undefined) qr.exchange = exchange;
        if (openingHours !== undefined) qr.openingHours = openingHours;
        if (basicInfo !== undefined) qr.basicInfo = basicInfo;
        if (form !== undefined) qr.form = form;
        if (customFields !== undefined) qr.customFields = customFields;
        if (thankYou !== undefined) qr.thankYou = thankYou;
        if (rating !== undefined) qr.rating = rating;
        if (reviews !== undefined) qr.reviews = reviews;
        if (shareOption !== undefined) qr.shareOption = shareOption;
        if (pdf !== undefined) qr.pdf = pdf;
        if (links !== undefined) qr.links = links;
        if (socialLinks !== undefined) qr.socialLinks = socialLinks;
        if (infoFields !== undefined) qr.infoFields = infoFields;
        if (eventSchedule !== undefined) qr.eventSchedule = eventSchedule;
        if (venue !== undefined) qr.venue = venue;
        if (contactInfo !== undefined) qr.contactInfo = contactInfo;
        if (productContent !== undefined) qr.productContent = productContent;
        if (video !== undefined) qr.video = video;
        if (feedback !== undefined) qr.feedback = feedback;
        if (images !== undefined) qr.images = images;
        if (dynamicUrl !== undefined) qr.dynamicUrl = dynamicUrl;
        if (req.body.password !== undefined) qr.password = req.body.password;
        if (req.body.passwordExpiry !== undefined) qr.passwordExpiry = req.body.passwordExpiry;
        if (req.body.scanLimitEnabled !== undefined) qr.scanLimitEnabled = req.body.scanLimitEnabled;
        if (req.body.scanLimit !== undefined) qr.scanLimit = req.body.scanLimit;
        if (req.body.categories !== undefined && qr.type === 'reviews') qr.categories = req.body.categories;

        await qr.save();

        // 3. Regenerate QR image if design OR shortId OR data changed
        if (design || isShortIdChanged || data !== undefined) {
            try {
                const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
                const qrContent = qr.data; // Contains the view URL
                const filename = `qr-codes/${qr.shortId}-${Date.now()}.png`;

                console.log('🔄 Regenerating QR Image for UPDATE:', qrContent);
                const imageBuffer = await generateQRImageBuffer(qrContent, qr.design);

                const qrImageUrl = await uploadQRImage(imageBuffer, filename);
                qr.qrImageUrl = qrImageUrl;
                await qr.save();

                // Delete old image if it's different
                if (oldImageUrl && oldImageUrl !== qrImageUrl) {
                    await deleteQRImage(oldImageUrl);
                }
            } catch (uploadError) {
                console.error('Error regenerating QR image:', uploadError);
            }
        }

        res.json(qr);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get Single QR by ID (for Statistics)
exports.getQRById = async (req, res) => {
    try {
        const qr = await QRCodeModel.findById(req.params.id);
        if (!qr) return res.status(404).json({ msg: 'QR Code not found' });
        res.json(qr);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'QR Code not found' });
        res.status(500).send('Server Error');
    }
};

// Get Single QR (for Landing Page)
exports.getQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        if (!qr) return res.status(404).send('QR Not Found');

        // Check Expiry
        if (qr.passwordExpiry && new Date() > new Date(qr.passwordExpiry)) {
            return res.status(410).send('QR Code has expired');
        }
        // Check Scan Limit
        if (qr.scanLimitEnabled && qr.scanLimit && qr.scanCount >= qr.scanLimit) {
            return res.status(410).send('Scan limit reached');
        }

        res.json(qr);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// List all QR codes with pagination and filters
exports.listQRs = async (req, res) => {
    try {
        // Check if database is connected
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            await waitForDbConnection(5000); // 5 seconds wait
        }
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Filter parameters
        const { type, search, startDate, endDate, sort, tab } = req.query;

        // Build query
        let query = {};

        // Type filter
        if (type && type !== 'All types') {
            query.type = type;
        }

        // Tab filter (Dynamic/Static)
        if (tab && tab !== 'All') {
            if (tab === 'Dynamic') {
                query.type = { $in: ['menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image', 'app-store', 'dynamic-url'] };
            } else if (tab === 'Static') {
                query.type = { $in: ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'static', 'website', 'map', 'more'] };
            }
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { shortId: { $regex: search, $options: 'i' } },
                { data: { $regex: search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        // Sort options
        let sortOption = { createdAt: -1 }; // Default: Last Created
        if (sort === 'First Created') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'Most Scanned') {
            sortOption = { scanCount: -1 };
        } else if (sort === 'Last 30 Days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            query.createdAt = { ...query.createdAt, $gte: thirtyDaysAgo };
        }

        // Get total count for pagination with filters
        const total = await QRCodeModel.countDocuments(query);

        // Fetch QR codes with pagination and filters
        const qrs = await QRCodeModel.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        console.log(`Fetched ${qrs.length} QR codes (Page ${page}, Limit ${limit}, Total: ${total})`);

        res.json({
            qrs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching QR list:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({
            error: 'Server Error',
            message: err.message,
            details: err.toString()
        });
    }
};

// Download stored QR code (png/jpeg/svg/pdf)
// Download stored QR code (png/jpeg/svg/pdf)
exports.downloadStoredQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        if (!qr) return res.status(404).send('QR Code not found');

        const { type, design, qrImageUrl } = qr;
        const format = (req.query.format || 'png').toLowerCase();

        // 1. Handle SVG separately (Vectors are usually re-generated as we don't store SVGs usually)
        if (format === 'svg') {
            // ... (keep existing SVG logic if you want, or if you store SVG, fetch it)
            // For now, regenerating SVG is safer for vector quality unless we stored it.
            // But if consistency is key, and we only have PNG stored, we might not be able to give a perfect SVG of the *stored* PNG.
            // Let's keep SVG regeneration for now as it creates vector graphics.

            const isLocal = req.get('host').includes('localhost');
            const backendBase = `${req.protocol}://${req.get('host')}`;
            const frontendBase = (process.env.FRONTEND_URL || (isLocal ? 'http://localhost:5173' : `${req.protocol}://${req.get('host').replace(':3000', '')}`)).replace(/\/$/, '');

            let content;
            if (qr.isDynamic === false) {
                content = qr.data;
            } else if (type === 'dynamic-url') {
                content = `${backendBase}/${qr.shortId}`;
            } else if (type === 'app-store') {
                content = `${frontendBase}/app/${qr.shortId}`;
            } else if (['menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(type) || qr.isBusinessPage) {
                content = `${frontendBase}/view/${qr.shortId}`;
            } else {
                content = `${backendBase}/${qr.shortId}`;
            }

            const svgString = await QRCode.toString(content, {
                type: 'svg',
                errorCorrectionLevel: 'H',
                color: {
                    dark: design?.dots?.color || '#000000',
                    light: design?.background?.color || '#ffffff'
                },
                margin: 0
            });
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.svg"`);
            return res.send(svgString);
        }

        // 2. Get the Base Image (Buffer)
        let pngBuffer;

        if (qrImageUrl) {
            try {
                // Determine URL to fetch
                let urlToFetch = qrImageUrl.trim();

                // Ensure protocol
                if (!urlToFetch.startsWith('http')) {
                    // If it's a relative path, might need to handle, but usually it's absolute from blob storage
                    // Assuming absolute for now based on user input
                }

                console.log('🔄 Fetching stored QR from:', urlToFetch);

                // Fetch the stored image
                const response = await axios.get(urlToFetch, {
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                pngBuffer = Buffer.from(response.data);
                console.log(`✅ Successfully fetched stored QR image (${pngBuffer.length} bytes)`);
            } catch (fetchErr) {
                console.error('❌ Failed to fetch stored QR image:', fetchErr.message);
                if (fetchErr.response) {
                    console.error('   Status:', fetchErr.response.status);
                    console.error('   Headers:', fetchErr.response.headers);
                }
                // Fallback will trigger below
            }
        }

        // Fallback: Regenerate if no stored image or fetch failed
        if (!pngBuffer) {
            console.log('⚠️ Regenerating QR image (Fallback)...');
            const isLocal = req.get('host').includes('localhost');
            const backendBase = `${req.protocol}://${req.get('host')}`;
            const frontendBase = (process.env.FRONTEND_URL || (isLocal ? 'http://localhost:5173' : `${req.protocol}://${req.get('host').replace(':3000', '')}`)).replace(/\/$/, '');

            let content;
            if (qr.isDynamic === false) {
                content = qr.data;
            } else if (type === 'dynamic-url') {
                content = `${backendBase}/${qr.shortId}`;
            } else if (type === 'app-store') {
                content = `${frontendBase}/app/${qr.shortId}`;
            } else if (['menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(type) || qr.isBusinessPage) {
                content = `${frontendBase}/view/${qr.shortId}`;
            } else {
                content = `${backendBase}/${qr.shortId}`;
            }

            try {
                // Try to use the high-quality generator
                pngBuffer = await generateQRImageBuffer(content, design);
            } catch (genErr) {
                console.error('High-quality generation failed, using basic QR:', genErr);
                pngBuffer = await QRCode.toBuffer(content, {
                    errorCorrectionLevel: 'H',
                    type: 'png',
                    margin: 4,
                    width: 1000,
                    color: {
                        dark: design?.dots?.color || '#000000',
                        light: design?.background?.color || '#ffffff'
                    }
                });
            }
        }

        // 3. Convert if necessary (PNG is default)

        // JPEG format
        if (format === 'jpeg' || format === 'jpg') {
            const jpegBuffer = await sharp(pngBuffer)
                .flatten({ background: { r: 255, g: 255, b: 255 } }) // Ensure no transparency for JPG
                .jpeg({ quality: 95 })
                .toBuffer();
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.jpeg"`);
            return res.send(jpegBuffer);
        }

        // PDF format
        if (format === 'pdf') {
            try {
                const pdfBuffer = await sharp(pngBuffer).toFormat('pdf').toBuffer();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.pdf"`);
                return res.send(pdfBuffer);
            } catch (pdfErr) {
                // Fallback to PDFKit if Sharp PDF fails (less likely now but good safety)
                const doc = new PDFDocument({ autoFirstPage: true, margin: 36 });
                const chunks = [];
                doc.on('data', (c) => chunks.push(c));
                doc.on('end', () => {
                    const outBuffer = Buffer.concat(chunks);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.pdf"`);
                    res.send(outBuffer);
                });
                doc.image(pngBuffer, {
                    fit: [500, 700],
                    align: 'center',
                    valign: 'center'
                });
                doc.end();
                return;
            }
        }

        // Default: PNG
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.png"`);
        return res.send(pngBuffer);

    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Server Error');
    }
};

// Delete QR
exports.deleteQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findByIdAndDelete(req.params.id);
        if (!qr) return res.status(404).send('QR Not Found');
        res.json({ success: true, message: 'QR Code deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
