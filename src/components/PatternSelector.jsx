import React from 'react';
import { Check } from 'lucide-react';

const patternStyles = [
    { id: 'square', name: 'Square', preview: '■' },
    { id: 'dots', name: 'Dots', preview: '●' },
    { id: 'rounded', name: 'Rounded', preview: '▢' },
    { id: 'classy', name: 'Classy', preview: '◆' },
    { id: 'classy-rounded', name: 'Classy Rounded', preview: '◈' },
    { id: 'extra-rounded', name: 'Extra Rounded', preview: '◯' }
];

const cornerStyles = [
    { id: 'square', name: 'Square', preview: '■' },
    { id: 'dot', name: 'Dot', preview: '●' },
    { id: 'extra-rounded', name: 'Extra Rounded', preview: '◯' }
];

const PatternSelector = ({ type = 'dots', selected, onSelect, label }) => {
    const options = type === 'dots' ? patternStyles : cornerStyles;

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                {label}
            </label>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: '0.75rem'
            }}>
                {options.map(option => (
                    <div
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        style={{
                            position: 'relative',
                            padding: '1rem 0.75rem',
                            border: selected === option.id ? '2px solid #6366f1' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: selected === option.id ? '#eff6ff' : '#ffffff',
                            textAlign: 'center'
                        }}
                    >
                        {selected === option.id && (
                            <div style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#6366f1',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Check size={10} color="#fff" />
                            </div>
                        )}

                        {/* Visual Preview */}
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '0.5rem',
                            color: '#1e293b'
                        }}>
                            {option.preview}
                        </div>

                        <span style={{ fontSize: '0.7rem', fontWeight: '500', color: '#64748b', display: 'block' }}>
                            {option.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatternSelector;
