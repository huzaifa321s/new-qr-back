import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Eye } from 'lucide-react';
import { useState, useRef } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';
import ImageUploadModal from './ImageUploadModal';

const CouponConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isCouponOpen, setIsCouponOpen] = useState(false);

    // New state for modal and hover
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalTempImage, setUploadModalTempImage] = useState(null);
    const [uploadModalFileName, setUploadModalFileName] = useState('');
    const fileInputRef = useRef(null);

    const design = config.design || {};
    const coupon = config.coupon || {};
    const businessInfo = config.businessInfo || {};

    const primaryColor = design.color?.dark || '#7D2AE7';
    const secondaryColor = design.color?.light || '#0BBBCE';

    const handleDesignUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            design: { ...prev.design, [key]: value }
        }));
    };

    const handleDesignSectionUpdate = (key, value) => {
        onChange(prev => {
            const newDesign = { ...prev.design };
            const keys = key.split('.');
            if (keys.length === 1) {
                newDesign[keys[0]] = value;
            } else {
                if (!newDesign[keys[0]]) newDesign[keys[0]] = {};
                newDesign[keys[0]] = { ...newDesign[keys[0]], [keys[1]]: value };
            }
            return { ...prev, design: newDesign };
        });
    };

    const handleColorUpdate = (colorKey, value) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                color: { ...prev.design.color, [colorKey]: value }
            }
        }));
    };

    const handleColorPaletteClick = (primary, secondary) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                color: { dark: primary, light: secondary }
            }
        }));
    };

    const handleLogoUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                logo: { url }
            }
        }));
    };

    const handleBackgroundImageUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            coupon: {
                ...prev.coupon,
                image: url
            }
        }));
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

        const reader = new FileReader();
        reader.onload = () => {
            setUploadModalTempImage(reader.result);
            setUploadModalFileName(file.name);
            setIsUploadModalOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input
    };

    const handleUploadModalSave = (url) => {
        handleBackgroundImageUpdate(url);
    };

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleBusinessInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            businessInfo: {
                ...prev.businessInfo,
                [key]: value
            }
        }));
    };

    const handleCouponUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            coupon: {
                ...prev.coupon,
                [key]: value
            }
        }));
    };

    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FACC15', s: '#FEF9C3' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const backgroundImages = [
        { id: 'bg1', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop' },
        { id: 'bg2', url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop' },
        { id: 'bg3', url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop' },
        { id: 'bg4', url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=300&fit=crop' },
        { id: 'bg5', url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop' },
        { id: 'bg6', url: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400&h=300&fit=crop' },
        { id: 'bg7', url: 'https://img.freepik.com/free-vector/flat-winter-sale-background_23-2149121770.jpg' }
    ];

    const logoOptions = [
        { id: 'logo1', url: 'https://picsum.photos/seed/logo1/150/150' },
        { id: 'logo2', url: 'https://picsum.photos/seed/logo2/150/150' },
        { id: 'logo3', url: 'https://picsum.photos/seed/logo3/150/150' },
        { id: 'logo4', url: 'https://picsum.photos/seed/logo4/150/150' }
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        dark: design.color?.dark || '#7D2AE7',
                        light: design.color?.light || '#08B8CE'
                    },
                    logo: {
                        ...design.logo,
                        url: design.logo?.url
                    }
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'color.dark', secondary: 'color.light' }}
                palettes={palettes}
                logoKey="logo.url"
                logoOptions={logoOptions}
                logoLabel="LOGO"
                logoHelpText="128x128px, 1:1 Ratio"
            >
                {/* BACKGROUND IMAGE SECTION - Passed as Children */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                            BACKGROUND IMAGE
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Minimum width: 400px, 3:2 Ratio
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Remove/Clear Option */}
                        <div
                            onClick={() => handleBackgroundImageUpdate('')}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                        >
                            <X size={24} color="#cbd5e1" />
                        </div>

                        {/* Background Image Options */}
                        {backgroundImages.map(img => (
                            <div
                                key={img.id}
                                onClick={() => handleBackgroundImageUpdate(img.url)}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: coupon.image === img.url ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {coupon.image === img.url && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '20px',
                                        height: '20px',
                                        background: '#8b5cf6',
                                        borderBottomLeftRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Check size={12} color="#fff" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Uploaded Image (if not in presets) */}
                        {coupon.image && !backgroundImages.some(img => img.url === coupon.image) && (
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: '2px solid #8b5cf6',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <img src={coupon.image} alt="Custom Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '20px',
                                    height: '20px',
                                    background: '#8b5cf6',
                                    borderBottomLeftRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2
                                }}>
                                    <Check size={12} color="#fff" />
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
                                        <Eye size={20} color="#fff" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upload Option */}
                        <div
                            onClick={triggerFileUpload}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '4px',
                                border: '1px dashed #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <UploadCloud size={20} color="#94a3b8" />
                        </div>
                    </div>
                </div>
            </ReusableDesignAccordion>

            {/* Modal for Background Image Preview */}
            {isModalOpen && coupon.image && (
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
                    padding: '1rem'
                }} onClick={() => setIsModalOpen(false)}>
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <img src={coupon.image} alt="Background Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }} />
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

            {/* BASIC INFORMATION ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
                    style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isBasicInfoOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>BASIC INFORMATION</div>
                    </div>
                    {isBasicInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isBasicInfoOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        COMPANY NAME*
                                    </label>
                                    <input
                                        type="text"
                                        value={businessInfo.title || ''}
                                        onChange={(e) => handleBusinessInfoUpdate('title', e.target.value)}
                                        placeholder="ABC Boutique"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Text Color
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
                                            value={businessInfo.titleColor || '#FFFFFF'}
                                            onChange={(e) => handleBusinessInfoUpdate('titleColor', e.target.value)}
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
                                            background: businessInfo.titleColor || '#FFFFFF',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={businessInfo.titleColor || '#FFFFFF'}
                                                onChange={(e) => handleBusinessInfoUpdate('titleColor', e.target.value)}
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

                                <div style={{ flex: '1 1 100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={businessInfo.titleFont || 'Lato'}
                                        onChange={(e) => handleBusinessInfoUpdate('titleFont', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            height: '44px',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center`,
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="Lato">Lato</option>
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Work Sans">Work Sans</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        HEADLINE*
                                    </label>
                                    <input
                                        type="text"
                                        value={coupon.title || ''}
                                        onChange={(e) => handleCouponUpdate('title', e.target.value)}
                                        placeholder="Winter Sale"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Text Color
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
                                            value={coupon.titleColor || '#FFFFFF'}
                                            onChange={(e) => handleCouponUpdate('titleColor', e.target.value)}
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
                                            background: coupon.titleColor || '#FFFFFF',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={coupon.titleColor || '#FFFFFF'}
                                                onChange={(e) => handleCouponUpdate('titleColor', e.target.value)}
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

                                <div style={{ flex: '1 1 100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={coupon.titleFont || 'Lato'}
                                        onChange={(e) => handleCouponUpdate('titleFont', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            height: '44px',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center`,
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="Lato">Lato</option>
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Work Sans">Work Sans</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DESCRIPTION*
                            </label>
                            <textarea
                                value={coupon.offer || ''}
                                onChange={(e) => handleCouponUpdate('offer', e.target.value)}
                                placeholder="Copy the Coupon and get 50% OFF on your next purchase"
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                    </div>
                )}
            </div>

            {/* COUPON ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsCouponOpen(!isCouponOpen)}
                    style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isCouponOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>COUPON</div>
                    </div>
                    {isCouponOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isCouponOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* COUPON CODE */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                COUPON CODE*
                            </label>
                            <input
                                type="text"
                                value={coupon.code || ''}
                                onChange={(e) => handleCouponUpdate('code', e.target.value)}
                                placeholder="SALE20"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* COUPON EFFECTIVE DATE */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                COUPON EFFECTIVE DATE*
                            </label>
                            <input
                                type="date"
                                value={coupon.expiry || ''}
                                onChange={(e) => handleCouponUpdate('expiry', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#000'
                                }}
                            />
                        </div>

                        {/* TERMS & CONDITIONS */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                TERMS & CONDITIONS
                            </label>
                            <textarea
                                value={coupon.terms || 'This coupon is only valid for online purchases.'}
                                onChange={(e) => handleCouponUpdate('terms', e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* BUTTON TITLE */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                BUTTON TITLE*
                            </label>
                            <input
                                type="text"
                                value={coupon.buttonTitle || 'Redeem Now'}
                                onChange={(e) => handleCouponUpdate('buttonTitle', e.target.value)}
                                placeholder="Redeem Now"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* CALL TO ACTION */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                CALL TO ACTION*
                            </label>
                            <input
                                type="text"
                                value={coupon.callToAction || 'https://www.abcbotique.com'}
                                onChange={(e) => handleCouponUpdate('callToAction', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* LOCATION */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                LOCATION
                            </label>
                            <input
                                type="text"
                                value={coupon.location || ''}
                                onChange={(e) => handleCouponUpdate('location', e.target.value)}
                                placeholder="1000 Marketplace Ave. NY, 10001, United States"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                    </div>
                )}
            </div>
            {/* Reusable Upload Modal */}
            <ImageUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setUploadModalTempImage(null);
                }}
                tempImage={uploadModalTempImage}
                onSave={handleUploadModalSave}
                fileName={uploadModalFileName}
                type="image"
            />
        </div>
    );
};

export default CouponConfig;
