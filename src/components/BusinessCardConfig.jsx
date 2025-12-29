import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Phone, Mail, Globe, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';

const BusinessCardConfig = ({ config, onChange }) => {


    const socialPlatforms = [
        { id: 'facebook', name: 'Facebook', icon: 'https://img.icons8.com/color/48/facebook-new.png', color: '#1877F2' },
        { id: 'instagram', name: 'Instagram', icon: 'https://img.icons8.com/color/48/instagram-new--v1.png', color: '#E4405F' },
        { id: 'twitter', name: 'X', icon: 'https://img.icons8.com/color/48/twitterx--v1.png', color: '#000000' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'https://img.icons8.com/color/48/linkedin.png', color: '#0A66C2' },
        { id: 'discord', name: 'Discord', icon: 'https://img.icons8.com/color/48/discord-new.png', color: '#5865F2' },
        { id: 'youtube', name: 'YouTube', icon: 'https://img.icons8.com/color/48/youtube-play.png', color: '#FF0000' },
        { id: 'whatsapp', name: 'WhatsApp', icon: 'https://img.icons8.com/color/48/whatsapp--v1.png', color: '#25D366' },
        { id: 'snapchat', name: 'Snapchat', icon: 'https://img.icons8.com/color/48/snapchat--v1.png', color: '#FFFC00' },
        { id: 'tiktok', name: 'TikTok', icon: 'https://img.icons8.com/color/48/tiktok--v1.png', color: '#000000' },
        { id: 'spotify', name: 'Spotify', icon: 'https://img.icons8.com/color/48/spotify--v1.png', color: '#1DB954' },
        { id: 'dribbble', name: 'Dribbble', icon: 'https://img.icons8.com/color/48/dribbble.png', color: '#EA4C89' },
        { id: 'pinterest', name: 'Pinterest', icon: 'https://img.icons8.com/color/48/pinterest.png', color: '#BD081C' },
        { id: 'telegram', name: 'Telegram', icon: 'https://img.icons8.com/color/48/telegram-app.png', color: '#0088CC' },
        { id: 'reddit', name: 'Reddit', icon: 'https://img.icons8.com/color/48/reddit.png', color: '#FF4500' },
        { id: 'website', name: 'Website', icon: 'https://img.icons8.com/color/48/domain.png', color: '#4B5563' },
        { id: 'behance', name: 'Behance', icon: 'https://img.icons8.com/color/48/behance.png', color: '#1769FF' },
        { id: 'twitch', name: 'Twitch', icon: 'https://img.icons8.com/color/48/twitch.png', color: '#9146FF' },
        { id: 'line', name: 'Line', icon: 'https://img.icons8.com/color/48/line-me.png', color: '#00B900' }
    ];

    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);
    const [isExchangeOpen, setIsExchangeOpen] = useState(false);

    const design = config.design || {};
    const personalInfo = config.personalInfo || {};
    const contact = config.contact || {};
    const social = config.social || {};
    const exchange = config.exchange || {};

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

    const handleProfileUpdate = (url) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                profile: { url }
            }
        }));
    };

    const handlePersonalInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [key]: value
            }
        }));
    };

    const handleContactUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
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

    const handleExchangeUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            exchange: {
                ...prev.exchange,
                [key]: value
            }
        }));
    };

    const deleteContactField = (field) => {
        handleContactUpdate(field, '');
    };

    const deleteSocialField = (field) => {
        handleSocialUpdate(field, '');
    };

    // Custom Fields Handlers
    const handleAddCustomField = () => {
        const customFields = exchange.customFields || [];
        const newField = {
            id: Date.now(),
            type: 'text',
            label: '',
            options: []
        };
        handleExchangeUpdate('customFields', [...customFields, newField]);
    };

    const handleCustomFieldUpdate = (id, key, value) => {
        const customFields = exchange.customFields || [];
        const updatedFields = customFields.map(field =>
            field.id === id ? { ...field, [key]: value } : field
        );
        handleExchangeUpdate('customFields', updatedFields);
    };

    const handleDeleteCustomField = (id) => {
        const customFields = exchange.customFields || [];
        const updatedFields = customFields.filter(field => field.id !== id);
        handleExchangeUpdate('customFields', updatedFields);
    };

    const handleAddOption = (fieldId) => {
        const customFields = exchange.customFields || [];
        const updatedFields = customFields.map(field => {
            if (field.id === fieldId) {
                return { ...field, options: [...(field.options || []), ''] };
            }
            return field;
        });
        handleExchangeUpdate('customFields', updatedFields);
    };

    const handleDeleteOption = (fieldId, optionIndex) => {
        const customFields = exchange.customFields || [];
        const updatedFields = customFields.map(field => {
            if (field.id === fieldId) {
                const newOptions = field.options.filter((_, idx) => idx !== optionIndex);
                return { ...field, options: newOptions };
            }
            return field;
        });
        handleExchangeUpdate('customFields', updatedFields);
    };

    const handleOptionUpdate = (fieldId, optionIndex, value) => {
        const customFields = exchange.customFields || [];
        const updatedFields = customFields.map(field => {
            if (field.id === fieldId) {
                const newOptions = [...(field.options || [])];
                newOptions[optionIndex] = value;
                return { ...field, options: newOptions };
            }
            return field;
        });
        handleExchangeUpdate('customFields', updatedFields);
    };


    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FACC15', s: '#FEF9C3' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const profileImages = [
        { id: 'profile1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 'profile2', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
        { id: 'profile3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
        { id: 'profile4', url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' }
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
                    },
                    profile: {
                        ...design.profile,
                        url: design.profile?.url
                    }
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'color.header', secondary: 'color.light' }}
                palettes={palettes}
                logoKey="profile.url"
                logoOptions={profileImages}
                logoLabel="YOUR PICTURE"
                logoHelpText="128x128px, 1:1 Ratio"
                logoShapeKey="profile.shape"
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
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* NAME */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        NAME*
                                    </label>
                                    <input
                                        type="text"
                                        value={personalInfo.name || ''}
                                        onChange={(e) => handlePersonalInfoUpdate('name', e.target.value)}
                                        placeholder="HELLEN GREY"
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
                                            value={personalInfo.nameColor || '#000000'}
                                            onChange={(e) => handlePersonalInfoUpdate('nameColor', e.target.value)}
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
                                            background: personalInfo.nameColor || '#000000',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={personalInfo.nameColor || '#000000'}
                                                onChange={(e) => handlePersonalInfoUpdate('nameColor', e.target.value)}
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
                                        value={personalInfo.nameFont || 'Lato'}
                                        onChange={(e) => handlePersonalInfoUpdate('nameFont', e.target.value)}
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
                                            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1rem'
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

                        {/* ABOUT */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                ABOUT
                            </label>
                            <textarea
                                value={personalInfo.about || ''}
                                onChange={(e) => handlePersonalInfoUpdate('about', e.target.value)}
                                placeholder="I am a designer & photographer working in International company. I am a designer & photographer working in International company."
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

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        JOB TITLE
                                    </label>
                                    <input
                                        type="text"
                                        value={personalInfo.title || ''}
                                        onChange={(e) => handlePersonalInfoUpdate('title', e.target.value)}
                                        placeholder="Creative Lead"
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
                                            value={personalInfo.titleColor || '#000000'}
                                            onChange={(e) => handlePersonalInfoUpdate('titleColor', e.target.value)}
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
                                            background: personalInfo.titleColor || '#000000',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={personalInfo.titleColor || '#000000'}
                                                onChange={(e) => handlePersonalInfoUpdate('titleColor', e.target.value)}
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
                                        value={personalInfo.titleFont || 'Lato'}
                                        onChange={(e) => handlePersonalInfoUpdate('titleFont', e.target.value)}
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
                                            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1rem'
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

                        <div style={{ marginBottom: '0' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        COMPANY NAME
                                    </label>
                                    <input
                                        type="text"
                                        value={personalInfo.company || ''}
                                        onChange={(e) => handlePersonalInfoUpdate('company', e.target.value)}
                                        placeholder="Techoid"
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
                                            value={personalInfo.companyColor || '#000000'}
                                            onChange={(e) => handlePersonalInfoUpdate('companyColor', e.target.value)}
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
                                            background: personalInfo.companyColor || '#000000',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={personalInfo.companyColor || '#000000'}
                                                onChange={(e) => handlePersonalInfoUpdate('companyColor', e.target.value)}
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
                                        value={personalInfo.companyFont || 'Lato'}
                                        onChange={(e) => handlePersonalInfoUpdate('companyFont', e.target.value)}
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
                                            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1rem'
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

                    </div>
                )}
            </div>

            {/* CONTACT INFORMATION ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsContactOpen(!isContactOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isContactOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>CONTACT INFORMATION</div>
                    </div>
                    {isContactOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isContactOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* PHONE */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {contact.phone ? (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Phone size={20} color="#64748b" />
                                    </div>
                                    <input
                                        type="text"
                                        value={contact.phone || ''}
                                        onChange={(e) => handleContactUpdate('phone', e.target.value)}
                                        placeholder="15555555234"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => deleteContactField('phone')}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <X size={20} color="#64748b" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleContactUpdate('phone', ' ')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px dashed #cbd5e1',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <Plus size={18} />
                                    Add Phone
                                </button>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {contact.email ? (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Mail size={20} color="#64748b" />
                                    </div>
                                    <input
                                        type="text"
                                        value={contact.email || ''}
                                        onChange={(e) => handleContactUpdate('email', e.target.value)}
                                        placeholder="Hellen@gmail.com"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => deleteContactField('email')}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <X size={20} color="#64748b" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleContactUpdate('email', ' ')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px dashed #cbd5e1',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <Plus size={18} />
                                    Add Email
                                </button>
                            )}
                        </div>

                        {/* WEBSITE */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {contact.website ? (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        border: '1px solid #1e293b',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Globe size={20} color="#64748b" />
                                    </div>
                                    <input
                                        type="text"
                                        value={contact.website || ''}
                                        onChange={(e) => handleContactUpdate('website', e.target.value)}
                                        placeholder="https://Hellengrey.com"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => deleteContactField('website')}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <X size={20} color="#64748b" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleContactUpdate('website', ' ')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px dashed #cbd5e1',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <Plus size={18} />
                                    Add Website
                                </button>
                            )}
                        </div>

                        {/* ADDRESS */}
                        <div style={{ marginBottom: '0' }}>
                            {contact.address ? (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        value={contact.address || ''}
                                        onChange={(e) => handleContactUpdate('address', e.target.value)}
                                        placeholder="1000 Marketplace Ave. NY, 10001, United States"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => deleteContactField('address')}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '1px solid #1e293b',
                                            borderRadius: '4px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <X size={20} color="#64748b" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleContactUpdate('address', ' ')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px dashed #cbd5e1',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <Plus size={18} />
                                    Add Address
                                </button>
                            )}
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

                        {/* Flex for social media inputs */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>

                            {social.website && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Website*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/domain.png" alt="Website" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.website || ''}
                                            onChange={(e) => handleSocialUpdate('website', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('website')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.whatsapp && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Whatsapp*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="WhatsApp" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.whatsapp || ''}
                                            onChange={(e) => handleSocialUpdate('whatsapp', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('whatsapp')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.facebook && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Facebook*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.facebook || ''}
                                            onChange={(e) => handleSocialUpdate('facebook', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('facebook')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.linkedin && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Linkedin*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.linkedin || ''}
                                            onChange={(e) => handleSocialUpdate('linkedin', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('linkedin')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.tiktok && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Tiktok*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/tiktok--v1.png" alt="TikTok" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.tiktok || ''}
                                            onChange={(e) => handleSocialUpdate('tiktok', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('tiktok')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.instagram && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Instagram*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.instagram || ''}
                                            onChange={(e) => handleSocialUpdate('instagram', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('instagram')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.twitter && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Twitter (X)*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/twitterx--v1.png" alt="Twitter" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.twitter || ''}
                                            onChange={(e) => handleSocialUpdate('twitter', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('twitter')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.discord && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Discord*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/discord-new.png" alt="Discord" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.discord || ''}
                                            onChange={(e) => handleSocialUpdate('discord', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('discord')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.youtube && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        YouTube*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/youtube-play.png" alt="YouTube" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.youtube || ''}
                                            onChange={(e) => handleSocialUpdate('youtube', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('youtube')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.twitch && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Twitch*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/twitch.png" alt="Twitch" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.twitch || ''}
                                            onChange={(e) => handleSocialUpdate('twitch', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('twitch')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.line && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Line*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/line-me.png" alt="Line" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.line || ''}
                                            onChange={(e) => handleSocialUpdate('line', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('line')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.snapchat && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Snapchat*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/snapchat--v1.png" alt="Snapchat" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.snapchat || ''}
                                            onChange={(e) => handleSocialUpdate('snapchat', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('snapchat')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.tumblr && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Tumblr*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/tumblr.png" alt="Tumblr" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.tumblr || ''}
                                            onChange={(e) => handleSocialUpdate('tumblr', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('tumblr')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.spotify && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Spotify*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/spotify--v1.png" alt="Spotify" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.spotify || ''}
                                            onChange={(e) => handleSocialUpdate('spotify', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('spotify')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.dribbble && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Dribbble*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/dribbble.png" alt="Dribbble" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.dribbble || ''}
                                            onChange={(e) => handleSocialUpdate('dribbble', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('dribbble')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.pinterest && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Pinterest*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/pinterest.png" alt="Pinterest" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.pinterest || ''}
                                            onChange={(e) => handleSocialUpdate('pinterest', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('pinterest')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.telegram && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Telegram*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/telegram-app.png" alt="Telegram" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.telegram || ''}
                                            onChange={(e) => handleSocialUpdate('telegram', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('telegram')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.behance && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Behance*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/behance.png" alt="Behance" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.behance || ''}
                                            onChange={(e) => handleSocialUpdate('behance', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('behance')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {social.reddit && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Reddit*
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '44px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#fff',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <img src="https://img.icons8.com/color/48/reddit.png" alt="Reddit" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            type="text"
                                            value={social.reddit || ''}
                                            onChange={(e) => handleSocialUpdate('reddit', e.target.value)}
                                            placeholder="https://"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.85rem',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <button
                                            onClick={() => deleteSocialField('reddit')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* ADD MORE Section */}
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>ADD MORE</span>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                    Click on the icon to add a social media profile.
                                </div>
                            </div>

                            {/* Social Media Icons Grid */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {socialPlatforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        onClick={() => handleSocialUpdate(platform.id, ' ')}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: platform.color,
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img
                                            src={platform.icon}
                                            alt={platform.name}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                objectFit: 'contain',
                                                filter: platform.id === 'snapchat' || platform.id === 'line' ? 'none' : 'brightness(0) invert(1)'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* EXCHANGE CONTACT ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsExchangeOpen(!isExchangeOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isExchangeOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>EXCHANGE CONTACT</div>
                    </div>
                    {isExchangeOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isExchangeOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Full Name */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.fullName !== false}
                                    onChange={(e) => handleExchangeUpdate('fullName', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Full Name
                            </label>
                        </div>

                        {/* Contact Number */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.contactNumber !== false}
                                    onChange={(e) => handleExchangeUpdate('contactNumber', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Contact Number
                            </label>
                        </div>

                        {/* Organization */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.organization !== false}
                                    onChange={(e) => handleExchangeUpdate('organization', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Organization
                            </label>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.email !== false}
                                    onChange={(e) => handleExchangeUpdate('email', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Email
                            </label>
                        </div>

                        {/* Job Title */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.jobTitle || false}
                                    onChange={(e) => handleExchangeUpdate('jobTitle', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Job Title
                            </label>
                        </div>

                        {/* Website */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#1e293b'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={exchange.website || false}
                                    onChange={(e) => handleExchangeUpdate('website', e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '0.75rem',
                                        accentColor: '#06b6d4',
                                        cursor: 'pointer'
                                    }}
                                />
                                Website
                            </label>
                        </div>


                        {/* Custom Fields */}
                        {exchange.customFields && exchange.customFields.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                {exchange.customFields.map((field, index) => (
                                    <div key={field.id} style={{
                                        marginBottom: '1.5rem',
                                        padding: '1.5rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: '#f8fafc'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                color: '#8b5cf6',
                                                textTransform: 'uppercase'
                                            }}>
                                                ASK THEM A PERSONALIZED QUESTION
                                            </div>
                                            <button
                                                onClick={() => handleDeleteCustomField(field.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94a3b8',
                                                    padding: '0.25rem'
                                                }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                            Type your question and options
                                        </div>

                                        {/* Type Selector */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                                Type
                                            </label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => handleCustomFieldUpdate(field.id, 'type', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid #1e293b',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    background: '#fff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="text">Text</option>
                                                <option value="options">Options</option>
                                                <option value="radio">Radio</option>
                                            </select>
                                        </div>

                                        {/* Label Input */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                                Label
                                            </label>
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldUpdate(field.id, 'label', e.target.value)}
                                                placeholder="Enter question label"
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

                                        {/* Options/Radio Fields */}
                                        {(field.type === 'options' || field.type === 'radio') && (
                                            <div>
                                                {field.options && field.options.map((option, optIndex) => (
                                                    <div key={optIndex} style={{ marginBottom: '0.75rem' }}>
                                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                                            {field.type === 'options' ? 'Option' : 'Radio'} {optIndex + 1}
                                                        </label>
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => handleOptionUpdate(field.id, optIndex, e.target.value)}
                                                                placeholder={`Enter ${field.type === 'options' ? 'option' : 'radio'} ${optIndex + 1}`}
                                                                style={{
                                                                    flex: 1,
                                                                    padding: '0.75rem',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #1e293b',
                                                                    fontSize: '0.9rem',
                                                                    outline: 'none'
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteOption(field.id, optIndex)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: '#94a3b8',
                                                                    padding: '0.5rem'
                                                                }}
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add Other Button */}
                                                <button
                                                    onClick={() => handleAddOption(field.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        background: 'none',
                                                        color: '#8b5cf6',
                                                        border: 'none',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        padding: '0.5rem 0'
                                                    }}
                                                >
                                                    Add Other
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Customized Button */}
                        <div>
                            <button
                                onClick={handleAddCustomField}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#8b5cf6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#7c3aed'}
                                onMouseOut={(e) => e.target.style.background = '#8b5cf6'}
                            >
                                <Plus size={16} />
                                Add Customized
                            </button>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessCardConfig;
