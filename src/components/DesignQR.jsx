import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Upload, X, ArrowRight, Check, Eye, UploadCloud } from 'lucide-react';
import FormSection from './FormSection';
import ColorPicker from './ColorPicker';

const DesignQR = ({
    design, setDesign, qrData, setQrData, onSave,
    qrName, setQrName, qrNameRef, qrNameError, setQrNameError,
    isGenerating, isEditing,
    password, setPassword,
    passwordExpiry, setPasswordExpiry,
    scanLimitEnabled, setScanLimitEnabled,
    scanLimit, setScanLimit
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    const currentLogoUrl = design?.image?.url;

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setDesign(prev => ({
                    ...prev,
                    image: { ...prev.image, url: reader.result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialLogoSelect = (social) => {
        setDesign(prev => ({
            ...prev,
            image: { ...prev.image, url: social.src }
        }));
    };

    const socialLogos = [
        { id: 'facebook', src: 'https://img.icons8.com/color/96/facebook-new.png', label: 'Facebook' },
        { id: 'instagram', src: 'https://img.icons8.com/fluency/96/instagram-new.png', label: 'Instagram' },
        { id: 'x', src: 'https://img.icons8.com/ios-filled/96/000000/twitterx.png', label: 'X' },
        { id: 'linkedin', src: 'https://img.icons8.com/color/96/linkedin.png', label: 'LinkedIn' },
        { id: 'discord', src: 'https://img.icons8.com/color/96/discord-logo-2.png', label: 'Discord' },
        { id: 'twitch', src: 'https://img.icons8.com/color/96/twitch.png', label: 'Twitch' },
        { id: 'kickstarter', src: 'https://img.icons8.com/color/96/kickstarter.png', label: 'Kickstarter' },
        { id: 'youtube', src: 'https://img.icons8.com/color/96/youtube-play.png', label: 'YouTube' },
        { id: 'whatsapp', src: 'https://img.icons8.com/color/96/whatsapp.png', label: 'WhatsApp' },
        { id: 'snapchat', src: 'https://img.icons8.com/color/96/snapchat-circled.png', label: 'Snapchat' },
        { id: 'tiktok', src: 'https://img.icons8.com/color/96/tiktok.png', label: 'TikTok' },
        { id: 'tumblr', src: 'https://img.icons8.com/color/96/tumblr.png', label: 'Tumblr' },
        { id: 'spotify', src: 'https://img.icons8.com/color/96/spotify.png', label: 'Spotify' },
        { id: 'dribbble', src: 'https://img.icons8.com/color/96/dribbble.png', label: 'Dribbble' },
        { id: 'pinterest', src: 'https://img.icons8.com/color/96/pinterest.png', label: 'Pinterest' },
        { id: 'telegram', src: 'https://img.icons8.com/color/96/telegram-app.png', label: 'Telegram' },
        { id: 'behance', src: 'https://img.icons8.com/color/96/behance.png', label: 'Behance' },
        { id: 'reddit', src: 'https://img.icons8.com/color/96/reddit.png', label: 'Reddit' },
        { id: 'web', src: 'https://img.icons8.com/color/96/internet.png', label: 'Web' },
    ];

    return (
        <div style={{ padding: '1rem', width: '100%', boxSizing: 'border-box' }}>


            {/* SHAPE & COLOR */}
            <FormSection title="SHAPE & COLOR" defaultOpen={true}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Body Patterns */}
                    <div>
                        <label className="label" style={{ marginBottom: '1rem', display: 'block', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem' }}>BODY PATTERNS</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {[
                                { id: 'square', svg: <rect x="2" y="2" width="46" height="46" fill="currentColor" /> },
                                { id: 'dots', svg: <><circle cx="12" cy="12" r="6" fill="currentColor" /><circle cx="38" cy="12" r="6" fill="currentColor" /><circle cx="12" cy="38" r="6" fill="currentColor" /><circle cx="38" cy="38" r="6" fill="currentColor" /></> },
                                { id: 'classy', svg: <path d="M25 2L48 25L25 48L2 25Z" fill="currentColor" /> },
                                { id: 'rounded', svg: <rect x="2" y="2" width="46" height="46" rx="12" fill="currentColor" /> },
                                { id: 'extra-rounded', svg: <rect x="2" y="2" width="46" height="46" rx="23" fill="currentColor" /> },
                            ].map((p, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setDesign(prev => ({ ...prev, dots: { ...prev.dots, style: p.id } }))}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        border: design?.dots?.style === p.id ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fff',
                                        color: '#000',
                                        padding: '8px'
                                    }}
                                >
                                    <svg viewBox="0 0 50 50" width="100%" height="100%">
                                        {p.svg}
                                    </svg>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed #e2e8f0', margin: '1.5rem 0' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Pattern Color</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                background: '#fff',
                                width: '100%',
                                maxWidth: '200px',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{design?.dots?.color || '#000000'}</span>
                                <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                                    <input
                                        type="color"
                                        value={design?.dots?.color || '#000000'}
                                        onChange={(e) => setDesign(prev => ({ ...prev, dots: { ...prev.dots, color: e.target.value } }))}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: design?.dots?.color || '#000000',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '0' }}></div>

                    {/* Eye Frame (Outer Square) */}
                    <div>
                        <label className="label" style={{ marginBottom: '1rem', display: 'block', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem' }}>EYE FRAME (OUTER SQUARE)</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {[
                                { id: 'circle', svg: <circle cx="25" cy="25" r="21.5" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'square', svg: <rect x="3.5" y="3.5" width="43" height="43" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                {
                                    id: 'dashed', svg: <>
                                        <path d="M3.5 3.5 h15 v7 h-8 v8 h-7 v-15 z" fill="currentColor" />
                                        <path d="M46.5 3.5 h-15 v7 h8 v8 h7 v-15 z" fill="currentColor" />
                                        <path d="M3.5 46.5 h15 v-7 h-8 v-8 h-7 v15 z" fill="currentColor" />
                                        <path d="M46.5 46.5 h-15 v-7 h8 v-8 h7 v15 z" fill="currentColor" />
                                    </>
                                },
                                { id: 'rounded', svg: <rect x="3.5" y="3.5" width="43" height="43" rx="12" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'leaf-top-right', svg: <path d="M3.5 23.5 A20 20 0 0 1 23.5 3.5 L46.5 3.5 L46.5 26.5 A20 20 0 0 1 26.5 46.5 L23.5 46.5 A20 20 0 0 1 3.5 26.5 Z" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'leaf-top-left', svg: <path d="M3.5 3.5 L26.5 3.5 A20 20 0 0 1 46.5 23.5 L46.5 26.5 A20 20 0 0 1 26.5 46.5 L23.5 46.5 A20 20 0 0 1 3.5 26.5 Z" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'leaf-bottom-right', svg: <path d="M3.5 23.5 A20 20 0 0 1 23.5 3.5 L26.5 3.5 A20 20 0 0 1 46.5 23.5 L46.5 46.5 L23.5 46.5 A20 20 0 0 1 3.5 26.5 Z" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'leaf-bottom-left', svg: <path d="M23.5 3.5 A20 20 0 0 1 43.5 23.5 L43.5 26.5 A20 20 0 0 1 23.5 46.5 L3.5 46.5 L3.5 23.5 A20 20 0 0 1 23.5 3.5 Z" stroke="currentColor" strokeWidth="7" fill="none" /> },
                                { id: 'dot-frame', svg: <><rect x="3.5" y="3.5" width="43" height="43" stroke="currentColor" strokeWidth="7" fill="none" /><circle cx="25" cy="25" r="7" fill="currentColor" /></> },
                            ].map((f, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setDesign(prev => ({ ...prev, cornersSquare: { ...prev.cornersSquare, style: f.id } }))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: design?.cornersSquare?.style === f.id ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fff',
                                        color: '#000',
                                        padding: '6px'
                                    }}
                                >
                                    <svg viewBox="0 0 50 50" width="100%" height="100%">
                                        {f.svg}
                                    </svg>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed #e2e8f0', margin: '1rem 0' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Frame Color</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                background: '#fff',
                                width: '100%',
                                maxWidth: '200px',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{design?.cornersSquare?.color || design?.dots?.color || '#000000'}</span>
                                <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                                    <input
                                        type="color"
                                        value={design?.cornersSquare?.color || design?.dots?.color || '#000000'}
                                        onChange={(e) => setDesign(prev => ({ ...prev, cornersSquare: { ...prev.cornersSquare, color: e.target.value } }))}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: design?.cornersSquare?.color || design?.dots?.color || '#000000',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '0' }}></div>

                    {/* Eye Ball (Inner Dot) */}
                    <div>
                        <label className="label" style={{ marginBottom: '1rem', display: 'block', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem' }}>EYE BALL (INNER DOT)</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {[
                                { id: 'dot', svg: <circle cx="25" cy="25" r="17" fill="currentColor" /> },
                                { id: 'square', svg: <rect x="9" y="9" width="32" height="32" fill="currentColor" /> },
                                { id: 'rounded', svg: <rect x="9" y="9" width="32" height="32" rx="10" fill="currentColor" /> },
                                { id: 'leaf-diag-1', svg: <path d="M25 9 L41 9 L41 25 A16 16 0 0 1 25 41 L9 41 L9 25 A16 16 0 0 1 25 9 Z" fill="currentColor" /> },
                                { id: 'leaf-diag-2', svg: <path d="M9 25 L9 9 L25 9 A16 16 0 0 1 41 25 L41 41 L25 41 A16 16 0 0 1 9 25 Z" fill="currentColor" /> },
                                { id: 'teardrop-tl', svg: <path d="M9 25 L9 9 L25 9 A16 16 0 0 1 41 25 A16 16 0 0 1 25 41 A16 16 0 0 1 9 25 Z" fill="currentColor" /> },
                                { id: 'diamond', svg: <path d="M25 5 L45 25 L25 45 L5 25 Z" fill="currentColor" /> },
                                { id: 'star', svg: <path d="M25 8 L30 18 L41 19 L32 26 L35 37 L25 31 L15 37 L18 26 L9 19 L20 18 Z" fill="currentColor" /> },
                                { id: 'plus', svg: <path d="M18 5 L32 5 L32 18 L45 18 L45 32 L32 32 L32 45 L18 45 L18 32 L5 32 L5 18 L18 18 Z" fill="currentColor" /> },
                                { id: 'cross', svg: <path d="M15 10 L25 5 L35 15 L30 25 L40 35 L35 40 L25 30 L15 40 L10 35 L20 25 L10 15 L15 10 Z" fill="currentColor" /> },
                            ].map((b, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setDesign(prev => ({ ...prev, cornersDot: { ...prev.cornersDot, style: b.id } }))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: design?.cornersDot?.style === b.id ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fff',
                                        color: '#000',
                                        padding: '6px'
                                    }}
                                >
                                    <svg viewBox="0 0 50 50" width="100%" height="100%">
                                        {b.svg}
                                    </svg>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed #e2e8f0', margin: '1rem 0' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Ball Color</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                background: '#fff',
                                width: '100%',
                                maxWidth: '200px',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{design?.cornersDot?.color || design?.dots?.color || '#000000'}</span>
                                <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                                    <input
                                        type="color"
                                        value={design?.cornersDot?.color || design?.dots?.color || '#000000'}
                                        onChange={(e) => setDesign(prev => ({ ...prev, cornersDot: { ...prev.cornersDot, color: e.target.value } }))}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: design?.cornersDot?.color || design?.dots?.color || '#000000',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '0' }}></div>

                    {/* Background Color */}
                    <div>
                        <label className="label" style={{ marginBottom: '1rem', display: 'block', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem' }}>BACKGROUND COLOR</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Background Color</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                background: '#fff',
                                width: '100%',
                                maxWidth: '200px',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{design?.background?.color || '#ffffff'}</span>
                                <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                                    <input
                                        type="color"
                                        value={design?.background?.color || '#ffffff'}
                                        onChange={(e) => setDesign(prev => ({ ...prev, background: { ...prev.background, color: e.target.value } }))}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: design?.background?.color || '#ffffff',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FormSection>


            {/* SELECT A LOGO */}
            <FormSection title="SELECT A LOGO">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Upload Section */}
                    <div style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isHovered ? '#f8fafc' : '#ffffff'
                    }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleLogoUpload}
                        />

                        {design?.image?.url ? (
                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
                                <img
                                    src={design.image.url}
                                    alt="Uploaded Logo"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDesign(prev => ({ ...prev, image: { ...prev.image, url: null } }));
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        background: '#ef4444',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <X size={14} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: '#eff6ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: '#3b82f6'
                                }}>
                                    <Upload size={28} />
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                                    Upload your custom logo
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Supported formats: PNG, JPG, SVG
                                </div>
                            </>
                        )}
                    </div>

                    {/* Social Logos Grid */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                            OR CHOOSE FROM PRESETS
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '1rem' }}>
                            {socialLogos.map((social) => (
                                <div
                                    key={social.id}
                                    onClick={() => handleSocialLogoSelect(social)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        border: design?.image?.url === social.src ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#fff',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    <img src={social.src} alt={social.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    {design?.image?.url === social.src && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            right: '-6px',
                                            background: '#3b82f6',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px'
                                        }}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Remove Background Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <div
                            onClick={() => setDesign(prev => ({
                                ...prev,
                                imageOptions: { ...prev.imageOptions, hideBackgroundDots: !prev.imageOptions?.hideBackgroundDots }
                            }))}
                            style={{
                                width: '44px',
                                height: '24px',
                                background: design?.imageOptions?.hideBackgroundDots ? '#3b82f6' : '#cbd5e1',
                                borderRadius: '12px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: design?.imageOptions?.hideBackgroundDots ? '22px' : '2px',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}></div>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>Remove Background Behind Logo</span>
                    </div>

                    {/* Logo Size Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>Logo Size</label>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{Math.round((design?.imageOptions?.imageSize || 0.4) * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="0.5"
                            step="0.05"
                            value={design?.imageOptions?.imageSize || 0.4}
                            onChange={(e) => setDesign(prev => ({
                                ...prev,
                                imageOptions: { ...prev.imageOptions, imageSize: parseFloat(e.target.value) }
                            }))}
                            style={{
                                width: '100%',
                                height: '6px',
                                background: '#e2e8f0',
                                borderRadius: '3px',
                                outline: 'none',
                                cursor: 'pointer',
                                accentColor: '#3b82f6'
                            }}
                        />
                    </div>
                </div>
            </FormSection>

            {/* ADVANCED SETTINGS */}
            <FormSection title="ADVANCED SETTINGS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Password Protection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>PASSWORD PROTECTION</label>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Require a password to access content</div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="......"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #94a3b8',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: '#94a3b8'
                                }}
                            >
                                {showPassword ? <Eye size={18} /> : <Eye size={18} style={{ opacity: 0.7 }} />}
                            </div>
                        </div>
                    </div>

                    {/* Password Expiry */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>PASSWORD EXPIRY</label>
                        <input
                            type="date"
                            value={passwordExpiry}
                            onChange={(e) => setPasswordExpiry(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #000',
                                borderRadius: '6px',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Scan Limit */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>SCAN LIMIT</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div
                                onClick={() => setScanLimitEnabled(!scanLimitEnabled)}
                                style={{
                                    width: '36px',
                                    height: '20px',
                                    background: scanLimitEnabled ? '#7c3aed' : '#cbd5e1',
                                    borderRadius: '10px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: scanLimitEnabled ? '18px' : '2px',
                                    transition: 'left 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}></div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#000' }}>Limit number of times this coupon can be used</span>
                        </div>
                        {scanLimitEnabled && (
                            <input
                                type="number"
                                value={scanLimit}
                                onChange={(e) => setScanLimit(e.target.value)}
                                placeholder="10"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #000',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                        )}
                    </div>
                </div>
            </FormSection>

            {/* QR NAME */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>QR Code Name</label>
                <input
                    ref={qrNameRef}
                    type="text"
                    value={qrName}
                    onChange={(e) => {
                        setQrName(e.target.value);
                        if (qrNameError) setQrNameError('');
                    }}
                    placeholder="Enter QR name..."
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${qrNameError ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxShadow: qrNameError ? '0 0 0 1px #ef4444' : 'none'
                    }}
                />
                {qrNameError && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: '500' }}>
                        {qrNameError}
                    </p>
                )}
            </div>

            {/* SAVE BUTTON */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={onSave}
                    disabled={isGenerating}
                    style={{
                        background: isGenerating ? '#e2e8f0' : 'linear-gradient(to right, #6366f1, #8b5cf6)',
                        color: isGenerating ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        padding: '0.875rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.95rem',
                        width: 'auto',
                        minWidth: '200px'
                    }}
                >
                    {isGenerating ? 'Saving...' : (isEditing ? 'Update QR Code' : 'Save QR Code')}
                    {!isGenerating && <ArrowRight size={18} />}
                </button>
            </div>
        </div>
    );
};

export default DesignQR;
