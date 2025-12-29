import React, { useState, useCallback } from 'react';
import { X, Minus, Plus, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/canvasUtils';

const ImageUploadModal = ({ isOpen, onClose, onSave, tempImage, fileName, type = 'logo', aspect = 1 }) => {
    const [uploading, setUploading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(
                tempImage,
                croppedAreaPixels,
                rotation
            );

            const formData = new FormData();
            const name = (fileName || 'image').replace(/\.[^/.]+$/, "") + ".jpg";
            formData.append(type, croppedImageBlob, name);

            const res = await axios.post(`http://localhost:3000/api/upload/${type}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onSave(res.data.url);
            onClose();
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                width: '600px',
                maxWidth: '95%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                        {uploading ? 'Uploading...' : 'Edit image'}
                    </h3>
                    <button onClick={onClose} disabled={uploading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Crop Area */}
                <div style={{ position: 'relative', height: '400px', background: '#333' }}>
                    <Cropper
                        image={tempImage}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                {/* Controls */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Zoom Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Minus size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setZoom(Math.max(1, zoom - 0.1))} />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{
                                flex: 1,
                                accentColor: '#8b5cf6',
                                height: '4px',
                                background: '#e2e8f0',
                                borderRadius: '2px',
                                appearance: 'none'
                            }}
                        />
                        <Plus size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setZoom(Math.min(3, zoom + 0.1))} />
                    </div>

                    {/* Rotation Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <RefreshCw size={20} color="#64748b" style={{ cursor: 'pointer', transform: 'scaleX(-1)' }} onClick={() => setRotation(rotation - 90)} />
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={(e) => setRotation(Number(e.target.value))}
                            style={{
                                flex: 1,
                                accentColor: '#8b5cf6',
                                height: '4px',
                                background: '#e2e8f0',
                                borderRadius: '2px',
                                appearance: 'none'
                            }}
                        />
                        <RefreshCw size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setRotation(rotation + 90)} />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#fff',
                                color: '#64748b',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#8b5cf6',
                                color: '#fff',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {uploading ? (
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid #fff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            ) : 'OK'}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ImageUploadModal;
