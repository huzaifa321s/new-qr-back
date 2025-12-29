import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check } from 'lucide-react';
import { useState } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';
import ImageUploadModal from './ImageUploadModal';

const socialIconsMap = [
    { id: 'website', icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png', color: '#4B5563', name: 'Website' },
    { id: 'facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', color: '#1877F2', name: 'Facebook' },
    { id: 'instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', color: '#E4405F', name: 'Instagram' },
    { id: 'twitter', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png', color: '#000000', name: 'X' },
    { id: 'linkedin', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', color: '#0A66C2', name: 'LinkedIn' },
    { id: 'tiktok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', color: '#000000', name: 'TikTok' },
    { id: 'youtube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', color: '#FF0000', name: 'YouTube' },
    { id: 'whatsapp', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png', color: '#25D366', name: 'WhatsApp' },
    { id: 'snapchat', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', color: '#FFFC00', name: 'Snapchat' },
    { id: 'discord', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670157.png', color: '#5865F2', name: 'Discord' },
    { id: 'twitch', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111668.png', color: '#9146FF', name: 'Twitch' },
    { id: 'telegram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', color: '#0088CC', name: 'Telegram' },
    { id: 'pinterest', icon: 'https://cdn-icons-png.flaticon.com/512/145/145808.png', color: '#BD081C', name: 'Pinterest' },
    { id: 'reddit', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670154.png', color: '#FF4500', name: 'Reddit' },
    { id: 'spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174868.png', color: '#1DB954', name: 'Spotify' },
    { id: 'behance', icon: 'https://cdn-icons-png.flaticon.com/512/733/733541.png', color: '#1769FF', name: 'Behance' },
    { id: 'line', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111491.png', color: '#00B900', name: 'Line' }
];

const ReviewsConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalTempImage, setUploadModalTempImage] = useState(null);
    const [uploadModalFileName, setUploadModalFileName] = useState('');
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const design = config.design || {};
    const basicInfo = config.basicInfo || {};
    const categories = config.categories || [
        { id: 1, name: '', subcategories: [''] }
    ];
    const social = config.social || {};

    const primaryColor = design.color?.header || '#2131AE';
    const secondaryColor = design.color?.light || '#C0E1DD';

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
                color: { header: primary, dark: primary, light: secondary }
            }
        }));
    };

    const handleHeaderImageUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                headerImage: { url }
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

    const handleBasicInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                [key]: value
            }
        }));
    };

    const handleCategoryUpdate = (categoryId, field, value) => {
        onChange(prev => ({
            ...prev,
            categories: prev.categories.map(cat =>
                cat.id === categoryId ? { ...cat, [field]: value } : cat
            )
        }));
    };

    const handleSubcategoryUpdate = (categoryId, subcategoryIndex, value) => {
        onChange(prev => ({
            ...prev,
            categories: prev.categories.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        subcategories: cat.subcategories.map((sub, idx) =>
                            idx === subcategoryIndex ? value : sub
                        )
                    }
                    : cat
            )
        }));
    };

    const handleAddSubcategory = (categoryId) => {
        onChange(prev => ({
            ...prev,
            categories: prev.categories.map(cat =>
                cat.id === categoryId
                    ? { ...cat, subcategories: [...cat.subcategories, ''] }
                    : cat
            )
        }));
    };

    const handleAddCategory = () => {
        onChange(prev => ({
            ...prev,
            categories: [
                ...prev.categories,
                { id: Date.now(), name: '', subcategories: [''] }
            ]
        }));
    };

    const handleDeleteCategory = (categoryId) => {
        onChange(prev => ({
            ...prev,
            categories: prev.categories.filter(cat => cat.id !== categoryId)
        }));
    };

    const handleDeleteSubcategory = (categoryId, subcategoryIndex) => {
        onChange(prev => ({
            ...prev,
            categories: prev.categories.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        subcategories: cat.subcategories.filter((_, idx) => idx !== subcategoryIndex)
                    }
                    : cat
            )
        }));
    };

    const handleSocialUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            social: {
                ...prev.social,
                [key]: value
            }
        }));
    };

    const handleToggleSocial = (platformId) => {
        onChange(prev => {
            const newSocial = { ...prev.social };
            if (newSocial[platformId] !== undefined) {
                delete newSocial[platformId];
            } else {
                newSocial[platformId] = '';
            }
            return {
                ...prev,
                social: newSocial
            };
        });
    };

    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FACC15', s: '#FEF9C3' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const headerImageOptions = [
        { id: 'header1', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' },
        { id: 'header2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=267&fit=crop' },
        { id: 'header3', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=267&fit=crop' },
        { id: 'header4', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=267&fit=crop' },
        { id: 'header5', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=267&fit=crop' },
        { id: 'header6', url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=267&fit=crop' }
    ];

    const logoOptions = [
        { id: 'logo1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 'logo2', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
        { id: 'logo3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
        { id: 'logo4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' }
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        header: design.color?.header || '#2131AE',
                        light: design.color?.light || '#C0E1DD'
                    },
                    logo: {
                        ...design.logo,
                        url: design.logo?.url
                    }
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'color.header', secondary: 'color.light' }}
                palettes={palettes}
                logoKey="logo.url"
                logoOptions={logoOptions}
                logoLabel="LOGO"
                logoHelpText="128x128px, 1:1 Ratio"
            >
                {/* HEADER IMAGE SECTION */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                            HEADER IMAGE
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Minimum width : 400px, 3:2 Ratio
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Remove/Clear Option */}
                        <div
                            onClick={() => handleHeaderImageUpdate('')}
                            style={{
                                width: '80px',
                                height: '53px',
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

                        {/* Header Image Options */}
                        {headerImageOptions.map(img => (
                            <div
                                key={img.id}
                                onClick={() => handleHeaderImageUpdate(img.url)}
                                style={{
                                    width: '80px',
                                    height: '53px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: design.headerImage?.url === img.url ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {design.headerImage?.url === img.url && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        width: '20px',
                                        height: '20px',
                                        background: '#8b5cf6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #fff'
                                    }}>
                                        <Check size={12} color="#fff" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Upload Option */}
                        <label style={{
                            width: '80px',
                            height: '53px',
                            borderRadius: '4px',
                            border: '1px dashed #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setUploadModalTempImage(reader.result);
                                        setUploadModalFileName(file.name);
                                        setIsUploadModalOpen(true);
                                    };
                                    reader.readAsDataURL(file);
                                    e.target.value = null;
                                }}
                            />
                            <UploadCloud size={20} color="#94a3b8" />
                        </label>

                        {/* Custom Uploaded Header Image */}
                        {design.headerImage?.url && !headerImageOptions.find(img => img.url === design.headerImage.url) && (
                            <div
                                onClick={() => setShowPreviewModal(true)}
                                onMouseEnter={() => setIsHoveringUpload(true)}
                                onMouseLeave={() => setIsHoveringUpload(false)}
                                style={{
                                    width: '80px',
                                    height: '53px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: '2px solid #8b5cf6',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <img src={design.headerImage.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {isHoveringUpload && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10
                                    }}>
                                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>Preview</span>
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: 2,
                                    right: 2,
                                    width: '20px',
                                    height: '20px',
                                    background: '#8b5cf6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #fff',
                                    zIndex: 5
                                }}>
                                    <Check size={12} color="#fff" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ReusableDesignAccordion>

            {/* BASIC INFORMATION ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
                    style={{
                        padding: '1.5rem',
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

                        {/* ORGANIZATION NAME FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ORGANIZATION NAME*
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Organization Name Input */}
                                <div style={{ flex: '2 1 200px' }}>
                                    <input
                                        type="text"
                                        value={basicInfo.organizationName || 'LUXURY HOTELS'}
                                        onChange={(e) => handleBasicInfoUpdate('organizationName', e.target.value)}
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

                                {/* Text Color */}
                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Text Color
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        padding: '0.25rem',
                                        height: '44px',
                                        gap: '0.5rem'
                                    }}>
                                        <input
                                            type="color"
                                            value={basicInfo.organizationNameColor || '#FFFFFF'}
                                            onChange={(e) => handleBasicInfoUpdate('organizationNameColor', e.target.value)}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: 'none',
                                                background: 'none',
                                                padding: 0,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={basicInfo.organizationNameColor || '#FFFFFF'}
                                            onChange={(e) => handleBasicInfoUpdate('organizationNameColor', e.target.value)}
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '0.85rem',
                                                color: '#000',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                minWidth: 0
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Font */}
                                <div style={{ flex: '1 1 100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={basicInfo.organizationNameFont || 'Lato'}
                                        onChange={(e) => handleBasicInfoUpdate('organizationNameFont', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            background: '#fff',
                                            height: '44px'
                                        }}
                                    >
                                        <option value="Lato">Lato</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* TITLE FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                TITLE*
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Title Input */}
                                <div style={{ flex: '2 1 200px' }}>
                                    <input
                                        type="text"
                                        value={basicInfo.title || 'Give us your feedback'}
                                        onChange={(e) => handleBasicInfoUpdate('title', e.target.value)}
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

                                {/* Text Color */}
                                <div style={{ flex: '1 1 120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Text Color
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        padding: '0.25rem',
                                        height: '44px',
                                        gap: '0.5rem'
                                    }}>
                                        <input
                                            type="color"
                                            value={basicInfo.titleColor || '#1e293b'}
                                            onChange={(e) => handleBasicInfoUpdate('titleColor', e.target.value)}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: 'none',
                                                background: 'none',
                                                padding: 0,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={basicInfo.titleColor || '#1e293b'}
                                            onChange={(e) => handleBasicInfoUpdate('titleColor', e.target.value)}
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '0.85rem',
                                                color: '#000',
                                                fontWeight: '500',
                                                textTransform: 'uppercase',
                                                minWidth: 0
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Font */}
                                <div style={{ flex: '1 1 100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={basicInfo.titleFont || 'Lato'}
                                        onChange={(e) => handleBasicInfoUpdate('titleFont', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            background: '#fff',
                                            height: '44px'
                                        }}
                                    >
                                        <option value="Lato">Lato</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* DESCRIPTION FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DESCRIPTION
                            </label>
                            <textarea
                                value={basicInfo.description || 'We aim to provide fresh and healthy snacks people on the go.'}
                                onChange={(e) => handleBasicInfoUpdate('description', e.target.value)}
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

                        {/* WEBSITE FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                WEBSITE*
                            </label>
                            <input
                                type="text"
                                value={basicInfo.website || 'https://www.hotelparadise.com'}
                                onChange={(e) => handleBasicInfoUpdate('website', e.target.value)}
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

            {/* CATEGORY ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isCategoryOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>CATEGORY</div>
                    </div>
                    {isCategoryOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isCategoryOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Categories List */}
                        {categories.map((category, categoryIndex) => (
                            <div key={category.id} style={{ marginBottom: '2rem', position: 'relative' }}>

                                {/* Category Name */}
                                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        CATEGORY NAME*
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input
                                            type="text"
                                            value={category.name || ''}
                                            onChange={(e) => handleCategoryUpdate(category.id, 'name', e.target.value)}
                                            placeholder="Food"
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none'
                                            }}
                                        />
                                        {/* Delete Category Icon */}
                                        <div
                                            onClick={() => handleDeleteCategory(category.id)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                flexShrink: 0
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                                        >
                                            <X size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            SUBCATEGORIES:
                                        </label>

                                        {category.subcategories.map((subcategory, subIndex) => (
                                            <div key={subIndex} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <input
                                                    type="text"
                                                    value={subcategory || ''}
                                                    onChange={(e) => handleSubcategoryUpdate(category.id, subIndex, e.target.value)}
                                                    placeholder="Staff"
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.75rem',
                                                        borderRadius: '4px',
                                                        border: '1px solid #1e293b',
                                                        fontSize: '0.9rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                                {/* Delete Subcategory Icon */}
                                                <div
                                                    onClick={() => handleDeleteSubcategory(category.id, subIndex)}
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        background: '#f1f5f9',
                                                        color: '#64748b',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        flexShrink: 0
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                >
                                                    <X size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add Subcategory Button */}
                                <div style={{ textAlign: 'right', marginBottom: categoryIndex < categories.length - 1 ? '2rem' : '0' }}>
                                    <button
                                        onClick={() => handleAddSubcategory(category.id)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #8b5cf6',
                                            color: '#8b5cf6',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        + Add Subcategory
                                    </button>
                                </div>

                            </div>
                        ))}

                        {/* Add Category Button */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                onClick={handleAddCategory}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #1e293b',
                                    color: '#1e293b',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                + Add Category
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* SOCIAL MEDIA CHANNELS ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsSocialOpen(!isSocialOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isSocialOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>SOCIAL MEDIA CHANNELS</div>
                    </div>
                    {isSocialOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isSocialOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Social Media Input Fields */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {Object.keys(social).map((platformId) => {
                                const platform = socialIconsMap.find(p => p.id === platformId);
                                if (!platform) return null;
                                return (
                                    <div key={platformId} style={{ flex: '1 1 200px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            {platform.name}*
                                        </label>
                                        <div style={{ position: 'relative', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <div style={{ position: 'relative', flex: 1 }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 1
                                                }}>
                                                    <img src={platform.icon} alt={platform.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={social[platformId] || ''}
                                                    onChange={(e) => handleSocialUpdate(platformId, e.target.value)}
                                                    placeholder="https://"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 0.75rem 0.75rem 3rem',
                                                        borderRadius: '4px',
                                                        border: '1px solid #1e293b',
                                                        fontSize: '0.9rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <div
                                                onClick={() => handleToggleSocial(platformId)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <X size={16} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ADD MORE Section */}
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ADD MORE
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                                Click on the icon to add a social media profile.
                            </div>

                            {/* Social Media Icons Grid */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {socialIconsMap.map((platform) => {
                                    const isSelected = social[platform.id] !== undefined;
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => handleToggleSocial(platform.id)}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: '#fff',
                                                borderRadius: '12px',
                                                border: `2px solid ${isSelected ? '#8b5cf6' : '#f1f5f9'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.2s',
                                                boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.15)' : 'none'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isSelected) e.currentTarget.style.borderColor = '#f1f5f9';
                                            }}
                                        >
                                            <img
                                                src={platform.icon}
                                                alt={platform.name}
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    objectFit: 'contain',
                                                    filter: isSelected ? 'none' : 'grayscale(100%) opacity(0.5)'
                                                }}
                                            />
                                            {isSelected && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    width: '18px',
                                                    height: '18px',
                                                    background: '#8b5cf6',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    border: '2px solid #fff'
                                                }}>
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setUploadModalTempImage(null);
                    setUploadModalFileName('');
                }}
                tempImage={uploadModalTempImage}
                fileName={uploadModalFileName}
                onSave={(url) => {
                    handleHeaderImageUpdate(url);
                    setIsUploadModalOpen(false);
                    setUploadModalTempImage(null);
                    setUploadModalFileName('');
                }}
            />

            {/* Preview Modal for Uploaded Header Image */}
            {showPreviewModal && design.headerImage?.url && (
                <div
                    onClick={() => setShowPreviewModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '2rem'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                        <img
                            src={design.headerImage.url}
                            alt="Header Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPreviewModal(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                background: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <X size={20} color="#000" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsConfig;
