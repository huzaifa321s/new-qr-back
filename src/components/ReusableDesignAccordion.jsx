
import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Check, UploadCloud, X, Eye } from 'lucide-react';
import ImageUploadModal from './ImageUploadModal';
import axios from 'axios';

/**
 * Reusable Design Accordion Component
 * 
 * @param {Object} props
 * @param {Object} props.design - The design configuration object
 * @param {Function} props.onChange - Handler for updates: (key, value) => void
 * @param {boolean} props.isOpen - Whether the accordion is open
 * @param {Function} props.onToggle - Handler to toggle open state
 * @param {string} props.label - Accordion title (default: "DESIGN")
 * @param {boolean} props.showColors - Whether to show the Colors section (default: true)
 * @param {boolean} props.showLogo - Whether to show the Logo section (default: true)
 * @param {string} props.logoLabel - Label for the Logo section (default: "LOGO")
 * @param {string} props.logoHelpText - Help text for logo (default: "128x128px, 1:1 Ratio")
 * @param {Object} props.colorKeys - Keys to access color values in `design`. Supports dot notation for one level nesting (e.g. 'color.header').
 * @param {Array} props.palettes - Array of color palettes { p: string, s: string }
 * @param {Array} props.logoOptions - Array of logo option objects { id: string, url: string }
 * @param {Object} props.logoKey - Key for the logo in `design` object (default: 'logo')
 * @param {React.ReactNode} props.children - Additional content to render inside the accordion
 */
