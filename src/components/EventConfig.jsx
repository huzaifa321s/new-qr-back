import { ChevronDown, ChevronUp, UploadCloud, X, Check, ArrowRightLeft, Clock, Plus, Wifi, Plug, Accessibility, Users, Baby, PawPrint, Bus, Car, Bed, Coffee, Martini, Utensils, ParkingCircle, Phone, Mail, Globe, RotateCcw, Facebook, Instagram, Twitter, Linkedin, Youtube, Twitch, Music, MessageCircle, Send, LayoutGrid, Eye } from 'lucide-react';
import { useState, useRef } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';

const EventConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isVenuOpen, setIsVenuOpen] = useState(true);
    const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(true);
    const [isContactOpen, setIsContactOpen] = useState(true);
    const [isSocialOpen, setIsSocialOpen] = useState(true);
    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);
    const headerFileInputRef = useRef(null);

    const design = config.design || {};
    const businessInfo = config.businessInfo || {};
    const eventSchedule = config.eventSchedule || {
        format: 'ampm',
        days: [
            { id: 1, date: '2023-03-03', begins: '04:00 AM', ends: '08:00 AM' },
            { id: 2, date: '2023-03-04', begins: '04:00 AM', ends: '08:00 AM' }
        ]
    };
    const venue = config.venue || {};
    const facilities = config.facilities || ['wifi', 'plug', 'wheelchair'];
    const contactInfo = config.contactInfo || {
        personName: 'Hellen Grey',
        designation: 'Event Manager',
        channels: [
            { id: 1, type: 'phone', value: '15555551234' },
            { id: 2, type: 'email', value: 'Hellen@gmail.com' }
        ]
    };
    const socialLinks = config.socialLinks || [
        { id: 1, platform: 'website', url: '' },
        { id: 2, platform: 'instagram', url: '' },
        { id: 3, platform: 'facebook', url: '' }
    ];

    // Default colors from screenshot
    const primaryColor = design.color?.header || '#097D6A';
    const secondaryColor = design.color?.light || '#FFC700';

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

    const handleHeaderFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            handleHeaderImageUpdate(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const triggerHeaderFileUpload = () => {
        if (headerFileInputRef.current) {
            headerFileInputRef.current.click();
        }
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

    const handleBusinessInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            businessInfo: {
                ...prev.businessInfo,
                [key]: value
            }
        }));
    };

    const handleScheduleUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            eventSchedule: {
                ...(prev.eventSchedule || eventSchedule),
                [key]: value
            }
        }));
    };

    const handleDayUpdate = (id, field, value) => {
        const currentDays = eventSchedule.days || [];
        const updatedDays = currentDays.map(day =>
            day.id === id ? { ...day, [field]: value } : day
        );
        handleScheduleUpdate('days', updatedDays);
    };

    const handleAddDay = () => {
        const currentDays = eventSchedule.days || [];
        const newDay = {
            id: Date.now(),
            date: '',
            begins: '09:00 AM',
            ends: '05:00 PM'
        };
        handleScheduleUpdate('days', [...currentDays, newDay]);
    };

    const handleRemoveDay = (id) => {
        const currentDays = eventSchedule.days || [];
        const updatedDays = currentDays.filter(day => day.id !== id);
        handleScheduleUpdate('days', updatedDays);
    };

    const handleVenueUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            venue: {
                ...(prev.venue || {}),
                [key]: value
            }
        }));
    };

    const handleFacilitiesUpdate = (facilityName) => {
        const currentFacilities = config.facilities || [];
        const updatedFacilities = currentFacilities.includes(facilityName)
            ? currentFacilities.filter(f => f !== facilityName)
            : [...currentFacilities, facilityName];

        onChange(prev => ({
            ...prev,
            facilities: updatedFacilities
        }));
    };

    // Facility Icons Map
    const facilityIcons = [
        { id: 'wifi', icon: Wifi, label: 'Wifi' },
        { id: 'plug', icon: Plug, label: 'Power' },
        { id: 'wheelchair', icon: Accessibility, label: 'Accessibility' },
        { id: 'restroom', icon: Users, label: 'Restroom' },
        { id: 'baby', icon: Baby, label: 'Baby Station' },
        { id: 'pet', icon: PawPrint, label: 'Pet Friendly' },
        { id: 'parking', icon: ParkingCircle, label: 'Parking' },
        { id: 'bus', icon: Bus, label: 'Bus' },
        { id: 'car', icon: Car, label: 'Car' },
        { id: 'bed', icon: Bed, label: 'Accommodation' },
        { id: 'coffee', icon: Coffee, label: 'Coffee' },
        { id: 'drink', icon: Martini, label: 'Bar' },
        { id: 'food', icon: Utensils, label: 'Food' }
    ];

    const handleContactUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            contactInfo: {
                ...(prev.contactInfo || contactInfo),
                [key]: value
            }
        }));
    };

    const handleChannelUpdate = (id, value) => {
        const currentChannels = contactInfo.channels || [];
        const updatedChannels = currentChannels.map(ch =>
            ch.id === id ? { ...ch, value } : ch
        );
        handleContactUpdate('channels', updatedChannels);
    };

    const handleRemoveChannel = (id) => {
        const currentChannels = contactInfo.channels || [];
        const updatedChannels = currentChannels.filter(ch => ch.id !== id);
        handleContactUpdate('channels', updatedChannels);
    };

    const handleAddChannel = (type) => {
        const currentChannels = contactInfo.channels || [];
        const newChannel = {
            id: Date.now(),
            type,
            value: ''
        };
        handleContactUpdate('channels', [...currentChannels, newChannel]);
    };

    const getChannelIcon = (type) => {
        switch (type) {
            case 'phone': return <Phone size={20} color="#64748b" />;
            case 'email': return <Mail size={20} color="#64748b" />;
            case 'website': return <Globe size={20} color="#64748b" />;
            default: return <Globe size={20} color="#64748b" />;
        }
    };

    const handleSocialUpdate = (updatedLinks) => {
        onChange(prev => ({
            ...prev,
            socialLinks: updatedLinks
        }));
    };

    const handleAddSocial = (platform) => {
        const newLink = {
            id: Date.now(),
            platform,
            url: ''
        };
        handleSocialUpdate([...socialLinks, newLink]);
    };

    const handleRemoveSocial = (id) => {
        const updatedLinks = socialLinks.filter(link => link.id !== id);
        handleSocialUpdate(updatedLinks);
    };

    const handleSocialLinkChange = (id, url) => {
        const updatedLinks = socialLinks.map(link =>
            link.id === id ? { ...link, url } : link
        );
        handleSocialUpdate(updatedLinks);
    };

    const socialPlatforms = [
        { id: 'facebook', icon: 'https://img.icons8.com/color/48/facebook-new.png', color: '#1877F2' },
        { id: 'instagram', icon: 'https://img.icons8.com/color/48/instagram-new--v1.png', color: '#E4405F' },
        { id: 'twitter', icon: 'https://img.icons8.com/color/48/twitterx--v1.png', color: '#000000' },
        { id: 'linkedin', icon: 'https://img.icons8.com/color/48/linkedin.png', color: '#0A66C2' },
        { id: 'youtube', icon: 'https://img.icons8.com/color/48/youtube-play.png', color: '#FF0000' },
        { id: 'twitch', icon: 'https://img.icons8.com/color/48/twitch.png', color: '#9146FF' },
        { id: 'whatsapp', icon: 'https://img.icons8.com/color/48/whatsapp--v1.png', color: '#25D366' },
        { id: 'snapchat', icon: 'https://img.icons8.com/color/48/snapchat--v1.png', color: '#FFFC00' },
        { id: 'tiktok', icon: 'https://img.icons8.com/color/48/tiktok--v1.png', color: '#000000' },
        { id: 'spotify', icon: 'https://img.icons8.com/color/48/spotify--v1.png', color: '#1DB954' },
        { id: 'telegram', icon: 'https://img.icons8.com/color/48/telegram-app.png', color: '#0088CC' },
        { id: 'website', icon: 'https://img.icons8.com/color/48/domain.png', color: '#4B5563' }
    ];

    const getSocialIcon = (platform) => {
        const p = socialPlatforms.find(p => p.id === platform);
        const Icon = p ? p.icon : Globe;
        return <Icon size={20} color="#fff" />;
    };

    // Colors matching the screenshot palettes
    const palettes = [
        { p: '#0B2D86', s: '#FFA800' }, // Dark Blue / Orange
        { p: '#FFFF00', s: '#FFFFE0' }, // Yellow / Cream
        { p: '#8B5CF6', s: '#C4B5FD' }, // Purple / Light Purple
        { p: '#16A34A', s: '#86EFAC' }, // Green / Light Green
        { p: '#06B6D4', s: '#67E8F9' }  // Cyan / Light Cyan
    ];

    // Placeholder images matching the visual style of reference
    const headerOptions = [
        { id: 'h1', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&h=100&fit=crop' },
        { id: 'h2', url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=150&h=100&fit=crop' },
        { id: 'h3', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=100&fit=crop' },
        { id: 'h4', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&h=100&fit=crop' },
        { id: 'h5', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=150&h=100&fit=crop' }, // Selected in reference
    ];

    const logoOptions = [
        { id: 'l1', url: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=128&h=128&fit=crop' },
        { id: 'l2', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=128&h=128&fit=crop' },
        { id: 'l3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop' }
    ];

    const fonts = ['Lato', 'Roboto', 'Open Sans', 'Montserrat'];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        header: design.color?.header || '#097D6A',
                        light: design.color?.light || '#FFC700'
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
                {/* HEADER IMAGE SECTION */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            HEADER IMAGE
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                            Minimum width : 400px, 3:2 Ratio
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Remove/Clear Option */}
                        <div
                            onClick={() => handleHeaderImageUpdate('')}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                        >
                            <X size={32} color="#e2e8f0" strokeWidth={1} />
                        </div>

                        {/* Image Options */}
                        {headerOptions.map(img => (
                            <div
                                key={img.id}
                                onClick={() => handleHeaderImageUpdate(img.url)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: design.headerImage?.url === img.url ? '2px solid #8b5cf6' : 'none'
                                }}>
                                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {design.headerImage?.url === img.url && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        width: '20px',
                                        height: '20px',
                                        background: '#8b5cf6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        border: '2px solid #fff'
                                    }}>
                                        <Check size={12} color="#fff" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Uploaded Image */}
                        {design.headerImage?.url && !headerOptions.some(opt => opt.url === design.headerImage.url) && (
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: '2px solid #8b5cf6',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={() => setIsHeaderHovered(true)}
                                onMouseLeave={() => setIsHeaderHovered(false)}
                                onClick={() => setIsHeaderModalOpen(true)}
                            >
                                <img src={design.headerImage.url} alt="Custom Header" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    width: '18px',
                                    height: '18px',
                                    background: '#8b5cf6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    border: '2px solid #fff'
                                }}>
                                    <Check size={10} color="#fff" />
                                </div>
                                {isHeaderHovered && (
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
                                        <span style={{ color: '#fff', fontSize: '10px', marginTop: '2px' }}>Preview</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upload Option */}
                        <div
                            onClick={triggerHeaderFileUpload}
                            style={{
                                width: '80px',
                                height: '80px',
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
                                ref={headerFileInputRef}
                                onChange={handleHeaderFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <UploadCloud size={24} color="#94a3b8" />
                        </div>
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
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        BASIC INFORMATION
                    </div>
                    {isBasicInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isBasicInfoOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* ORGANIZATION NAME */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        ORGANIZATION NAME*
                                    </label>
                                    <input
                                        type="text"
                                        value={businessInfo.companyName || 'Sterling & Co.'}
                                        onChange={(e) => handleBusinessInfoUpdate('companyName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            color: '#1e293b'
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
                                            value={businessInfo.companyNameColor || '#FFC700'}
                                            onChange={(e) => handleBusinessInfoUpdate('companyNameColor', e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.9rem',
                                                color: '#000',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            background: businessInfo.companyNameColor || '#FFC700',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={businessInfo.companyNameColor || '#FFC700'}
                                                onChange={(e) => handleBusinessInfoUpdate('companyNameColor', e.target.value)}
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
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={businessInfo.companyNameFont || 'Lato'}
                                            onChange={(e) => handleBusinessInfoUpdate('companyNameFont', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingRight: '2rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                appearance: 'none',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {fonts.map(font => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EVENT NAME */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        EVENT NAME*
                                    </label>
                                    <input
                                        type="text"
                                        value={businessInfo.headline || '4th Annual Company Meetup'}
                                        onChange={(e) => handleBusinessInfoUpdate('headline', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            color: '#1e293b'
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
                                            value={businessInfo.headlineColor || '#FFFFFF'}
                                            onChange={(e) => handleBusinessInfoUpdate('headlineColor', e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                width: '100%',
                                                fontSize: '0.9rem',
                                                color: '#000',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            background: businessInfo.headlineColor || '#FFFFFF',
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={businessInfo.headlineColor || '#FFFFFF'}
                                                onChange={(e) => handleBusinessInfoUpdate('headlineColor', e.target.value)}
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
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={businessInfo.headlineFont || 'Lato'}
                                            onChange={(e) => handleBusinessInfoUpdate('headlineFont', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingRight: '2rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                appearance: 'none',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {fonts.map(font => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DESCRIPTION
                            </label>
                            <textarea
                                value={businessInfo.description || 'We aim to provide fresh and healthy snacks people on the go.'}
                                onChange={(e) => handleBusinessInfoUpdate('description', e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #8b5cf6', // Purple border as shown in screenshot
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    color: '#1e293b'
                                }}
                            />
                        </div>

                        {/* BUTTON & LINK */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0' }}>
                            {/* BUTTON */}
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    BUTTON
                                </label>
                                <input
                                    type="text"
                                    value={businessInfo.button || 'Get Tickets'}
                                    onChange={(e) => handleBusinessInfoUpdate('button', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #1e293b',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>

                            {/* LINK */}
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    LINK
                                </label>
                                <input
                                    type="text"
                                    value={businessInfo.website || 'http://www.sterlingco.com/tickets'}
                                    onChange={(e) => handleBusinessInfoUpdate('website', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #1e293b',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* EVENT SCHEDULE ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isScheduleOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        EVENT SCHEDULE
                    </div>
                    {isScheduleOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isScheduleOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Time Format Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => handleScheduleUpdate('format', '24h')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: eventSchedule.format === '24h' ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    background: eventSchedule.format === '24h' ? '#fff' : '#fff',
                                    color: eventSchedule.format === '24h' ? '#8b5cf6' : '#64748b',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    pointerEvents: 'auto', // Ensure it's clickable
                                    fontWeight: eventSchedule.format === '24h' ? '500' : '400'
                                }}>
                                24 hrs
                            </button>
                            <button
                                onClick={() => handleScheduleUpdate('format', 'ampm')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: eventSchedule.format === 'ampm' ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    background: eventSchedule.format === 'ampm' ? '#fff' : '#fff',
                                    color: eventSchedule.format === 'ampm' ? '#8b5cf6' : '#64748b',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    fontWeight: eventSchedule.format === 'ampm' ? '500' : '400'
                                }}>
                                AM/PM
                            </button>
                        </div>

                        {/* Days List */}
                        {eventSchedule.days && eventSchedule.days.map((day, index) => (
                            <div key={day.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                {/* DAY/DATE */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        DAY{index + 1}*
                                    </label>
                                    <input
                                        type="date"
                                        value={day.date}
                                        onChange={(e) => handleDayUpdate(day.id, 'date', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            color: '#1e293b'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                    {/* BEGINS AT */}
                                    <div style={{ flex: '1 1 120px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            BEGINS AT*
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={day.begins}
                                                onChange={(e) => handleDayUpdate(day.id, 'begins', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    paddingRight: '2.5rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid #1e293b',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: '#1e293b'
                                                }}
                                            />
                                            <Clock size={16} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>

                                    {/* ENDS AT */}
                                    <div style={{ flex: '1 1 120px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            ENDS AT*
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={day.ends}
                                                onChange={(e) => handleDayUpdate(day.id, 'ends', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    paddingRight: '2.5rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid #1e293b',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: '#1e293b'
                                                }}
                                            />
                                            <Clock size={16} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <div
                                        onClick={() => handleRemoveDay(day.id)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            marginBottom: '6px', // Align with inputs
                                            flexShrink: 0,
                                            marginLeft: 'auto'
                                        }}
                                    >
                                        <X size={16} color="#cbd5e1" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Days Button */}
                        <div style={{ marginTop: '1rem' }}>
                            <button
                                onClick={handleAddDay}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#fff',
                                    color: '#8b5cf6',
                                    border: '1px solid #8b5cf6',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={16} />
                                Add Days
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* VENU ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsVenuOpen(!isVenuOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isVenuOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        VENU
                    </div>
                    {isVenuOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isVenuOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                LOCATION*
                            </label>
                            <input
                                type="text"
                                value={venue.location || '1000 Marketplace Ave. NY, 10001, United States'}
                                onChange={(e) => handleVenueUpdate('location', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* FACILITIES ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsFacilitiesOpen(!isFacilitiesOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isFacilitiesOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        FACILITIES
                    </div>
                    {isFacilitiesOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isFacilitiesOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {facilityIcons.map((item) => {
                                const Icon = item.icon;
                                const isSelected = facilities.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleFacilitiesUpdate(item.id)}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title={item.label}
                                    >
                                        <Icon
                                            size={24}
                                            color={isSelected ? '#3b82f6' : '#94a3b8'} // Blue for active as per commonly seen selected states, or stick to purple? Image shows icons in blueish color.
                                        // Actually image shows they are blue: #2563eb or similar.
                                        // Screenshot icons are blue: Wifi, Plug, Wheelchair..
                                        // Some are grey: Bed, Coffee...
                                        // So existing ones are blue, non-existing grey.
                                        />
                                    </div>
                                );
                            })}
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
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        CONTACT INFORMATION
                    </div>
                    {isContactOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isContactOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* NAME OF PERSON */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                NAME OF PERSON
                            </label>
                            <input
                                type="text"
                                value={contactInfo.personName || 'Hellen Grey'}
                                onChange={(e) => handleContactUpdate('personName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#1e293b'
                                }}
                            />
                        </div>

                        {/* DESIGNATION */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DESIGNATION IN THE COMPANY
                            </label>
                            <input
                                type="text"
                                value={contactInfo.designation || 'Event Manager'}
                                onChange={(e) => handleContactUpdate('designation', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#1e293b'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {contactInfo.channels && contactInfo.channels.map(channel => (
                                <div key={channel.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    {/* Icon Box */}
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #1e293b',
                                        flexShrink: 0
                                    }}>
                                        {getChannelIcon(channel.type)}
                                    </div>

                                    {/* Input */}
                                    <div style={{ flex: '1 1 200px', position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={channel.value}
                                            onChange={(e) => handleChannelUpdate(channel.id, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                paddingLeft: '2.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                color: '#1e293b'
                                            }}
                                        />
                                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                                            {channel.type === 'phone' && (
                                                <Phone size={14} color="#64748b" style={{ marginRight: '8px' }} />
                                            )}
                                            {channel.type === 'email' && (
                                                <Mail size={14} color="#64748b" style={{ marginRight: '8px' }} />
                                            )}
                                            {channel.type === 'website' && (
                                                <Globe size={14} color="#64748b" style={{ marginRight: '8px' }} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginLeft: 'auto' }}>
                                        <X
                                            size={16}
                                            color="#cbd5e1"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveChannel(channel.id)}
                                        />
                                        <ArrowRightLeft
                                            size={16}
                                            color="#cbd5e1"
                                            style={{ cursor: 'pointer', transform: 'rotate(90deg)' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Channel Buttons */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {!contactInfo.channels?.some(ch => ch.type === 'phone') && (
                                <button
                                    onClick={() => handleAddChannel('phone')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: '#fff',
                                        color: '#8b5cf6',
                                        border: '1px solid #8b5cf6',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={16} />
                                    Add Phone
                                </button>
                            )}
                            {!contactInfo.channels?.some(ch => ch.type === 'email') && (
                                <button
                                    onClick={() => handleAddChannel('email')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: '#fff',
                                        color: '#8b5cf6',
                                        border: '1px solid #8b5cf6',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={16} />
                                    Add Email
                                </button>
                            )}
                            {!contactInfo.channels?.some(ch => ch.type === 'website') && (
                                <button
                                    onClick={() => handleAddChannel('website')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: '#fff',
                                        color: '#8b5cf6',
                                        border: '1px solid #8b5cf6',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={16} />
                                    Add Website
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
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                        SOCIAL MEDIA CHANNELS
                    </div>
                    {isSocialOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isSocialOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Active Inputs */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {socialLinks.map(link => {
                                const platform = socialPlatforms.find(p => p.id === link.platform);
                                if (!platform) return null;
                                const Icon = platform.icon;
                                return (
                                    <div key={link.id} style={{ flex: '1 1 200px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                            {link.platform}*
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {/* Icon */}
                                            <div style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '8px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {typeof Icon === 'string' ? (
                                                    <img
                                                        src={Icon}
                                                        alt=""
                                                        style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <Icon size={24} color="#fff" />
                                                )}
                                            </div>

                                            {/* Input */}
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '4px', paddingRight: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => handleSocialLinkChange(link.id, e.target.value)}
                                                    placeholder="https://"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        border: 'none',
                                                        outline: 'none',
                                                        fontSize: '0.9rem',
                                                        color: '#1e293b',
                                                        background: 'transparent'
                                                    }}
                                                />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <X
                                                        size={14}
                                                        color="#cbd5e1"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleRemoveSocial(link.id)}
                                                    />
                                                    <ArrowRightLeft
                                                        size={14}
                                                        color="#cbd5e1"
                                                        style={{ cursor: 'pointer', transform: 'rotate(90deg)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add More Section */}
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                ADD MORE
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                Click on the icon to add a social media profile.
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {socialPlatforms.map(platform => {
                                    const Icon = platform.icon;
                                    const isAdded = socialLinks.some(l => l.platform === platform.id);
                                    return (
                                        <div
                                            key={platform.id}
                                            onClick={() => handleAddSocial(platform.id)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                opacity: isAdded ? 0.5 : 1,
                                                transition: 'all 0.2s',
                                                border: 'none'
                                            }}
                                            title={platform.id}
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
                                                <Icon size={20} color={isAdded ? '#94a3b8' : '#fff'} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Modal for Header Image Preview */}
            {isHeaderModalOpen && design.headerImage?.url && (
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
                }} onClick={() => setIsHeaderModalOpen(false)}>
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <img src={design.headerImage.url} alt="Header Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }} />
                        <button
                            onClick={() => setIsHeaderModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '-40px',
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
        </div>
    );
};

export default EventConfig;
