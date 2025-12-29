import { ChevronDown, ChevronUp, UploadCloud, X } from 'lucide-react';
import { useState, useRef } from 'react';

const ImageConfig = ({ config, onChange }) => {
    const [isImagesOpen, setIsImagesOpen] = useState(true);
    const fileInputRef = useRef(null);

    const images = config.images || [];

    const handleImagesUpdate = (newImages) => {
        onChange(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = files.map(file => ({
            id: Date.now() + Math.random().toString(),
            url: URL.createObjectURL(file), // Create local preview URL
            file: file
        }));

        handleImagesUpdate([...images, ...newImages]);
        e.target.value = null; // Reset input
    };

    const handleRemoveImage = (id) => {
        const newImages = images.filter(img => img.id !== id);
        handleImagesUpdate(newImages);
    };

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            {/* UPLOAD YOUR IMAGES ACCORDION */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsImagesOpen(!isImagesOpen)}
                    style={{
                        padding: '1.5rem',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isImagesOpen ? '1px solid #e2e8f0' : 'none'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                            UPLOAD YOUR IMAGES.
                        </div>
                    </div>
                    {isImagesOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isImagesOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                DRAG FILE HERE OR BROWSE
                            </label>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                                {/* Rendered Images */}
                                {images.map((img) => (
                                    <div key={img.id} style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        padding: '4px',
                                        position: 'relative',
                                        background: '#fff'
                                    }}>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                background: '#f1f5f9'
                                            }}
                                        >
                                            <img
                                                src={img.url}
                                                alt="Uploaded"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <div
                                            onClick={() => handleRemoveImage(img.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                left: '-8px',
                                                width: '20px',
                                                height: '20px',
                                                background: '#8b5cf6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                border: '2px solid #fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <X size={12} color="#fff" />
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <div
                                    onClick={triggerFileUpload}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        border: '1px dashed #cbd5e1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#f8fafc',
                                        flexShrink: 0
                                    }}
                                >
                                    <UploadCloud size={24} color="#94a3b8" />
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                            />
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageConfig;
