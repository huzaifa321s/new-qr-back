import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DesignQR from '../components/DesignQR';
import QRRenderer from '../components/QRRenderer';
import AppStoreConfig from '../components/AppStoreConfig';
import MenuConfig from '../components/MenuConfig';
import CustomConfig from '../components/CustomConfig';
import CouponConfig from '../components/CouponConfig';
import BusinessCardConfig from '../components/BusinessCardConfig';
import BusinessPageConfig from '../components/BusinessPageConfig';
import BioPageConfig from '../components/BioPageConfig';
import SurveyConfig from '../components/SurveyConfig';
import LeadGenerationConfig from '../components/LeadGenerationConfig';
import RatingConfig from '../components/RatingConfig';
import ReviewsConfig from '../components/ReviewsConfig';
import SocialMediaConfig from '../components/SocialMediaConfig';
import PDFConfig from '../components/PDFConfig';
import MultipleLinksConfig from '../components/MultipleLinksConfig';
import PasswordProtectedConfig from '../components/PasswordProtectedConfig';
import EventConfig from '../components/EventConfig';
import MobilePreview from '../components/MobilePreview';
import DynamicUrlConfig from '../components/DynamicUrlConfig';
import VideoConfig from '../components/VideoConfig';
import ImageConfig from '../components/ImageConfig';
import ProductPageConfig from '../components/ProductPageConfig';
import { qrTypes } from '../utils/qrTypes';
import { getPreviewConfig } from '../utils/previewConfigs';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

