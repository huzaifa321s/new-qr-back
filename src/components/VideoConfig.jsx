import { ChevronDown, ChevronUp, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';

const VideoConfig = ({ config, onChange }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const fileInputRef = useRef(null);

    const title = config.video?.title || '';
    const url = config.video?.url || '';
    const redirect = config.video?.redirect || false;

    const handleUpdate = (key, value) => {
        onChange(prev => ({
            ...prev,
            video: {
                ...prev.video,
                [key]: value
            }
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }

        // Create a local URL for the uploaded file
        const objectUrl = URL.createObjectURL(file);
        handleUpdate('url', objectUrl);
    };

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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

                        {/* Video Title */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                VIDEO TITLE*
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                                placeholder="Jacket Video"
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

                        {/* Upload Video Section */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                UPLOAD VIDEO
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handleUpdate('url', e.target.value)}
                                placeholder="https://"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #1e293b',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#1e293b',
                                    marginBottom: '1rem'
                                }}
                            />

                            <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                OR
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="video/*"
                                style={{ display: 'none' }}
                            />

                            <button
                                onClick={triggerFileUpload}
                                disabled={!!url}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0',
                                    background: !!url ? '#f1f5f9' : '#f8fafc',
                                    color: !!url ? '#94a3b8' : '#64748b',
                                    fontSize: '0.9rem',
                                    cursor: !!url ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <UploadCloud size={20} />
                                Upload/ Choose Video from your Computer
                            </button>

                            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                                10MB max Video size
                            </div>
                        </div>

                        {/* Redirect Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <input
                                type="checkbox"
                                id="redirectVideo"
                                checked={redirect}
                                onChange={(e) => handleUpdate('redirect', e.target.checked)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                }}
                            />
                            <label htmlFor="redirectVideo" style={{ fontSize: '0.85rem', color: '#1e293b', cursor: 'pointer', fontWeight: '500' }}>
                                Redirect Video
                            </label>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoConfig;
