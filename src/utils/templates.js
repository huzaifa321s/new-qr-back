// QR Code Template Presets
export const templates = [
    {
        id: 'classic',
        name: 'Classic',
        preview: '/templates/classic.png',
        design: {
            color: { dark: '#000000', light: '#ffffff' },
            dots: { style: 'square' },
            corners: { style: 'square' },
            frame: { style: 'none' }
        }
    },
    {
        id: 'modern',
        name: 'Modern',
        preview: '/templates/modern.png',
        design: {
            color: { dark: '#4F46E5', light: '#ffffff' },
            dots: { style: 'rounded' },
            corners: { style: 'extra-rounded' },
            frame: { style: 'none' }
        }
    },
    {
        id: 'gradient-blue',
        name: 'Ocean Blue',
        preview: '/templates/gradient-blue.png',
        design: {
            color: {
                dark: '#0EA5E9',
                light: '#ffffff',
                gradient: { type: 'linear', colors: ['#0EA5E9', '#3B82F6'] }
            },
            dots: { style: 'dots' },
            corners: { style: 'extra-rounded' },
            frame: { style: 'none' }
        }
    },
    {
        id: 'gradient-purple',
        name: 'Purple Dream',
        preview: '/templates/gradient-purple.png',
        design: {
            color: {
                dark: '#9333EA',
                light: '#ffffff',
                gradient: { type: 'linear', colors: ['#9333EA', '#EC4899'] }
            },
            dots: { style: 'classy-rounded' },
            corners: { style: 'extra-rounded' },
            frame: { style: 'none' }
        }
    },
    {
        id: 'minimal',
        name: 'Minimal',
        preview: '/templates/minimal.png',
        design: {
            color: { dark: '#1e293b', light: '#f8fafc' },
            dots: { style: 'dots' },
            corners: { style: 'dot' },
            frame: { style: 'none' }
        }
    },
    {
        id: 'vibrant',
        name: 'Vibrant',
        preview: '/templates/vibrant.png',
        design: {
            color: { dark: '#DC2626', light: '#FEF2F2' },
            dots: { style: 'classy' },
            corners: { style: 'extra-rounded' },
            frame: { style: 'none' }
        }
    }
];

// Frame Presets
export const frames = [
    {
        id: 'none',
        name: 'No Frame',
        preview: '/frames/none.png'
    },
    {
        id: 'basic',
        name: 'Basic',
        preview: '/frames/basic.png',
        style: {
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 0
        }
    },
    {
        id: 'rounded',
        name: 'Rounded',
        preview: '/frames/rounded.png',
        style: {
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 20
        }
    },
    {
        id: 'banner-top',
        name: 'Banner Top',
        preview: '/frames/banner-top.png',
        style: {
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            banner: {
                position: 'top',
                text: 'SCAN ME',
                backgroundColor: '#000000',
                textColor: '#ffffff',
                height: 40
            }
        }
    },
    {
        id: 'banner-bottom',
        name: 'Banner Bottom',
        preview: '/frames/banner-bottom.png',
        style: {
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            banner: {
                position: 'bottom',
                text: 'SCAN ME',
                backgroundColor: '#000000',
                textColor: '#ffffff',
                height: 40
            }
        }
    },
    {
        id: 'circular',
        name: 'Circular',
        preview: '/frames/circular.png',
        style: {
            padding: 30,
            backgroundColor: '#ffffff',
            borderRadius: 9999,
            shape: 'circle'
        }
    }
];
