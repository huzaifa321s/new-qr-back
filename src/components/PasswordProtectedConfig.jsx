import { ChevronDown, ChevronUp, RefreshCw, UploadCloud, X, Check, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import ImageUploadModal from './ImageUploadModal';

const PasswordProtectedConfig = ({ config, onChange }) => {
    const [isDesignOpen, setIsDesignOpen] = useState(true);

    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadModalTempImage, setUploadModalTempImage] = useState(null);
    const [uploadModalFileName, setUploadModalFileName] = useState('');
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const fileInputRef = useRef(null);

    const design = config.design || {};
    const infoFields = config.infoFields || [
        { id: '1', name: 'Name', value: 'Hellen Grey' },
        { id: '2', name: 'Address', value: '4059 Carling Avenue Ottawa Ontario' },
        { id: '3', name: 'Contact', value: '703-701-9964' },
        { id: '4', name: 'Bank Account', value: '9647037019964' }
    ];

    // Default colors from screenshot
    const primaryColor = design.color?.header || '#01392C';
    const secondaryColor = design.color?.light || '#FFFFFF';

    // Handler functions
    const handleDesignUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            design: { ...prev.design, [key]: value }
        }));
    };

    const handleFieldUpdate = (id, key, value) => {
        const newFields = infoFields.map(field =>
            field.id === id ? { ...field, [key]: value } : field
        );
        onChange(prev => ({ ...prev, infoFields: newFields }));
    };

    const handleAddField = () => {
        const newField = { id: Date.now().toString(), name: '', value: '' };
        onChange(prev => ({ ...prev, infoFields: [...infoFields, newField] }));
    };

    const handleRemoveField = (id) => {
        const newFields = infoFields.filter(field => field.id !== id);
        onChange(prev => ({ ...prev, infoFields: newFields }));
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

    // Correctly mapping primary/secondary to checking against header/light mostly
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

    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadModalFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadModalTempImage(reader.result);
                setIsUploadModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null;
    };

    const handleCropComplete = (croppedImageUrl) => {
        handleHeaderImageUpdate(croppedImageUrl);
        setIsUploadModalOpen(false);
        setUploadModalTempImage(croppedImageUrl);
    };

    const palettes = [
        { p: '#0B2D86', s: '#FFA800' },
        { p: '#FFFF00', s: '#FFFFE0' },
        { p: '#8B5CF6', s: '#C4B5FD' },
        { p: '#16A34A', s: '#86EFAC' },
        { p: '#06B6D4', s: '#67E8F9' }
    ];

    // Placeholder images matching the visual style of reference roughly
    const headerOptions = [
        { id: 'h1', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&h=100&fit=crop' }, // Blue doodle ish
        { id: 'h2', url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=150&h=100&fit=crop' }, // Pattern dots
        { id: 'h3', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=100&fit=crop' }, // Sketch/Cartoon
        { id: 'h4', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&h=100&fit=crop' }, // Red pattern
        { id: 'h5', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop' }, // Digital check/Security (Selected)
        { id: 'h6', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&h=100&fit=crop' }  // Digital art
    ];

    return (
        <div>
            {/* DESIGN ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsDesignOpen(!isDesignOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isDesignOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>DESIGN</div>
                    </div>
                    {isDesignOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isDesignOpen && (
                    <div style={{ padding: '2rem', background: '#fff' }}>

                        {/* COLORS SECTION */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                COLORS
                            </label>

                            {/* Color Palettes */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                {palettes.map((palette, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleColorPaletteClick(palette.p, palette.s)}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: (primaryColor === palette.p && secondaryColor === palette.s) ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
                                            position: 'relative',
                                            background: `linear-gradient(180deg, ${palette.p} 50%, ${palette.s} 50%)`
                                        }}
                                    >
                                        {(primaryColor === palette.p && secondaryColor === palette.s) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '24px',
                                                height: '24px',
                                                background: '#8b5cf6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #fff'
                                            }}>
                                                <Check size={14} color="#fff" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div style={{
                                position: 'relative',
                                height: '1px',
                                background: 'none',
                                borderTop: '1px dashed #e2e8f0',
                                margin: '2rem 0'
                            }}></div>

                            {/* Primary and Secondary Color Inputs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                                {/* Primary Color */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Primary Color
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
                                            value={primaryColor}
                                            onChange={(e) => handleColorUpdate('header', e.target.value)}
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
                                            background: primaryColor,
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => handleColorUpdate('header', e.target.value)}
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

                                {/* Swap Icon */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '1.5rem'
                                }}>
                                    <div
                                        onClick={() => handleColorPaletteClick(secondaryColor, primaryColor)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '4px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            background: '#fff'
                                        }}
                                    >
                                        <RefreshCw size={18} color="#64748b" />
                                    </div>
                                </div>

                                {/* Secondary Color */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        Secondary Color
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
                                            value={secondaryColor}
                                            onChange={(e) => handleColorUpdate('light', e.target.value)}
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
                                            background: secondaryColor,
                                            borderRadius: '2px',
                                            flexShrink: 0,
                                            border: '1px solid #e2e8f0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="color"
                                                value={secondaryColor}
                                                onChange={(e) => handleColorUpdate('light', e.target.value)}
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
                            </div>
                        </div>

                        {/* HEADER IMAGE SECTION */}
                        <div style={{ marginBottom: '0' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>
                                    HEADER IMAGE
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                    Minimum width : 400px, 3:2 Ratio
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Remove/Clear Option */}
                                <div
                                    onClick={() => handleHeaderImageUpdate('')}
                                    style={{
                                        width: '80px',
                                        height: '60px',
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

                                {/* Image Options */}
                                {headerOptions.map(img => (
                                    <div
                                        key={img.id}
                                        onClick={() => handleHeaderImageUpdate(img.url)}
                                        style={{
                                            width: '80px',
                                            height: '60px',
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
                                                top: '-6px',
                                                right: '-6px',
                                                width: '20px',
                                                height: '20px',
                                                background: '#8b5cf6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #fff',
                                                zIndex: 10
                                            }}>
                                                <Check size={12} color="#fff" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Upload Option */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />
                                <div
                                    onMouseEnter={() => setIsHoveringUpload(true)}
                                    onMouseLeave={() => setIsHoveringUpload(false)}
                                    onClick={handleImageUpload}
                                    style={{
                                        width: '80px',
                                        height: '60px',
                                        borderRadius: '4px',
                                        border: design.headerImage?.url && !headerOptions.some(opt => opt.url === design.headerImage?.url) ? '2px solid #8b5cf6' : '1px dashed #cbd5e1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        background: '#fff',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {design.headerImage?.url && !headerOptions.some(opt => opt.url === design.headerImage?.url) ? (
                                        <>
                                            <img src={design.headerImage.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {isHoveringUpload && (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowPreviewModal(true);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(0,0,0,0.4)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    VIEW
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <UploadCloud size={20} color="#94a3b8" />
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* ENTER INFORMATION ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isInfoOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>ENTER INFORMATION</div>
                    </div>
                    {isInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isInfoOpen && (
                    <div style={{ padding: '2rem', background: '#fff' }}>

                        {infoFields.map((field) => (
                            <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'end' }}>
                                {/* Field Name Input */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        FIELD NAME*
                                    </label>
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => handleFieldUpdate(field.id, 'name', e.target.value)}
                                        placeholder="Name"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #1e293b',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            fontWeight: 'bold',
                                            color: '#000'
                                        }}
                                    />
                                </div>

                                {/* Field Info Input & Delete */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            FIELD INFORMATION*
                                        </label>
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => handleFieldUpdate(field.id, 'value', e.target.value)}
                                            placeholder="Information"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '4px',
                                                border: '1px solid #1e293b',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                fontWeight: '500',
                                                color: '#000'
                                            }}
                                        />
                                    </div>
                                    <div
                                        onClick={() => handleRemoveField(field.id)}
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

                        {/* Add More Fields Button */}
                        <button
                            onClick={handleAddField}
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
                            Add More Fields
                        </button>

                    </div>
                )}
            </div>

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                tempImage={uploadModalTempImage}
                onSave={handleCropComplete}
                aspect={3 / 2}
                type="image"
                fileName={uploadModalFileName}
            />

            {/* Full Image Preview Modal */}
            {showPreviewModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}
                    onClick={() => setShowPreviewModal(false)}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                        <button
                            onClick={() => setShowPreviewModal(false)}
                            style={{
                                position: 'absolute',
                                top: '-2rem',
                                right: '-2rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={design.headerImage?.url}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default PasswordProtectedConfig;
