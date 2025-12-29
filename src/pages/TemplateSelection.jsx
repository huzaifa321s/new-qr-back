import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Settings, Eye } from 'lucide-react';
import { qrTypes } from '../utils/qrTypes';
import MobilePreview from '../components/MobilePreview';
import { getPreviewConfig } from '../utils/previewConfigs';

const TemplateSelection = () => {
    const [selectedType, setSelectedType] = useState('app-store');
    const [activeTab, setActiveTab] = useState('generator');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleContinue = () => {
        if (selectedType) {
            navigate('/generator', { state: { selectedType } });
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8f9fa',
            padding: '0',
            position: 'relative'
        }}>
            {/* Top Navigation Bar */}
            <div style={{
                background: '#fff',
                padding: '1rem 2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                }}>
                    <span style={{ color: '#8b5cf6' }}>QR</span>
                    <span style={{ color: '#6366f1' }}>INSIGHT</span>
                </div>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <span
                        onClick={() => navigate('/static-generator')}
                        style={{
                            fontSize: '0.95rem',
                            color: '#64748b',
                            cursor: 'pointer'
                        }}>
                        Static QRs
                    </span>
                    <span style={{
                        fontSize: '0.95rem',
                        color: '#8b5cf6',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Dynamic QRs
                    </span>
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '6rem',
                    left: '2rem',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#e0e7ff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#6366f1',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
            >
                <ArrowLeft size={20} />
            </button>

            <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '2rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        color: '#8b5cf6',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '1rem'
                    }}>
                        Select Your QR Code Purpose
                    </div>
                    {/* Progress Bar */}
                    <div style={{
                        width: '300px',
                        height: '6px',
                        background: '#e2e8f0',
                        margin: '0 auto',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '20%',
                            height: '100%',
                            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                            borderRadius: '3px'
                        }} />
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: isMobile ? '0' : '3rem',
                    alignItems: 'flex-start',
                    flexDirection: isMobile ? 'column' : 'row',
                    marginBottom: isMobile ? '20px' : '0'
                }}>

                    {/* Left Side: QR Type Grid */}
                    <div style={{
                        flex: 1,
                        width: '100%',
                        display: (isMobile && activeTab !== 'generator') ? 'none' : 'block'
                    }}>
                        {/* Scrollable QR Type Grid */}
                        <div
                            className="custom-scrollbar"
                            style={{
                                height: '55vh',
                                overflowY: 'auto',
                                paddingRight: '1rem',
                                marginBottom: isMobile ? '1rem' : '2rem'
                            }}>
                            <style>
                                {`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 8px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: #f1f5f9;
                                    border-radius: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #cbd5e1;
                                    border-radius: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #94a3b8;
                                }
                            `}
                            </style>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(3, 1fr)',
                                gap: '1.5rem'
                            }}>
                                {qrTypes.map(type => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        style={{
                                            position: 'relative',
                                            background: '#ffffff',
                                            border: selectedType === type.id ? '3px solid #8b5cf6' : '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            minHeight: '100px'
                                        }}
                                    >
                                        {/* Text Section */}
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h3 style={{
                                                margin: '0 0 0.5rem 0',
                                                color: '#0f172a',
                                                fontSize: '1rem',
                                                fontWeight: '700'
                                            }}>
                                                {type.name}
                                            </h3>
                                            <p style={{
                                                margin: 0,
                                                color: '#94a3b8',
                                                fontSize: '0.8rem',
                                                lineHeight: '1.4'
                                            }}>
                                                {type.description}
                                            </p>
                                        </div>

                                        {/* Icon Section */}
                                        <div style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: '50%',
                                            background: type.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            flexShrink: 0
                                        }}>
                                            {type.icon}
                                        </div>

                                        {/* Incomplete Badge */}
                                        {['survey', 'social-media', 'product-page', 'dynamic-url', 'image', 'video'].includes(type.id) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '10px',
                                                background: '#ef4444',
                                                color: '#fff',
                                                padding: '2px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                textTransform: 'uppercase',
                                                zIndex: 10
                                            }}>
                                                incomplete
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Mobile Preview Panel */}
                    <div style={{
                        width: isMobile ? '100%' : '350px',
                        flexShrink: 0,
                        position: isMobile ? 'relative' : 'sticky',
                        top: isMobile ? '0' : '2rem',
                        display: isMobile ? (activeTab === 'preview' ? 'flex' : 'none') : (selectedType ? 'block' : 'none'),
                        justifyContent: 'center',
                        transition: 'opacity 0.3s ease'
                    }}>
                        {selectedType && (
                            <div style={{
                                background: '#fff',
                                borderRadius: '24px',
                                padding: '1rem',
                                boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                    color: '#64748b',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}>
                                    Preview
                                </div>
                                {getPreviewConfig(selectedType) ? (
                                    <MobilePreview config={getPreviewConfig(selectedType)} />
                                ) : (
                                    <div style={{
                                        minHeight: '400px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8'
                                    }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                            {qrTypes.find(t => t.id === selectedType)?.icon}
                                        </div>
                                        <h3>{qrTypes.find(t => t.id === selectedType)?.name}</h3>
                                        <p>Preview available in next step</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Continue Button */}
                <div style={{
                    display: isMobile ? (activeTab === 'generator' ? 'flex' : 'none') : 'flex',
                    justifyContent: 'center',
                    marginTop: isMobile ? '0.5rem' : '0',
                    marginBottom: isMobile ? '100px' : '0'
                }}>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedType}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: selectedType ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            opacity: selectedType ? 1 : 0.5
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '50px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                background: '#8b5cf6',
                                color: '#ffffff',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}>
                                Continue
                            </div>
                            <div style={{
                                background: '#c4b5fd',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#8b5cf6'
                            }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: '#fff',
                    display: 'flex',
                    borderTop: '1px solid #e2e8f0',
                    boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
                    zIndex: 1000
                }}>
                    <div
                        onClick={() => setActiveTab('generator')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: activeTab === 'generator' ? '#8b5cf6' : '#94a3b8',
                            cursor: 'pointer'
                        }}
                    >
                        <Settings size={24} />
                        <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'generator' ? '600' : '400' }}>Generator</span>
                    </div>
                    <div
                        onClick={() => setActiveTab('preview')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: activeTab === 'preview' ? '#8b5cf6' : '#94a3b8',
                            cursor: 'pointer',
                            opacity: selectedType ? 1 : 0.5
                        }}
                    >
                        <Eye size={24} />
                        <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'preview' ? '600' : '400' }}>Preview</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSelection;