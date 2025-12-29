import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MobilePreview from '../components/MobilePreview';

const AppStoreLanding = () => {
    const { shortId } = useParams();
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/qr/${shortId}`);
                setQrData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shortId]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    if (!qrData) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>QR Code Not Found</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ width: '100%', height: '100vh', background: '#fff', overflow: 'hidden' }}>
                <MobilePreview config={qrData} isLiveView={true} />
            </div>
        </div>
    );
};

export default AppStoreLanding;
