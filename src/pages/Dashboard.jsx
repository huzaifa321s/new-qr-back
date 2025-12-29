import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Plus, Search, Download, Edit, Trash2, BarChart, ChevronDown,
    MoreVertical, Link, Copy, Globe, Calendar, Star, Folder, AlertTriangle, Check, X,
    Image as ImageIcon, FileText, PenTool, ChevronLeft, ChevronRight, Menu, Sliders, Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import QRRenderer from '../components/QRRenderer';
import Sidebar from '../components/Sidebar';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { io } from 'socket.io-client';
import MobilePreview from '../components/MobilePreview';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const HEATMAP_COLORS = ['#f3e8ff', '#d8b4fe', '#c084fc', '#a855f7', '#7e22ce'];

const DateCustomInput = React.forwardRef(({ value, onClick, startDate, endDate }, ref) => (
    <div
        onClick={onClick}
        ref={ref}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '50px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#666',
            minWidth: '260px',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: startDate ? '#333' : '#999' }}>
                {startDate ? startDate.toLocaleDateString('en-CA') : 'Start date'}
            </span>
            <span style={{ margin: '0 0.75rem', color: '#ccc' }}>→</span>
            <span style={{ color: endDate ? '#333' : '#999' }}>
                {endDate ? endDate.toLocaleDateString('en-CA') : 'End date'}
            </span>
        </div>
        <Calendar size={16} color="#999" />
    </div>
));

