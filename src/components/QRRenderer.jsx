import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCode from 'qrcode';

const SHAPES = {
    // Body Patterns
    body: {
        square: (ctx, x, y, size) => ctx.fillRect(x, y, size, size),
        dots: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();
        },
        rounded: (ctx, x, y, size) => {
            const r = size * 0.25;
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, r);
            ctx.fill();
        },
        'extra-rounded': (ctx, x, y, size) => {
            const r = size * 0.5;
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, r);
            ctx.fill();
        },
        classy: (ctx, x, y, size) => {
            // Diamond shape
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y);
            ctx.lineTo(x + size, y + size / 2);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x, y + size / 2);
            ctx.closePath();
            ctx.fill();
        }
    },
    // Eye Frames (Outer) - Defined as paths for 50x50 viewport
    frame: {
        circle: "M25 5C13.95 5 5 13.95 5 25s8.95 20 20 20 20-8.95 20-20S36.05 5 25 5zm0 5c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15z",
        square: "M5 5h40v40H5V5zm5 5v30h30V10H10z",
        dashed: "M5 5h12v5H10v7H5V5z M38 5h7v12h-5v-7h-2V5z M5 38v7h12v-5h-7v-2H5z M38 45h7v-12h-5v7h-2v5z",
        rounded: "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 5c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12z",
        'leaf-top-right': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zM38 10h-7v5h7c1.1 0 2 .9 2 2v21c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h19v-5H12c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z",
        'leaf-bottom-right': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm26 35h-7v-5h7c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2h19v5H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h26c1.1 0 2 .9 2 2v21c0 1.1-.9 2-2 2z",
        'leaf-bottom-left': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 35h7v-5h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h26c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H19v5h19c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2z",
        'leaf-top-left': "M12 5h26c3.87 0 7 3.13 7 7v26c0 3.87-3.13 7-7 7H12c-3.87 0-7-3.13-7-7V12c0-3.87 3.13-7 7-7zm0 5h7v5h-7c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H19V5h19c1.1 0 2 .9 2 2v26c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2z",
        'dot-frame': "M5 5h40v40H5V5zm5 5v30h30V10H10z M25 15 A10 10 0 1 0 25 35 A10 10 0 1 0 25 15"
    },
    // Eye Balls (Inner) - Defined as paths for 50x50 viewport
    ball: {
        dot: "M25 10 A15 15 0 1 1 25 40 A15 15 0 1 1 25 10", // Circle r=15 at 25,25
        square: "M10 10h30v30H10z",
        'extra-rounded': "M10 10h30c4.42 0 8 3.58 8 8v14c0 4.42-3.58 8-8 8H10c-4.42 0-8-3.58-8-8V18c0-4.42 3.58-8 8-8z", // Approx rect with radius
        'leaf-1': "M10 25 Q10 10 25 10 L40 10 L40 25 Q40 40 25 40 L10 40 Z",
        'leaf-2': "M10 10 L25 10 Q40 10 40 25 L40 40 L25 40 Q10 40 10 25 Z",
        'leaf-3': "M10 10 L25 10 L40 10 L40 25 Q40 40 25 40 Q10 40 10 25 Z",
        diamond: "M25 5 L45 25 L25 45 L5 25 Z",
        star: "M25 8 L30 18 L41 19 L32 26 L35 37 L25 31 L15 37 L18 26 L9 19 L20 18 Z",
        plus: "M20 10 H30 V20 H40 V30 H30 V40 H20 V30 H10 V20 H20 Z",
        cross: "M15 10 L25 20 L35 10 L40 15 L30 25 L40 35 L35 40 L25 30 L15 40 L10 35 L20 25 L10 15 Z"
    }
};

