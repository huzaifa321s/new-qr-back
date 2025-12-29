import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, UploadCloud, X, RefreshCw, Check, Image as ImageIcon, Plus, ArrowUpDown, Trash2, Clock, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Music, Send, MapPin, Link as LinkIcon, Hash } from 'lucide-react';
import ReusableDesignAccordion from './ReusableDesignAccordion';
import ImageUploadModal from './ImageUploadModal';
import axios from 'axios';

const MenuConfig = ({ config, onChange }) => {
    // Accordion States
    const [isDesignOpen, setIsDesignOpen] = useState(false);
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTimingsOpen, setIsTimingsOpen] = useState(false);
    const [isSocialOpen, setIsSocialOpen] = useState(true);

    // Sub-accordion state for Menu Categories
    const [openCategoryId, setOpenCategoryId] = useState(() => {
        if (config.menu?.categories && config.menu.categories.length > 0) {
            return config.menu.categories[0].id;
        }
        return 'burger';
    });

    // Image Preview State (Existing preview modal)
    const [showImageModal, setShowImageModal] = useState(false);
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);

    // State for background upload modal (New reusable modal)
    const [isBgModalOpen, setIsBgModalOpen] = useState(false);
    const [tempBgImage, setTempBgImage] = useState(null);
    const [bgFileName, setBgFileName] = useState('');

    const design = config.design || {};
    const businessInfo = config.businessInfo || {};

    // Initial State handling for Categories
    const [categories, setCategories] = useState(() => {
        if (config.menu?.categories && config.menu.categories.length > 0) {
            return config.menu.categories;
        }
        return [
            {
                id: 'burger',
                name: 'Burger',
                products: [
                    {
                        id: 'p1',
                        name: 'Zinger Burger',
                        price: '10',
                        description: 'jalapeno + cheese',
                        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80'
                    }
                ]
            },
            {
                id: 'coffee',
                name: 'Coffee',
                products: []
            },
            {
                id: 'juices',
                name: 'Juices',
                products: []
            }
        ];
    });

    // Timings State
    const [timeFormat, setTimeFormat] = useState(businessInfo?.timeFormat || 'AM/PM');
    const [timings, setTimings] = useState(businessInfo?.timings || [
        { day: 'Monday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Tuesday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Wednesday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Thursday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Friday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Saturday', isOpen: true, start: '08:00 AM', end: '08:00 AM' },
        { day: 'Sunday', isOpen: false, start: '08:00 AM', end: '08:00 AM' },
    ]);

    // Social Media State
    const [socials, setSocials] = useState(businessInfo?.socials || [
        { id: 'website', name: 'Website', icon: 'globe', placeholder: 'https://', url: '' },
        { id: 'facebook', name: 'Facebook', icon: 'facebook', placeholder: 'https://', url: '' },
        { id: 'instagram', name: 'Instagram', icon: 'instagram', placeholder: 'https://', url: '' }
    ]);

    // Available Social Icons Map
    const availableSocials = [
        { id: 'facebook', color: '#1877F2', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
        { id: 'instagram', color: '#E4405F', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' },
        { id: 'twitter', color: '#000000', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png' },
        { id: 'linkedin', color: '#0A66C2', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
        { id: 'discord', color: '#5865F2', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670157.png' },
        { id: 'twitch', color: '#9146FF', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111668.png' },
        { id: 'youtube', color: '#FF0000', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
        { id: 'whatsapp', color: '#25D366', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
        { id: 'snapchat', color: '#FFFC00', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png' },
        { id: 'tiktok', color: '#000000', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
        { id: 'tumblr', color: '#36465D', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968943.png' },
        { id: 'spotify', color: '#1DB954', icon: 'https://cdn-icons-png.flaticon.com/512/174/174868.png' },
        { id: 'pinterest', color: '#BD081C', icon: 'https://cdn-icons-png.flaticon.com/512/145/145808.png' },
        { id: 'telegram', color: '#0088CC', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
        { id: 'reddit', color: '#FF4500', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670154.png' },
        { id: 'website', color: '#4F46E5', icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png' }
    ];

    // Helper functions
    const updateCategories = (newCategories) => {
        setCategories(newCategories);
        onChange(prev => ({
            ...prev,
            menu: { ...prev.menu, categories: newCategories }
        }));
    };

    const handleCategoryNameChange = (id, newName) => {
        const newCats = categories.map(c => c.id === id ? { ...c, name: newName } : c);
        updateCategories(newCats);
    };

    const handleProductChange = (catId, prodId, field, value) => {
        const newCats = categories.map(c => {
            if (c.id !== catId) return c;
            const newProds = c.products.map(p => p.id === prodId ? { ...p, [field]: value } : p);
            return { ...c, products: newProds };
        });
        updateCategories(newCats);
    };

    const handleAddProduct = (catId) => {
        const newCats = categories.map(c => {
            if (c.id !== catId) return c;
            return {
                ...c,
                products: [...c.products, { id: Date.now(), name: '', price: '', description: '', image: '' }]
            };
        });
        updateCategories(newCats);
    };

    const handleRemoveProduct = (catId, prodId) => {
        const newCats = categories.map(c => {
            if (c.id === catId) {
                return { ...c, products: c.products.filter(p => p.id !== prodId) };
            }
            return c;
        });
        updateCategories(newCats);
    };

    const handleRemoveCategory = (catId) => {
        const newCategories = categories.filter(c => c.id !== catId);
        updateCategories(newCategories);
        if (openCategoryId === catId) {
            setOpenCategoryId(newCategories.length > 0 ? newCategories[0].id : null);
        }
    };

    const handleProductImageUpload = async (catId, prodId, file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('File size should be less than 5MB'); return; }
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await axios.post('http://localhost:3000/api/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleProductChange(catId, prodId, 'image', res.data.url);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please try again.');
        }
    };

    const handleAddCategory = () => {
        const newId = `cat-${Date.now()}`;
        const newCat = { id: newId, name: '', products: [] };
        const newCategories = [...categories, newCat];
        updateCategories(newCategories);
        setOpenCategoryId(newId);
    };

    const toggleCategory = (id) => {
        setOpenCategoryId(prev => prev === id ? null : id);
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

    const handleBusinessInfoUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            businessInfo: { ...prev.businessInfo, [key]: value }
        }));
    };

    const getSocialIcon = (id) => {
        const item = availableSocials.find(s => s.id === id);
        if (!item) return <Globe size={20} color="#fff" />;
        return <img src={item.icon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', filter: item.id === 'snapchat' || item.color === '#fffc00' ? 'none' : 'brightness(0) invert(1)' }} />;
    };

    const getSocialColor = (id) => {
        const item = availableSocials.find(s => s.id === id);
        return item ? item.color : '#94a3b8';
    };

    const handleSocialChange = (index, value) => {
        const newSocials = [...socials];
        newSocials[index].url = value;
        setSocials(newSocials);
        onChange(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, socials: newSocials } }));
    };

    const handleAddSocial = (id) => {
        if (socials.find(s => s.id === id)) return;
        const newItem = { id, name: id.charAt(0).toUpperCase() + id.slice(1), url: '', placeholder: 'https://' };
        const newSocials = [...socials, newItem];
        setSocials(newSocials);
        onChange(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, socials: newSocials } }));
    };

    const handleRemoveSocial = (index) => {
        const newSocials = socials.filter((_, i) => i !== index);
        setSocials(newSocials);
        onChange(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, socials: newSocials } }));
    };

    const handleTimingChange = (index, field, value) => {
        const newTimings = [...timings];
        newTimings[index][field] = value;
        setTimings(newTimings);
        onChange(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, timings: newTimings } }));
    };

    const handleTimeFormatChange = (format) => {
        setTimeFormat(format);
        let updatedTimings = [...timings];
        if (format === '24 hrs') {
            updatedTimings = timings.map(t => ({
                ...t,
                start: t.start ? t.start.replace(/\s*(AM|PM|am|pm)/i, '').trim() : t.start,
                end: t.end ? t.end.replace(/\s*(AM|PM|am|pm)/i, '').trim() : t.end
            }));
            setTimings(updatedTimings);
        }
        onChange(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, timings: updatedTimings, timeFormat: format } }));
    };

    // Effects
    useEffect(() => {
        if (!config.menu?.categories || config.menu.categories.length === 0) {
            onChange(prev => ({ ...prev, menu: { ...prev.menu, categories: categories } }));
        }
    }, []);

    useEffect(() => {
        if (businessInfo?.timings) setTimings(businessInfo.timings);
        if (businessInfo?.timeFormat) setTimeFormat(businessInfo.timeFormat);
    }, [businessInfo?.timings, businessInfo?.timeFormat]);

    const palettes = [{ p: '#0f296d', s: '#f59e0b' }, { p: '#fef08a', s: '#fffbeb' }, { p: '#8b5cf6', s: '#c4b5fd' }, { p: '#16a34a', s: '#86efac' }, { p: '#06b6d4', s: '#67e8f9' }];
    const bgImages = [{ id: '1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' }, { id: '2', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400' }, { id: '3', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400' }, { id: '4', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400' }, { id: '5', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400' }];
    const logos = [{ id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }, { id: '2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Food' }, { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' }];

    return (
        <div>
            <ReusableDesignAccordion
                design={{
                    ...design,
                    primaryColor: design.primaryColor || '#6F0101',
                    secondaryColor: design.secondaryColor || '#FFFFFF'
                }}
                onChange={handleDesignSectionUpdate}
                isOpen={isDesignOpen}
                onToggle={() => setIsDesignOpen(!isDesignOpen)}
                colorKeys={{ primary: 'primaryColor', secondary: 'secondaryColor' }}
                palettes={palettes}
                logoKey="logo"
                showLogo={true}
                logoLabel="LOGO"
                logoOptions={logos}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>BACKGROUND IMAGE</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <div onClick={() => handleDesignSectionUpdate('backgroundImage', '')} style={{ width: '80px', height: '80px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={32} color="#e2e8f0" />
                        </div>
                        {bgImages.map(img => (
                            <div key={img.id} onClick={() => handleDesignSectionUpdate('backgroundImage', img.url)} style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: design.backgroundImage === img.url ? '2px solid #8b5cf6' : '1px solid #e2e8f0', position: 'relative', cursor: 'pointer' }}>
                                <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {design.backgroundImage === img.url && (
                                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#8b5cf6', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check size={12} color="#fff" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {design.backgroundImage && !bgImages.find(img => img.url === design.backgroundImage) && (
                            <div onClick={() => setShowImageModal(true)} onMouseEnter={() => setIsHoveringUpload(true)} onMouseLeave={() => setIsHoveringUpload(false)} style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '2px solid #8b5cf6', position: 'relative', cursor: 'pointer' }}>
                                <img src={design.backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {isHoveringUpload && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>Preview</span>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#8b5cf6', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                                    <Check size={12} color="#fff" strokeWidth={3} />
                                </div>
                            </div>
                        )}
                        <label style={{ width: '80px', height: '80px', borderRadius: '4px', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setBgFileName(file.name);
                                    const reader = new FileReader();
                                    reader.onload = () => { setTempBgImage(reader.result); setIsBgModalOpen(true); };
                                    reader.readAsDataURL(file);
                                }
                                e.target.value = '';
                            }} />
                            <UploadCloud size={24} color="#94a3b8" />
                        </label>
                    </div>
                </div>
            </ReusableDesignAccordion>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)} style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>BASIC INFORMATION</div>
                    {isBasicInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
                {isBasicInfoOpen && (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>RESTAURANT NAME*</label><input type="text" value={businessInfo.title || ''} onChange={e => handleBusinessInfoUpdate('title', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1e293b', borderRadius: '4px' }} /></div>
                        <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>TITLE*</label><input type="text" value={businessInfo.headline || 'DOWNLOAD NOW'} onChange={e => handleBusinessInfoUpdate('headline', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1e293b', borderRadius: '4px' }} /></div>
                        <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>DESCRIPTION</label><textarea value={businessInfo.description || ''} onChange={e => handleBusinessInfoUpdate('description', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1e293b', borderRadius: '4px' }} /></div>
                        <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>WEBSITE*</label><input type="text" value={businessInfo.website || ''} onChange={e => handleBusinessInfoUpdate('website', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1e293b', borderRadius: '4px' }} /></div>
                        <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>NO OF TABLES*</label><input type="number" value={businessInfo.tables || ''} onChange={e => handleBusinessInfoUpdate('tables', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #1e293b', borderRadius: '4px' }} /></div>
                    </div>
                )}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>MENU</div>
                    {isMenuOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
                {isMenuOpen && (
                    <div style={{ padding: '1rem', background: '#faf9fc' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {categories.map((cat) => (
                                <div key={cat.id} style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: '#fff' }}>
                                    <div onClick={() => toggleCategory(cat.id)} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#000000' }}>
                                        {cat.name || 'New Category'}
                                        {openCategoryId === cat.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                    {openCategoryId === cat.id && (
                                        <div style={{ padding: '1rem' }}>
                                            <input type="text" value={cat.name} onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)} placeholder="Category Name" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                            {cat.products.map((prod, idx) => (
                                                <div key={prod.id} style={{ border: '1px solid #f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: '#f8fafc' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                        <input type="text" value={prod.name} placeholder="Product Name" onChange={(e) => handleProductChange(cat.id, prod.id, 'name', e.target.value)} style={{ flex: '1 1 150px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                                        <input type="text" value={prod.price} placeholder="Price" onChange={(e) => handleProductChange(cat.id, prod.id, 'price', e.target.value)} style={{ flex: '1 1 80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                                    </div>
                                                    <textarea value={prod.description} placeholder="Description" onChange={(e) => handleProductChange(cat.id, prod.id, 'description', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }} />
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        {prod.image && <img src={prod.image} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                                        <input type="file" onChange={(e) => handleProductImageUpload(cat.id, prod.id, e.target.files[0])} style={{ fontSize: '0.8rem' }} />
                                                        <button onClick={() => handleRemoveProduct(cat.id, prod.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => handleAddProduct(cat.id)} style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem' }}>+ Add Product</button>
                                            <button onClick={() => handleRemoveCategory(cat.id)} style={{ color: '#ef4444', float: 'right' }}>Remove Category</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddCategory} style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px' }}>+ Add Category</button>
                    </div>
                )}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div onClick={() => setIsTimingsOpen(!isTimingsOpen)} style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>TIMINGS</div>
                    {isTimingsOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
                {isTimingsOpen && (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
                            {['24 hrs', 'AM/PM'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => handleTimeFormatChange(f)}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        border: timeFormat === f ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        background: timeFormat === f ? '#fff' : '#fff',
                                        color: timeFormat === f ? '#8b5cf6' : '#94a3b8',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: timeFormat === f ? '0 4px 12px rgba(139, 92, 246, 0.15)' : 'none'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {timings.map((day, idx) => (
                                <div key={day.day} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div
                                            onClick={() => handleTimingChange(idx, 'isOpen', !day.isOpen)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '4px',
                                                border: `2px solid ${day.isOpen ? '#06b6d4' : '#e2e8f0'}`,
                                                background: day.isOpen ? '#06b6d4' : '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                flexShrink: 0
                                            }}
                                        >
                                            {day.isOpen && <Check size={16} color="#fff" strokeWidth={4} />}
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#475569', minWidth: '100px' }}>{day.day}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ position: 'relative', flex: '1 1 120px' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.25rem' }}>OPEN</label>
                                            <input
                                                type="text"
                                                value={day.start}
                                                disabled={!day.isOpen}
                                                onChange={(e) => handleTimingChange(idx, 'start', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    paddingRight: '2.5rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '0.9rem',
                                                    color: '#1e293b',
                                                    background: day.isOpen ? '#fff' : '#f8fafc',
                                                    outline: 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                                placeholder="08:00 AM"
                                            />
                                            <Clock size={16} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: 'calc(50% + 8px)', transform: 'translateY(-50%)', opacity: 0.6 }} />
                                        </div>

                                        <div style={{ position: 'relative', flex: '1 1 120px' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.25rem' }}>CLOSE</label>
                                            <input
                                                type="text"
                                                value={day.end}
                                                disabled={!day.isOpen}
                                                onChange={(e) => handleTimingChange(idx, 'end', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    paddingRight: '2.5rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '0.9rem',
                                                    color: '#1e293b',
                                                    background: day.isOpen ? '#fff' : '#f8fafc',
                                                    outline: 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                                placeholder="08:00 AM"
                                            />
                                            <Clock size={16} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: 'calc(50% + 8px)', transform: 'translateY(-50%)', opacity: 0.6 }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div onClick={() => setIsSocialOpen(!isSocialOpen)} style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>SOCIAL MEDIA</div>
                    {isSocialOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
                {isSocialOpen && (
                    <div style={{ padding: '1rem' }}>
                        {socials.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ background: getSocialColor(s.id), padding: '0.5rem', borderRadius: '4px', flexShrink: 0 }}>{getSocialIcon(s.id)}</div>
                                <input type="text" value={s.url} placeholder={s.placeholder} onChange={(e) => handleSocialChange(idx, e.target.value)} style={{ flex: '1 1 150px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                <button onClick={() => handleRemoveSocial(idx)} style={{ color: '#ef4444', marginLeft: 'auto' }}><X size={16} /></button>
                            </div>
                        ))}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                            {availableSocials.map(s => (
                                <div key={s.id} onClick={() => handleAddSocial(s.id)} style={{ width: '30px', height: '30px', borderRadius: '4px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: socials.find(as => as.id === s.id) ? 0.3 : 1 }}>
                                    <img src={s.icon} style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showImageModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowImageModal(false)}>
                    <img src={design.backgroundImage} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
                </div>
            )}

            <ImageUploadModal
                isOpen={isBgModalOpen}
                onClose={() => { setIsBgModalOpen(false); setTempBgImage(null); }}
                onSave={(url) => handleDesignSectionUpdate('backgroundImage', url)}
                tempImage={tempBgImage}
                fileName={bgFileName}
                type="image"
            />
        </div>
    );
};

export default MenuConfig;
