import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, MessageCircle, Music, MessageSquare, Twitch, Send, Ghost, Headphones, Pin, Bot } from 'lucide-react';
import { useState } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';
import ImageUploadModal from './ImageUploadModal';

const SocialMediaConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);
    const [isShareOptionOpen, setIsShareOptionOpen] = useState(false);

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalTempImage, setUploadModalTempImage] = useState(null);
    const [uploadModalFileName, setUploadModalFileName] = useState('');
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const design = config.design || {};
    const basicInfo = config.basicInfo || {};
    const social = config.social || {};
    const shareOption = config.shareOption || {};

    const primaryColor = design.color?.header || '#0B2D86';
    const secondaryColor = design.color?.light || '#FFA800';

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

    const handleBackgroundImageUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                backgroundImage: { url }
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

    const handleSocialUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            social: {
                ...prev.social,
                [key]: value
            }
        }));
    };

    const handleDeleteSocial = (urlKey, textKey) => {
        onChange(prev => {
            const newSocial = { ...prev.social };
            delete newSocial[urlKey];
            delete newSocial[textKey];
            return { ...prev, social: newSocial };
        });
    };

    const handleToggleSocial = (urlKey, textKey) => {
        onChange(prev => {
            const newSocial = { ...prev.social };
            if (newSocial[urlKey] !== undefined) {
                // Unselect
                delete newSocial[urlKey];
                delete newSocial[textKey];
            } else {
                // Select
                newSocial[urlKey] = '';
                newSocial[textKey] = '';
            }
            return { ...prev, social: newSocial };
        });
    };

    const handleShareOptionUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            shareOption: {
                ...prev.shareOption,
                [key]: value
            }
        }));
    };

    const platformConfig = [
        { id: 'website', urlKey: 'websiteUrl', textKey: 'websiteText', name: 'Website', icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png', color: '#6366f1', placeholder: 'https://techoid.com', defaultText: 'Visit Us Online' },
        { id: 'facebook', urlKey: 'facebookUrl', textKey: 'facebookText', name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', color: '#1877f2', placeholder: 'https://facebook.com/techoid' },
        { id: 'instagram', urlKey: 'instagramUrl', textKey: 'instagramText', name: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', color: '#E4405F', placeholder: 'https://instagram.com/techoid' },
        { id: 'twitter', urlKey: 'twitterUrl', textKey: 'twitterText', name: 'X (Twitter)', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png', color: '#000000', placeholder: 'https://x.com/techoid' },
        { id: 'linkedin', urlKey: 'linkedinUrl', textKey: 'linkedinText', name: 'LinkedIn', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', color: '#0a66c2', placeholder: 'https://linkedin.com/in/techoid' },
        { id: 'discord', urlKey: 'discordUrl', textKey: 'discordText', name: 'Discord', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670157.png', color: '#5865f2', placeholder: 'https://discord.gg/techoid' },
        { id: 'twitch', urlKey: 'twitchUrl', textKey: 'twitchText', name: 'Twitch', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111668.png', color: '#9146ff', placeholder: 'https://twitch.tv/techoid' },
        { id: 'youtube', urlKey: 'youtubeUrl', textKey: 'youtubeText', name: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', color: '#ff0000', placeholder: 'https://youtube.com/@techoid' },
        { id: 'whatsapp', urlKey: 'whatsappUrl', textKey: 'whatsappText', name: 'WhatsApp', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png', color: '#25d366', placeholder: '15555551234' },
        { id: 'snapchat', urlKey: 'snapchatUrl', textKey: 'snapchatText', name: 'Snapchat', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', color: '#fffc00', placeholder: 'https://snapchat.com/add/techoid' },
        { id: 'tiktok', urlKey: 'tiktokUrl', textKey: 'tiktokText', name: 'TikTok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', color: '#000000', placeholder: 'https://tiktok.com/@techoid' },
        { id: 'tumblr', urlKey: 'tumblrUrl', textKey: 'tumblrText', name: 'Tumblr', icon: 'https://cdn-icons-png.flaticon.com/512/100/100611.png', color: '#35465c', placeholder: 'https://techoid.tumblr.com' },
        { id: 'spotify', urlKey: 'spotifyUrl', textKey: 'spotifyText', name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174868.png', color: '#1db954', placeholder: 'https://open.spotify.com/user/techoid' },
        { id: 'telegram', urlKey: 'telegramUrl', textKey: 'telegramText', name: 'Telegram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', color: '#0088cc', placeholder: 'https://t.me/techoid' },
        { id: 'behance', urlKey: 'behanceUrl', textKey: 'behanceText', name: 'Behance', icon: 'https://cdn-icons-png.flaticon.com/512/733/733541.png', color: '#1769ff', placeholder: 'https://behance.net/techoid' },
        { id: 'pinterest', urlKey: 'pinterestUrl', textKey: 'pinterestText', name: 'Pinterest', icon: 'https://cdn-icons-png.flaticon.com/512/145/145808.png', color: '#e60023', placeholder: 'https://pinterest.com/techoid' },
        { id: 'reddit', urlKey: 'redditUrl', textKey: 'redditText', name: 'Reddit', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670154.png', color: '#ff4500', placeholder: 'https://reddit.com/user/techoid' },
        { id: 'line', urlKey: 'lineUrl', textKey: 'lineText', name: 'Line', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111491.png', color: '#00B900', placeholder: 'https://line.me/ti/p/techoid' },
    ];

    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FACC15', s: '#FEF9C3' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const backgroundImageOptions = [
        { id: 'bg1', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' },
        { id: 'bg2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=267&fit=crop' },
        { id: 'bg3', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=267&fit=crop' },
        { id: 'bg4', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=267&fit=crop' },
        { id: 'bg5', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=267&fit=crop' }
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
                        header: design.color?.header || '#0B2D86',
                        light: design.color?.light || '#FFA800'
                    }
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'color.header', secondary: 'color.light' }}
                palettes={palettes}
                logoKey="logo.url"
                logoOptions={logoOptions}
            >
                {/* BACKGROUND IMAGE SECTION */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                            BACKGROUND IMAGE
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Minimum width : 400px, 3:2 Ratio
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Remove/Clear Option */}
                        <div
                            onClick={() => handleBackgroundImageUpdate('')}
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

                        {/* Background Image Options */}
                        {backgroundImageOptions.map(img => (
                            <div
                                key={img.id}
                                onClick={() => handleBackgroundImageUpdate(img.url)}
                                style={{
                                    width: '80px',
                                    height: '53px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: design.backgroundImage?.url === img.url ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {design.backgroundImage?.url === img.url && (
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

                        {/* Custom Uploaded Background Image */}
                        {design.backgroundImage?.url && !backgroundImageOptions.find(img => img.url === design.backgroundImage.url) && (
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
                                <img src={design.backgroundImage.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                {/* LOGO SECTION */}
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
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>BASIC INFORMATION</div>
                    </div>
                    {isBasicInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isBasicInfoOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* HEADLINE FIELD */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                HEADLINE*
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    {/* Headline Input */}
                                    <input
                                        type="text"
                                        value={basicInfo.headline || "Connect With Us On Social Media"}
                                        onChange={(e) => handleBasicInfoUpdate('headline', e.target.value)}
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

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {/* Text Color */}
                                    <div style={{ flex: '1 1 150px' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                            Text Color
                                        </label>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            padding: '0.5rem',
                                            height: '44px',
                                            background: '#fff'
                                        }}>
                                            <input
                                                type="text"
                                                value={basicInfo.headlineColor || '#FFFFFF'}
                                                onChange={(e) => handleBasicInfoUpdate('headlineColor', e.target.value)}
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    width: '100%',
                                                    fontSize: '0.85rem',
                                                    color: '#000',
                                                    fontWeight: '500',
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                background: basicInfo.headlineColor || '#FFFFFF',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                                border: '1px solid #e2e8f0',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
                                            }}>
                                                <input
                                                    type="color"
                                                    value={basicInfo.headlineColor || '#FFFFFF'}
                                                    onChange={(e) => handleBasicInfoUpdate('headlineColor', e.target.value)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-50%',
                                                        left: '-50%',
                                                        width: '200%',
                                                        height: '200%',
                                                        cursor: 'pointer',
                                                        opacity: 0,
                                                        padding: 0,
                                                        margin: 0
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Font */}
                                    <div style={{ flex: '1 1 150px' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                            Font
                                        </label>
                                        <select
                                            value={basicInfo.headlineFont || 'Lato'}
                                            onChange={(e) => handleBasicInfoUpdate('headlineFont', e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '44px',
                                                padding: '0 0.75rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                background: '#fff'
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
                        </div>

                        {/* ABOUT US FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ABOUT US
                            </label>
                            <textarea
                                value={basicInfo.aboutUs || "Follow us and get updates delivered to your favorite social media channel."}
                                onChange={(e) => handleBasicInfoUpdate('aboutUs', e.target.value)}
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
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>SOCIAL MEDIA CHANNELS</div>
                    </div>
                    {isSocialOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isSocialOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Dynamic Render of Active Platforms */}
                        {platformConfig.filter(p => social[p.urlKey] !== undefined).map(platform => {
                            const isUrlInvalid = social[platform.urlKey] && !social[platform.urlKey].startsWith('http');

                            return (
                                <div key={platform.id} style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                        {platform.name.toUpperCase()}
                                    </label>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {/* URL Input */}
                                            <div style={{ flex: '1 1 200px' }}>
                                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                                    URL
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '12px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: '24px',
                                                        height: '24px',
                                                        background: 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 1
                                                    }}>
                                                        <img src={platform.icon} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={social[platform.urlKey] || ''}
                                                        onChange={(e) => handleSocialUpdate(platform.urlKey, e.target.value)}
                                                        placeholder={platform.placeholder}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem 0.75rem 0.75rem 3rem',
                                                            borderRadius: '4px',
                                                            border: isUrlInvalid ? '1px solid #ef4444' : '1px solid #e2e8f0',
                                                            fontSize: '0.9rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                                {isUrlInvalid && (
                                                    <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                                        Please enter a valid URL (starting with http/https).
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text Input */}
                                            <div style={{ flex: '1 1 120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                                    Text
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        value={social[platform.textKey] || ''}
                                                        onChange={(e) => handleSocialUpdate(platform.textKey, e.target.value)}
                                                        placeholder={platform.defaultText || platform.name}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem',
                                                            paddingRight: '3rem',
                                                            borderRadius: '4px',
                                                            border: '1px solid #1e293b',
                                                            fontSize: '0.9rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                    <div
                                                        onClick={() => handleDeleteSocial(platform.urlKey, platform.textKey)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '12px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                            color: '#ef4444'
                                                        }}
                                                        title="Remove Platform"
                                                    >
                                                        <X size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* ADD MORE Section */}
                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ADD MORE
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                Click on the icon to add a social media profile.
                            </div>

                            {/* Social Media Icons Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.75rem' }}>
                                {platformConfig.map(platform => {
                                    const isActive = social[platform.urlKey] !== undefined;
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => handleToggleSocial(platform.urlKey, platform.textKey)}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.2s',
                                                transform: isActive ? 'scale(0.95)' : 'scale(1)'
                                            }}
                                            title={isActive ? `Remove ${platform.name}` : `Add ${platform.name}`}
                                        >
                                            <img
                                                src={platform.icon}
                                                alt={platform.name}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                            {isActive && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    width: '20px',
                                                    height: '20px',
                                                    background: '#10b981',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '2px solid #fff'
                                                }}>
                                                    <Check size={12} color="#fff" strokeWidth={3} />
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

            {/* SHARE OPTION ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsShareOptionOpen(!isShareOptionOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isShareOptionOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>SHARE OPTION</div>
                    </div>
                    {isShareOptionOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isShareOptionOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* SHARE MESSAGE FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                SHARE MESSAGE
                            </label>
                            <input
                                type="text"
                                value={shareOption.shareMessage || ''}
                                onChange={(e) => handleShareOptionUpdate('shareMessage', e.target.value)}
                                placeholder="Share this page"
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
                    handleBackgroundImageUpdate(url);
                    setIsUploadModalOpen(false);
                    setUploadModalTempImage(null);
                    setUploadModalFileName('');
                }}
            />

            {/* Preview Modal for Uploaded Background Image */}
            {showPreviewModal && design.backgroundImage?.url && (
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
                            src={design.backgroundImage.url}
                            alt="Background Preview"
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

export default SocialMediaConfig;