const ReusableDesignAccordion = ({
    design = {},
    onChange,
    isOpen,
    onToggle,
    label = "DESIGN",
    showColors = true,
    showLogo = true,
    logoLabel = "LOGO",
    logoHelpText = "128x128px, 1:1 Ratio",
    colorKeys = { primary: 'color.header', secondary: 'color.light' },
    palettes = [],
    logoOptions = [],
    logoKey = 'logo', // Can be 'logo' (string url) or 'logo.url' (nested)
    logoShapeKey,
    children
}) => {

    // Helper to resolve value from path (e.g., "color.header" -> design.color.header)
    const getValue = (path) => {
        if (!path) return '';
        const keys = path.split('.');
        let val = design;
        for (const k of keys) {
            val = val?.[k];
        }
        return val;
    };

    const primaryColor = getValue(colorKeys.primary) || '#0B2D86';
    const secondaryColor = getValue(colorKeys.secondary) || '#FFA800';

    // Helper to determine if the logo is a string URL or an object with URL
    const getLogoUrl = () => {
        const val = getValue(logoKey);
        if (typeof val === 'string') return val;
        return val?.url || '';
    };

    const currentLogoUrl = getLogoUrl();
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // State for image upload modal
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleColorPaletteClick = (p, s) => {
        onChange(colorKeys.primary, p);
        onChange(colorKeys.secondary, s);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result);
            setIsUploadModalOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = null; // Clear input
    };

    const handleSaveLogo = (url) => {
        if (logoKey.includes('.')) {
            const keys = logoKey.split('.');
            onChange(keys[0], { ...getValue(keys[0]), [keys[1]]: url });
        } else {
            // If logoKey is just 'logo', store as object with url property
            onChange(logoKey, { url: url });
        }
    };

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div
                onClick={onToggle}
                style={{
                    padding: '1.5rem',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderBottom: isOpen ? '1px solid #e2e8f0' : 'none'
                }}
            >
                <div>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>{label}</div>
                </div>
                {isOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
            </div>

            {isOpen && (
                <div style={{ padding: '1rem', background: '#fff' }}>

                    {showColors && (
                        <div style={{ marginBottom: showLogo || children ? '2rem' : '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                COLORS
                            </label>

                            {/* Color Palettes */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                {palettes.map((palette, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleColorPaletteClick(palette.p, palette.s)}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: (primaryColor === palette.p && secondaryColor === palette.s) ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
                                            position: 'relative',
                                            background: `linear-gradient(180deg, ${palette.p} 50%, ${palette.s} 50%)`
                                        }}
                                    >
                                        {(primaryColor === palette.p && secondaryColor === palette.s) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '24px',
                                                height: '24px',
                                                background: '#8b5cf6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #fff'
                                            }}>
                                                <Check size={14} color="#fff" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div style={{
                                position: 'relative',
                                height: '1px',
                                background: 'none',
                                borderTop: '1px dashed #e2e8f0',
                                margin: '2rem 0'
                            }}></div>

                            {/* Primary and Secondary Color Inputs */}
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Primary Color */}
                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Primary Color
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        padding: '0.5rem',
                                        height: '44px'
                                    }}>
                                        <input
                                            type="text"
                                            value={primaryColor}
                                            onChange={(e) => onChange(colorKeys.primary, e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.9rem',
                                                color: '#000',
                                                fontWeight: '500',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            background: primaryColor,
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => onChange(colorKeys.primary, e.target.value)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-50%',
                                                    left: '-50%',
                                                    width: '200%',
                                                    height: '200%',
                                                    cursor: 'pointer',
                                                    opacity: 0
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Swap Icon */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingTop: '1.2rem',
                                    flexShrink: 0
                                }}>
                                    <div
                                        onClick={() => handleColorPaletteClick(secondaryColor, primaryColor)}
                                        style={{
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#cbd5e1'
                                        }}
                                    >
                                        <RefreshCw size={20} />
                                    </div>
                                </div>

                                {/* Secondary Color */}
                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Secondary Color
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        padding: '0.5rem',
                                        height: '44px'
                                    }}>
                                        <input
                                            type="text"
                                            value={secondaryColor}
                                            onChange={(e) => onChange(colorKeys.secondary, e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.9rem',
                                                color: '#000',
                                                fontWeight: '500',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            background: secondaryColor,
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={secondaryColor}
                                                onChange={(e) => onChange(colorKeys.secondary, e.target.value)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-50%',
                                                    left: '-50%',
                                                    width: '200%',
                                                    height: '200%',
                                                    cursor: 'pointer',
                                                    opacity: 0
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showLogo && (
                        <div style={{ marginBottom: children ? '2rem' : '0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                                    {logoLabel}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {logoHelpText}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', paddingBottom: '0.5rem' }}>
                                {/* Remove/Clear Option */}
                                <div
                                    onClick={() => {
                                        if (logoKey.includes('.')) {
                                            const keys = logoKey.split('.');
                                            onChange(keys[0], { ...getValue(keys[0]), [keys[1]]: '' });
                                        } else {
                                            onChange(logoKey, null);
                                        }
                                    }}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#fff',
                                        flexShrink: 0
                                    }}
                                    title="Remove Logo"
                                >
                                    <X size={24} color="#cbd5e1" />
                                </div>

                                {/* Logo Presets */}
                                {logoOptions && logoOptions.map(img => (
                                    <div
                                        key={img.id}
                                        onClick={() => {
                                            if (logoKey.includes('.')) {
                                                const keys = logoKey.split('.');
                                                onChange(keys[0], { ...getValue(keys[0]), [keys[1]]: img.url });
                                            } else {
                                                onChange(logoKey, { url: img.url });
                                            }
                                        }}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: currentLogoUrl === img.url ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {currentLogoUrl === img.url && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '24px',
                                                height: '24px',
                                                background: '#8b5cf6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #fff'
                                            }}>
                                                <Check size={14} color="#fff" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Custom Uploaded Logo (if not in presets) */}
                                {currentLogoUrl && !logoOptions?.some(o => o.url === currentLogoUrl) && (
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '2px solid #8b5cf6',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <img src={currentLogoUrl} alt="Custom Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '24px',
                                            height: '24px',
                                            background: '#8b5cf6',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #fff',
                                            zIndex: 2
                                        }}>
                                            <Check size={14} color="#fff" />
                                        </div>
                                        {isHovered && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 3
                                            }}>
                                                <Eye size={24} color="#fff" />
                                                <span style={{ color: '#fff', fontSize: '10px', marginTop: '4px' }}>Preview</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Upload Option */}
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <div
                                        onClick={triggerFileUpload}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            border: '1px dashed #cbd5e1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                    >
                                        <UploadCloud size={24} color="#94a3b8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shape Selection */}
                    {showLogo && logoShapeKey && (
                        <div style={{ marginBottom: children ? '2rem' : '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                SHAPE
                            </label>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="shape"
                                        checked={getValue(logoShapeKey) !== 'rectangular'} // Default to circular
                                        onChange={() => {
                                            if (logoShapeKey.includes('.')) {
                                                const keys = logoShapeKey.split('.');
                                                onChange(keys[0], { ...getValue(keys[0]), [keys[1]]: 'circular' });
                                            } else {
                                                onChange(logoShapeKey, 'circular');
                                            }
                                        }}
                                        style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>Circular</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="shape"
                                        checked={getValue(logoShapeKey) === 'rectangular'}
                                        onChange={() => {
                                            if (logoShapeKey.includes('.')) {
                                                const keys = logoShapeKey.split('.');
                                                onChange(keys[0], { ...getValue(keys[0]), [keys[1]]: 'rectangular' });
                                            } else {
                                                onChange(logoShapeKey, 'rectangular');
                                            }
                                        }}
                                        style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>Rectangular</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {children}
                </div>
            )}
            {/* Modal for Logo Preview */}
            {isModalOpen && currentLogoUrl && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setIsModalOpen(false)}>
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <img src={currentLogoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }} />
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={24} color="#000" />
                        </button>
                    </div>
                </div>
            )}

            {/* Reusable Upload/Edit Modal */}
            <ImageUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setTempImage(null);
                }}
                onSave={handleSaveLogo}
                tempImage={tempImage}
                fileName={fileName}
                type="logo"
            />
        </div>
    );
};

export default ReusableDesignAccordion;