const Dashboard = () => {
    const navigate = useNavigate();
    const [qrs, setQrs] = useState([]);
    const qrRefs = useRef({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [openUpwards, setOpenUpwards] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(Date.now());
    const [renamingId, setRenamingId] = useState(null);
    const [tempName, setTempName] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [editingUrlQr, setEditingUrlQr] = useState(null);
    const [tempShortId, setTempShortId] = useState('');
    const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedQrForStats, setSelectedQrForStats] = useState(null);

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [downloadingQr, setDownloadingQr] = useState(null);
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [sortOption, setSortOption] = useState('Last Created');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('All types');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQRs, setTotalQRs] = useState(0);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const baseUrl = (import.meta.env.VITE_FRONTEND_URL || window.location.origin).replace(/\/$/, '');

    const handleDownloadClick = (qr) => {
        setDownloadingQr(qr);
        setDownloadFormat('png');
        setIsDownloadModalOpen(true);
    };

    const handleCloseDownloadModal = () => {
        setIsDownloadModalOpen(false);
        setDownloadingQr(null);
    };

    const handleRunDownload = async () => {
        if (!downloadingQr) {
            handleCloseDownloadModal();
            return;
        }

        try {
            const format = downloadFormat || 'png';
            const filename = `${downloadingQr.name || 'qr-code'}.${format}`;

            // Use the same robust download logic as Statistics page
            const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
            const downloadUrl = `${apiBase}/api/qr/download/${downloadingQr.shortId}?format=${format}`;

            console.log('📥 Downloading from:', downloadUrl);
            const response = await fetch(downloadUrl);

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('QR code downloaded successfully!');
            handleCloseDownloadModal();
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download QR code');

            // Fallback Client Side
            try {
                await fallbackClientDownload();
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    };

    // ❌ Fallback function (only if backend fails)
    const fallbackClientDownload = async () => {
        let qrElement = document.querySelector(`#modal-qr-${downloadingQr._id} canvas, #modal-qr-${downloadingQr._id} svg`) ||
            document.querySelector(`#qr-${downloadingQr._id} canvas, #qr-${downloadingQr._id} svg`);

        if (!qrElement) {
            throw new Error('QR element not found');
        }

        const filename = `${downloadingQr.name || 'qr-code'}.${downloadFormat}`;

        if (downloadFormat === 'pdf') {
            const dataUrl = await toPng(qrElement);
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;

            pdf.addImage(dataUrl, 'PNG', x, 10, pdfWidth, pdfHeight);
            pdf.save(filename);
        } else {
            const dataUrl = downloadFormat === 'jpg' || downloadFormat === 'jpeg'
                ? await toJpeg(qrElement, { quality: 0.95 })
                : await toPng(qrElement);

            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleEditUrlClick = (qr) => {
        setEditingUrlQr(qr);
        setTempShortId(qr.shortId);
        setIsUrlModalOpen(true);
    };

    const handleCloseUrlModal = () => {
        setIsUrlModalOpen(false);
        setEditingUrlQr(null);
        setTempShortId('');
    };

    const handleUpdateUrl = async () => {
        if (!editingUrlQr) return;

        // Basic validation
        if (!tempShortId.trim()) {
            toast.error('Short ID cannot be empty');
            return;
        }

        if (tempShortId.includes(' ')) {
            toast.error('Short ID cannot contain spaces');
            return;
        }

        setIsUpdatingUrl(true);
        try {
            const updateData = {
                shortId: tempShortId,
            };

            const res = await axios.put(`/api/qr/${editingUrlQr._id}`, updateData);

            // Update local state
            setQrs(prev => prev.map(q => q._id === editingUrlQr._id ? res.data : q));
            toast.success('QR Code Short ID updated successfully');
            handleCloseUrlModal();
            setLastUpdated(Date.now()); // Trigger image refresh
        } catch (err) {
            console.error('Error updating QR:', err);
            toast.error(err.response?.data?.message || 'Error updating QR Code');
        } finally {
            setIsUpdatingUrl(false);
        }
    };

    const handleCopyUrl = (qr) => {
        // Always use the original QR data URL from database
        const url = `${baseUrl}/view/${qr.shortId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(qr._id);
        toast.success('URL Copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleStartRename = (qr) => {
        setRenamingId(qr._id);
        setTempName(qr.name || 'Untitled QR');
    };

    const handleCancelRename = () => {
        setRenamingId(null);
        setTempName('');
    };

    const handleSaveRename = async (id) => {
        if (!tempName.trim()) return;
        try {
            await axios.put(`/api/qr/${id}`, { name: tempName });
            setQrs(prev => prev.map(q => q._id === id ? { ...q, name: tempName } : q));
            setRenamingId(null);
            toast.success('QR label updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Error updating label');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirmationId(id);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmationId) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/qr/${deleteConfirmationId}`);
            setQrs(prev => prev.filter(q => q._id !== deleteConfirmationId));
            setDeleteConfirmationId(null);
            toast.success('QR deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error('Server error');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle clicking outside of menus and tooltips to close them
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.qr-menu-container')) {
                if (activeMenuId) setActiveMenuId(null);
                if (deleteConfirmationId) setDeleteConfirmationId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId, deleteConfirmationId]);

    useEffect(() => {
        fetchQRs();
    }, []);

    const fetchQRs = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:3000/api/qr/list'
                : '/api/qr/list';

            const params = {
                page: currentPage,
                limit: pageLimit
            };

            // Add filter parameters
            if (selectedTypeFilter && selectedTypeFilter !== 'All types') {
                params.type = selectedTypeFilter;
            }
            if (activeTab && activeTab !== 'All') {
                params.tab = activeTab;
            }
            if (searchTerm) {
                params.search = searchTerm;
            }
            if (startDate) {
                params.startDate = startDate.toISOString();
            }
            if (endDate) {
                params.endDate = endDate.toISOString();
            }
            if (sortOption) {
                params.sort = sortOption;
            }

            const res = await axios.get(apiUrl, { params });
            setQrs(res.data.qrs || res.data);
            if (res.data.pagination) {
                setTotalPages(res.data.pagination.totalPages);
                setTotalQRs(res.data.pagination.total);
            }
            setLastUpdated(Date.now());
            setLoading(false);
        } catch (err) {
            console.error('Error fetching QRs:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch QRs');
            setLoading(false);
        }
    };

    // Real-time scan updates
    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const socket = io(socketUrl);

        socket.on('scan-updated', (data) => {
            setQrs(prevQrs => prevQrs.map(qr => {
                if (qr.shortId === data.shortId) {
                    // Update scanCount AND push dummy scan to array so length updates
                    const currentScans = qr.scans || [];
                    return {
                        ...qr,
                        scanCount: data.scanCount,
                        scans: [...currentScans, { timestamp: new Date() }]
                    };
                }
                return qr;
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Fetch QRs when pagination changes
    useEffect(() => {
        fetchQRs();
    }, [currentPage, pageLimit]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchQRs();
        }
    }, [selectedTypeFilter, activeTab, searchTerm, startDate, endDate, sortOption]);

    const handleDownloadQR = (qr) => {
        try {
            // Get the QRRenderer component's ref
            const qrRef = qrRefs.current[qr._id];
            if (qrRef && qrRef.current) {
                // Use the QRRenderer's download method with the same design
                qrRef.current.download('png', qr.name || 'qr-code');
            } else {
                // Fallback to the server-side download
                window.location.href = `/api/qr/${qr.shortId}/download?format=png`;
            }
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download QR code');
        }
    };

    const handleEditQR = (qr) => {
        navigate('/generator', { state: { editingQr: qr, selectedType: qr.type } });
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        if (activeMenuId !== id) {
            const rect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // If space below is less than menu height (approx 180px), open upwards
            setOpenUpwards(spaceBelow < 180);
        }
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    // Filter and Sort Logic
    const filteredQrs = qrs
        .filter(qr => {
            // 1. Search Filter
            const matchesSearch = searchTerm === '' ||
                qr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                qr.shortId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                qr.type?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Tab Filter
            if (activeTab === 'Dynamic') return ['url', 'dynamic-url', 'business-page', 'menu', 'business-card', 'app-store', 'video', 'pdf', 'mp3', 'image', 'social-media', 'coupon', 'feedback', 'event', 'product-page', 'lead-generation', 'rating', 'reviews', 'password-protected', 'multiple-links'].includes(qr.type);
            if (activeTab === 'Static') return ['text', 'email', 'sms', 'wifi', 'vcard', 'static', 'website', 'map', 'phone'].includes(qr.type);
            // if (activeTab === 'Favourite') return false; 

            // 3. Type Filter Dropdown
            if (selectedTypeFilter !== 'All types') {
                if (qr.type !== selectedTypeFilter) return false;
            }

            return true;
        })
        .filter(qr => {
            // 3. Timeframe Filter ("Last 30 Days")
            if (sortOption === 'Last 30 Days') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return new Date(qr.createdAt) >= thirtyDaysAgo;
            }

            // 4. Custom Date Range Filter
            if (startDate && endDate) {
                const qrDate = new Date(qr.createdAt);
                // Set start date to beginning of day, end date to end of day
                const start = new Date(startDate); start.setHours(0, 0, 0, 0);
                const end = new Date(endDate); end.setHours(23, 59, 59, 999);

                return qrDate >= start && qrDate <= end;
            }

            return true;
        })
        .sort((a, b) => {
            // 4. Sorting Logic
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            switch (sortOption) {
                case 'First Created':
                    return dateA - dateB;
                case 'Most Scanned':
                    return (b.scanCount || 0) - (a.scanCount || 0);
                case 'Last Created':
                case 'Last 30 Days':
                case 'Lifetime':
                default:
                    return dateB - dateA;
            }
        });

    const qrTypes = [
        { value: 'url', label: 'URL' },
        { value: 'custom-type', label: 'Custom Type' },
        { value: 'business-card', label: 'Business Card' },
        { value: 'business-page', label: 'Business Page' },
        { value: 'social-media', label: 'Social Media' },
        { value: 'image', label: 'Image' },
        { value: 'pdf', label: 'PDF' },
        { value: 'app-store', label: 'App Store' },
        { value: 'menu', label: 'Menu' },
        { value: 'video', label: 'Video' },
        { value: 'coupon', label: 'Coupon' },
        { value: 'event', label: 'Event' },
        { value: 'product-page', label: 'Product Page' },
        { value: 'lead-generation', label: 'Lead Generation' },
        { value: 'rating', label: 'Rating' },
        { value: 'reviews', label: 'Reviews' },
        { value: 'password-protected', label: 'Password Protected' },
        { value: 'multiple-links', label: 'Multiple Links' },
        { value: 'dynamic-url', label: 'Dynamic URL' }
    ].sort((a, b) => a.label.localeCompare(b.label));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'sans-serif' }}>
            <Toaster position="top-right" />

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: isMobile ? '1rem' : '1.5rem 2rem',
                overflowY: 'auto',
                marginLeft: (isMobile || !isSidebarOpen) ? 0 : '0' // Adjusted by Sidebar sticky/fixed
            }}>

                {/* Mobile Header */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        marginBottom: '1.5rem',
                        borderBottom: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>
                                Q
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Dashboard</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Menu size={24} color="#000" />
                        </button>
                    </div>
                )}

                {/* STATISTICS VIEW (Refactored to /statistics/:id) */}
                {false ? (
                    <div>
                        {/* Back Button */}
                        <div
                            onClick={() => setSelectedQrForStats(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#7c3aed',
                                fontWeight: '600',
                                marginBottom: '1.5rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            <ChevronLeft size={18} /> Back
                        </div>

                        {/* Stats Card */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '2rem',
                            display: 'flex',
                            gap: '2rem',
                            flexWrap: 'wrap',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                            {/* Left Column: Info */}
                            <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#000', lineHeight: '1.1' }}>
                                        {(selectedQrForStats.scans || []).length}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                        <Folder size={16} /> No Folder
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
                                        QR LINK
                                    </div>
                                    <a
                                        href={`${baseUrl}/view/${selectedQrForStats.shortId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ fontSize: '1rem', color: '#7c3aed', textDecoration: 'none', fontWeight: '500' }}
                                    >
                                        {`${baseUrl}/view/${selectedQrForStats.shortId}`}
                                    </a>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
                                        CREATED
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>
                                        {new Date(selectedQrForStats.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
                                        TYPE
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#7c3aed', fontWeight: '500' }}>
                                        {selectedQrForStats.type === 'app-store' ? 'App Store' : selectedQrForStats.type.charAt(0).toUpperCase() + selectedQrForStats.type.slice(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Center Column: QR & Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', minWidth: '200px' }}>
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    background: '#fff',
                                    padding: '10px',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}>
                                    {selectedQrForStats.qrImageUrl ? (
                                        <img
                                            src={`${selectedQrForStats.qrImageUrl}?t=${lastUpdated}`}
                                            alt="QR Code"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <QRRenderer
                                            value={`${baseUrl}/view/${selectedQrForStats.shortId}`}
                                            design={selectedQrForStats.design || {}}
                                            size={160}
                                        />
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {[
                                        { icon: Download, action: () => handleDownloadClick(selectedQrForStats) },
                                        { icon: Edit, action: () => handleEditQR(selectedQrForStats) },
                                        { icon: Trash2, action: () => handleDeleteClick(selectedQrForStats._id) },
                                    ].map((btn, idx) => (
                                        <button
                                            key={idx}
                                            onClick={btn.action}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e5e5',
                                                background: '#fff',
                                                color: '#666',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#666'; }}
                                        >
                                            <btn.icon size={18} />
                                        </button>
                                    ))}
                                    <button
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e5e5',
                                            background: '#fff',
                                            color: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderRadius: '50%' }}></div>
                                            <div style={{ width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                                            <div style={{ width: '12px', height: '6px', border: '2px solid currentColor', borderTop: 'none', borderRadius: '0 0 16px 16px', position: 'absolute', top: '120%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Mobile Preview */}
                            <div style={{
                                width: '280px',
                                height: '560px',
                                border: '8px solid #f3f4f6',
                                borderRadius: '40px',
                                overflow: 'hidden',
                                position: 'relative',
                                background: '#fff',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', height: '120%' }}>
                                    <MobilePreview config={selectedQrForStats} isLiveView={true} />
                                </div>
                            </div>
                        </div>

                        {/* Scan Activity Section */}
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000', marginBottom: '0.25rem' }}>
                                    Scan Activity
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                                    Track your QR code performance over time
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', height: '400px' }}>
                                {/* Chart Area */}
                                <div style={{
                                    flex: 2,
                                    background: '#fff',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                                    minHeight: '300px'
                                }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={(() => {
                                                if (!selectedQrForStats.scans || selectedQrForStats.scans.length === 0) return [];

                                                // Group scans by date
                                                const scansByDate = selectedQrForStats.scans.reduce((acc, scan) => {
                                                    const date = new Date(scan.timestamp).toISOString().split('T')[0];
                                                    acc[date] = (acc[date] || 0) + 1;
                                                    return acc;
                                                }, {});

                                                // Create array and sort
                                                return Object.entries(scansByDate)
                                                    .map(([date, count]) => ({ date, count }))
                                                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                                            })()}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#999', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#999', fontSize: 12 }}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#7c3aed"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Stats Cards */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Total Scans Card */}
                                    <div style={{
                                        background: '#f3e8ff', // Light purple bg
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        flex: 1
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }}></div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#000' }}>Total Scans</span>
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#7c3aed', lineHeight: 1, marginBottom: '0.5rem' }}>
                                            {selectedQrForStats.scanCount || 0}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {selectedQrForStats.createdAt ? `${new Date(selectedQrForStats.createdAt).toLocaleDateString()} to Now` : 'Lifetime'}
                                        </div>
                                    </div>

                                    {/* Unique Scans Card */}
                                    <div style={{
                                        background: '#ecfdf5', // Light green/teal bg
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        flex: 1
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#000' }}>Unique Scans</span>
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#06b6d4', lineHeight: 1, marginBottom: '0.5rem' }}>
                                            {(() => {
                                                if (!selectedQrForStats.scans) return 0;
                                                const uniqueIps = new Set(selectedQrForStats.scans.map(s => s.ip));
                                                return uniqueIps.size;
                                            })()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {selectedQrForStats.createdAt ? `${new Date(selectedQrForStats.createdAt).toLocaleDateString()} to Now` : 'Lifetime'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demographics & Heatmap Row */}
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', height: '600px' }}>

                            {/* DEMOGRAPHICS COLUMN */}
                            <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflowY: 'auto' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000', margin: 0 }}>Demographics</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.25rem 0 0 0' }}>Device usage and geographic distribution</p>
                                </div>

                                {/* Scans by Device */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b0082', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '4px', height: '4px', background: '#4b0082', borderRadius: '50%' }}></span> Scans by Device
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '120px', height: '120px' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={(() => {
                                                            const counts = {};
                                                            (selectedQrForStats.scans || []).forEach(s => counts[s.device || 'Unknown'] = (counts[s.device || 'Unknown'] || 0) + 1);
                                                            return Object.entries(counts).map(([name, value]) => ({ name, value }));
                                                        })()}
                                                        innerRadius={40}
                                                        outerRadius={55}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {Object.keys((() => {
                                                            const counts = {};
                                                            (selectedQrForStats.scans || []).forEach(s => counts[s.device || 'Unknown'] = (counts[s.device || 'Unknown'] || 0) + 1);
                                                            return counts;
                                                        })()).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill="#10b981" />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            {(() => {
                                                const counts = {};
                                                (selectedQrForStats.scans || []).forEach(s => counts[s.device || 'Unknown'] = (counts[s.device || 'Unknown'] || 0) + 1);
                                                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                                                return Object.entries(counts).map(([device, count], idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151' }}>{device}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                                            <span style={{ fontWeight: '600', color: '#7c3aed' }}>{count}</span>
                                                            <span style={{ color: '#9ca3af' }}>{Math.round((count / (total || 1)) * 100)}%</span>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Scans by Country */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b0082', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '4px', height: '4px', background: '#4b0082', borderRadius: '50%' }}></span> Scans by Country
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '120px', height: '120px' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={(() => {
                                                            const counts = {};
                                                            (selectedQrForStats.scans || []).forEach(s => {
                                                                const country = (s.location || 'Unknown, Unknown').split(',')[1]?.trim() || 'Unknown';
                                                                counts[country] = (counts[country] || 0) + 1;
                                                            });
                                                            return Object.entries(counts).map(([name, value]) => ({ name, value }));
                                                        })()}
                                                        innerRadius={40}
                                                        outerRadius={55}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        <Cell fill="#10b981" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            {(() => {
                                                const counts = {};
                                                (selectedQrForStats.scans || []).forEach(s => {
                                                    const country = (s.location || 'Unknown, Unknown').split(',')[1]?.trim() || 'Unknown';
                                                    counts[country] = (counts[country] || 0) + 1;
                                                });
                                                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                                                return Object.entries(counts).map(([country, count], idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151' }}>{country}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                                            <span style={{ fontWeight: '600', color: '#7c3aed' }}>{count}</span>
                                                            <span style={{ color: '#9ca3af' }}>{Math.round((count / (total || 1)) * 100)}%</span>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Scans by City */}
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b0082', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '4px', height: '4px', background: '#4b0082', borderRadius: '50%' }}></span> Scans by City
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '120px', height: '120px' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={(() => {
                                                            const counts = {};
                                                            (selectedQrForStats.scans || []).forEach(s => {
                                                                const city = (s.location || 'Unknown, Unknown').split(',')[0]?.trim() || 'Unknown';
                                                                counts[city] = (counts[city] || 0) + 1;
                                                            });
                                                            return Object.entries(counts).map(([name, value]) => ({ name, value }));
                                                        })()}
                                                        innerRadius={40}
                                                        outerRadius={55}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        <Cell fill="#ef4444" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            {(() => {
                                                const counts = {};
                                                (selectedQrForStats.scans || []).forEach(s => {
                                                    const city = (s.location || 'Unknown, Unknown').split(',')[0]?.trim() || 'Unknown';
                                                    counts[city] = (counts[city] || 0) + 1;
                                                });
                                                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                                                return Object.entries(counts).map(([city, count], idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151' }}>{city}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                                            <span style={{ fontWeight: '600', color: '#7c3aed' }}>{count}</span>
                                                            <span style={{ color: '#9ca3af' }}>{Math.round((count / (total || 1)) * 100)}%</span>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* HEATMAP COLUMN */}
                            <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflowY: 'auto' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000', margin: 0 }}>Activity Heatmap</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.25rem 0 0 0' }}>When your QR code is most active</p>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    {/* Grid Header */}
                                    <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '40px' }}></div> {/* Spacer for time labels */}
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <div key={day} style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#666', fontWeight: '500' }}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grid Body */}
                                    {Array.from({ length: 24 }).map((_, hour) => (
                                        <div key={hour} style={{ display: 'flex', marginBottom: '4px', alignItems: 'center' }}>
                                            <div style={{ width: '40px', fontSize: '0.65rem', color: '#999', textAlign: 'right', paddingRight: '10px' }}>
                                                {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                                            </div>
                                            {Array.from({ length: 7 }).map((_, dayDiff) => {
                                                // 0 = Sunday, but UI shows Mon first. Data logic: Mon=1...Sun=0.
                                                // Simple mapping: Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6), Sun(0)

                                                const dayIndex = (dayDiff + 1) % 7; // Map 0->1(Mon), 6->0(Sun)

                                                const count = (selectedQrForStats.scans || []).filter(s => {
                                                    const d = new Date(s.timestamp);
                                                    return d.getDay() === dayIndex && d.getHours() === hour;
                                                }).length;

                                                let bg = '#f9fafb';
                                                let color = 'transparent';

                                                if (count > 0) {
                                                    bg = '#7c3aed'; // Solid purple for any activity for now to match style
                                                    color = '#fff';
                                                }

                                                return (
                                                    <div
                                                        key={dayDiff}
                                                        style={{
                                                            flex: 1,
                                                            height: '24px',
                                                            background: count > 0 ? '#7c3aed' : '#f3f4f6',
                                                            margin: '0 2px',
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.6rem',
                                                            color: '#fff'
                                                        }}
                                                        title={`Count: ${count}`}
                                                    >
                                                        {count > 0 ? count : ''}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#000', margin: 0 }}>My QR Codes</h1>
                            <button
                                onClick={() => navigate('/select-template')}
                                style={{
                                    background: '#7c3aed',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: isMobile ? '0.5rem' : '0.625rem 1.25rem',
                                    borderRadius: isMobile ? '50%' : '6px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    position: isMobile ? 'fixed' : 'static',
                                    bottom: isMobile ? '2rem' : 'auto',
                                    right: isMobile ? '1.5rem' : 'auto',
                                    zIndex: 100,
                                    boxShadow: isMobile ? '0 4px 12px rgba(124, 58, 237, 0.5)' : 'none'
                                }}
                            >
                                <Plus size={isMobile ? 24 : 16} />
                                {!isMobile && "CREATE NEW QR"}
                            </button>
                        </div>

                        {/* Search Bar - Full width on Mobile */}
                        {isMobile && (
                            <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
                                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                                        border: '1px solid #7c3aed',
                                        borderRadius: '50px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        background: '#fff'
                                    }}
                                />
                            </div>
                        )}

                        {/* Filters Row - Replaced by icon on Mobile */}
                        {!isMobile ? (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={selectedTypeFilter}
                                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                        style={{
                                            padding: '0.5rem 2rem 0.5rem 0.75rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            color: '#666',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            minWidth: '150px'
                                        }}
                                    >
                                        <option value="All types">All types</option>
                                        {qrTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        style={{
                                            padding: '0.5rem 2rem 0.5rem 0.75rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            color: '#666',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            appearance: 'none',
                                            minWidth: '140px'
                                        }}
                                    >
                                        <option value="Last Created">Last Created</option>
                                        <option value="First Created">First Created</option>
                                        <option value="Most Scanned">Most Scanned</option>
                                        <option value="Last 30 Days">Last 30 Days</option>
                                        <option value="Lifetime">Lifetime</option>
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                </div>

                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDate(start);
                                            setEndDate(end);
                                        }}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        customInput={<DateCustomInput startDate={startDate} endDate={endDate} />}
                                    />
                                </div>

                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setActiveTab('All');
                                            setSortOption('Last Created');
                                            setSelectedTypeFilter('All types');
                                            setStartDate(null);
                                            setEndDate(null);
                                            toast.success('All filters cleared');
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#7c3aed',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                    <div style={{ position: 'relative', width: '220px' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Sliders size={20} color="#666" />
                                </button>
                            </div>
                        )}

                        {/* Pagination Controls - Stack on Mobile */}
                        <div style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '0.875rem', color: '#666' }}>Show:</span>
                                <select
                                    value={pageLimit}
                                    onChange={(e) => {
                                        setPageLimit(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span style={{ fontSize: '0.875rem', color: '#666' }}>per page</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: isMobile ? '100%' : 'auto', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', order: isMobile ? 2 : 1 }}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            background: currentPage === 1 ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div style={{ fontSize: '0.875rem', color: '#666', display: 'flex', alignItems: 'center', px: '0.5rem' }}>
                                        {currentPage} / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: '#666', order: isMobile ? 1 : 2 }}>
                                    {totalQRs} total
                                </span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '2rem', borderBottom: '2px solid #e5e5e5', marginBottom: '1.5rem' }}>
                            {['All', 'Dynamic', 'Static'].map(tab => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 0',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: activeTab === tab ? '#7c3aed' : '#999',
                                        borderBottom: activeTab === tab ? '3px solid #7c3aed' : 'none',
                                        marginBottom: '-2px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* QR Codes List */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#666', fontWeight: '500' }}>
                                Loading QR Codes...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
                                <div style={{ marginBottom: '1rem' }}>⚠️ Error: {error}</div>
                                <button
                                    onClick={fetchQRs}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#fff',
                                        border: '1px solid #ef4444',
                                        color: '#ef4444',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : filteredQrs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>No QR codes yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredQrs.map((qr, index) => {
                                    const isMenuOpen = activeMenuId === qr._id;
                                    const expiryDate = new Date(qr.createdAt);
                                    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

                                    const isStatic = ['text', 'email', 'sms', 'wifi', 'vcard', 'static', 'website', 'map', 'phone'].includes(qr.type);

                                    return (
                                        <div
                                            key={qr._id}
                                            style={{
                                                position: 'relative',
                                                background: '#ffffff',
                                                border: '1px solid #e5e5e5',
                                                borderRadius: '8px',
                                                padding: '1.25rem 1.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2rem'
                                            }}
                                        >
                                            {/* QR Code + Info */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                alignItems: 'center',
                                                minWidth: isMobile ? 'none' : '280px',
                                                width: isMobile ? '100%' : 'auto'
                                            }}>
                                                <div style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    background: '#fff',
                                                    padding: '6px',
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {qr.qrImageUrl ? (
                                                        <img
                                                            src={`${qr.qrImageUrl}?t=${lastUpdated}`}
                                                            alt="QR Code"
                                                            style={{
                                                                width: '58px',
                                                                height: '58px',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    ) : (
                                                        <QRRenderer
                                                            value={isStatic ? qr.data : `${baseUrl}/view/${qr.shortId}`}
                                                            design={qr.design || {}}
                                                            size={58}
                                                            id={`qr-${qr._id}`}
                                                            margin={5}
                                                        />
                                                    )}
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: '#7c3aed', fontWeight: '600', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                                        {qr.type === 'app-store' ? 'App Store' : qr.type.charAt(0).toUpperCase() + qr.type.slice(1)}
                                                    </div>
                                                    <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '700', color: '#000', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                                        {renamingId === qr._id ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <input
                                                                    value={tempName}
                                                                    onChange={(e) => setTempName(e.target.value)}
                                                                    autoFocus
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: '700',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        borderBottom: '2px solid #7c3aed',
                                                                        background: 'transparent',
                                                                        outline: 'none',
                                                                        width: isMobile ? '100px' : '150px',
                                                                        padding: '0 0 2px 0'
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={handleCancelRename}
                                                                    style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '50%', cursor: 'pointer', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                                                >
                                                                    <X size={12} color="#ef4444" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleSaveRename(qr._id)}
                                                                    style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '50%', cursor: 'pointer', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                                                >
                                                                    <Check size={12} color="#16a34a" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span style={{ maxWidth: isMobile ? '150px' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {qr.name || 'Untitled QR'}
                                                                </span>
                                                                <Edit
                                                                    size={12}
                                                                    color="#999"
                                                                    style={{ cursor: 'pointer', opacity: 0.6 }}
                                                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                                                    onMouseOut={(e) => e.target.style.opacity = 0.6}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStartRename(qr);
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#999', fontSize: '0.75rem' }}>
                                                            <Calendar size={12} />
                                                            <span>Expires At: {expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        {qr.scanLimitEnabled && qr.scanLimit && (qr.scanCount || (qr.scans || []).length) >= qr.scanLimit && (
                                                            <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '600' }}>
                                                                The scan limit you set has been reached.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* URLs Section - Hidden on Mobile and for Static QRs */}
                                            {!isMobile && !isStatic && (
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid #f0f0f0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Link size={14} color="#999" />
                                                        <a
                                                            href={`${baseUrl}/view/${qr.shortId}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ color: '#000', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '500' }}
                                                        >
                                                            {`${baseUrl}/view/${qr.shortId}`}
                                                        </a>
                                                        {copiedId === qr._id ? (
                                                            <Check size={12} color="#16a34a" />
                                                        ) : (
                                                            <Copy
                                                                size={12}
                                                                color="#7c3aed"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleCopyUrl(qr)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Globe size={14} color="#999" />
                                                        <span style={{ color: '#999', fontSize: '0.875rem' }}>
                                                            {qr.shortId}
                                                        </span>
                                                        <Edit
                                                            size={12}
                                                            color="#7c3aed"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleEditUrlClick(qr)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Scans + Actions */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: isMobile ? '0.5rem' : '1.5rem',
                                                marginLeft: 'auto'
                                            }}>
                                                {!isMobile && !isStatic && (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '60px'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '1.75rem',
                                                            fontWeight: '700',
                                                            color: (qr.scanLimitEnabled && qr.scanLimit && (qr.scanCount || (qr.scans || []).length) >= qr.scanLimit) ? '#ef4444' : '#000',
                                                            lineHeight: 1
                                                        }}>
                                                            {(qr.scans || []).length}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.75rem',
                                                            color: '#999',
                                                            fontWeight: '500',
                                                            marginTop: '2px'
                                                        }}>
                                                            Scans
                                                        </div>
                                                    </div>
                                                )}

                                                {!isMobile && isStatic && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '100px'
                                                    }}>
                                                        <span style={{
                                                            background: '#3b82f6',
                                                            color: '#fff',
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '50px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            Static QR
                                                        </span>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handleDownloadClick(qr)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#fff',
                                                        border: '1.5px solid #e5e5e5',
                                                        color: '#7c3aed',
                                                        borderRadius: isMobile ? '50%' : '20px',
                                                        width: isMobile ? '40px' : 'auto',
                                                        height: isMobile ? '40px' : 'auto',
                                                        padding: isMobile ? '0' : '0.5rem 1rem',
                                                        fontWeight: '700',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {isMobile ? <Download size={20} /> : <>DOWNLOAD <Download size={14} /></>}
                                                </button>

                                                <div className="qr-menu-container" style={{ position: 'relative' }}>
                                                    <button
                                                        onClick={(e) => toggleMenu(e, qr._id)}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            border: '1px solid #e5e5e5',
                                                            background: '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            color: '#666'
                                                        }}
                                                    >
                                                        <MoreVertical size={20} />
                                                    </button>

                                                    {/* Delete Tooltip Modal (Same as Statistics Page) */}
                                                    {deleteConfirmationId === qr._id && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 'calc(100% + 15px)',
                                                            right: '-8px',
                                                            width: '280px',
                                                            background: '#ffffff',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                            border: '1px solid #e5e5e5',
                                                            padding: '1.25rem',
                                                            zIndex: 110,
                                                            cursor: 'default',
                                                            textAlign: 'left'
                                                        }} onClick={e => e.stopPropagation()}>
                                                            {/* Arrow */}
                                                            <div style={{
                                                                position: 'absolute',
                                                                bottom: '-6px',
                                                                right: '20px',
                                                                width: '12px',
                                                                height: '12px',
                                                                background: '#ffffff',
                                                                transform: 'rotate(45deg)',
                                                                borderRight: '1px solid #e5e5e5',
                                                                borderBottom: '1px solid #e5e5e5',
                                                            }}></div>

                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                                                                <div style={{
                                                                    minWidth: '20px', height: '20px', background: '#fbbf24', borderRadius: '50%',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                                                                }}>
                                                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>!</span>
                                                                </div>
                                                                <div>
                                                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: '700', color: '#000' }}>Delete the QR Code</h4>
                                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>Are you sure to delete this QR Code?</p>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => setDeleteConfirmationId(null)}
                                                                    disabled={isDeleting}
                                                                    style={{
                                                                        padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #e5e5e5',
                                                                        background: '#fff', color: '#666', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500'
                                                                    }}>
                                                                    No
                                                                </button>
                                                                <button
                                                                    onClick={confirmDelete}
                                                                    disabled={isDeleting}
                                                                    style={{
                                                                        padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: '#ef4444',
                                                                        color: '#fff', fontSize: '0.85rem', cursor: isDeleting ? 'not-allowed' : 'pointer', fontWeight: '500',
                                                                        minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        opacity: isDeleting ? 0.8 : 1
                                                                    }}>
                                                                    {isDeleting ? (
                                                                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                                    ) : 'Yes'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isMenuOpen && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: openUpwards ? '45px' : 'auto',
                                                            top: openUpwards ? 'auto' : '45px',
                                                            right: '0',
                                                            width: '180px',
                                                            background: '#ffffff',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                            border: '1px solid #e5e5e5',
                                                            zIndex: 100,
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{ padding: '0.5rem 0' }}>
                                                                {[
                                                                    { icon: Edit, label: 'Edit', color: '#666', action: () => handleEditQR(qr), dynamicOnly: true },
                                                                    { icon: BarChart, label: 'Statistics', color: '#666', action: () => navigate(`/statistics/${qr._id}`), dynamicOnly: true },
                                                                    { icon: Trash2, label: 'Delete', color: '#ef4444', action: () => handleDeleteClick(qr._id) }
                                                                ].filter(item => !item.dynamicOnly || !isStatic).map((item, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (item.action) item.action();
                                                                            toggleMenu(e, qr._id);
                                                                        }}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.75rem',
                                                                            width: '100%',
                                                                            padding: '0.625rem 1rem',
                                                                            border: 'none',
                                                                            background: '#fff',
                                                                            cursor: 'pointer',
                                                                            color: item.color,
                                                                            fontSize: '0.875rem',
                                                                            transition: 'background 0.2s',
                                                                            textAlign: 'left',
                                                                            fontWeight: '400'
                                                                        }}
                                                                        onMouseEnter={(e) => e.target.style.background = '#f8f8f8'}
                                                                        onMouseLeave={(e) => e.target.style.background = '#fff'}
                                                                    >
                                                                        <item.icon size={15} />
                                                                        {item.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                        }
                    </>
                )}
            </div>

            {/* Edit URL Modal */}
            {
                isUrlModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            background: '#ffffff', borderRadius: '12px', width: isMobile ? '90%' : '500px', padding: '1.5rem',
                            position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            <button
                                onClick={handleCloseUrlModal}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={20} color="#999" />
                            </button>

                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000', marginBottom: '1.5rem' }}>
                                Edit QR Short ID
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed', marginBottom: '0.5rem' }}>
                                        QR Slug / Short ID
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #ddd', borderRadius: '8px', padding: '0 0.75rem' }}>
                                        <span style={{ color: '#9ca3af', fontSize: '0.875rem', userSelect: 'none' }}>{baseUrl.replace(/^https?:\/\//, '')}/view/</span>
                                        <input
                                            value={tempShortId}
                                            onChange={(e) => setTempShortId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            style={{
                                                flex: 1, padding: '0.75rem 0.5rem', border: 'none', background: 'transparent',
                                                fontSize: '1rem', color: '#000', outline: 'none', fontWeight: '500'
                                            }}
                                        />
                                    </div>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                                        Use only lowercase letters, numbers, and hyphens.
                                    </p>
                                </div>

                                <div style={{
                                    background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px', padding: '1rem',
                                    display: 'flex', gap: '0.75rem'
                                }}>
                                    <AlertTriangle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.8rem', color: '#9a3412', lineHeight: '1.5', margin: 0 }}>
                                        <span style={{ fontWeight: 'bold' }}>Important:</span> Changing the Short ID will update the QR code pattern. Any previously printed or shared QR codes with the old ID will <span style={{ fontWeight: 'bold' }}>stop working</span>.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={handleCloseUrlModal}
                                        style={{
                                            flex: 1, background: '#fff', border: '1.5px solid #e5e5e5', color: '#666',
                                            padding: '0.75rem', borderRadius: '24px', fontWeight: '600', cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateUrl}
                                        disabled={isUpdatingUrl}
                                        style={{
                                            flex: 2, background: isUpdatingUrl ? '#a78bfa' : '#7c3aed', border: 'none', color: '#fff',
                                            padding: '0.75rem', borderRadius: '24px', fontWeight: '700', cursor: isUpdatingUrl ? 'not-allowed' : 'pointer',
                                            fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        {isUpdatingUrl ? (
                                            <>
                                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                                Updating...
                                            </>
                                        ) : 'Update QR Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Download Modal */}
            {
                isDownloadModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            background: '#ffffff', borderRadius: '12px', width: isMobile ? '90%' : '600px', padding: '1.5rem',
                            position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            maxHeight: isMobile ? '90vh' : 'auto', overflowY: 'auto'
                        }}>
                            <button
                                onClick={handleCloseDownloadModal}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={20} color="#999" />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000', marginBottom: '1.5rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1rem' }}>
                                Save as...
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                {[
                                    { id: 'jpeg', label: 'JPEG', icon: ImageIcon, desc: 'Standard Image' },
                                    { id: 'png', label: 'PNG', icon: ImageIcon, desc: 'Transparency support' },
                                    { id: 'svg', label: 'SVG', icon: PenTool, desc: 'Vector File' },
                                    { id: 'pdf', label: 'PDF', icon: FileText, desc: 'Universal file' }
                                ].map((fmt) => (
                                    <div
                                        key={fmt.id}
                                        onClick={() => setDownloadFormat(fmt.id)}
                                        style={{
                                            border: `2px solid ${downloadFormat === fmt.id ? '#7c3aed' : '#e5e5e5'}`,
                                            borderRadius: '8px',
                                            padding: '1rem 0.5rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: downloadFormat === fmt.id ? '#faf5ff' : '#fff'
                                        }}
                                    >
                                        <div style={{ color: '#7c3aed', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                            <fmt.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div style={{ color: '#7c3aed', fontWeight: 'bold', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                            {fmt.label}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#999' }}>
                                            {fmt.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {downloadFormat && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        onClick={handleRunDownload}
                                        style={{
                                            background: '#7c3aed',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.5)',
                                            width: isMobile ? '100%' : 'auto',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        DOWNLOAD QR
                                        <Download size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Filters Drawer (Mobile Only) */}
            {
                isMobile && isFilterDrawerOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 1100,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{
                            background: '#fff',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '1.5rem',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Filters</h2>
                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    <X size={20} color="#666" />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Filter by Type */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.75rem' }}>
                                        Filter by Type
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={selectedTypeFilter}
                                            onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 2rem 0.75rem 1rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                color: '#333',
                                                background: '#fff',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="All types">All types</option>
                                            {qrTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.75rem' }}>
                                        Sort By
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 2rem 0.75rem 1rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                color: '#333',
                                                background: '#fff',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="Last Created">Last Created</option>
                                            <option value="First Created">First Created</option>
                                            <option value="Most Scanned">Most Scanned</option>
                                            <option value="Last 30 Days">Last 30 Days</option>
                                            <option value="Lifetime">Lifetime</option>
                                        </select>
                                        <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.75rem' }}>
                                        Date Range
                                    </label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDate(start);
                                            setEndDate(end);
                                        }}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        customInput={
                                            <div style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span>{startDate ? `${startDate.toLocaleDateString()} - ${endDate ? endDate.toLocaleDateString() : '...'}` : 'Select dates'}</span>
                                                <Calendar size={18} color="#666" />
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setActiveTab('All');
                                            setSortOption('Last Created');
                                            setSelectedTypeFilter('All types');
                                            setStartDate(null);
                                            setEndDate(null);
                                            setIsFilterDrawerOpen(false);
                                            toast.success('Filters cleared');
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            background: '#f5f5f5',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            color: '#666',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => setIsFilterDrawerOpen(false)}
                                        style={{
                                            flex: 2,
                                            padding: '1rem',
                                            background: '#7c3aed',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div >
    );
};

export default Dashboard;