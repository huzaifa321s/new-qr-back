const QRCode = require('qrcode');
const { createCanvas, loadImage, registerFont, Path2D } = require('canvas');
const sharp = require('sharp');
const QRCodeModel = require('../models/QRCode');
const shortid = require('shortid');
const geoip = require('geoip-lite');
const { uploadQRImage, deleteQRImage } = require('../utils/blobStorage');
const PDFDocument = require('pdfkit');

const SHAPES = {
    frame: {
        circle: "M25 5C13.95 5 5 13.95 5 25s8.95 20 20 20 20-8.95 20-20S36.05 5 25 5zm0 5c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15z",
        square: "M5 5h40v40H5V5zm5 5v30h30V10H10z",
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
        square: "M10 10h30v30H10z",
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

    const size = 512; // Higher resolution for storage
    const margin = 40;
    const drawingSize = size - (margin * 2);
    const cellSize = drawingSize / moduleCount;

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

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
                const x = margin + (c * cellSize);
                const y = margin + (r * cellSize);

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
                    ctx.fillRect(x, y, cellSize, cellSize);
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

        // Helper to draw path
        const drawPath = (pathStr, x, y, color, size) => {
            ctx.save();
            ctx.translate(x, y);
            const scale = size / 50; // SVGs are 50x50
            ctx.scale(scale, scale);
            const p = new Path2D(pathStr);
            ctx.fillStyle = color;
            ctx.fill(p);
            ctx.restore();
        };

        // Draw Outer Frame
        if (SHAPES.frame[frameStyle]) {
            drawPath(SHAPES.frame[frameStyle], eyeX, eyeY, frameColor, eyeSize);
        } else {
            // Fallback
            ctx.fillStyle = frameColor;
            ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
            ctx.fillStyle = bgColor;
            ctx.fillRect(eyeX + cellSize, eyeY + cellSize, 5 * cellSize, 5 * cellSize);
        }

        // Draw Inner Ball
        const ballSize = 3 * cellSize;
        const ballX = eyeX + 2 * cellSize;
        const ballY = eyeY + 2 * cellSize;

        if (SHAPES.ball[ballStyle]) {
            drawPath(SHAPES.ball[ballStyle], ballX, ballY, ballColor, ballSize);
        } else {
            // Fallback
            ctx.fillStyle = ballColor;
            ctx.fillRect(ballX, ballY, ballSize, ballSize);
        }
    };

    drawEye(0, 0);
    drawEye(0, moduleCount - 7);
    drawEye(moduleCount - 7, 0);

    // Add logo if exists
    if (design?.image?.url) {
        try {
            const logoImage = await loadImage(design.image.url);
            const logoSize = size * (design.imageOptions?.imageSize || design.image?.size || 0.2);
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;

            if (design.imageOptions?.hideBackgroundDots || design.image?.hideBackgroundDots) {
                ctx.fillStyle = design?.background?.color || '#ffffff';
                ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            }

            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        } catch (err) {
            // console.error('Logo load error:', err);
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
        if (design?.logo?.url) {
            try {
                const logo = await loadImage(design.logo.url);
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
        const { type, name, data, design, businessInfo, menu, timings, social, isBusinessPage, appLinks, appStatus, customComponents, coupon, facilities, contact, personalInfo, exchange, openingHours, basicInfo, form, customFields, thankYou, rating, reviews, shareOption, pdf, links, socialLinks, infoFields, eventSchedule, venue, contactInfo, productContent, video, feedback, images, dynamicUrl } = req.body;

        // Generate shortId first
        const shortId = shortid.generate();

        // Generate actual QR URL based on type BEFORE saving
        const baseUrl = req.get('host').includes('localhost') ? 'http://localhost:5173' : `${req.protocol}://${req.get('host').replace(':3000', '')}`;
        let qrContent = '';

        if (type === 'app-store') {
            qrContent = `${baseUrl}/app/${shortId}`;
        } else if (type === 'menu' || type === 'business-page' || type === 'custom-type' || type === 'coupon' || type === 'business-card' || type === 'bio-page' || type === 'lead-generation' || type === 'rating' || type === 'reviews' || type === 'social-media' || type === 'pdf' || type === 'multiple-links' || type === 'password-protected' || type === 'event' || type === 'product-page' || type === 'video' || type === 'image') {
            qrContent = `${baseUrl}/view/${shortId}`;
        } else {
            const backendUrl = req.get('host').includes('localhost') ? 'http://localhost:3000' : `${req.protocol}://${req.get('host')}`;
            qrContent = `${backendUrl}/${shortId}`;
        }

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
            shortId: shortId
        });

        await newQR.save();

        // Generate QR image and upload to Vercel Blob
        try {
            const filename = `qr-codes/${newQR.shortId}-${Date.now()}.png`;

            let imageBuffer;
            if (req.body.qrImage) {
                // Use provided client-side image
                const base64Data = req.body.qrImage.replace(/^data:image\/\w+;base64,/, "");
                imageBuffer = Buffer.from(base64Data, 'base64');
            } else {
                // Use the actual QR content URL we just set
                imageBuffer = await generateQRImageBuffer(qrContent, design);
            }

            const blobUrl = await uploadQRImage(imageBuffer, filename);

            // Update QR with image URL
            newQR.qrImageUrl = blobUrl;
            await newQR.save();
        } catch (uploadError) {
            console.error('Error uploading QR image:', uploadError);
            // Continue even if upload fails - QR will render client-side
        }

        // Return the short URL (reuse baseUrl from above)
        const shortUrl = isBusinessPage
            ? `${baseUrl}/view/${newQR.shortId}`
            : `${req.protocol}://${req.get('host')}/${newQR.shortId}`;

        res.json({ shortUrl, shortId: newQR.shortId });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Redirect Dynamic QR
exports.redirectQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });

        if (!qr) {
            return res.status(404).send('QR Code not found');
        }

        // Analytics
        const ip = req.clientIp || req.ip;
        const userAgent = req.useragent;
        const geo = geoip.lookup(ip);

        const scanData = {
            ip: ip,
            device: userAgent ? (userAgent.isMobile ? 'Mobile' : 'Desktop') : 'Unknown',
            os: userAgent ? userAgent.os : 'Unknown',
            browser: userAgent ? userAgent.browser : 'Unknown',
            location: geo ? `${geo.city}, ${geo.country}` : 'Unknown'
        };

        // Update scans
        qr.scans.push(scanData);
        qr.scanCount = (qr.scanCount || 0) + 1;
        await qr.save();

        // Redirect based on type
        if (qr.type === 'url') {
            return res.redirect(qr.data);
        } else if (qr.type === 'dynamic-url') {
            return res.redirect(qr.dynamicUrl);
        } else if (qr.type === 'video') {
            if (qr.video && qr.video.redirect) {
                return res.redirect(qr.video.url);
            }
            const baseUrl = req.get('host').includes('localhost') ? 'http://localhost:5173' : `${req.protocol}://${req.get('host')}`;
            return res.redirect(`${baseUrl}/view/${qr.shortId}`);
        } else if (qr.type === 'text') {
            return res.send(qr.data);
        } else if (qr.type === 'app-store') {
            // Redirect to App Store landing page
            const baseUrl = req.get('host').includes('localhost') ? 'http://localhost:5173' : `${req.protocol}://${req.get('host')}`;
            return res.redirect(`${baseUrl}/app/${qr.shortId}`);
        } else if (qr.type === 'business-page' || qr.type === 'menu' || qr.type === 'custom-type' || qr.type === 'coupon' || qr.type === 'business-card' || qr.type === 'bio-page' || qr.type === 'lead-generation' || qr.type === 'rating' || qr.type === 'reviews' || qr.type === 'social-media' || qr.type === 'pdf' || qr.type === 'multiple-links' || qr.type === 'password-protected' || qr.type === 'event' || qr.type === 'product-page' || qr.type === 'video' || qr.type === 'image') {
            // Redirect to Business Page / Menu / Custom Type / Coupon / Business Card landing
            const baseUrl = req.get('host').includes('localhost') ? 'http://localhost:5173' : `${req.protocol}://${req.get('host')}`;
            return res.redirect(`${baseUrl}/view/${qr.shortId}`);
        }

        // For other types, you might show a landing page
        res.json(qr.data);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update QR (Editable)
exports.updateQR = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, design, businessInfo, menu, timings, social, appLinks, appStatus, facilities, contact, personalInfo, coupon, customComponents, exchange, openingHours, basicInfo, form, customFields, thankYou, rating, reviews, shareOption, pdf, links, socialLinks, infoFields, eventSchedule, venue, contactInfo, productContent, video, feedback, images, dynamicUrl } = req.body;

        const qr = await QRCodeModel.findById(id);
        if (!qr) return res.status(404).send('QR Code not found');

        const oldImageUrl = qr.qrImageUrl;

        // Update all fields properly
        if (data !== undefined) qr.data = data;
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

        await qr.save();

        // Regenerate QR image if design changed
        if (design) {
            try {
                const baseUrl = req.get('host').includes('localhost') ? 'http://localhost:3000' : `${req.protocol}://${req.get('host')}`;
                const qrContent = `${baseUrl}/${qr.shortId}`;
                const filename = `qr-codes/${qr.shortId}-${Date.now()}.png`;

                let imageBuffer;
                if (req.body.qrImage) {
                    const base64Data = req.body.qrImage.replace(/^data:image\/\w+;base64,/, "");
                    imageBuffer = Buffer.from(base64Data, 'base64');
                } else {
                    imageBuffer = await generateQRImageBuffer(qrContent, qr.design);
                }

                const qrImageUrl = await uploadQRImage(imageBuffer, filename);
                qr.qrImageUrl = qrImageUrl;
                await qr.save();

                // Delete old image if exists and it's different from the new one
                if (oldImageUrl && oldImageUrl !== qrImageUrl) {
                    await deleteQRImage(oldImageUrl);
                }
                await qr.save();
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

// Get Single QR (for Landing Page)
exports.getQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        if (!qr) return res.status(404).send('QR Not Found');
        res.json(qr);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// List all QR codes
exports.listQRs = async (req, res) => {
    try {
        // Check if database is connected
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Database not connected',
                message: 'Please wait for database connection'
            });
        }

        const qrs = await QRCodeModel.find().sort({ createdAt: -1 }).lean();
        console.log(`Fetched ${qrs.length} QR codes`);
        res.json(qrs);
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
exports.downloadStoredQR = async (req, res) => {
    try {
        const qr = await QRCodeModel.findOne({ shortId: req.params.shortId });
        if (!qr) return res.status(404).send('QR Code not found');

        const { type, design } = qr;
        const format = (req.query.format || 'png').toLowerCase();

        // ✅ ALWAYS use frontend base for QR content
        const isLocal = req.get('host').includes('localhost');
        const frontendBase = isLocal
            ? 'http://localhost:5173'
            : `${req.protocol}://${req.get('host').replace(':3000', '')}`;

        // ✅ Generate content based on type (ALWAYS frontend URLs)
        let content;
        if (type === 'app-store') {
            content = `${frontendBase}/app/${qr.shortId}`;
        } else if (['menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(type)) {
            content = `${frontendBase}/view/${qr.shortId}`;
        } else {
            // Even for URL types, use frontend redirect
            content = `${frontendBase}/r/${qr.shortId}`; // Frontend handles redirect
        }

        console.log('🔍 QR Content:', content);
        console.log('📱 Type:', type);

        // SVG generation
        if (format === 'svg') {
            const svgString = await QRCode.toString(content, {
                type: 'svg',
                errorCorrectionLevel: 'H',
                color: {
                    dark: design?.dots?.color || '#000000',
                    light: design?.background?.color || '#ffffff'
                },
                margin: 4 // ✅ Fixed
            });
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', `attachment; filename="qr-${qr.shortId}.svg"`);
            return res.send(svgString);
        }

        // PNG generation with fallback
        let pngBuffer;
        try {
            pngBuffer = await generateQRImageBuffer(content, design);
        } catch (genErr) {
            console.error('QR buffer generation failed, using basic QR:', genErr);
            pngBuffer = await QRCode.toBuffer(content, {
                errorCorrectionLevel: 'H',
                type: 'png',
                margin: 4, // ✅ Fixed
                width: 1000,
                color: {
                    dark: design?.dots?.color || '#000000',
                    light: design?.background?.color || '#ffffff'
                }
            });
        }

        console.log('✅ Buffer generated:', pngBuffer.length, 'bytes');

        // JPEG format
        if (format === 'jpeg' || format === 'jpg') {
            const jpegBuffer = await sharp(pngBuffer).jpeg({ quality: 95 }).toBuffer();
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
                console.error('Sharp PDF failed, using pdfkit:', pdfErr);
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

        // Default PNG
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
