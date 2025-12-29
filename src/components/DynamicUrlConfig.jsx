import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const DynamicUrlConfig = ({ config, onChange }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(true);

    const url = config.url || '';

    const handleUrlUpdate = (value) => {
        onChange(prev => ({
            ...prev,
            url: value
        }));
    };

    return (
        <div>
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
                        <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase' }}>
                            ENTER INFORMATION
                        </div>
                    </div>
                    {isInfoOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isInfoOpen && (
                    <div style={{ padding: '1rem', background: '#fff' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                WEBSITE OR PAGE LINK*
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handleUrlUpdate(e.target.value)}
                                placeholder="https://www.webiste.com/"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicUrlConfig;
