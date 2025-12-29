import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Trash2, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, Music, Ghost, MessageCircle, Send, Dribbble, Github, GripVertical } from 'lucide-react';
import { useState } from 'react';
import ReusableDesignAccordion from './ReusableDesignAccordion';

const SurveyConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isSurveyQuestionsOpen, setIsSurveyQuestionsOpen] = useState(false);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(false);

    const design = config.design || {};
    const basicInfo = config.basicInfo || {};
    const defaultSurveyQuestions = [
        {
            id: 1,
            type: 'Options',
            questions: {
                'English': 'Branch Name',
                'Urdu': 'برانچ کا نام'
            },
            options: [
                {
                    id: 101,
                    labels: {
                        'English': 'Digital',
                        'Urdu': 'ڈیجیٹل'
                    }
                }
            ]
        },
        {
            id: 2,
            type: 'Text',
            questions: {
                'English': 'Name of the Customer',
                'Urdu': 'صارف کا نام'
            },
            options: []
        },
        {
            id: 3,
            type: 'Phone Number',
            questions: {
                'English': 'Mobile No',
                'Urdu': 'موبائل نمبر'
            },
            options: []
        },
        {
            id: 4,
            type: 'Rating',
            questions: {
                'English': 'How much are you satisfied with the Environment and other facilities?',
                'Urdu': 'کیا آپ ماحول اور دیگر سہولیات سے کتنے مطمئن ہیں؟'
            },
            options: []
        },
        {
            id: 5,
            type: 'Rating',
            questions: {
                'English': 'How much are you satisfied with the knowledge capacity of staff regarding different services being offered?',
                'Urdu': 'کیا آپ عملہ کی جانب سے پیش کی جانے والی مختلف خدمات سے متعلق معلومات فراہمی سے کتنے مطمئن ہیں؟'
            },
            options: []
        },
        {
            id: 6,
            type: 'Radio',
            questions: {
                'English': 'Will you recommend us?',
                'Urdu': 'کیا آپ ہمیں تجویز کریں گے؟'
            },
            options: [
                {
                    id: 601,
                    labels: {
                        'English': 'Yes',
                        'Urdu': 'جی ہاں'
                    }
                },
                {
                    id: 602,
                    labels: {
                        'English': 'No',
                        'Urdu': 'جی نہیں'
                    }
                }
            ]
        }
    ];

    const survey = {
        languages: config.survey?.languages || ['English', 'Urdu'],
        defaultLanguage: config.survey?.defaultLanguage || 'English',
        questions: config.survey?.questions || defaultSurveyQuestions
    };
    const thankYou = config.thankYou || {};
    const socialLinks = config.socialLinks || [];

    const primaryColor = design.color?.header || '#2B853E';
    const secondaryColor = design.color?.light || '#68D87F';

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

    // Survey handlers
    const handleAddLanguage = (language) => {
        if (!survey.languages.includes(language)) {
            onChange(prev => ({
                ...prev,
                survey: {
                    ...prev.survey,
                    languages: [...(prev.survey?.languages || []), language]
                }
            }));
        }
    };

    const handleRemoveLanguage = (language) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                languages: (prev.survey?.languages || []).filter(l => l !== language)
            }
        }));
    };

    const handleDefaultLanguageChange = (language) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                defaultLanguage: language
            }
        }));
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            type: 'Options',
            questions: {},
            options: []
        };
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: [...(prev.survey?.questions || []), newQuestion]
            }
        }));
    };

    const handleRemoveQuestion = (questionId) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).filter(q => q.id !== questionId)
            }
        }));
    };

    const handleQuestionTypeChange = (questionId, type) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).map(q =>
                    q.id === questionId ? { ...q, type } : q
                )
            }
        }));
    };

    const handleQuestionTextChange = (questionId, language, text) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).map(q =>
                    q.id === questionId ? {
                        ...q,
                        questions: { ...q.questions, [language]: text }
                    } : q
                )
            }
        }));
    };

    const handleAddOption = (questionId) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: [...(q.options || []), { id: Date.now(), labels: {} }]
                    } : q
                )
            }
        }));
    };

    const handleRemoveOption = (questionId, optionId) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: (q.options || []).filter(o => o.id !== optionId)
                    } : q
                )
            }
        }));
    };

    const handleOptionLabelChange = (questionId, optionId, language, label) => {
        onChange(prev => ({
            ...prev,
            survey: {
                ...prev.survey,
                questions: (prev.survey?.questions || []).map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: (q.options || []).map(o =>
                            o.id === optionId ? {
                                ...o,
                                labels: { ...o.labels, [language]: label }
                            } : o
                        )
                    } : q
                )
            }
        }));
    };

    const handleThankYouUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            thankYou: {
                ...prev.thankYou,
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
        { id: 'facebook', name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', color: '#1877F2' },
        { id: 'instagram', name: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', color: '#E4405F' },
        { id: 'twitter', name: 'X', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png', color: '#1DA1F2' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', color: '#0A66C2' },
        { id: 'discord', name: 'Discord', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670157.png', color: '#5865F2' },
        { id: 'youtube', name: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', color: '#FF0000' },
        { id: 'whatsapp', name: 'WhatsApp', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png', color: '#25D366' },
        { id: 'snapchat', name: 'Snapchat', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', color: '#FFFC00' },
        { id: 'tiktok', name: 'TikTok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', color: '#000000' },
        { id: 'spotify', name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174868.png', color: '#1DB954' },
        { id: 'dribbble', name: 'Dribbble', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111388.png', color: '#EA4C89' },
        { id: 'pinterest', name: 'Pinterest', icon: 'https://cdn-icons-png.flaticon.com/512/145/145808.png', color: '#BD081C' },
        { id: 'telegram', name: 'Telegram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', color: '#0088CC' },
        { id: 'reddit', name: 'Reddit', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670154.png', color: '#FF4500' },
        { id: 'website', name: 'Website', icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png', color: '#4B5563' }
    ];

    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FACC15', s: '#FEF9C3' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    const logoOptions = [
        { id: 'logo1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 'logo2', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
        { id: 'logo3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
        { id: 'logo4', url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' }
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
                        header: design.color?.header || '#2B853E',
                        light: design.color?.light || '#68D87F'
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
                                        value={basicInfo.organizationName || ''}
                                        onChange={(e) => handleBasicInfoUpdate('organizationName', e.target.value)}
                                        placeholder="Luxury Hotels"
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
                                        height: '44px'
                                    }}>
                                        <input
                                            type="text"
                                            value={basicInfo.organizationNameColor || '#000000'}
                                            onChange={(e) => handleBasicInfoUpdate('organizationNameColor', e.target.value)}
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
                                        <div
                                            onClick={() => document.getElementById('orgNameColorPicker').click()}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: basicInfo.organizationNameColor || '#000000',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}>
                                            <input
                                                id="orgNameColorPicker"
                                                type="color"
                                                value={basicInfo.organizationNameColor || '#000000'}
                                                onChange={(e) => handleBasicInfoUpdate('organizationNameColor', e.target.value)}
                                                style={{
                                                    position: 'absolute',
                                                    opacity: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer'
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

                        {/* DESCRIPTION FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DESCRIPTION
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Description Textarea */}
                                <div style={{ flex: '2 1 200px' }}>
                                    <textarea
                                        value={basicInfo.description || ''}
                                        onChange={(e) => handleBasicInfoUpdate('description', e.target.value)}
                                        placeholder="We aim to provide fresh and healthy snacks for people on the go."
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
                                        height: '44px'
                                    }}>
                                        <input
                                            type="text"
                                            value={basicInfo.descriptionColor || '#475569'}
                                            onChange={(e) => handleBasicInfoUpdate('descriptionColor', e.target.value)}
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
                                        <div
                                            onClick={() => document.getElementById('descColorPicker').click()}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: basicInfo.descriptionColor || '#475569',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}>
                                            <input
                                                id="descColorPicker"
                                                type="color"
                                                value={basicInfo.descriptionColor || '#475569'}
                                                onChange={(e) => handleBasicInfoUpdate('descriptionColor', e.target.value)}
                                                style={{
                                                    position: 'absolute',
                                                    opacity: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer'
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
                                        value={basicInfo.descriptionFont || 'Lato'}
                                        onChange={(e) => handleBasicInfoUpdate('descriptionFont', e.target.value)}
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
                                placeholder="https://www.luxerhotels.com"
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

            {/* SURVEY QUESTIONS ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsSurveyQuestionsOpen(!isSurveyQuestionsOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isSurveyQuestionsOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>SURVEY QUESTIONS</div>
                    </div>
                    {isSurveyQuestionsOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isSurveyQuestionsOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* LANGUAGES */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                LANGUAGES
                            </label>

                            {/* Language Tags Container with Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <div
                                    onClick={() => {
                                        const dropdown = document.getElementById('languageDropdown');
                                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                                    }}
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #1e293b',
                                        minHeight: '44px',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                >
                                    {survey.languages && survey.languages.map((lang, idx) => {
                                        const languageData = [
                                            { name: 'English', code: 'us' },
                                            { name: 'Urdu', code: 'pk' },
                                            { name: 'Arabic', code: 'sa' },
                                            { name: 'Spanish', code: 'es' },
                                            { name: 'French', code: 'fr' },
                                            { name: 'German', code: 'de' },
                                            { name: 'Chinese', code: 'cn' },
                                            { name: 'Japanese', code: 'jp' },
                                            { name: 'Korean', code: 'kr' },
                                            { name: 'Russian', code: 'ru' },
                                            { name: 'Portuguese', code: 'pt' },
                                            { name: 'Italian', code: 'it' },
                                            { name: 'Dutch', code: 'nl' },
                                            { name: 'Turkish', code: 'tr' },
                                            { name: 'Hindi', code: 'in' },
                                            { name: 'Bengali', code: 'bd' },
                                            { name: 'Vietnamese', code: 'vn' },
                                            { name: 'Thai', code: 'th' },
                                            { name: 'Indonesian', code: 'id' },
                                            { name: 'Malay', code: 'my' },
                                            { name: 'Polish', code: 'pl' },
                                            { name: 'Ukrainian', code: 'ua' },
                                            { name: 'Romanian', code: 'ro' },
                                            { name: 'Greek', code: 'gr' },
                                            { name: 'Czech', code: 'cz' },
                                            { name: 'Swedish', code: 'se' },
                                            { name: 'Norwegian', code: 'no' },
                                            { name: 'Danish', code: 'dk' },
                                            { name: 'Finnish', code: 'fi' },
                                            { name: 'Hungarian', code: 'hu' }
                                        ].find(l => l.name === lang);

                                        return (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: '#f1f5f9',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem'
                                            }}>
                                                {languageData && (
                                                    <img
                                                        src={`https://flagcdn.com/w20/${languageData.code}.png`}
                                                        alt={lang}
                                                        style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                                                    />
                                                )}
                                                <span>{lang}</span>
                                                <X
                                                    size={14}
                                                    color="#64748b"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveLanguage(lang);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                    {(!survey.languages || survey.languages.length === 0) && (
                                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select languages...</span>
                                    )}
                                    <ChevronDown size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                                </div>

                                {/* Dropdown Menu */}
                                <div
                                    id="languageDropdown"
                                    style={{
                                        display: 'none',
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '0.25rem',
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        zIndex: 10
                                    }}
                                >
                                    {[
                                        { name: 'English', code: 'us' },
                                        { name: 'Urdu', code: 'pk' },
                                        { name: 'Arabic', code: 'sa' },
                                        { name: 'Spanish', code: 'es' },
                                        { name: 'French', code: 'fr' },
                                        { name: 'German', code: 'de' },
                                        { name: 'Chinese', code: 'cn' },
                                        { name: 'Japanese', code: 'jp' },
                                        { name: 'Korean', code: 'kr' },
                                        { name: 'Russian', code: 'ru' },
                                        { name: 'Portuguese', code: 'pt' },
                                        { name: 'Italian', code: 'it' },
                                        { name: 'Dutch', code: 'nl' },
                                        { name: 'Turkish', code: 'tr' },
                                        { name: 'Hindi', code: 'in' },
                                        { name: 'Bengali', code: 'bd' },
                                        { name: 'Vietnamese', code: 'vn' },
                                        { name: 'Thai', code: 'th' },
                                        { name: 'Indonesian', code: 'id' },
                                        { name: 'Malay', code: 'my' },
                                        { name: 'Polish', code: 'pl' },
                                        { name: 'Ukrainian', code: 'ua' },
                                        { name: 'Romanian', code: 'ro' },
                                        { name: 'Greek', code: 'gr' },
                                        { name: 'Czech', code: 'cz' },
                                        { name: 'Swedish', code: 'se' },
                                        { name: 'Norwegian', code: 'no' },
                                        { name: 'Danish', code: 'dk' },
                                        { name: 'Finnish', code: 'fi' },
                                        { name: 'Hungarian', code: 'hu' }
                                    ].map((language, idx) => {
                                        const isSelected = survey.languages && survey.languages.includes(language.name);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isSelected) {
                                                        handleRemoveLanguage(language.name);
                                                    } else {
                                                        handleAddLanguage(language.name);
                                                        // Auto-set as default if it's the first language
                                                        if (!survey.languages || survey.languages.length === 0) {
                                                            handleDefaultLanguageChange(language.name);
                                                        }
                                                    }
                                                    // Close dropdown after selection
                                                    document.getElementById('languageDropdown').style.display = 'none';
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.75rem 1rem',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#f1f5f9' : '#fff',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#fff';
                                                }}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/w20/${language.code}.png`}
                                                    alt={language.name}
                                                    style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                                                />
                                                <span style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b' }}>{language.name}</span>
                                                {isSelected && <Check size={16} color="#8b5cf6" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* DEFAULT LANGUAGE */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                DEFAULT LANGUAGE*
                            </label>

                            {/* Custom Dropdown for Default Language */}
                            <div style={{ position: 'relative' }}>
                                <div
                                    onClick={() => {
                                        const dropdown = document.getElementById('defaultLanguageDropdown');
                                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #1e293b',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                >
                                    {(() => {
                                        const languageData = [
                                            { name: 'English', code: 'us' },
                                            { name: 'Urdu', code: 'pk' },
                                            { name: 'Arabic', code: 'sa' },
                                            { name: 'Spanish', code: 'es' },
                                            { name: 'French', code: 'fr' },
                                            { name: 'German', code: 'de' },
                                            { name: 'Chinese', code: 'cn' },
                                            { name: 'Japanese', code: 'jp' },
                                            { name: 'Korean', code: 'kr' },
                                            { name: 'Russian', code: 'ru' },
                                            { name: 'Portuguese', code: 'pt' },
                                            { name: 'Italian', code: 'it' },
                                            { name: 'Dutch', code: 'nl' },
                                            { name: 'Turkish', code: 'tr' },
                                            { name: 'Hindi', code: 'in' },
                                            { name: 'Bengali', code: 'bd' },
                                            { name: 'Vietnamese', code: 'vn' },
                                            { name: 'Thai', code: 'th' },
                                            { name: 'Indonesian', code: 'id' },
                                            { name: 'Malay', code: 'my' }
                                        ].find(l => l.name === (survey.defaultLanguage || 'English'));

                                        return languageData ? (
                                            <>
                                                <img
                                                    src={`https://flagcdn.com/w20/${languageData.code}.png`}
                                                    alt={survey.defaultLanguage || 'English'}
                                                    style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                                                />
                                                <span style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b' }}>
                                                    {survey.defaultLanguage || 'English'}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ flex: 1, fontSize: '0.9rem', color: '#94a3b8' }}>
                                                Select default language...
                                            </span>
                                        );
                                    })()}
                                    <ChevronDown size={16} color="#64748b" />
                                </div>

                                {/* Dropdown Menu */}
                                <div
                                    id="defaultLanguageDropdown"
                                    style={{
                                        display: 'none',
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '0.25rem',
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        maxHeight: '180px',
                                        overflowY: 'scroll',
                                        zIndex: 10
                                    }}
                                >
                                    {survey.languages && survey.languages.map((lang, idx) => {
                                        const languageData = [
                                            { name: 'English', code: 'us' },
                                            { name: 'Urdu', code: 'pk' },
                                            { name: 'Arabic', code: 'sa' },
                                            { name: 'Spanish', code: 'es' },
                                            { name: 'French', code: 'fr' },
                                            { name: 'German', code: 'de' },
                                            { name: 'Chinese', code: 'cn' },
                                            { name: 'Japanese', code: 'jp' },
                                            { name: 'Korean', code: 'kr' },
                                            { name: 'Russian', code: 'ru' },
                                            { name: 'Portuguese', code: 'pt' },
                                            { name: 'Italian', code: 'it' },
                                            { name: 'Dutch', code: 'nl' },
                                            { name: 'Turkish', code: 'tr' },
                                            { name: 'Hindi', code: 'in' },
                                            { name: 'Bengali', code: 'bd' },
                                            { name: 'Vietnamese', code: 'vn' },
                                            { name: 'Thai', code: 'th' },
                                            { name: 'Indonesian', code: 'id' },
                                            { name: 'Malay', code: 'my' }
                                        ].find(l => l.name === lang);

                                        const isSelected = survey.defaultLanguage === lang;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDefaultLanguageChange(lang);
                                                    document.getElementById('defaultLanguageDropdown').style.display = 'none';
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.75rem 1rem',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#f1f5f9' : '#fff',
                                                    borderBottom: idx < survey.languages.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#fff';
                                                }}
                                            >
                                                {languageData && (
                                                    <img
                                                        src={`https://flagcdn.com/w20/${languageData.code}.png`}
                                                        alt={lang}
                                                        style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                                                    />
                                                )}
                                                <span style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b' }}>{lang}</span>
                                                {isSelected && <Check size={16} color="#8b5cf6" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* QUESTIONS SECTION */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b', textTransform: 'uppercase' }}>
                                    QUESTIONS
                                </div>
                                <button
                                    onClick={handleAddQuestion}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#fff',
                                        color: '#8b5cf6',
                                        border: '1px solid #8b5cf6',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Add Question
                                </button>
                            </div>

                            {/* Questions List */}
                            {survey.questions && survey.questions.map((question, qIdx) => (
                                <div key={question.id} style={{
                                    marginBottom: '2rem',
                                    padding: '1.5rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    background: '#fafafa'
                                }}>
                                    {/* Question Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                                            QUESTION {qIdx + 1}
                                        </div>
                                        <Trash2
                                            size={18}
                                            color="#ef4444"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveQuestion(question.id)}
                                        />
                                    </div>

                                    {/* Question Type */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                            Question Type
                                        </label>
                                        <select
                                            value={question.type || 'Options'}
                                            onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
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
                                            <option value="Options">Options</option>
                                            <option value="Text">Text</option>
                                            <option value="Phone Number">Phone Number</option>
                                            <option value="Rating">Rating</option>
                                            <option value="Radio">Radio</option>
                                        </select>
                                    </div>

                                    {/* Question Inputs for each language */}
                                    {survey.languages && survey.languages.map((lang, langIdx) => {
                                        // Map language names to codes
                                        const langCode = {
                                            'English': 'en',
                                            'Urdu': 'ur',
                                            'Arabic': 'ar',
                                            'Spanish': 'es',
                                            'French': 'fr',
                                            'German': 'de',
                                            'Chinese': 'zh',
                                            'Japanese': 'ja',
                                            'Korean': 'ko',
                                            'Russian': 'ru',
                                            'Portuguese': 'pt',
                                            'Italian': 'it',
                                            'Dutch': 'nl',
                                            'Turkish': 'tr',
                                            'Hindi': 'hi',
                                            'Bengali': 'bn',
                                            'Vietnamese': 'vi',
                                            'Thai': 'th',
                                            'Indonesian': 'id',
                                            'Malay': 'ms'
                                        }[lang] || 'en';

                                        return (
                                            <div key={langIdx} style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                                                        {langCode}
                                                    </span>
                                                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                                        Question
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={question.questions?.[lang] || ''}
                                                    onChange={(e) => handleQuestionTextChange(question.id, lang, e.target.value)}
                                                    placeholder={lang === 'English' ? 'Branch Name' : lang === 'Urdu' ? 'برانچ کا نام' : 'Question'}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '4px',
                                                        border: question.questions?.[lang] ? '1px solid #1e293b' : '1px solid #ef4444',
                                                        fontSize: '0.9rem',
                                                        outline: 'none',
                                                        background: '#fff'
                                                    }}
                                                />
                                                {!question.questions?.[lang] && (
                                                    <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                                        Question is required
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* OPTIONS Section (only for Options and Radio types) */}
                                    {(question.type === 'Options' || question.type === 'Radio') && (
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                                OPTIONS
                                            </div>

                                            {question.options?.map((option, optIdx) => (
                                                <div key={option.id} style={{ marginBottom: '1.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                                                            Option {optIdx + 1}
                                                        </div>
                                                        <Trash2
                                                            size={16}
                                                            color="#ef4444"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleRemoveOption(question.id, option.id)}
                                                        />
                                                    </div>

                                                    {survey.languages && survey.languages.map((lang, langIdx) => {
                                                        const langCode = {
                                                            'English': 'en',
                                                            'Urdu': 'ur',
                                                            'Arabic': 'ar',
                                                            'Spanish': 'es',
                                                            'French': 'fr',
                                                            'German': 'de',
                                                            'Chinese': 'zh',
                                                            'Japanese': 'ja',
                                                            'Korean': 'ko',
                                                            'Russian': 'ru',
                                                            'Portuguese': 'pt',
                                                            'Italian': 'it',
                                                            'Dutch': 'nl',
                                                            'Turkish': 'tr',
                                                            'Hindi': 'hi',
                                                            'Bengali': 'bn',
                                                            'Vietnamese': 'vi',
                                                            'Thai': 'th',
                                                            'Indonesian': 'id',
                                                            'Malay': 'ms'
                                                        }[lang] || 'en';

                                                        return (
                                                            <div key={langIdx} style={{ marginBottom: '0.75rem' }}>
                                                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                                    Option Label ({langCode})
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={option.labels?.[lang] || ''}
                                                                    onChange={(e) => handleOptionLabelChange(question.id, option.id, lang, e.target.value)}
                                                                    placeholder={lang === 'English' ? 'Digital' : lang === 'Urdu' ? 'ڈیجیٹل' : 'Option'}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '0.5rem',
                                                                        borderRadius: '4px',
                                                                        border: option.labels?.[lang] ? '1px solid #1e293b' : '1px solid #ef4444',
                                                                        fontSize: '0.85rem',
                                                                        outline: 'none',
                                                                        background: '#fff'
                                                                    }}
                                                                />
                                                                {!option.labels?.[lang] && (
                                                                    <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                                                        Option is required
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}

                                            {/* Add Option Button */}
                                            <div
                                                onClick={() => handleAddOption(question.id)}
                                                style={{
                                                    padding: '1rem',
                                                    border: '2px dashed #8b5cf6',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    color: '#8b5cf6',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Add Option
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>

            {/* THANK YOU AFTER SUBMIT ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsThankYouOpen(!isThankYouOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isThankYouOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>THANK YOU AFTER SUBMIT</div>
                    </div>
                    {isThankYouOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isThankYouOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        {/* THANKYOU TITLE FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                THANKYOU TITLE*
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Title Input */}
                                <div style={{ flex: '2 1 200px' }}>
                                    <input
                                        type="text"
                                        value={thankYou.title || ''}
                                        onChange={(e) => handleThankYouUpdate('title', e.target.value)}
                                        placeholder="We appreciate your feedback!"
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
                                        height: '44px'
                                    }}>
                                        <input
                                            type="text"
                                            value={thankYou.titleColor || '#000000'}
                                            onChange={(e) => handleThankYouUpdate('titleColor', e.target.value)}
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
                                        <div
                                            onClick={() => document.getElementById('thankYouTitleColorPicker').click()}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: thankYou.titleColor || '#000000',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}>
                                            <input
                                                id="thankYouTitleColorPicker"
                                                type="color"
                                                value={thankYou.titleColor || '#000000'}
                                                onChange={(e) => handleThankYouUpdate('titleColor', e.target.value)}
                                                style={{
                                                    position: 'absolute',
                                                    opacity: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer'
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
                                        value={thankYou.titleFont || 'Lato'}
                                        onChange={(e) => handleThankYouUpdate('titleFont', e.target.value)}
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

                        {/* THANKYOU MESSAGE FIELD */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                THANKYOU MESSAGE*
                            </label>
                            <textarea
                                value={thankYou.message || ''}
                                onChange={(e) => handleThankYouUpdate('message', e.target.value)}
                                placeholder="Thank you for completing the survey! Your feedback helps us improve."
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

                        {/* REDIRECT URL FIELD */}
                        <div style={{ marginBottom: '0' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                REDIRECT URL*
                            </label>
                            <input
                                type="text"
                                value={thankYou.redirectUrl || ''}
                                onChange={(e) => handleThankYouUpdate('redirectUrl', e.target.value)}
                                placeholder="https://www.luxerhotels.com"
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

                        {/* Selected Social Media Inputs Grid */}
                        {socialLinks.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                {socialLinks.map((link) => {
                                    const platform = socialPlatforms.find(p => p.id === link.platform);
                                    if (!platform) return null;
                                    const Icon = platform.icon;

                                    return (
                                        <div key={link.id} style={{ position: 'relative', flex: '1 1 200px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: platform.gradient || platform.color,
                                                    borderRadius: '50%',
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
                                                                width: '20px',
                                                                height: '20px',
                                                                objectFit: 'contain',
                                                                filter: platform.id === 'snapchat' || platform.color === '#fffc00' ? 'none' : 'brightness(0) invert(1)'
                                                            }}
                                                        />
                                                    ) : (
                                                        <Icon size={20} color={platform.textColor || "#fff"} />
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={link.url || ''}
                                                    onChange={(e) => handleSocialLinkUpdate(link.id, e.target.value)}
                                                    placeholder="https://"
                                                    style={{
                                                        flex: '1 1 180px',
                                                        padding: '0.5rem',
                                                        borderRadius: '4px',
                                                        border: '1px solid #1e293b',
                                                        fontSize: '0.85rem',
                                                        outline: 'none',
                                                        color: '#94a3b8'
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
                                                background: platform.gradient || platform.color,
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: isAdded ? 'not-allowed' : 'pointer',
                                                opacity: isAdded ? 0.5 : 1,
                                                transition: 'transform 0.1s',
                                                border: isAdded ? '2px solid #cbd5e1' : 'none'
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
                                                    alt=""
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        objectFit: 'contain',
                                                        filter: platform.id === 'snapchat' || platform.color === '#fffc00' ? 'none' : 'brightness(0) invert(1)'
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
        </div>
    );
};

export default SurveyConfig;
