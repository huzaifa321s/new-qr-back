import React from 'react';
import { frames } from '../utils/templates';
import { Check } from 'lucide-react';

const FrameSelector = ({ selected, onSelect }) => {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                Choose Frame
            </label>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem'
            }}>
                {frames.map(frame => (
                    <div
                        key={frame.id}
                        onClick={() => onSelect(frame)}
                        style={{
                            position: 'relative',
                            padding: '0.75rem',
                            border: selected?.id === frame.id ? '2px solid #6366f1' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: selected?.id === frame.id ? '#eff6ff' : '#ffffff',
                            textAlign: 'center'
                        }}
                    >
                        {selected?.id === frame.id && (
                            <div style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#6366f1',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Check size={12} color="#fff" />
                            </div>
                        )}

                        {/* Frame Preview */}
                        <div style={{
                            width: '100%',
                            height: '80px',
                            background: '#f1f5f9',
                            borderRadius: frame.style?.borderRadius || 0,
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            position: 'relative'
                        }}>
                            {frame.style?.banner && frame.style.banner.position === 'top' && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '20px',
                                    background: frame.style.banner.backgroundColor,
                                    borderTopLeftRadius: frame.style.borderRadius || 0,
                                    borderTopRightRadius: frame.style.borderRadius || 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.5rem',
                                    color: frame.style.banner.textColor,
                                    fontWeight: 'bold'
                                }}>
                                    {frame.style.banner.text}
                                </div>
                            )}

                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: '#000',
                                borderRadius: '4px'
                            }} />

                            {frame.style?.banner && frame.style.banner.position === 'bottom' && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '20px',
                                    background: frame.style.banner.backgroundColor,
                                    borderBottomLeftRadius: frame.style.borderRadius || 0,
                                    borderBottomRightRadius: frame.style.borderRadius || 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.5rem',
                                    color: frame.style.banner.textColor,
                                    fontWeight: 'bold'
                                }}>
                                    {frame.style.banner.text}
                                </div>
                            )}
                        </div>

                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#1e293b' }}>
                            {frame.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FrameSelector;
