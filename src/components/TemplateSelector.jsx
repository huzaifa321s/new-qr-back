import React from 'react';
import { templates } from '../utils/templates';
import { Check } from 'lucide-react';

const TemplateSelector = ({ selected, onSelect }) => {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                Choose Template
            </label>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem'
            }}>
                {templates.map(template => (
                    <div
                        key={template.id}
                        onClick={() => onSelect(template)}
                        style={{
                            position: 'relative',
                            padding: '0.75rem',
                            border: selected?.id === template.id ? '2px solid #6366f1' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: selected?.id === template.id ? '#eff6ff' : '#ffffff',
                            textAlign: 'center'
                        }}
                    >
                        {selected?.id === template.id && (
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

                        {/* Template Preview - Simple colored box for now */}
                        <div style={{
                            width: '100%',
                            height: '80px',
                            background: template.design.color.dark,
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: template.design.color.light,
                                borderRadius: template.design.dots.style === 'rounded' ? '8px' : '4px'
                            }} />
                        </div>

                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#1e293b' }}>
                            {template.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