const Generator = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const typeFromQuery = params.get('type');
    const editingQr = location.state?.editingQr;
    // Derive selectedType from state, editingQr, or query param
    const selectedType = location.state?.selectedType || editingQr?.type || typeFromQuery || 'website';
    const isEditing = !!editingQr;
    const qrRef = useRef(null);

    const [activeStep, setActiveStep] = useState('content'); // 'content' | 'design'
    const [qrName, setQrName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordExpiry, setPasswordExpiry] = useState('');
    const [scanLimitEnabled, setScanLimitEnabled] = useState(false);
    const [scanLimit, setScanLimit] = useState('');
    const [qrNameError, setQrNameError] = useState('');
    const qrNameRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedShortId, setGeneratedShortId] = useState(null); // Store shortId after creation
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [activeTab, setActiveTab] = useState('generator');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [initialState, setInitialState] = useState({ pageConfig: {}, qrDesign: {}, qrName: '' });
    const [scannability, setScannability] = useState({
        score: 100,
        text: 'EXCELLENT',
        color: '#166534',
        bgColor: '#dcfce7'
    });
    const [loadingHash, setLoadingHash] = useState(0);

    // Shuffle QR pattern during loading state
    useEffect(() => {
        let interval;
        if (isGenerating) {
            interval = setInterval(() => {
                setLoadingHash(prev => prev + 1);
            }, 100);
        } else {
            setLoadingHash(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper to generate a simple hash of an object for live preview updates
    const getHash = (obj) => {
        try {
            const str = JSON.stringify(obj);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(36);
        } catch (e) {
            return 'default';
        }
    };

    // Helper function to generate QR value URL for preview/display
    const getQRValue = () => {
        const baseUrl = (import.meta.env.VITE_FRONTEND_URL || window.location.origin).replace(/\/$/, '');

        // Priority: generatedShortId (after creation) > editingQr.shortId (edit mode) > preview
        const id = generatedShortId || (isEditing ? editingQr?.shortId : null);

        if (!id) {
            // For preview during creation
            let previewUrl = '';
            if ((selectedType === 'dynamic-url' || selectedType === 'website') && pageConfig.url) {
                previewUrl = pageConfig.url;
            } else if (['app-store', 'menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(selectedType)) {
                previewUrl = `${baseUrl}/view/preview`;
            } else {
                const backendUrl = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin.replace(':5173', ':3000'));
                previewUrl = `${backendUrl}/preview`;
            }

            // Append config hash to ensure QR pattern updates in real-time as content changes
            const configHash = getHash(pageConfig);
            const extraHash = isGenerating ? `&loading=${loadingHash}` : '';
            return previewUrl.includes('?') ? `${previewUrl}&v=${configHash}${extraHash}` : `${previewUrl}?v=${configHash}${extraHash}`;
        }

        // Generate actual URL based on type
        // While generating, we still want the preview to animate
        const extraHash = isGenerating ? `?loading=${loadingHash}` : '';

        if (['app-store', 'menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(selectedType)) {
            return `${baseUrl}/view/${id}${extraHash}`;
        } else {
            const backendUrl = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin.replace(':5173', ':3000'));
            return `${backendUrl}/${id}${extraHash}`;
        }
    };

    // --- SCANNABILITY ENGINE ---
    const getRelativeLuminance = (hex) => {
        // Handle cases where hex might be null or undefined
        if (!hex) return 0;
        let c = hex.replace(/^#/, '');
        if (c.length === 3) {
            c = c.split('').map(x => x + x).join('');
        }
        const rgb = c.match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const getContrastRatio = (color1, color2) => {
        const L1 = getRelativeLuminance(color1);
        const L2 = getRelativeLuminance(color2);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    };

    const calculateScannability = (design, qrValue) => {
        let score = 100;
        const contrast = getContrastRatio(design.dots.color, design.background.color);

        // 1. Contrast Check (Weight: 60%)
        if (contrast < 2.5) score -= 60;
        else if (contrast < 4.5) score -= 30;

        // 2. Logo Check (Weight: 20%)
        if (design.image?.url && design.imageOptions?.imageSize > 0.35) {
            score -= 20;
        } else if (design.image?.url && design.imageOptions?.imageSize > 0.2) {
            score -= 10;
        }

        // 3. Data Density (Weight: 20%)
        if (qrValue.length > 200) score -= 20;
        else if (qrValue.length > 100) score -= 10;

        // Final result mapping
        if (score >= 90) return { score, text: 'EXCELLENT', color: '#166534', bgColor: '#dcfce7' };
        if (score >= 60) return { score, text: 'GOOD', color: '#1e40af', bgColor: '#dbeafe' };
        return { score, text: 'CRITICAL', color: '#991b1b', bgColor: '#fee2e2' };
    };
    // ---------------------------

    // QR Code Design State (Visuals)
    const [qrDesign, setQrDesign] = useState({
        dots: { style: 'square', color: '#000000' },
        cornersSquare: { style: 'square', color: '#000000' },
        cornersDot: { style: 'dot', color: '#000000' },
        background: { color: '#ffffff' },
        image: { url: '' },
        imageOptions: { hideBackgroundDots: false, imageSize: 0.4 }
    });

    // Page Configuration State (Content + Page Theme)
    const [pageConfig, setPageConfig] = useState({});

    // Populating state if editing
    useEffect(() => {
        const defaultConfig = getPreviewConfig(selectedType) || {};

        if (editingQr) {
            setQrName(editingQr.name || '');
            setPassword(editingQr.password || '');
            setPasswordExpiry(editingQr.passwordExpiry ? new Date(editingQr.passwordExpiry).toISOString().split('T')[0] : '');
            setScanLimitEnabled(editingQr.scanLimitEnabled || false);
            setScanLimit(editingQr.scanLimit || '');

            // Properly merge design with defaults to ensure all fields are populated
            const defaultDesign = {
                dots: { style: 'square', color: '#000000' },
                cornersSquare: { style: 'square', color: '#000000' },
                cornersDot: { style: 'dot', color: '#000000' },
                background: { color: '#ffffff' },
                image: { url: '' },
                imageOptions: { hideBackgroundDots: false, imageSize: 0.4 }
            };

            setQrDesign({
                dots: { ...defaultDesign.dots, ...(editingQr.design?.dots || {}) },
                cornersSquare: { ...defaultDesign.cornersSquare, ...(editingQr.design?.cornersSquare || {}) },
                cornersDot: { ...defaultDesign.cornersDot, ...(editingQr.design?.cornersDot || {}) },
                background: { ...defaultDesign.background, ...(editingQr.design?.background || {}) },
                image: { ...defaultDesign.image, ...(editingQr.design?.image || {}) },
                imageOptions: { ...defaultDesign.imageOptions, ...(editingQr.design?.imageOptions || {}) }
            });

            // Populate content - ensure all saved data is loaded
            const loadedConfig = {
                ...defaultConfig,
                businessInfo: editingQr.businessInfo ? { ...defaultConfig.businessInfo, ...editingQr.businessInfo } : defaultConfig.businessInfo,
                basicInfo: editingQr.basicInfo || defaultConfig.basicInfo,
                appLinks: editingQr.appLinks ? { ...defaultConfig.appLinks, ...editingQr.appLinks } : defaultConfig.appLinks,
                appStatus: editingQr.appStatus ? { ...defaultConfig.appStatus, ...editingQr.appStatus } : defaultConfig.appStatus,
                menu: editingQr.menu || defaultConfig.menu,
                timings: editingQr.timings || defaultConfig.timings,
                social: editingQr.social ? { ...defaultConfig.social, ...editingQr.social } : defaultConfig.social,
                coupon: editingQr.coupon || defaultConfig.coupon,
                customComponents: editingQr.customComponents || defaultConfig.customComponents,
                personalInfo: editingQr.personalInfo || defaultConfig.personalInfo,
                contact: editingQr.contact || defaultConfig.contact,
                facilities: editingQr.facilities || defaultConfig.facilities,
                exchange: editingQr.exchange || defaultConfig.exchange,
                openingHours: editingQr.openingHours || defaultConfig.openingHours,
                basicInfo: editingQr.basicInfo || defaultConfig.basicInfo,
                form: editingQr.form || defaultConfig.form,
                customFields: editingQr.customFields || defaultConfig.customFields,
                thankYou: editingQr.thankYou || defaultConfig.thankYou,
                rating: editingQr.rating || defaultConfig.rating,
                reviews: editingQr.reviews || defaultConfig.reviews,
                shareOption: editingQr.shareOption || defaultConfig.shareOption,
                uploadPdf: editingQr.pdf || defaultConfig.uploadPdf,
                links: editingQr.links || defaultConfig.links,
                socialLinks: editingQr.socialLinks || defaultConfig.socialLinks,
                infoFields: editingQr.infoFields || defaultConfig.infoFields,
                eventSchedule: editingQr.eventSchedule || defaultConfig.eventSchedule,
                venue: editingQr.venue || defaultConfig.venue,
                facilities: editingQr.facilities || defaultConfig.facilities,
                contactInfo: editingQr.contactInfo || defaultConfig.contactInfo,
                content: editingQr.productContent || defaultConfig.content,
                video: editingQr.video || defaultConfig.video,
                feedback: editingQr.feedback || defaultConfig.feedback,
                url: editingQr.dynamicUrl || defaultConfig.url,
                images: editingQr.images || defaultConfig.images,
                // Re-merge design to include page styles (like colors) and QR design
                design: {
                    ...defaultConfig.design,
                    ...editingQr.design,
                    // Ensure QR design fields are preserved
                    dots: editingQr.design?.dots || defaultConfig.design?.dots,
                    cornersSquare: editingQr.design?.cornersSquare || defaultConfig.design?.cornersSquare,
                    cornersDot: editingQr.design?.cornersDot || defaultConfig.design?.cornersDot,
                    background: editingQr.design?.background || defaultConfig.design?.background,
                    image: editingQr.design?.image || defaultConfig.design?.image,
                    imageOptions: editingQr.design?.imageOptions || defaultConfig.design?.imageOptions
                }
            };

            setPageConfig(loadedConfig);

            // Also update qrDesign state with saved design
            if (editingQr.design) {
                const defaultDesign = {
                    dots: { style: 'square', color: '#000000' },
                    cornersSquare: { style: 'square', color: '#000000' },
                    cornersDot: { style: 'dot', color: '#000000' },
                    background: { color: '#ffffff' },
                    image: { url: '' },
                    imageOptions: { hideBackgroundDots: false, imageSize: 0.4 }
                };
                const loadedDesign = {
                    dots: { ...defaultDesign.dots, ...(editingQr.design.dots || {}) },
                    cornersSquare: { ...defaultDesign.cornersSquare, ...(editingQr.design.cornersSquare || {}) },
                    cornersDot: { ...defaultDesign.cornersDot, ...(editingQr.design.cornersDot || {}) },
                    background: { ...defaultDesign.background, ...(editingQr.design.background || {}) },
                    image: { ...defaultDesign.image, ...(editingQr.design.image || {}) },
                    imageOptions: { ...defaultDesign.imageOptions, ...(editingQr.design.imageOptions || {}) }
                };
                setQrDesign(loadedDesign);

                // Store initial state for change detection
                setInitialState({
                    pageConfig: JSON.parse(JSON.stringify(loadedConfig)),
                    qrDesign: JSON.parse(JSON.stringify(loadedDesign)),
                    qrName: editingQr.name || ''
                });
            }
        } else {
            const newConfig = { ...defaultConfig, type: selectedType };
            setPageConfig(newConfig);

            // Store initial state for new QR
            const defaultDesign = {
                dots: { style: 'square', color: '#000000' },
                cornersSquare: { style: 'square', color: '#000000' },
                cornersDot: { style: 'dot', color: '#000000' },
                background: { color: '#ffffff' },
                image: { url: '' },
                imageOptions: { hideBackgroundDots: false, imageSize: 0.4 }
            };
            setInitialState({
                pageConfig: JSON.parse(JSON.stringify(newConfig)),
                qrDesign: JSON.parse(JSON.stringify(defaultDesign)),
                qrName: ''
            });
        }
    }, [selectedType, editingQr]);

    // Detect changes
    useEffect(() => {
        if (!initialState.pageConfig || Object.keys(initialState.pageConfig).length === 0) return;

        const currentStateStr = JSON.stringify({ pageConfig, qrDesign, qrName });
        const initialStateStr = JSON.stringify(initialState);

        setHasUnsavedChanges(currentStateStr !== initialStateStr);
    }, [pageConfig, qrDesign, qrName, initialState]);

    useEffect(() => {
        if (!qrDesign || !getQRValue()) return;
        const result = calculateScannability(qrDesign, getQRValue());
        setScannability(result);
    }, [qrDesign, pageConfig, generatedShortId, selectedType]);

    const handleSave = async () => {
        if (!qrName.trim()) {
            setQrNameError('QR name is required');
            if (qrNameRef.current) {
                qrNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                qrNameRef.current.focus();
            }
            return;
        }

        setQrNameError('');

        setIsGenerating(true);

        try {
            // Capture client-side image to ensure WYSIWYG
            let qrImageBase64 = null;
            if (qrRef.current && qrRef.current.getDataURL) {
                qrImageBase64 = qrRef.current.getDataURL();
            }

            // Generate actual QR URL based on type
            // For new QRs, backend will generate the correct URL, so we can send a placeholder
            // For editing, use existing shortId to generate correct URL
            let qrDataUrl = 'https://placeholder.com';

            if (isEditing) {
                const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

                if (['app-store', 'menu', 'business-page', 'custom-type', 'coupon', 'business-card', 'bio-page', 'lead-generation', 'rating', 'reviews', 'social-media', 'pdf', 'multiple-links', 'password-protected', 'event', 'product-page', 'video', 'image'].includes(selectedType)) {
                    qrDataUrl = `${baseUrl}/view/${editingQr.shortId}`;
                } else {
                    const backendUrl = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin.replace(':5173', ':3000'));
                    qrDataUrl = `${backendUrl}/${editingQr.shortId}`;
                }
            }
            // For new QRs, backend will generate correct URL in createDynamicQR

            const payload = {
                type: selectedType,
                qrImage: qrImageBase64,
                data: qrDataUrl,
                design: {
                    ...pageConfig.design,
                    ...qrDesign,
                },
                businessInfo: pageConfig.businessInfo,
                menu: pageConfig.menu,
                timings: pageConfig.timings,
                social: pageConfig.social,
                isBusinessPage: ['business-page', 'app-store'].includes(selectedType),
                appLinks: pageConfig.appLinks,
                appStatus: pageConfig.appStatus,
                facilities: pageConfig.facilities,
                contact: pageConfig.contact,
                personalInfo: pageConfig.personalInfo,
                coupon: pageConfig.coupon,
                customComponents: pageConfig.customComponents,
                exchange: pageConfig.exchange,
                openingHours: pageConfig.openingHours,
                basicInfo: pageConfig.basicInfo,
                form: pageConfig.form,
                customFields: pageConfig.customFields,
                thankYou: pageConfig.thankYou,
                rating: pageConfig.rating,
                reviews: pageConfig.reviews,
                shareOption: pageConfig.shareOption,
                pdf: pageConfig.uploadPdf, // Map frontend 'uploadPdf' to backend 'pdf'
                links: pageConfig.links,
                socialLinks: pageConfig.socialLinks,
                infoFields: pageConfig.infoFields,
                eventSchedule: pageConfig.eventSchedule,
                venue: pageConfig.venue,
                contactInfo: pageConfig.contactInfo,
                productContent: pageConfig.content,
                video: pageConfig.video,
                feedback: pageConfig.feedback,
                images: pageConfig.images,
                dynamicUrl: pageConfig.url,
                name: qrName,
                password,
                passwordExpiry,
                scanLimitEnabled,
                scanLimit: scanLimit ? Number(scanLimit) : null
            };

            if (isEditing) {
                await axios.put(`/api/qr/${editingQr._id}`, payload);
            } else {
                const response = await axios.post('/api/qr/dynamic', payload);
                // Store the generated shortId for immediate use
                if (response.data?.shortId) {
                    setGeneratedShortId(response.data.shortId);
                }
            }

            navigate('/');

        } catch (error) {
            console.error('Error generating QR:', error);
            alert('Failed to generate/update QR Code. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleContinue = () => {
        if (selectedType === 'app-store') {
            const googleUrl = (pageConfig?.appLinks?.google || '').trim();
            const appleUrl = (pageConfig?.appLinks?.apple || '').trim();

            const isGooglePresent = googleUrl !== '' && googleUrl !== 'https://';
            const isApplePresent = appleUrl !== '' && appleUrl !== 'https://';

            // 1. Check if at least one is present
            if (!isGooglePresent && !isApplePresent) {
                toast.error('Please provide at least one valid Play Store or App Store link');
                return;
            }

            // 2. If Google is present, validate it
            if (isGooglePresent) {
                const isValidGoogle = googleUrl.includes('play.google.com');
                if (!isValidGoogle) {
                    toast.error('Please enter a valid Play Store URL (e.g., play.google.com/...)');
                    return;
                }
            }

            // 3. If Apple is present, validate it
            if (isApplePresent) {
                const isValidApple = appleUrl.includes('apps.apple.com') || appleUrl.includes('itunes.apple.com');
                if (!isValidApple) {
                    toast.error('Please enter a valid App Store URL (e.g., apps.apple.com/...)');
                    return;
                }
            }
        }
        setActiveStep('design');
    };

    const typeInfo = qrTypes.find(t => t.id === selectedType) || qrTypes[0];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Toaster position="top-right" />
            {/* Left Panel */}
            <div style={{
                flex: 1,
                padding: isMobile ? '1rem' : '2rem',
                overflowY: isMobile ? 'visible' : 'auto',
                height: isMobile ? 'auto' : '100vh',
                display: isMobile && activeTab !== 'generator' ? 'none' : 'block',
                marginBottom: isMobile ? '80px' : '0'
            }}>
                <div style={{ maxWidth: '100%', margin: '0 auto' }}>

                    {/* Header / Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <button
                            onClick={() => {
                                if (activeStep === 'design') {
                                    setActiveStep('content');
                                } else {
                                    // Check for unsaved changes before navigating back
                                    if (hasUnsavedChanges) {
                                        setShowUnsavedModal(true);
                                    } else {
                                        navigate(-1);
                                    }
                                }
                            }}
                            style={{
                                background: '#e0f2fe',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0ea5e9'
                            }}
                        >
                            ←
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '0.9rem' }}>
                                {activeStep === 'content' ? 'Content Configuration' : 'Design QR Code'}
                            </span>
                            <div style={{ width: '150px', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '0.5rem', position: 'relative' }}>
                                <div style={{
                                    width: activeStep === 'content' ? '70px' : '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                                    borderRadius: '2px',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0
                                }}></div>
                            </div>
                        </div>

                        <div style={{ width: '40px' }}></div>
                    </div>

                    {/* Step Content */}
                    {activeStep === 'content' ? (
                        <>
                            {selectedType === 'app-store' && (
                                <AppStoreConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'menu' && (
                                <MenuConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'coupon' && (
                                <CouponConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'business-card' && (
                                <BusinessCardConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'business-page' && (
                                <BusinessPageConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'bio-page' && (
                                <BioPageConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'survey' && (
                                <SurveyConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'lead-generation' && (
                                <LeadGenerationConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'rating' && (
                                <RatingConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'reviews' && (
                                <ReviewsConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'social-media' && (
                                <SocialMediaConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'pdf' && (
                                <PDFConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'multiple-links' && (
                                <MultipleLinksConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'custom-type' && (
                                <CustomConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'password-protected' && (
                                <PasswordProtectedConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'event' && (
                                <EventConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'dynamic-url' && (
                                <DynamicUrlConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'video' && (
                                <VideoConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'image' && (
                                <ImageConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType === 'product-page' && (
                                <ProductPageConfig
                                    config={pageConfig}
                                    onChange={setPageConfig}
                                />
                            )}

                            {selectedType !== 'app-store' && selectedType !== 'menu' && selectedType !== 'coupon' && selectedType !== 'business-card' && selectedType !== 'business-page' && selectedType !== 'bio-page' && selectedType !== 'survey' && selectedType !== 'lead-generation' && selectedType !== 'rating' && selectedType !== 'reviews' && selectedType !== 'social-media' && selectedType !== 'pdf' && selectedType !== 'multiple-links' && selectedType !== 'custom-type' && selectedType !== 'password-protected' && selectedType !== 'event' && selectedType !== 'dynamic-url' && selectedType !== 'video' && selectedType !== 'image' && selectedType !== 'product-page' && (

                                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                    Configuration for {typeInfo.name} is coming soon.
                                </div>
                            )}

                            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                                <button
                                    onClick={handleContinue}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease'
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
                        </>
                    ) : (
                        <DesignQR
                            design={qrDesign}
                            setDesign={setQrDesign}
                            qrName={qrName}
                            setQrName={setQrName}
                            qrNameRef={qrNameRef}
                            qrNameError={qrNameError}
                            setQrNameError={setQrNameError}
                            onSave={handleSave}
                            isGenerating={isGenerating}
                            isEditing={isEditing}
                            password={password}
                            setPassword={setPassword}
                            passwordExpiry={passwordExpiry}
                            setPasswordExpiry={setPasswordExpiry}
                            scanLimitEnabled={scanLimitEnabled}
                            setScanLimitEnabled={setScanLimitEnabled}
                            scanLimit={scanLimit}
                            setScanLimit={setScanLimit}
                        />
                    )}
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div style={{
                width: isMobile ? '100%' : '400px',
                background: 'linear-gradient(180deg, #eef2ff 0%, #f3e8ff 100%)',
                borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
                display: isMobile ? (activeTab === 'preview' ? 'flex' : 'none') : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: isMobile ? '1rem' : '2rem',
                position: isMobile ? 'relative' : 'sticky',
                top: 0,
                height: isMobile ? 'auto' : '100vh',
                overflowY: isMobile ? 'visible' : 'hidden',
                marginBottom: isMobile ? '80px' : '0'
            }}>
                <div style={{ marginBottom: '2rem' }}></div>

                {activeStep === 'content' ? (
                    <>
                        <div style={{
                            transform: 'scale(0.85)',
                            transformOrigin: 'top center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <MobilePreview
                                config={pageConfig}
                                qrDesign={qrDesign}
                                qrValue={getQRValue()}
                                isEditor={true}
                            />
                        </div>
                        {/* Background QR for Content Step */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0.1,
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}>
                            <QRRenderer
                                value={getQRValue()}
                                design={{
                                    ...pageConfig.design,
                                    ...qrDesign
                                }}
                                size={350}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ position: 'relative', width: '100%', marginTop: '2rem' }}>
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '20px',
                                background: '#fff',
                                border: '1px solid #8b5cf6',
                                color: '#8b5cf6',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                zIndex: 10,
                                textTransform: 'uppercase'
                            }}>
                                {typeInfo.name}
                            </div>

                            <div style={{
                                background: '#fff',
                                padding: '2rem',
                                borderRadius: '4px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <QRRenderer
                                    ref={qrRef}
                                    value={getQRValue()}
                                    design={{
                                        ...pageConfig.design,
                                        ...qrDesign
                                    }}
                                    size={240}
                                />
                            </div>
                        </div>

                        <div style={{
                            background: scannability.bgColor,
                            color: scannability.color,
                            padding: '0.25rem 1rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: `1px solid ${scannability.color}20`
                        }}>
                            Scannability: {scannability.text}
                        </div>
                    </>
                )}
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
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
                            cursor: 'pointer'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                        <span style={{ fontSize: '0.75rem', fontWeight: activeTab === 'preview' ? '600' : '400' }}>Preview</span>
                    </div>
                </div>
            )}

            {/* Unsaved Changes Modal */}
            {showUnsavedModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div
                        className="modal-entry-animation"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '90%',
                            position: 'relative',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowUnsavedModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                padding: '0',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>

                        {/* Modal content */}
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                marginBottom: '1rem',
                                marginTop: '0'
                            }}>
                                Are you sure?
                            </h2>
                            <p style={{
                                fontSize: '1rem',
                                color: '#6b7280',
                                marginBottom: '2rem',
                                lineHeight: '1.5'
                            }}>
                                Are you sure to discard this page? This will lose all the change you made.
                            </p>

                            {/* Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center'
                            }}>
                                <button
                                    onClick={() => setShowUnsavedModal(false)}
                                    style={{
                                        padding: '0.75rem 2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        backgroundColor: '#fff',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                    }}
                                >
                                    No
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUnsavedModal(false);
                                        navigate('/select-template');
                                    }}
                                    style={{
                                        padding: '0.75rem 2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#fff',
                                        backgroundColor: '#dc2626',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#b91c1c';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#dc2626';
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Generator;
