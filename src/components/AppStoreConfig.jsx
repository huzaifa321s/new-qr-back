import React, { useState, useEffect } from 'react';
import FormSection from './FormSection';
import ColorPicker from './ColorPicker';
import FileUploader from './FileUploader';
import ImageUploadModal from './ImageUploadModal';
import { ChevronDown, ChevronUp, Upload, Calendar, Image as ImageIcon, Video, UploadCloud, X, Check, Eye } from 'lucide-react';
import axios from 'axios';

const AppStoreConfig = ({ config, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // State for logo upload modal
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [tempLogoImage, setTempLogoImage] = useState(null);
    const [logoFileName, setLogoFileName] = useState('');

    // Helper to update nested state
    const updateConfig = (path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();

        // Deep clone to avoid mutation and ensure re-renders
        const newConfig = JSON.parse(JSON.stringify(config));

        let pointer = newConfig;
        for (const key of keys) {
            if (!pointer[key]) pointer[key] = {};
            pointer = pointer[key];
        }
        pointer[lastKey] = value;
        onChange(newConfig);
    };

    // Helper to get nested value
    const getValue = (path) => {
        return path.split('.').reduce((obj, key) => obj?.[key], config) || '';
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // You might want to add a loading state here if needed
        try {
            const formData = new FormData();
            formData.append('video', file);

            const res = await axios.post('http://localhost:3000/api/upload/video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateConfig('appStatus.fileUrl', res.data.url);
        } catch (err) {
            console.error('Video upload failed:', err);
            alert('Video upload failed');
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* DESIGN Section */}
            <FormSection title="DESIGN" defaultOpen={true}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Colors */}
                    <div>
                        <label className="label" style={{ marginBottom: '1rem', display: 'block', color: '#8b5cf6', fontWeight: '600', fontSize: '0.9rem' }}>COLORS</label>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                            {/* Preset Color Palettes */}
                            {[
                                { primary: '#0f3485', secondary: '#ff9500', name: 'Blue Orange' },
                                { primary: '#facc15', secondary: '#fef08a', name: 'Yellow' },
                                { primary: '#8b5cf6', secondary: '#c4b5fd', name: 'Purple' },
                                { primary: '#22c55e', secondary: '#86efac', name: 'Green' },
                                { primary: '#06b6d4', secondary: '#67e8f9', name: 'Cyan' }
                            ].map((palette, idx) => {
                                const isSelected = getValue('design.color.dark') === palette.primary;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            const newConfig = JSON.parse(JSON.stringify(config));
                                            newConfig.design = newConfig.design || {};
                                            newConfig.design.color = newConfig.design.color || {};
                                            newConfig.design.color.dark = palette.primary;
                                            newConfig.design.color.light = palette.secondary;
                                            onChange(newConfig);
                                        }}
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(to bottom, ${palette.primary} 65%, ${palette.secondary} 65%)`,
                                            cursor: 'pointer',
                                            border: '3px solid #fff',
                                            boxShadow: isSelected
                                                ? '0 0 0 2px #8b5cf6, 0 4px 12px rgba(139, 92, 246, 0.3)'
                                                : '0 2px 8px rgba(0,0,0,0.1), 0 0 0 1px #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'all 0.2s',
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    >
                                        {isSelected && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                left: '-6px',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#8b5cf6',
                                                border: '2px solid #fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                zIndex: 10
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 150px' }}>
                                <ColorPicker
                                    label="Primary Color"
                                    color={getValue('design.color.dark') || '#0f3485'}
                                    onChange={(c) => {
                                        updateConfig('design.color.dark', c);
                                    }}
                                />
                            </div>
                            <div style={{ flex: '1 1 150px' }}>
                                <ColorPicker
                                    label="Secondary Color"
                                    color={getValue('design.color.light') || '#ff9500'}
                                    onChange={(c) => {
                                        updateConfig('design.color.light', c);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo Section */}
                    <div>
                        <label className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>LOGO</label>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>128x128px, 1:1 Ratio</div>
                        {(() => {
                            const currentUrl = getValue('design.logo.url');
                            const presets = [
                                { id: 'app1', url: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=150&h=150&fit=crop' },
                                { id: 'app2', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop' },
                                { id: 'app3', url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=150&h=150&fit=crop' },
                                { id: 'app4', url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150&h=150&fit=crop' }
                            ];
                            const isPreset = presets.some(p => p.url === currentUrl);

                            return (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {/* 1. Remove Button */}
                                    <button
                                        onClick={() => updateConfig('design.logo.url', '')}
                                        style={{
                                            minWidth: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            border: '1px solid #e2e8f0',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#94a3b8',
                                            transition: 'all 0.2s',
                                            flexShrink: 0
                                        }}
                                        title="Remove Logo"
                                        type="button"
                                    >
                                        <X size={32} strokeWidth={1} />
                                    </button>

                                    {/* 2. Presets */}
                                    {presets.map((item) => {
                                        const isSelected = currentUrl === item.url;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => updateConfig('design.logo.url', item.url)}
                                                style={{
                                                    minWidth: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#f8fafc',
                                                    flexShrink: 0,
                                                    position: 'relative',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <img
                                                    src={item.url}
                                                    alt="Preset Logo"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                {isSelected && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: '#8b5cf6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* 3. Custom Selection */}
                                    {currentUrl && !isPreset && (
                                        <div
                                            style={{
                                                minWidth: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '3px solid #8b5cf6',
                                                position: 'relative',
                                                flexShrink: 0,
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <img src={currentUrl} alt="Custom Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                            {/* Hover Overlay */}
                                            {isHovered && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0, 0, 0, 0.5)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 10
                                                }}>
                                                    <Eye size={20} color="#fff" />
                                                    <span style={{ color: '#fff', fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>Preview</span>
                                                </div>
                                            )}

                                            <div style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#8b5cf6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. Upload Button */}
                                    <label style={{
                                        minWidth: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        border: '2px dashed #cbd5e1',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748b',
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }} title="Upload Logo">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setLogoFileName(file.name);
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        setTempLogoImage(event.target?.result);
                                                        setIsLogoModalOpen(true);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                                e.target.value = null;
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                        <UploadCloud size={24} />
                                    </label>
                                </div>
                            );
                        })()}

                        {/* Logo Upload/Edit Modal */}
                        <ImageUploadModal
                            isOpen={isLogoModalOpen}
                            onClose={() => {
                                setIsLogoModalOpen(false);
                                setTempLogoImage(null);
                            }}
                            onSave={(url) => updateConfig('design.logo.url', url)}
                            tempImage={tempLogoImage}
                            fileName={logoFileName}
                            type="logo"
                        />

                        {/* Modal for Custom Logo Preview */}
                        {isModalOpen && getValue('design.logo.url') && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 9999
                                }}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) setIsModalOpen(false);
                                }}
                            >
                                <div style={{
                                    background: '#fff',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            right: '-12px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                    <img
                                        src={getValue('design.logo.url')}
                                        alt="Full Logo Check"
                                        style={{
                                            maxWidth: '400px',
                                            maxHeight: '400px',
                                            objectFit: 'contain',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </FormSection>

            {/* BASIC INFORMATION Section */}
            <FormSection title="BASIC INFORMATION">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* App Name */}
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <label className="label">APP NAME*</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                <input
                                    type="color"
                                    value={getValue('businessInfo.titleColor') || '#000000'}
                                    onChange={(e) => updateConfig('businessInfo.titleColor', e.target.value)}
                                    style={{ width: '30px', height: '30px', padding: 0, border: 'none', background: 'none' }}
                                />
                                <select
                                    className="input"
                                    style={{ width: '80px', padding: '0.25rem' }}
                                    value={getValue('businessInfo.titleFont') || 'Lato'}
                                    onChange={(e) => updateConfig('businessInfo.titleFont', e.target.value)}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Work Sans">Work Sans</option>
                                </select>
                            </div>
                        </div>
                        <input
                            className="input"
                            value={getValue('businessInfo.title')}
                            onChange={(e) => updateConfig('businessInfo.title', e.target.value)}
                            placeholder="Techoid Bank"
                        />
                    </div>

                    {/* Detail */}
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <label className="label">DETAIL</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                <input
                                    type="color"
                                    value={getValue('businessInfo.subtitleColor') || '#4b5563'}
                                    onChange={(e) => updateConfig('businessInfo.subtitleColor', e.target.value)}
                                    style={{ width: '30px', height: '30px', padding: 0, border: 'none', background: 'none' }}
                                />
                                <select
                                    className="input"
                                    style={{ width: '80px', padding: '0.25rem' }}
                                    value={getValue('businessInfo.subtitleFont') || 'Lato'}
                                    onChange={(e) => updateConfig('businessInfo.subtitleFont', e.target.value)}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Work Sans">Work Sans</option>
                                </select>
                            </div>
                        </div>
                        <input
                            className="input"
                            value={getValue('businessInfo.subtitle')}
                            onChange={(e) => updateConfig('businessInfo.subtitle', e.target.value)}
                            placeholder="Technician name"
                        />
                    </div>

                    {/* Title (Call to Action) */}
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <label className="label">TITLE*</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                <input
                                    type="color"
                                    value={getValue('businessInfo.ctaColor') || '#000000'}
                                    onChange={(e) => updateConfig('businessInfo.ctaColor', e.target.value)}
                                    style={{ width: '30px', height: '30px', padding: 0, border: 'none', background: 'none' }}
                                />
                                <select
                                    className="input"
                                    style={{ width: '80px', padding: '0.25rem' }}
                                    value={getValue('businessInfo.ctaFont') || 'Lato'}
                                    onChange={(e) => updateConfig('businessInfo.ctaFont', e.target.value)}
                                >
                                    <option value="Lato">Lato</option>
                                    <option value="Work Sans">Work Sans</option>
                                </select>
                            </div>
                        </div>
                        <input
                            className="input"
                            value={getValue('businessInfo.cta') || 'DOWNLOAD NOW'}
                            onChange={(e) => updateConfig('businessInfo.cta', e.target.value)}
                            placeholder="Download Now"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="label">DESCRIPTION</label>
                        <textarea
                            className="input"
                            rows={4}
                            value={getValue('businessInfo.description')}
                            onChange={(e) => updateConfig('businessInfo.description', e.target.value)}
                            placeholder="Control all your finances easily and quickly."
                        />
                    </div>

                    {/* Website */}
                    <div className="form-group">
                        <label className="label">WEBSITE</label>
                        <input
                            className="input"
                            value={getValue('businessInfo.website') || 'https://www.techoid.com'}
                            onChange={(e) => updateConfig('businessInfo.website', e.target.value)}
                            placeholder="https://www.techoid.com"
                        />
                    </div>
                </div>
            </FormSection>

            {/* APP LINKS Section */}
            <FormSection title="APP LINKS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Button Type */}
                    <div className="form-group">
                        <label className="label">BUTTON TYPE</label>
                        <div style={{ display: 'flex', gap: '1rem 2rem', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#1e293b', fontWeight: '500' }}>
                                <input
                                    type="radio"
                                    name="buttonType"
                                    checked={getValue('appLinks.buttonType') === 'rectangular'}
                                    onChange={() => updateConfig('appLinks.buttonType', 'rectangular')}
                                    style={{ accentColor: '#8b5cf6' }}
                                />
                                Rectangular
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#1e293b', fontWeight: '500' }}>
                                <input
                                    type="radio"
                                    name="buttonType"
                                    checked={getValue('appLinks.buttonType') === 'circular'}
                                    onChange={() => updateConfig('appLinks.buttonType', 'circular')}
                                    style={{ accentColor: '#8b5cf6' }}
                                />
                                Circular
                            </label>
                        </div>
                    </div>

                    {/* Play Store */}
                    <div className="form-group">
                        <label className="label">Play Store</label>
                        {getValue('appLinks.google') ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    className="input"
                                    value={getValue('appLinks.google')}
                                    onChange={(e) => updateConfig('appLinks.google', e.target.value)}
                                    placeholder="https://"
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    onClick={() => updateConfig('appLinks.google', '')}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '4px'
                                    }}
                                    title="Remove link"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => updateConfig('appLinks.google', 'https://')}
                                style={{
                                    background: '#8b5cf6',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem'
                                }}
                            >
                                + Add Play Store
                            </button>
                        )}
                    </div>

                    {/* App Store */}
                    <div className="form-group">
                        <label className="label">App Store</label>
                        {getValue('appLinks.apple') ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    className="input"
                                    value={getValue('appLinks.apple')}
                                    onChange={(e) => updateConfig('appLinks.apple', e.target.value)}
                                    placeholder="https://"
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    onClick={() => updateConfig('appLinks.apple', '')}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '4px'
                                    }}
                                    title="Remove link"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => updateConfig('appLinks.apple', 'https://')}
                                style={{
                                    background: '#8b5cf6',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem'
                                }}
                            >
                                + Add App Store
                            </button>
                        )}
                    </div>
                </div>
            </FormSection>

            {/* APP STATUS Section */}
            <FormSection title="APP STATUS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Launch Date */}
                    <div className="form-group">
                        <label className="label">LAUNCH DATE</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                className="input"
                                value={getValue('appStatus.launchDate')}
                                onChange={(e) => updateConfig('appStatus.launchDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type (Image/Video) */}
                    <div className="form-group">
                        <label className="label">TYPE</label>
                        <div style={{ display: 'flex', gap: '1rem 2rem', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#1e293b', fontWeight: '500' }}>
                                <input
                                    type="radio"
                                    name="statusType"
                                    checked={getValue('appStatus.type') === 'image'}
                                    onChange={() => updateConfig('appStatus.type', 'image')}
                                    style={{ accentColor: '#8b5cf6' }}
                                />
                                Image
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#1e293b', fontWeight: '500' }}>
                                <input
                                    type="radio"
                                    name="statusType"
                                    checked={getValue('appStatus.type') === 'video'}
                                    onChange={() => updateConfig('appStatus.type', 'video')}
                                    style={{ accentColor: '#8b5cf6' }}
                                />
                                Video
                            </label>
                        </div>
                    </div>

                    {/* File Upload / Video Input */}
                    {getValue('appStatus.type') === 'video' ? (
                        <div className="form-group">
                            <label className="label">UPLOAD VIDEO*</label>

                            {/* URL Input */}
                            <input
                                className="input"
                                value={getValue('appStatus.fileUrl') || ''}
                                onChange={(e) => updateConfig('appStatus.fileUrl', e.target.value)}
                                placeholder="Paste URL of your Video"
                                style={{ marginBottom: '1rem' }}
                            />

                            <div style={{ textAlign: 'center', margin: '0.5rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>OR</div>

                            {/* Upload Button */}
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                padding: '0.75rem',
                                background: '#8b5cf6',
                                color: '#fff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                <UploadCloud size={20} />
                                Upload/ Choose Video from your Computer
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                                10MB max Video size
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <FileUploader
                                label="Drag file here or browse"
                                type="status"
                                currentFile={getValue('appStatus.fileUrl')}
                                onUpload={(url) => updateConfig('appStatus.fileUrl', url)}
                            />
                        </div>
                    )}
                </div>
            </FormSection>

        </div>
    );
};

export default AppStoreConfig;