const QRRenderer = forwardRef(({ value, design, size = 280, margin = 20, id }, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
        download: (format = 'png', name = 'qr-code') => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const link = document.createElement('a');
            link.download = `${name}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
            link.click();
        },
        getDataURL: (format = 'png') => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
            return canvas.toDataURL(`image/${format}`);
        }
    }));

    useEffect(() => {
        const renderQR = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            // Generate QR Matrix
            const qrData = await QRCode.create(value, {
                errorCorrectionLevel: 'H',
                margin: 0 // We handle margin manually
            });
            const modules = qrData.modules.data;
            const moduleCount = qrData.modules.size;

            // Setup Canvas
            const totalSize = size;
            const drawingSize = totalSize - (margin * 2);
            const cellSize = drawingSize / moduleCount;

            canvas.width = totalSize;
            canvas.height = totalSize;

            // Fill Background
            ctx.fillStyle = design.background?.color || '#ffffff';
            ctx.fillRect(0, 0, totalSize, totalSize);

            // Helper to draw path
            const drawPath = (pathStr, x, y, color) => {
                ctx.save();
                ctx.translate(x, y);
                const scale = cellSize / 50; // SVGs are 50x50
                ctx.scale(scale, scale);
                const p = new Path2D(pathStr);
                ctx.fillStyle = color;
                ctx.fill(p);
                ctx.restore();
            };

            // Helper to check if module is part of Position Pattern (Eyes)
            const isEye = (r, c) => {
                // Top-Left
                if (r < 7 && c < 7) return true;
                // Top-Right
                if (r < 7 && c >= moduleCount - 7) return true;
                // Bottom-Left
                if (r >= moduleCount - 7 && c < 7) return true;
                return false;
            };

            // Draw Modules (Body)
            ctx.fillStyle = design.dots?.color || '#000000';
            for (let r = 0; r < moduleCount; r++) {
                for (let c = 0; c < moduleCount; c++) {
                    if (modules[r * moduleCount + c]) {
                        if (!isEye(r, c)) {
                            // Check if covered by logo
                            // Simple center check for logo
                            const center = moduleCount / 2;
                            const logoSizeRatio = design.imageOptions?.imageSize || 0.4; // Default 0.4 from DesignQR
                            const logoSizeModules = logoSizeRatio * moduleCount;
                            const halfLogo = logoSizeModules / 2;

                            // Only hide background dots if the option is enabled (Toggle ON)
                            const shouldHideDots = design.imageOptions?.hideBackgroundDots;

                            const isCoveredByLogo =
                                design.image?.url &&
                                shouldHideDots &&
                                r > center - halfLogo && r < center + halfLogo &&
                                c > center - halfLogo && c < center + halfLogo;

                            if (!isCoveredByLogo) {
                                const x = margin + c * cellSize;
                                const y = margin + r * cellSize;
                                const style = design.dots?.style || 'square';
                                if (SHAPES.body[style]) {
                                    SHAPES.body[style](ctx, x, y, cellSize);
                                } else {
                                    ctx.fillRect(x, y, cellSize, cellSize);
                                }
                            }
                        }
                    }
                }
            }

            // Draw Eyes (Position Patterns)
            // Draw Eyes (Position Patterns)
            const drawEye = (r, c) => {
                const x = margin + c * cellSize;
                const y = margin + r * cellSize;
                const eyeSize = 7 * cellSize;

                const frameColor = design.cornersSquare?.color || design.dots?.color || '#000000';
                const ballColor = design.cornersDot?.color || design.dots?.color || '#000000';

                const frameStyle = design.cornersSquare?.style || 'square';
                const ballStyle = design.cornersDot?.style || 'dot';

                // Helper to draw geometric shape
                const drawGeometricEye = (type, style, drawX, drawY, size, color) => {
                    ctx.fillStyle = color;
                    const center = size / 2;
                    const radius = size / 2;

                    ctx.beginPath();

                    if (style === 'circle' || style === 'dot') {
                        ctx.arc(drawX + center, drawY + center, radius, 0, Math.PI * 2);
                    } else if (style === 'rounded') {
                        const r = size * 0.25;
                        if (ctx.roundRect) ctx.roundRect(drawX, drawY, size, size, r);
                        else ctx.rect(drawX, drawY, size, size);
                    } else if (style === 'extra-rounded') {
                        const r = size * 0.45;
                        if (ctx.roundRect) ctx.roundRect(drawX, drawY, size, size, r);
                        else ctx.rect(drawX, drawY, size, size);
                    } else if (style === 'dashed') {
                        const thickness = size / 7;
                        const legLen = size * 0.35;

                        ctx.fillRect(drawX, drawY, legLen, thickness);
                        ctx.fillRect(drawX, drawY, thickness, legLen);

                        ctx.fillRect(drawX + size - legLen, drawY, legLen, thickness);
                        ctx.fillRect(drawX + size - thickness, drawY, thickness, legLen);

                        ctx.fillRect(drawX, drawY + size - thickness, legLen, thickness);
                        ctx.fillRect(drawX, drawY + size - legLen, thickness, legLen);

                        ctx.fillRect(drawX + size - legLen, drawY + size - thickness, legLen, thickness);
                        ctx.fillRect(drawX + size - thickness, drawY + size - legLen, thickness, legLen);
                        return;
                    } else if (style.startsWith('leaf') || style.startsWith('teardrop')) {
                        const r = size * 0.4;
                        let radii = [0, 0, 0, 0];
                        if (style === 'leaf-diag-1') radii = [r, 0, r, 0]; // TR & BL Sharp
                        else if (style === 'leaf-diag-2') radii = [0, r, 0, r]; // TL & BR Sharp
                        else if (style === 'teardrop-tl') radii = [0, r, r, r]; // TL Sharp
                        else if (style === 'leaf-top-right') radii = [r, 0, r, r]; // Legacy support
                        else if (style === 'leaf-top-left') radii = [0, r, r, r];
                        else radii = [0, r, 0, r]; // Default diagonal

                        // Fallback for ball leaf styles
                        if (style === 'leaf-1') radii = [r, 0, r, 0];
                        if (style === 'leaf-2') radii = [0, r, 0, r];
                        if (style === 'leaf-3') radii = [r, r, 0, r];

                        if (ctx.roundRect) ctx.roundRect(drawX, drawY, size, size, radii);
                        else ctx.rect(drawX, drawY, size, size);
                    } else if (style === 'diamond') {
                        const mid = size / 2;
                        ctx.moveTo(drawX + mid, drawY);
                        ctx.lineTo(drawX + size, drawY + mid);
                        ctx.lineTo(drawX + mid, drawY + size);
                        ctx.lineTo(drawX, drawY + mid);
                        ctx.closePath();
                    } else if (style === 'star') {
                        const cx = drawX + size / 2;
                        const cy = drawY + size / 2;
                        const spikes = 5;
                        const outerRadius = size / 2;
                        const innerRadius = size / 4;
                        let rot = Math.PI / 2 * 3;
                        let x = cx;
                        let y = cy;
                        const step = Math.PI / spikes;

                        ctx.moveTo(cx, cy - outerRadius);
                        for (let i = 0; i < spikes; i++) {
                            x = cx + Math.cos(rot) * outerRadius;
                            y = cy + Math.sin(rot) * outerRadius;
                            ctx.lineTo(x, y);
                            rot += step;

                            x = cx + Math.cos(rot) * innerRadius;
                            y = cy + Math.sin(rot) * innerRadius;
                            ctx.lineTo(x, y);
                            rot += step;
                        }
                        ctx.lineTo(cx, cy - outerRadius);
                        ctx.closePath();
                    } else if (style === 'plus') {
                        const thickness = size / 3.5;
                        const offset = (size - thickness) / 2;
                        ctx.rect(drawX + offset, drawY, thickness, size); // V
                        ctx.rect(drawX, drawY + offset, size, thickness); // H
                    } else if (style === 'cross') {
                        // X shape
                        const thickness = size / 2.5; // Thicker for scannability
                        // Use matrix rotation or path
                        ctx.save();
                        ctx.translate(drawX + size / 2, drawY + size / 2);
                        ctx.rotate(45 * Math.PI / 180);
                        ctx.translate(-(drawX + size / 2), -(drawY + size / 2));
                        const offset = (size - thickness) / 2;
                        ctx.rect(drawX + offset, drawY, thickness, size);
                        ctx.rect(drawX, drawY + offset, size, thickness);
                        ctx.restore();
                        // Note: fillRect inside rotate doesn't work with ctx.fill() if correct path not closed?
                        // Wait, drawGeometricEye ends with ctx.fill().
                        // rect() adds to path. fillResult works.
                        // But save/restore might mess up context for subsequent fill?
                        // Actually ctx.rect adds to current path. Rotate affects the coordinates.
                        // Ideally we should compute points.
                        // Easier: Draw the plus path logic but with manually rotated points?
                        // No, let's just use paths that persist.
                        // ctx.rect works with current transform.
                    } else {
                        // Default Square (includes dot-frame)
                        ctx.rect(drawX, drawY, size, size);
                    }
                    ctx.fill();
                };

                // Draw Outer Frame
                ctx.fillStyle = frameColor;
                if (frameStyle === 'dashed') {
                    drawGeometricEye('frame', frameStyle, x, y, eyeSize, frameColor);
                } else {
                    drawGeometricEye('frame', frameStyle, x, y, eyeSize, frameColor);
                    // Inner cutout
                    ctx.fillStyle = design.background?.color || '#ffffff';
                    const innerSize = 5 * cellSize;
                    const innerOffset = cellSize;
                    drawGeometricEye('frame', frameStyle, x + innerOffset, y + innerOffset, innerSize, design.background?.color || '#ffffff');
                }

                // Draw Inner Ball
                const ballSize = 3 * cellSize;
                const ballX = x + 2 * cellSize;
                const ballY = y + 2 * cellSize;
                drawGeometricEye('ball', ballStyle, ballX, ballY, ballSize, ballColor);
            };

            // Top-Left
            drawEye(0, 0);
            // Top-Right
            drawEye(0, moduleCount - 7);
            // Bottom-Left
            drawEye(moduleCount - 7, 0);

            // Draw Logo
            if (design.image?.url) {
                const img = new Image();
                img.src = design.image.url;
                img.crossOrigin = "Anonymous";
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if error
                });

                const logoSizeRatio = design.imageOptions?.imageSize || 0.4;
                const logoSize = logoSizeRatio * totalSize;
                const logoX = (totalSize - logoSize) / 2;
                const logoY = (totalSize - logoSize) / 2;

                ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            }
        };

        renderQR();
    }, [value, design, size]);

    return (
        <canvas id={id} ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
    );
});

export default QRRenderer;
