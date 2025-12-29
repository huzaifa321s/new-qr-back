import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Plus, Facebook, Instagram, Twitter, Linkedin, Github, Youtube, Globe, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';

const MultipleLinksConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);

    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const design = config.design || {};
    const basicInfo = config.basicInfo || {};
    const links = config.links || [
        { id: '1', url: '', title: 'Visit Us Online' },
        { id: '2', url: '', title: 'Talk to Us' },
        { id: '3', url: '', title: 'Instagram' },
        { id: '4', url: '', title: 'Youtube' }
    ];
    const socialLinks = config.socialLinks || [
        { id: 's1', platform: 'website', url: '' },
        { id: 's2', platform: 'facebook', url: '' },
        { id: 's3', platform: 'instagram', url: '' }
    ];

    const primaryColor = design.color?.header || '#52BDA3'; // Matching screenshot approx
    const secondaryColor = design.color?.light || '#2B1E99'; // Matching screenshot approx

    // Handler functions
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

    const handleBasicInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                [key]: value
            }
        }));
    };

    const handleLinkUpdate = (id, field, value) => {
        const newLinks = links.map(link =>
            link.id === id ? { ...link, [field]: value } : link
        );
        onChange(prev => ({ ...prev, links: newLinks }));
    };

    const handleAddLink = () => {
        const newLink = { id: Date.now().toString(), url: '', title: '' };
        onChange(prev => ({ ...prev, links: [...links, newLink] }));
    };

    const handleRemoveLink = (id) => {
        const newLinks = links.filter(link => link.id !== id);
        onChange(prev => ({ ...prev, links: newLinks }));
    };

    const handleSocialLinkAdd = (platform) => {
        // Avoid duplicates if desired, or allow multiple
        const newLink = { id: Date.now().toString(), platform, url: '' };
        onChange(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || []), newLink] }));
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

    const socialPlatforms = [
        { id: 'website', icon: 'https://img.icons8.com/color/48/domain.png', color: '#4B5563', name: 'Website' },
        { id: 'facebook', icon: 'https://img.icons8.com/color/48/facebook-new.png', color: '#1877F2', name: 'Facebook' },
        { id: 'instagram', icon: 'https://img.icons8.com/color/48/instagram-new--v1.png', color: '#E4405F', name: 'Instagram' },
        { id: 'twitter', icon: 'https://img.icons8.com/color/48/twitterx--v1.png', color: '#000000', name: 'X (Twitter)' },
        { id: 'linkedin', icon: 'https://img.icons8.com/color/48/linkedin.png', color: '#0A66C2', name: 'LinkedIn' },
        { id: 'youtube', icon: 'https://img.icons8.com/color/48/youtube-play.png', color: '#FF0000', name: 'YouTube' },
        { id: 'whatsapp', icon: 'https://img.icons8.com/color/48/whatsapp--v1.png', color: '#25D366', name: 'WhatsApp' },
        { id: 'snapchat', icon: 'https://img.icons8.com/color/48/snapchat--v1.png', color: '#FFFC00', name: 'Snapchat' },
        { id: 'tiktok', icon: 'https://img.icons8.com/color/48/tiktok--v1.png', color: '#000000', name: 'TikTok' },
        { id: 'spotify', icon: 'https://img.icons8.com/color/48/spotify--v1.png', color: '#1DB954', name: 'Spotify' },
        { id: 'pinterest', icon: 'https://img.icons8.com/color/48/pinterest.png', color: '#BD081C', name: 'Pinterest' },
        { id: 'telegram', icon: 'https://img.icons8.com/color/48/telegram-app.png', color: '#0088CC', name: 'Telegram' },
        { id: 'line', icon: 'https://img.icons8.com/color/48/line-me.png', color: '#00B900', name: 'Line' }
    ];



    const palettes = [
        { p: '#0B2D86', s: '#FFA800' }, // Dark Blue / Orange
        { p: '#FFFF00', s: '#FFFFE0' }, // Yellow
        { p: '#8B5CF6', s: '#C4B5FD' }, // Purple
        { p: '#16A34A', s: '#86EFAC' }, // Green
        { p: '#06B6D4', s: '#67E8F9' }  // Cyan
    ];

    const logoOptions = [
        { id: 'logo1', url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop' }, // Avatar placeholder
        { id: 'logo2', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop' }, // Food placeholder
        { id: 'logo3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' }, // Doctor/Professional placeholder
        { id: 'logo4', url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=150&h=150&fit=crop' }  // Box/Product placeholder (simulating the selected one)
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        header: design.color?.header || '#52BDA3',
                        light: design.color?.light || '#2B1E99'
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
            />

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
                    <div style={{ padding: isMobile ? '1rem' : '2rem', background: '#fff' }}>

                        {/* HEADLINE FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                HEADLINE*
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '1rem' }}>
                                {/* Headline Input */}
                                <input
                                    type="text"
                                    value={basicInfo.headline || 'Techoid'}
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

                                {/* Text Color */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
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
                                            value={basicInfo.headlineColor || '#2B1E99'}
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
                                            background: basicInfo.headlineColor || '#2B1E99',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={basicInfo.headlineColor || '#2B1E99'}
                                                onChange={(e) => handleBasicInfoUpdate('headlineColor', e.target.value)}
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
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Font
                                    </label>
                                    <select
                                        value={basicInfo.headlineFont || 'Lato'}
                                        onChange={(e) => handleBasicInfoUpdate('headlineFont', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
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

                        {/* ABOUT US FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ABOUT US
                            </label>
                            <textarea
                                value={basicInfo.aboutUs || 'Follow us and get updates delivered to your favorite social media channel.'}
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

            {/* LINKS ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isLinksOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>LINKS</div>
                    </div>
                    {isLinksOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isLinksOpen && (
                    <div style={{ padding: isMobile ? '1rem' : '2rem', background: '#fff' }}>

                        {links.map((link) => (
                            <div key={link.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'end' }}>
                                {/* URL Input */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        URL*
                                    </label>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => handleLinkUpdate(link.id, 'url', e.target.value)}
                                        placeholder="https://"
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

                                {/* Link Title Input & Delete */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            LINK TITLE*
                                        </label>
                                        <input
                                            type="text"
                                            value={link.title}
                                            onChange={(e) => handleLinkUpdate(link.id, 'title', e.target.value)}
                                            placeholder="Visit Us Online"
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
                                    <div
                                        onClick={() => handleRemoveLink(link.id)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                    >
                                        <X size={14} color="#cbd5e1" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add More Links Button */}
                        <button
                            onClick={handleAddLink}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                border: '1px solid #8b5cf6',
                                background: '#fff',
                                color: '#8b5cf6',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                marginTop: '1rem'
                            }}
                        >
                            <Plus size={18} />
                            Add More Links
                        </button>

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
                    <div style={{ padding: isMobile ? '1rem' : '2rem', background: '#fff' }}>

                        {/* Selected Social Channels */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '2rem', marginBottom: socialLinks.length > 0 ? '2.5rem' : '0' }}>
                            {socialLinks.map((link) => {
                                const platform = socialPlatforms.find(p => p.id === link.platform) || socialPlatforms[0];
                                const Icon = platform.icon;

                                return (
                                    <div key={link.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>
                                                {platform.name}*
                                            </label>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            height: '44px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: '44px',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRight: '1px solid #1e293b',
                                                background: 'transparent'
                                            }}>
                                                {typeof Icon === 'string' ? (
                                                    <img
                                                        src={Icon}
                                                        alt=""
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <Icon size={20} color="#fff" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={link.url}
                                                onChange={(e) => handleSocialLinkUpdate(link.id, e.target.value)}
                                                placeholder="https://"
                                                style={{
                                                    flex: 1,
                                                    height: '100%',
                                                    border: 'none',
                                                    padding: '0 1rem',
                                                    outline: 'none',
                                                    color: '#64748b',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                            <div
                                                onClick={() => handleSocialLinkRemove(link.id)}
                                                style={{
                                                    padding: '0 0.5rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%'
                                                }}
                                            >
                                                <X size={16} color="#ef4444" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add More Section */}
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#8b5cf6',
                                marginBottom: '0.25rem',
                                textTransform: 'uppercase'
                            }}>
                                ADD MORE
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                                Click on the icon to add a social media profile.
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {socialPlatforms.map((platform) => {
                                    const Icon = platform.icon;
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => handleSocialLinkAdd(platform.id)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                border: 'none',
                                                transition: 'transform 0.1s'
                                            }}
                                            title={platform.name}
                                        >
                                            {typeof Icon === 'string' ? (
                                                <img
                                                    src={Icon}
                                                    alt=""
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : (
                                                <Icon size={20} color="#fff" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>

        </div >
    );
};

export default MultipleLinksConfig;
