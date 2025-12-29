import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, BarChart, ChevronLeft, ChevronRight, LayoutGrid, HelpCircle, MessageCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

    // Dynamic width and layout based on collapses and viewport
    const sidebarWidth = window.innerWidth <= 768 ? '240px' : (isCollapsed ? '70px' : '240px');

    return (
        <>
            {/* Mobile Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: window.innerWidth <= 768 && isOpen ? 'block' : 'none',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}
            />

            <div style={{
                width: sidebarWidth,
                background: '#fff',
                borderRight: '1px solid #e5e5e5',
                display: 'flex',
                flexDirection: 'column',
                position: window.innerWidth <= 768 ? 'fixed' : 'sticky',
                top: 0,
                left: 0,
                height: '100vh',
                maxHeight: '100vh',
                flexShrink: 0,
                transition: 'transform 0.3s ease, width 0.3s ease',
                zIndex: 1001,
                transform: window.innerWidth <= 768 ? `translateX(${isOpen ? '0' : '-100%'})` : 'none',
            }}>
                {/* Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        position: 'absolute',
                        top: '28px',
                        right: '-12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '1px solid #e5e5e5',
                        display: window.innerWidth > 768 ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#000',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        zIndex: 20
                    }}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        display: window.innerWidth <= 768 ? 'block' : 'none',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    <X size={24} />
                </button>

                {/* Logo */}
                <div style={{
                    padding: '1.5rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start',
                    gap: '0.75rem',
                    height: '80px'
                }}>
                    <div style={{
                        minWidth: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}>
                        Q
                    </div>
                    {(!isCollapsed || window.innerWidth <= 768) && (
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#000', lineHeight: 1 }}>QR</div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#000', lineHeight: 1 }}>INSIGHT</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => {
                            onClose?.();
                            navigate('/select-template');
                        }}
                        style={{
                            width: '100%',
                            background: '#000',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.625rem',
                            borderRadius: '6px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: (isCollapsed && window.innerWidth > 768) ? 0 : '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}
                        title="Create New QR"
                    >
                        <Plus size={18} />
                        {(!isCollapsed || window.innerWidth <= 768) && "Create New QR"}
                    </button>

                    <div
                        onClick={() => {
                            onClose?.();
                            navigate('/');
                        }}
                        style={{
                            padding: '0.625rem 1rem',
                            background: isActive('/') && !isActive('/statistics') ? '#7c3aed' : 'transparent',
                            color: isActive('/') && !isActive('/statistics') ? '#fff' : '#666',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start',
                            gap: '0.75rem',
                            transition: 'all 0.2s'
                        }}
                        title="My QR Codes"
                    >
                        <LayoutGrid size={20} />
                        {(!isCollapsed || window.innerWidth <= 768) && "My QR Codes"}
                    </div>

                    <div
                        onClick={() => {
                            onClose?.();
                            toast('Coming Soon', {
                                icon: 'ℹ️',
                                duration: 2000
                            });


                        }}
                        style={{
                            padding: '0.625rem 1rem',
                            background: 'transparent',
                            color: '#666',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start',
                            gap: '0.75rem',
                            transition: 'all 0.2s'
                        }}
                        title="Statistics"
                    >
                        <BarChart size={20} />
                        {(!isCollapsed || window.innerWidth <= 768) && "Statistics"}
                    </div>
                </nav>

                {/* Support */}
                <div style={{
                    borderTop: '1px solid #e5e5e5',
                    paddingTop: '1rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start'
                }}>
                    {(!isCollapsed || window.innerWidth <= 768) && (
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#999', marginBottom: '0.75rem', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>
                            Support
                        </div>
                    )}

                    <div style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: '#666',
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        justifyContent: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start'
                    }} title="Help Center">
                        <HelpCircle size={20} />
                        {(!isCollapsed || window.innerWidth <= 768) && "Help Center"}
                    </div>

                    <div style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: '#666',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        justifyContent: (isCollapsed && window.innerWidth > 768) ? 'center' : 'flex-start'
                    }} title="Contact Us">
                        <MessageCircle size={20} />
                        {(!isCollapsed || window.innerWidth <= 768) && "Contact Us"}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
