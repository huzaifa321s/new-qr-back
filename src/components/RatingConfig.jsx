import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, Music, Ghost, MessageCircle, Send, Dribbble, Github, GripVertical } from 'lucide-react';
import { useState } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';
import ImageUploadModal from './ImageUploadModal';

const RatingConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);

    // Reusable Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalTempImage, setUploadModalTempImage] = useState(null);
    const [uploadModalFileName, setUploadModalFileName] = useState('');
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const design = config.design || {};
    const basicInfo = config.basicInfo || {
        name: "Bob's Cafe",
        website: "https://www.bobscafe.com"
    };
    const rating = config.rating || {
        question: "How was your rental experience?",
        type: 'stars', // thumbs, emoji, stars
        allowComment: false
    };
    const socialLinks = config.socialLinks || [];

    const primaryColor = design.color?.header || '#4EB5E0';
    const secondaryColor = design.color?.light || '#FF5E3B';

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

    const handleHeaderImageUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                headerImage: { url }
            }
        }));
    };

    const handleFileChange = (e) => {
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
    };

    const handleUploadModalSave = (url) => {
        handleHeaderImageUpdate(url);
        setIsUploadModalOpen(false);
        setUploadModalTempImage(null);
        setUploadModalFileName('');
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

    const handleRatingUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            rating: {
                ...prev.rating,
                [key]: value
            }
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

    // Social Links handlers
    const handleSocialLinkAdd = (platformId) => {
        // Check if platform already exists
        const exists = socialLinks.some(link => link.platform === platformId);
        if (exists) return;

        const newLink = {
            id: Date.now().toString(),
            platform: platformId,
            url: ''
        };
        onChange(prev => ({
            ...prev,
            socialLinks: [...(prev.socialLinks || []), newLink]
        }));
    };

    const handleSocialLinkUpdate = (id, value) => {
        const newLinks = socialLinks.map(link =>
            link.id === id ? { ...link, url: value } : link
        );
        onChange(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const handleSocialLinkRemove = (id) => {
        const newLinks = socialLinks.filter(link => link.id !== id);
        onChange(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const handleSocialLinkUnselect = (id) => {
        // Remove the social link entirely
        const newLinks = socialLinks.filter(link => link.id !== id);
        onChange(prev => ({ ...prev, socialLinks: newLinks }));
    };

    // Social Media Platforms Configuration
    const socialPlatforms = [
        { id: 'website', name: 'Website', icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png', color: '#4B5563' },
        { id: 'facebook', name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', color: '#1877F2' },
        { id: 'instagram', name: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', color: '#E4405F' },
        { id: 'twitter', name: 'X', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png', color: '#000000' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', color: '#0A66C2' },
        { id: 'discord', name: 'Discord', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670157.png', color: '#5865F2' },
        { id: 'twitch', name: 'Twitch', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111668.png', color: '#9146FF' },
        { id: 'youtube', name: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', color: '#FF0000' },
        { id: 'whatsapp', name: 'WhatsApp', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png', color: '#25D366' },
        { id: 'snapchat', name: 'Snapchat', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', color: '#FFFC00' },
        { id: 'tiktok', name: 'TikTok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', color: '#000000' },
        { id: 'tumblr', name: 'Tumblr', icon: 'https://cdn-icons-png.flaticon.com/512/100/100611.png', color: '#35465C' },
        { id: 'spotify', name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174868.png', color: '#1DB954' },
        { id: 'telegram', name: 'Telegram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', color: '#0088CC' },
        { id: 'behance', name: 'Behance', icon: 'https://cdn-icons-png.flaticon.com/512/733/733541.png', color: '#1769FF' },
        { id: 'pinterest', name: 'Pinterest', icon: 'https://cdn-icons-png.flaticon.com/512/145/145808.png', color: '#BD081C' },
        { id: 'reddit', name: 'Reddit', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670154.png', color: '#FF4500' },
        { id: 'line', name: 'Line', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111491.png', color: '#00B900' }
    ];

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
        { id: 'logo3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        header: design.color?.header || '#4EB5E0',
                        light: design.color?.light || '#FF5E3B'
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
                logoLabel="YOUR LOGO"
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
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            <UploadCloud size={20} color="#94a3b8" />
                        </label>

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

                        {/* Custom Uploaded Image */}
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

                        {/* NAME FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                NAME*
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Name Input */}
                                <div style={{ flex: '2 1 200px' }}>
                                    <input
                                        type="text"
                                        value={basicInfo.name || ''}
                                        onChange={(e) => handleBasicInfoUpdate('name', e.target.value)}
                                        placeholder="Bob's Cafe"
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
                                        padding: '0.5rem',
                                        height: '44px',
                                        gap: '0.5rem'
                                    }}>
                                        <input
                                            type="text"
                                            value={basicInfo.nameColor || '#FFFFFF'}
                                            onChange={(e) => handleBasicInfoUpdate('nameColor', e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                flex: 1,
                                                fontSize: '0.85rem',
                                                color: '#000',
                                                fontWeight: '500',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '4px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            border: '1px solid #e2e8f0',
                                            flexShrink: 0
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: basicInfo.nameColor || '#FFFFFF'
                                            }}></div>
                                            <input
                                                type="color"
                                                value={basicInfo.nameColor || '#FFFFFF'}
                                                onChange={(e) => handleBasicInfoUpdate('nameColor', e.target.value)}
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

                                {/* Font */}
                                <div style={{ flex: '1 1 100px' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={basicInfo.nameFont || 'Lato'}
                                        onChange={(e) => handleBasicInfoUpdate('nameFont', e.target.value)}
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

                        {/* WEBSITE FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                WEBSITE*
                            </label>
                            <input
                                type="text"
                                value={basicInfo.website || ''}
                                onChange={(e) => handleBasicInfoUpdate('website', e.target.value)}
                                placeholder="https://www.bobscafe.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #06b6d4',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                    </div>
                )
                }
            </div >

            {/* RATING ACCORDION */}
            < div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsRatingOpen(!isRatingOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isRatingOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>RATING</div>
                    </div>
                    {isRatingOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {
                    isRatingOpen && (
                        <div style={{ padding: '1rem', background: '#fff' }}>

                            {/* QUESTION FIELD */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    QUESTION*
                                </label>
                                <input
                                    type="text"
                                    value={rating.question || ''}
                                    onChange={(e) => handleRatingUpdate('question', e.target.value)}
                                    placeholder="How was your rental experience?"
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

                            {/* RATING TYPE OPTIONS */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>

                                {/* Thumbs Up/Down Option */}
                                <div
                                    onClick={() => handleRatingUpdate('type', 'thumbs')}
                                    style={{
                                        flex: '1 1 150px',
                                        padding: '1.5rem 1rem',
                                        border: rating.type === 'thumbs' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#8b5cf6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        👍
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#8b5cf6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        👎
                                    </div>
                                </div>

                                {/* Emoji Faces Option */}
                                <div
                                    onClick={() => handleRatingUpdate('type', 'emoji')}
                                    style={{
                                        flex: '1 1 150px',
                                        padding: '1.5rem 1rem',
                                        border: rating.type === 'emoji' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', color: '#94a3b8' }}>☹️</div>
                                    <div style={{ fontSize: '2rem', color: '#94a3b8' }}>😐</div>
                                    <div style={{ fontSize: '2rem', color: '#94a3b8' }}>😊</div>
                                </div>

                                {/* Stars Option */}
                                <div
                                    onClick={() => handleRatingUpdate('type', 'stars')}
                                    style={{
                                        flex: '1 1 150px',
                                        padding: '1.5rem 1rem',
                                        border: rating.type === 'stars' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', color: '#cbd5e1' }}>⭐</div>
                                    <div style={{ fontSize: '2rem', color: '#cbd5e1' }}>⭐</div>
                                    <div style={{ fontSize: '2rem', color: '#cbd5e1' }}>⭐</div>
                                </div>

                            </div>

                            {/* ADD COMMENT SECTION CHECKBOX */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={rating.allowComment || false}
                                    onChange={(e) => handleRatingUpdate('allowComment', e.target.checked)}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>Add a comment section for user after rating.</span>
                            </label>

                        </div>
                    )
                }
            </div >

            {/* SOCIAL MEDIA CHANNELS ACCORDION */}
            < div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
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

                {
                    isSocialOpen && (
                        <div style={{ padding: '1rem', background: '#fff' }}>

                            {/* Selected Social Media Inputs Grid */}
                            {socialLinks.length > 0 && (
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                    {socialLinks.map((link) => {
                                        const platform = socialPlatforms.find(p => p.id === link.platform);
                                        if (!platform) return null;
                                        const Icon = platform.icon;

                                        return (
                                            <div key={link.id} style={{ flex: '1 1 200px', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                                                        {platform.name}*
                                                    </label>
                                                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                        <div
                                                            style={{
                                                                cursor: 'pointer',
                                                                padding: '0.25rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            onClick={() => handleSocialLinkUnselect(link.id)}
                                                            title="Unselect"
                                                        >
                                                            <X size={16} color="#cbd5e1" />
                                                        </div>
                                                        <div
                                                            style={{
                                                                cursor: 'grab',
                                                                padding: '0.25rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Drag to reorder"
                                                        >
                                                            <GripVertical size={16} color="#cbd5e1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '12px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: '24px',
                                                        height: '24px',
                                                        background: 'transparent',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 1
                                                    }}>
                                                        {typeof Icon === 'string' ? (
                                                            <img
                                                                src={Icon}
                                                                alt={platform.name}
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    objectFit: 'contain'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Icon size={16} color={platform.textColor || "#fff"} />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={link.url || ''}
                                                        onChange={(e) => handleSocialLinkUpdate(link.id, e.target.value)}
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
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ADD MORE Section */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    ADD MORE
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                    Click on the icon to add a social media profile.
                                </div>

                                {/* Social Media Icons Grid */}
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {socialPlatforms.map((platform) => {
                                        const Icon = platform.icon;
                                        const isAdded = socialLinks.some(link => link.platform === platform.id);

                                        return (
                                            <div
                                                key={platform.id}
                                                onClick={() => !isAdded && handleSocialLinkAdd(platform.id)}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    background: '#fff',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: isAdded ? 'not-allowed' : 'pointer',
                                                    opacity: isAdded ? 0.5 : 1,
                                                    transition: 'transform 0.1s',
                                                    border: isAdded ? '2px solid #cbd5e1' : '1px solid #e2e8f0',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}
                                                title={isAdded ? `${platform.name} already added` : `Add ${platform.name}`}
                                                onMouseEnter={(e) => {
                                                    if (!isAdded) e.currentTarget.style.transform = 'scale(1.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            >
                                                {typeof Icon === 'string' ? (
                                                    <img
                                                        src={Icon}
                                                        alt={platform.name}
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <Icon size={24} color={platform.textColor || "#fff"} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
            </div>

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

            {/* Simple Preview Modal */}
            {showPreviewModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10000,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                    onClick={() => setShowPreviewModal(false)}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowPreviewModal(false)}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '-40px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#fff'
                            }}
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={design.headerImage?.url}
                            alt="Header Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingConfig;
