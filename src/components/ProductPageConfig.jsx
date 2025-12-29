import { ChevronDown, ChevronUp, RefreshCw, Check, X, UploadCloud, Bold, Italic, Underline, Strikethrough, TextQuote, List, ListOrdered, Link, Image as ImageIcon, Trash2, Plus, Type, Phone, Mail, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, } from 'lucide-react';
import { FaWhatsapp, FaDiscord, FaTwitch, FaSnapchat, FaTiktok, FaSpotify, FaPinterest, FaTelegram, FaReddit, FaBehance, FaTumblr } from 'react-icons/fa';
import { SiKick } from 'react-icons/si';
import { useState, useRef } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';

const ProductPageConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(false);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(true);
    const [isSocialsOpen, setIsSocialsOpen] = useState(true);

    const design = config.design || {};
    const bInfo = config.basicInfo || {};
    const defaultProductImages = [
        { id: 'def-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop' },
        { id: 'def-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop' },
        { id: 'def-3', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }
    ];
    const basicInfo = {
        ...bInfo,
        companyName: bInfo.companyName || 'Dairyland',
        productTitle: bInfo.productTitle || 'Chocolate Flavored Milk',
        headline: bInfo.headline || '325 ml',
        price: bInfo.price || '95',
        currency: bInfo.currency || '₨',
        productImages: (bInfo.productImages && bInfo.productImages.length > 0) ? bInfo.productImages : defaultProductImages,
    };
    const video = {
        title: 'Vanilla & Malai...',
        url: 'https://www.youtube.com/watch?v=kYI9P_pkyEw',
        ...(config.video || {})
    };
    const feedback = {
        title: 'Add Your Feedback',
        ratingUrl: 'https://www.dairylandltd.com/floveredmilk/rating',
        font: 'Lato',
        ...(config.feedback || {}),
        textColor: (config.feedback?.textColor && config.feedback.textColor !== '#000000') ? config.feedback.textColor : '#ffffff'
    };
    const contact = config.contact || {};
    const content = config.content || {
        items: [
            { id: '1', title: 'Description', text: 'The Dark, Smooth, Creaminess Of Chocolate Romances The Wholesome Goodness Of Real Cow\'S Milk, Reigniting For The Love For A Healthy, Tasty Beverage.' },
            { id: '2', title: 'Ingredient', text: '• Reduced Fat Milk\n• Milk Solids\nCocoa Powder\n• Sugar\n• Emulsifier: Vegetable Oil Origin (E471)\n• Stabilizer (E470) & Chocolate Flavor' }
        ],
        certificates: (config.content && config.content.certificates && config.content.certificates.length > 0) ? config.content.certificates : [
            { id: 'def-cert-1', url: 'https://res.cloudinary.com/date1bmhd/image/upload/v1759749930/ODCzvu_imfdi2.png' },
            { id: 'def-cert-2', url: 'https://res.cloudinary.com/date1bmhd/image/upload/v1759749957/KOursE_uedyzk.png' }
        ],
        buttonText: 'Buy Product',
        buttonLink: 'https://www.dairylandltd.com/'
    };

    // Default colors from screenshot (approximate or standard defaults)
    const primaryColor = design.color?.header || '#FFB03E';
    const secondaryColor = design.color?.light || '#031D36';

    const fileInputRefLogo = useRef(null);
    const fileInputRefProduct = useRef(null);
    const fileInputRefCert = useRef(null);
    const fileInputRefVideo = useRef(null);

    const handleDesignUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            design: {
                ...prev.design,
                [key]: value
            }
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
                color: { ...prev.design?.color, [colorKey]: value }
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

    const handleBasicInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                [key]: value
            }
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleBasicInfoUpdate('logo', url);
        }
        e.target.value = null;
    };

    const handleProductImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = files.map(file => ({
            id: Date.now() + Math.random().toString(),
            url: URL.createObjectURL(file)
        }));

        const currentImages = basicInfo.productImages || [];
        handleBasicInfoUpdate('productImages', [...currentImages, ...newImages]);
        e.target.value = null;
    };

    const handleRemoveProductImage = (id) => {
        const currentImages = basicInfo.productImages || [];
        const newImages = currentImages.filter(img => img.id !== id);
        handleBasicInfoUpdate('productImages', newImages);
    };

    // Content Handlers
    const handleContentUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [key]: value
            }
        }));
    };

    const handleItemUpdate = (id, key, value) => {
        const newItems = (content.items || []).map(item =>
            item.id === id ? { ...item, [key]: value } : item
        );
        handleContentUpdate('items', newItems);
    };

    const handleAddCategory = () => {
        const newItem = { id: Date.now().toString(), title: '', text: '' };
        handleContentUpdate('items', [...(content.items || []), newItem]);
    };

    const handleRemoveCategory = (id) => {
        const newItems = (content.items || []).filter(item => item.id !== id);
        handleContentUpdate('items', newItems);
    };

    const handleCertificateUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newCerts = files.map(file => ({
            id: Date.now() + Math.random().toString(),
            url: URL.createObjectURL(file)
        }));

        handleContentUpdate('certificates', [...(content.certificates || []), ...newCerts]);
        e.target.value = null;
    };

    const handleRemoveCertificate = (id) => {
        const newCerts = (content.certificates || []).filter(cert => cert.id !== id);
        handleContentUpdate('certificates', newCerts);
    };

    // Video Handlers
    const handleVideoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            video: {
                ...prev.video,
                [key]: value
            }
        }));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleVideoUpdate('url', url);
            // Optionally clear the text input if local file is uploaded
            // handleVideoUpdate('videoUrlInput', ''); 
        }
        e.target.value = null;
    };

    // Feedback Handlers
    const handleFeedbackUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            feedback: {
                ...prev.feedback,
                [key]: value
            }
        }));
    };

    // Contact Handlers
    const handleContactUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [key]: value
            }
        }));
    };

    const handleAddSocial = (platform) => {
        const currentSocials = contact.socials || [];
        if (!currentSocials.find(s => s.platform === platform)) {
            handleContactUpdate('socials', [...currentSocials, { platform, url: '' }]);
        }
    };

    const handleRemoveSocial = (platform) => {
        const currentSocials = contact.socials || [];
        handleContactUpdate('socials', currentSocials.filter(s => s.platform !== platform));
    };

    const handleSocialUrlUpdate = (platform, url) => {
        const currentSocials = contact.socials || [];
        const updatedSocials = currentSocials.map(s =>
            s.platform === platform ? { ...s, url } : s
        );
        handleContactUpdate('socials', updatedSocials);
    };

    const socialIcons = [
        { id: 'facebook', icon: <Facebook size={20} />, color: '#1877F2' },
        { id: 'instagram', icon: <Instagram size={20} />, color: '#E4405F' },
        { id: 'twitter', icon: <Twitter size={20} />, color: '#1DA1F2' },
        { id: 'linkedin', icon: <Linkedin size={20} />, color: '#0A66C2' },
        { id: 'discord', icon: <FaDiscord size={20} />, color: '#5865F2' },
        { id: 'twitch', icon: <FaTwitch size={20} />, color: '#9146FF' },
        { id: 'kick', icon: <SiKick size={20} />, color: '#53FC18' },
        { id: 'youtube', icon: <Youtube size={20} />, color: '#FF0000' },
        { id: 'whatsapp', icon: <FaWhatsapp size={20} />, color: '#25D366' },
        { id: 'snapchat', icon: <FaSnapchat size={20} />, color: '#FFFC00' },
        { id: 'tiktok', icon: <FaTiktok size={20} />, color: '#000000' },
        { id: 'tumblr', icon: <FaTumblr size={20} />, color: '#36465D' },
        { id: 'spotify', icon: <FaSpotify size={20} />, color: '#1DB954' },
        { id: 'dribbble', icon: <Globe size={20} />, color: '#EA4C89' }, // Using Globe as placeholder or lucide Dribbble if avail
        { id: 'pinterest', icon: <FaPinterest size={20} />, color: '#BD081C' },
        { id: 'telegram', icon: <FaTelegram size={20} />, color: '#0088cc' },
        { id: 'behance', icon: <FaBehance size={20} />, color: '#1769ff' },
        { id: 'reddit', icon: <FaReddit size={20} />, color: '#FF4500' },
        { id: 'globe', icon: <Globe size={20} />, color: '#4B5563' },
    ];


    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FFFF00', s: '#FFFFE0' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const logoAvatars = [
        { id: 'av1', url: 'https://img.freepik.com/premium-photo/cartoon-character-boy-with-glasses-blue-shirt-orange-scarf_1029473-547081.jpg?w=128' },
        { id: 'av2', url: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
        { id: 'av3', url: 'https://img.freepik.com/premium-photo/cartoon-doctor-woman_1029473-547432.jpg' }
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <ReusableDesignAccordion
                design={{
                    ...design,
                    color: {
                        ...design.color,
                        header: design.color?.header || '#FFB03E',
                        light: design.color?.light || '#031D36'
                    }
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'color.header', secondary: 'color.light' }}
                palettes={palettes}
                logoKey="logo.url"
                logoOptions={logoAvatars}
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

                        {/* Company Name Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.5fr', gap: '1rem', marginBottom: '1.5rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    COMAPNY NAME*
                                </label>
                                <input
                                    type="text"
                                    value={basicInfo.companyName}
                                    onChange={(e) => handleBasicInfoUpdate('companyName', e.target.value)}
                                    placeholder="Dairyland"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '42px', background: '#fff' }}>
                                    <input
                                        type="text"
                                        value={basicInfo.companyTextColor || '#000000'}
                                        onChange={(e) => handleBasicInfoUpdate('companyTextColor', e.target.value)}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    />
                                    <input
                                        type="color"
                                        value={basicInfo.companyTextColor || '#000000'}
                                        onChange={(e) => handleBasicInfoUpdate('companyTextColor', e.target.value)}
                                        style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '2px', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Font</label>
                                <select
                                    value={basicInfo.companyFont || 'Lato'}
                                    onChange={(e) => handleBasicInfoUpdate('companyFont', e.target.value)}
                                    style={{ width: '100%', height: '42px', borderRadius: '4px', border: '1px solid #1e293b', padding: '0 0.5rem', outline: 'none', fontSize: '0.85rem' }}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                </select>
                            </div>
                        </div>



                        {/* Product Images */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                PRODUCT IMAGE
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {(basicInfo.productImages || []).map(img => (
                                    <div key={img.id} style={{ width: '60px', height: '60px', borderRadius: '4px', border: '1px solid #e2e8f0', padding: '4px', position: 'relative' }}>
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        <div
                                            onClick={() => handleRemoveProductImage(img.id)}
                                            style={{
                                                position: 'absolute', top: '-6px', left: '-6px', width: '16px', height: '16px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #fff'
                                            }}
                                        >
                                            <X size={10} color="#fff" />
                                        </div>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRefProduct.current.click()}
                                    style={{
                                        width: '60px', height: '60px', borderRadius: '4px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}
                                >
                                    <UploadCloud size={20} color="#94a3b8" />
                                </div>
                                <input type="file" ref={fileInputRefProduct} onChange={handleProductImageUpload} multiple style={{ display: 'none' }} accept="image/*" />
                            </div>
                        </div>

                        {/* Product Title Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.5fr', gap: '1rem', marginBottom: '1.5rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    PRODUCT TITLE*
                                </label>
                                <input
                                    type="text"
                                    value={basicInfo.productTitle}
                                    onChange={(e) => handleBasicInfoUpdate('productTitle', e.target.value)}
                                    placeholder="Chocolate Flavored Milk"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '42px', background: '#fff' }}>
                                    <input
                                        type="text"
                                        value={basicInfo.titleTextColor || '#000000'}
                                        onChange={(e) => handleBasicInfoUpdate('titleTextColor', e.target.value)}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    />
                                    <input
                                        type="color"
                                        value={basicInfo.titleTextColor || '#000000'}
                                        onChange={(e) => handleBasicInfoUpdate('titleTextColor', e.target.value)}
                                        style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '2px', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Font</label>
                                <select
                                    value={basicInfo.titleFont || 'Lato'}
                                    onChange={(e) => handleBasicInfoUpdate('titleFont', e.target.value)}
                                    style={{ width: '100%', height: '42px', borderRadius: '4px', border: '1px solid #1e293b', padding: '0 0.5rem', outline: 'none', fontSize: '0.85rem' }}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Roboto">Roboto</option>
                                </select>
                            </div>
                        </div>

                        {/* Headline */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                HEADLINE
                            </label>
                            <input
                                type="text"
                                value={basicInfo.headline}
                                onChange={(e) => handleBasicInfoUpdate('headline', e.target.value)}
                                placeholder="325 ml"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                            />
                        </div>

                        {/* Currency & Price */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    CURRENCY*
                                </label>
                                <select
                                    value={basicInfo.currency}
                                    onChange={(e) => handleBasicInfoUpdate('currency', e.target.value)}
                                    style={{ width: '100%', height: '42px', borderRadius: '4px', border: '1px solid #1e293b', padding: '0 0.5rem', outline: 'none', fontSize: '0.9rem', color: '#000' }}
                                >
                                    {[
                                        { code: 'AFN', symbol: '؋' }, { code: 'ALL', symbol: 'L' }, { code: 'DZD', symbol: 'د.ج' },
                                        { code: 'AOA', symbol: 'Kz' }, { code: 'ARS', symbol: '$' }, { code: 'AMD', symbol: '֏' },
                                        { code: 'AWG', symbol: 'ƒ' }, { code: 'AUD', symbol: '$' }, { code: 'AZN', symbol: '₼' },
                                        { code: 'BSD', symbol: '$' }, { code: 'BHD', symbol: '.د.ب' }, { code: 'BDT', symbol: '৳' },
                                        { code: 'BBD', symbol: '$' }, { code: 'BYN', symbol: 'Br' }, { code: 'BZD', symbol: 'BZ$' },
                                        { code: 'BMD', symbol: '$' }, { code: 'BTN', symbol: 'Nu.' }, { code: 'BOB', symbol: 'Bs.' },
                                        { code: 'BAM', symbol: 'KM' }, { code: 'BWP', symbol: 'P' }, { code: 'BRL', symbol: 'R$' },
                                        { code: 'BND', symbol: '$' }, { code: 'BGN', symbol: 'лв' }, { code: 'BIF', symbol: 'FBu' },
                                        { code: 'KHR', symbol: '៛' }, { code: 'CAD', symbol: '$' }, { code: 'CVE', symbol: '$' },
                                        { code: 'KYD', symbol: '$' }, { code: 'XAF', symbol: 'FCFA' }, { code: 'XPF', symbol: '₣' },
                                        { code: 'CLP', symbol: '$' }, { code: 'CNY', symbol: '¥' }, { code: 'COP', symbol: '$' },
                                        { code: 'KMF', symbol: 'CF' }, { code: 'CDF', symbol: 'FC' }, { code: 'CRC', symbol: '₡' },
                                        { code: 'HRK', symbol: 'kn' }, { code: 'CUP', symbol: '₱' }, { code: 'CZK', symbol: 'Kč' },
                                        { code: 'DKK', symbol: 'kr' }, { code: 'DJF', symbol: 'Fdj' }, { code: 'DOP', symbol: 'RD$' },
                                        { code: 'EGP', symbol: '£' }, { code: 'ETB', symbol: 'Br' }, { code: 'EUR', symbol: '€' },
                                        { code: 'FJD', symbol: '$' }, { code: 'GMD', symbol: 'D' }, { code: 'GEL', symbol: '₾' },
                                        { code: 'GHS', symbol: 'GH₵' }, { code: 'GIP', symbol: '£' }, { code: 'GTQ', symbol: 'Q' },
                                        { code: 'GNF', symbol: 'FG' }, { code: 'GYD', symbol: '$' }, { code: 'HTG', symbol: 'G' },
                                        { code: 'HNL', symbol: 'L' }, { code: 'HKD', symbol: '$' }, { code: 'HUF', symbol: 'Ft' },
                                        { code: 'ISK', symbol: 'kr' }, { code: 'INR', symbol: '₹' }, { code: 'IDR', symbol: 'Rp' },
                                        { code: 'IRR', symbol: '﷼' }, { code: 'IQD', symbol: 'ع.د' }, { code: 'ILS', symbol: '₪' },
                                        { code: 'JMD', symbol: 'J$' }, { code: 'JPY', symbol: '¥' }, { code: 'JOD', symbol: 'د.ا' },
                                        { code: 'KZT', symbol: '₸' }, { code: 'KES', symbol: 'KSh' }, { code: 'KWD', symbol: 'د.ك' },
                                        { code: 'KGS', symbol: 'лв' }, { code: 'LAK', symbol: '₭' }, { code: 'LBP', symbol: '£' },
                                        { code: 'LSL', symbol: 'L' }, { code: 'LRD', symbol: '$' }, { code: 'LYD', symbol: 'ل.د' },
                                        { code: 'MOP', symbol: 'MOP$' }, { code: 'MKD', symbol: 'ден' }, { code: 'MGA', symbol: 'Ar' },
                                        { code: 'MWK', symbol: 'MK' }, { code: 'MYR', symbol: 'RM' }, { code: 'MVR', symbol: 'Rf' },
                                        { code: 'MRU', symbol: 'UM' }, { code: 'MUR', symbol: '₨' }, { code: 'MXN', symbol: '$' },
                                        { code: 'MDL', symbol: 'L' }, { code: 'MNT', symbol: '₮' }, { code: 'MAD', symbol: 'د.م.' },
                                        { code: 'MZN', symbol: 'MT' }, { code: 'MMK', symbol: 'K' }, { code: 'NAD', symbol: '$' },
                                        { code: 'NPR', symbol: '₨' }, { code: 'NZD', symbol: '$' }, { code: 'NIO', symbol: 'C$' },
                                        { code: 'NGN', symbol: '₦' }, { code: 'NOK', symbol: 'kr' }, { code: 'OMR', symbol: '﷼' },
                                        { code: 'PKR', symbol: '₨' }, { code: 'PAB', symbol: 'B/.' }, { code: 'PGK', symbol: 'K' },
                                        { code: 'PYG', symbol: 'Gs' }, { code: 'PEN', symbol: 'S/.' }, { code: 'PHP', symbol: '₱' },
                                        { code: 'PLN', symbol: 'zł' }, { code: 'QAR', symbol: '﷼' }, { code: 'RON', symbol: 'lei' },
                                        { code: 'RUB', symbol: '₽' }, { code: 'RWF', symbol: 'FRw' }, { code: 'SAR', symbol: '﷼' },
                                        { code: 'RSD', symbol: 'Дин.' }, { code: 'SCR', symbol: '₨' }, { code: 'SLL', symbol: 'Le' },
                                        { code: 'SGD', symbol: '$' }, { code: 'SBD', symbol: '$' }, { code: 'SOS', symbol: 'S' },
                                        { code: 'ZAR', symbol: 'R' }, { code: 'KRW', symbol: '₩' }, { code: 'LKR', symbol: '₨' },
                                        { code: 'SDG', symbol: 'ج.س.' }, { code: 'SRD', symbol: '$' }, { code: 'SZL', symbol: 'E' },
                                        { code: 'SEK', symbol: 'kr' }, { code: 'CHF', symbol: 'CHf' }, { code: 'SYP', symbol: '£' },
                                        { code: 'TWD', symbol: 'NT$' }, { code: 'TJS', symbol: 'SM' }, { code: 'TZS', symbol: 'TSh' },
                                        { code: 'THB', symbol: '฿' }, { code: 'TOP', symbol: 'T$' }, { code: 'TTD', symbol: 'TT$' },
                                        { code: 'TND', symbol: 'د.ت' }, { code: 'TRY', symbol: '₺' }, { code: 'TMT', symbol: 'm' },
                                        { code: 'UGX', symbol: 'USh' }, { code: 'UAH', symbol: '₴' }, { code: 'AED', symbol: 'د.إ' },
                                        { code: 'GBP', symbol: '£' }, { code: 'USD', symbol: '$' }, { code: 'UYU', symbol: '$U' },
                                        { code: 'UZS', symbol: 'лв' }, { code: 'VUV', symbol: 'VT' }, { code: 'VEF', symbol: 'Bs' },
                                        { code: 'VND', symbol: '₫' }, { code: 'YER', symbol: '﷼' }, { code: 'ZMW', symbol: 'ZK' },
                                        { code: 'ZWL', symbol: '$' }
                                    ].map(curr => (
                                        <option key={curr.code} value={curr.symbol}>{curr.code} - {curr.symbol}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    PRICE*
                                </label>
                                <input
                                    type="text"
                                    value={basicInfo.price}
                                    onChange={(e) => handleBasicInfoUpdate('price', e.target.value)}
                                    placeholder="95"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                />
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* CONTENT ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsContentOpen(!isContentOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isContentOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>CONTENT</div>
                    </div>
                    {isContentOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isContentOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {(content.items || []).map((item, index) => (
                            <div key={item.id} style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
                                        Content {index + 1}
                                    </div>
                                    <Trash2
                                        size={18}
                                        color="#ef4444"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRemoveCategory(item.id)}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        TITLE*
                                    </label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleItemUpdate(item.id, 'title', e.target.value)}
                                        placeholder="Description"
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

                                {/* Mock Editor */}
                                <div style={{ border: '1px solid #1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                                    {/* Toolbar */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid #cbd5e1', background: '#fff', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.25rem' }}>Normal</span>
                                            <ChevronDown size={14} color="#64748b" />
                                        </div>
                                        <Bold size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <Italic size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <Underline size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <Strikethrough size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <TextQuote size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <List size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <ListOrdered size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <Link size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <ImageIcon size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                        <Type size={16} color="#475569" style={{ cursor: 'pointer', margin: '0 4px' }} />
                                    </div>
                                    {/* Text Area */}
                                    <textarea
                                        value={item.text}
                                        onChange={(e) => handleItemUpdate(item.id, 'text', e.target.value)}
                                        style={{
                                            width: '100%',
                                            minHeight: '120px',
                                            border: 'none',
                                            outline: 'none',
                                            padding: '0.75rem',
                                            fontSize: '0.9rem',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            lineHeight: '1.5'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Add Category Button */}
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={handleAddCategory}
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
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={18} />
                                Add Category
                            </button>
                        </div>

                        {/* Certificates */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                CERTIFICATE
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {(content.certificates || []).map(cert => (
                                    <div key={cert.id} style={{ width: '60px', height: '60px', borderRadius: '4px', border: '1px solid #e2e8f0', padding: '4px', position: 'relative' }}>
                                        <img src={cert.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        <div
                                            onClick={() => handleRemoveCertificate(cert.id)}
                                            style={{
                                                position: 'absolute', top: '-6px', left: '-6px', width: '16px', height: '16px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #fff'
                                            }}
                                        >
                                            <X size={10} color="#fff" />
                                        </div>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRefCert.current.click()}
                                    style={{
                                        width: '60px', height: '60px', borderRadius: '4px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}
                                >
                                    <UploadCloud size={20} color="#94a3b8" />
                                </div>
                                <input type="file" ref={fileInputRefCert} onChange={handleCertificateUpload} multiple style={{ display: 'none' }} accept="image/*" />
                            </div>
                        </div>

                        {/* Button and Link */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    BUTTON*
                                </label>
                                <input
                                    type="text"
                                    value={content.buttonText || ''}
                                    onChange={(e) => handleContentUpdate('buttonText', e.target.value)}
                                    placeholder="Buy Product"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    LINK*
                                </label>
                                <input
                                    type="text"
                                    value={content.buttonLink || ''}
                                    onChange={(e) => handleContentUpdate('buttonLink', e.target.value)}
                                    placeholder="https://www.dairylandltd.com/"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                />
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* VIDEO ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsVideoOpen(!isVideoOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isVideoOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>VIDEO</div>
                    </div>
                    {isVideoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isVideoOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Video Title */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                VIDEO TITLE*
                            </label>
                            <input
                                type="text"
                                value={video.title || ''}
                                onChange={(e) => handleVideoUpdate('title', e.target.value)}
                                placeholder="Jacket Video"
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

                        {/* Upload Video */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                UPLOAD VIDEO
                            </label>

                            {/* URL Input */}
                            <input
                                type="text"
                                value={video.url || ''}
                                onChange={(e) => handleVideoUpdate('url', e.target.value)}
                                placeholder="https://youtu.be/..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#000',
                                    marginBottom: '1rem'
                                }}
                            />

                            <div style={{ textAlign: 'center', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '1rem' }}>
                                OR
                            </div>

                            {/* Local Upload Button */}
                            <button
                                onClick={() => fileInputRefVideo.current.click()}
                                disabled={!!video.url && video.url.length > 0 && !video.url.startsWith('blob:')} // Disable if text URL is present (assuming blobs are local)
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    cursor: (video.url && video.url.length > 0 && !video.url.startsWith('blob:')) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: (video.url && video.url.length > 0 && !video.url.startsWith('blob:')) ? 0.6 : 1
                                }}
                            >
                                <UploadCloud size={20} />
                                Upload/ Choose Video from your Computer
                            </button>
                            <input
                                type="file"
                                ref={fileInputRefVideo}
                                onChange={handleVideoUpload}
                                accept="video/*"
                                style={{ display: 'none' }}
                            />

                            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                                10MB max Video size
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* FEEDBACK/RATING ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isFeedbackOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>FEEDBACK/RATING</div>
                    </div>
                    {isFeedbackOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isFeedbackOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Feedback Title Row */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '2 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        FEEDBACK TITLE*
                                    </label>
                                    <input
                                        type="text"
                                        value={feedback.title || ''}
                                        onChange={(e) => handleFeedbackUpdate('title', e.target.value)}
                                        placeholder="Add Your Feedback"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1 1 120px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.5rem', height: '42px', background: '#fff' }}>
                                    <input
                                        type="text"
                                        value={feedback.textColor || '#ffffff'}
                                        onChange={(e) => handleFeedbackUpdate('textColor', e.target.value)}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    />
                                    <input
                                        type="color"
                                        value={feedback.textColor || '#ffffff'}
                                        onChange={(e) => handleFeedbackUpdate('textColor', e.target.value)}
                                        style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '2px', cursor: 'pointer', flexShrink: 0 }}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: '1 1 100px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>Font</label>
                                <select
                                    value={feedback.font || 'Lato'}
                                    onChange={(e) => handleFeedbackUpdate('font', e.target.value)}
                                    style={{ width: '100%', height: '42px', borderRadius: '4px', border: '1px solid #1e293b', padding: '0 0.5rem', outline: 'none', fontSize: '0.85rem' }}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                </select>
                            </div>
                        </div>

                        {/* See Product Rating */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                SEE PRODUCT RATING
                            </label>
                            <input
                                type="text"
                                value={feedback.ratingUrl || ''}
                                onChange={(e) => handleFeedbackUpdate('ratingUrl', e.target.value)}
                                placeholder="https://www.dairylandltd.com/floveredmilk/rating"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* CONTACT ACCORDION */}
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
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>CONTACT</div>
                    </div>
                    {isContactOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isContactOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* Phone */}
                        {contact.phone != null ? (
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ width: '42px', height: '42px', border: '1px solid #1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Phone size={20} color="#1e293b" />
                                </div>
                                <div style={{ flex: '1 1 200px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                                        <Globe size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        value={contact.phone}
                                        onChange={(e) => handleContactUpdate('phone', e.target.value)}
                                        placeholder="111337374"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                    />
                                </div>
                                <div onClick={() => handleContactUpdate('phone', null)} style={{ cursor: 'pointer', opacity: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                    <X size={18} color="#ef4444" />
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '1rem' }}>
                                <button
                                    onClick={() => handleContactUpdate('phone', '')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #8b5cf6', borderRadius: '4px', color: '#8b5cf6', background: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={14} /> Add Phone
                                </button>
                            </div>
                        )}

                        {/* Email */}
                        {contact.email != null ? (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div style={{ width: '42px', height: '42px', border: '1px solid #1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={20} color="#1e293b" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        value={contact.email}
                                        onChange={(e) => handleContactUpdate('email', e.target.value)}
                                        placeholder="info@dairylandltd.com"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                    />
                                </div>
                                <div onClick={() => handleContactUpdate('email', null)} style={{ cursor: 'pointer', opacity: 1, padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <X size={18} color="#ef4444" />
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <button
                                    onClick={() => handleContactUpdate('email', '')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #8b5cf6', borderRadius: '4px', color: '#8b5cf6', background: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={14} /> Add Email
                                </button>
                            </div>
                        )}

                        {/* Website */}
                        {contact.website != null ? (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div style={{ width: '42px', height: '42px', border: '1px solid #1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Globe size={20} color="#1e293b" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        value={contact.website}
                                        onChange={(e) => handleContactUpdate('website', e.target.value)}
                                        placeholder="https://www.example.com"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.9rem', outline: 'none', color: '#000' }}
                                    />
                                </div>
                                <div onClick={() => handleContactUpdate('website', null)} style={{ cursor: 'pointer', opacity: 1, padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <X size={18} color="#ef4444" />
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '2rem' }}>
                                <button
                                    onClick={() => handleContactUpdate('website', '')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #8b5cf6', borderRadius: '4px', color: '#8b5cf6', background: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
                                    }}>
                                    <Plus size={14} /> Add Website
                                </button>
                            </div>
                        )}

                        {/* Social Media Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            {(contact.socials || []).map((social, idx) => {
                                const iconObj = socialIcons.find(i => i.id === social.platform);
                                return (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
                                                {social.platform}*
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #1e293b', borderRadius: '4px', overflow: 'hidden', paddingLeft: '0.5rem' }}>
                                                {iconObj && <div style={{ color: iconObj.color, display: 'flex', alignItems: 'center' }}>{iconObj.icon}</div>}
                                                <input
                                                    type="text"
                                                    value={social.url}
                                                    onChange={(e) => handleSocialUrlUpdate(social.platform, e.target.value)}
                                                    placeholder="https://"
                                                    style={{ width: '100%', height: '42px', border: 'none', outline: 'none', padding: '0 0.5rem', fontSize: '0.9rem', color: '#64748b' }}
                                                />
                                            </div>
                                            <div onClick={() => handleRemoveSocial(social.platform)} style={{ cursor: 'pointer', opacity: 1, padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                                <X size={18} color="#ef4444" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ADD MORE Section */}
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                                ADD MORE
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '1rem' }}>
                                Click on the icon to add a social media profile.
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {socialIcons.map((item) => {
                                    const isAdded = (contact.socials || []).find(s => s.platform === item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => !isAdded && handleAddSocial(item.id)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '8px',
                                                border: isAdded ? `2px solid ${item.color}` : 'none',
                                                background: isAdded ? '#fff' : item.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: isAdded ? 'default' : 'pointer',
                                                color: isAdded ? item.color : '#fff',
                                                opacity: isAdded ? 1 : 0.8 // Dim if not selected? No, reference shows bright colors
                                            }}
                                        >
                                            <div style={isAdded ? { transform: 'scale(1)' } : { color: '#fff' }}>
                                                {item.icon}
                                            </div>
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

export default ProductPageConfig;
