export const menuPreviewConfig = {
    type: 'menu',
    design: {
        color: { dark: '#7f1d1d', light: '#ffffff' }, // Deep Red
        logo: { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' } // Coffee/Cafe logo
    },
    businessInfo: {
        title: "Bob's Cafe",
        subtitle: "Eat.Refresh.Go",
        description: "We aim to provide fresh and healthy snacks people on the go.",
        website: "https://www.techoid.com"
    },
    menu: [
        {
            name: "ZINGER BURGER",
            price: "10.00 $",
            description: "jalapeno + cheese",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "CHICKEN BURGER",
            price: "12.00 $",
            description: "jalapeno + cheese + grilled chicken",
            image: "https://images.unsplash.com/photo-1512152272829-e3139601d179?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        }
    ],
    timings: {
        "Mon-Sun": { isOpen: true, open: "08:00 AM", close: "08:00 PM" }
    },
    social: {
        website: true
    }
};

export const appStorePreviewConfig = {
    type: 'app-store',
    design: {
        color: { dark: '#0f3485', light: '#ff9500' },
        logo: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' }
    },
    businessInfo: {
        title: "Techoid Bank",
        subtitle: "Technician name",
        description: "Control all your finances easily and quickly.",
        cta: "DOWNLOAD NOW",
        website: "https://www.techoid.com"
    },
    appLinks: {
        google: 'https://play.google.com/store/apps',
        apple: 'https://apps.apple.com/us/app',
        buttonType: 'rectangular'
    }
};

export const couponPreviewConfig = {
    type: 'coupon',
    design: {
        color: { dark: '#7c3aed', light: '#08B8CE' }, // Violet/Purple
        logo: { url: 'https://picsum.photos/seed/coupon-logo/150/150' } // Boutique logo placeholder
    },
    businessInfo: {
        title: "ABC Boutique"
    },
    coupon: {
        title: "Winter Sale",
        image: "https://img.freepik.com/free-vector/flat-winter-sale-background_23-2149121770.jpg", // Winter sale placeholder
        offer: "Copy the Coupon and get 50% OFF on your next purchase",
        code: "SALE20",
        expiry: "---",
        location: "1000 Marketplace Ave. NY, 10001",
        buttonTitle: "GET COUPON",
        callToAction: "https://www.abcbotique.com",
        terms: "This coupon is only valid for online purchases."
    }
};

export const businessCardPreviewConfig = {
    type: 'business-card',
    design: {
        color: { header: '#0f3485', dark: '#0f3485', light: '#ffffff' }, // Dark Blue
        profile: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' } // Using same avatar as example
    },
    personalInfo: {
        name: "HELLEN GREY",
        title: "Creative Lead",
        company: "Techoid",
        about: "I am a designer & photographer working in International company. I am a designer & photographer working in International company."
    },
    contact: {
        phone: "15555555234",
        email: "Hellen@gmail.com",
        website: "https://Hellengrey.com",
        address: "1000 Marketplace Ave. NY, 10001, United States",
        mapUrl: "#"
    },
    social: {
        website: true,
        whatsapp: true,
        facebook: true,
        linkedin: true
    }
};

export const businessPagePreviewConfig = {
    type: 'business-page',
    design: {
        color: { header: '#0f3485', dark: '#0f3485', light: '#ffffff' }, // Dark Blue
        logo: { url: 'https://img.freepik.com/premium-vector/restaurant-logo-design-template_79169-56.jpg' }, // Restaurant logo
        heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // New working cafe image
    },
    businessInfo: {
        title: "Royal's Cafe",
        subtitle: "Eat. Refresh. Go.",
        description: "We aim to provide fresh and healthy snacks people on the go."
    },
    timings: {
        "Monday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Tuesday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Wednesday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Thursday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Friday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Saturday": { isOpen: true, open: "08:00 AM", close: "08:00 PM" },
        "Sunday": { isOpen: false, open: "", close: "" }
    },
    facilities: {
        wifi: true,
        sofa: true,
        handicap: true
    },
    contact: {
        phone: "15555551234",
        email: "Hellen@gmail.com",
        website: "https://Hellengrey.com"
    }
};

export const bioPagePreviewConfig = {
    type: 'bio-page',
    design: {
        color: { header: '#8b5cf6', dark: '#8b5cf6', light: '#ffffff' }, // Purple/Violet
        profile: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' } // Professional woman photo
    },
    basicInfo: {
        name: "HARRY TAYLOR",
        companyName: "Designer & Photographer",
        description: "I am a designer & photographer working in International company. I am a designer & photographer working in International company."
    },
    contact: {
        phone: '15555551234',
        phoneButtonTitle: 'Talk to Me',
        email: 'Hellen@gmail.com',
        emailButtonTitle: 'Email Me',
        website: 'https://Hellengrey.com',
        websiteButtonTitle: 'Visit Us'
    },
    social: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        website: 'https://techoid.com'
    }
};

export const surveyPreviewConfig = {
    type: 'survey',
    design: {
        logo: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' }, // 3D character
        illustration: 'https://img.freepik.com/free-vector/customer-survey-concept-illustration_114360-5321.jpg' // Survey illustration
    },
    businessInfo: {
        title: "Luxury Hotels",
        description: "We aim to provide fresh and healthy snacks people on the go."
    }
};

export const leadGenerationPreviewConfig = {
    type: 'lead-generation',
    design: {
        color: { header: '#7f1d1d', dark: '#7f1d1d', light: '#ffffff' }, // Dark Red/Maroon
        logo: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' }, // 3D character
        headerImage: { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' } // Default header image
    },
    basicInfo: {
        companyName: "Sterling & Co",
        headline: "Important Document",
        description: "Download this document today."
    },
    form: {
        fullName: true,
        contactNumber: false,
        organizationName: false,
        email: true,
        jobTitle: false,
        website: false
    },
    thankYou: {
        message: "Thanks for submitting! You can now download your content, thanks again"
    }
};

export const ratingPreviewConfig = {
    type: 'rating',
    design: {
        color: { header: '#5b8fd9', dark: '#5b8fd9', light: '#FF5E3B' }, // Blue header, Orange buttons
        logo: { url: 'https://img.freepik.com/premium-vector/heart-with-pulse-icon-healthcare-medical-symbol_116137-7857.jpg' }, // Heart logo
        headerImage: { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' } // Default header image
    },
    socialLinks: [
        { id: '1', platform: 'facebook', url: 'https://facebook.com' },
        { id: '2', platform: 'instagram', url: 'https://instagram.com' },
        { id: '3', platform: 'whatsapp', url: 'https://whatsapp.com' }
    ],
    basicInfo: {
        name: "Bob's Cafe",
        website: "https://www.bobscafe.com"
    },
    rating: {
        question: "How was your rental experience?",
        type: 'stars',
        allowComment: false
    }
};

export const reviewsPreviewConfig = {
    type: 'reviews',
    design: {
        color: { header: '#2e3192', dark: '#2e3192', light: '#C0E1DD' },
        logo: { url: 'https://img.freepik.com/premium-vector/luxury-hotel-logo-design-template_7492-63.jpg' },
        headerImage: { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' }
    },
    basicInfo: {
        organizationName: "LUXURY HOTELS",
        title: "Give us your feedback",
        description: "We aim to provide fresh and healthy snacks people on the go.",
        website: "https://www.hotelparadise.com",
        organizationNameColor: "#FFFFFF",
        organizationNameFont: "Lato",
        titleColor: "#1e293b",
        titleFont: "Lato"
    },
    categories: [
        { id: 1, name: 'Food', subcategories: ['Staff', 'Quantity', 'Taste'] },
        { id: 2, name: 'Drink', subcategories: ['Quality', 'Variety'] },
        { id: 3, name: 'Parking', subcategories: ['Availability', 'Security'] }
    ],
    social: {
        website: "https://www.hotelparadise.com",
        facebook: "https://facebook.com/hotelparadise",
        instagram: "https://instagram.com/hotelparadise"
    }
};

export const socialMediaPreviewConfig = {
    type: 'social-media',
    design: {
        logo: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' },
        backgroundImage: { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267&fit=crop' }
    },
    basicInfo: {
        headline: "Connect With Us On Social Media",
        aboutUs: "Follow us and get updates delivered to your favorite social media channel."
    }
};

export const pdfPreviewConfig = {
    type: 'pdf',
    design: {
        logo: { url: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' },
        color: { header: '#0B2D86', light: '#FFA800' }
    },
    basicInfo: {
        companyName: 'Software Company',
        pdfTitle: 'See Our Company Profile',
        description: 'We aim to provide fresh and healthy snacks people on the go.',
        companyNameColor: '#FFFFFF',
        companyNameFont: 'Lato',
        pdfTitleColor: '#FFA800',
        pdfTitleFont: 'Lato'
    },
    uploadPdf: {
        pdfTitle: 'Qr Insight Presentation',
        pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        buttonTitle: 'Download Now'
    }
};

export const multipleLinksPreviewConfig = {
    type: 'multiple-links',
    design: {
        logo: { url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=150&h=150&fit=crop' },
        color: { header: '#52BDA3', light: '#2B1E99' }
    },
    basicInfo: {
        headline: 'Techoid',
        aboutUs: 'Follow us and get updates delivered to your favorite social media channel.',
        headlineColor: '#2B1E99',
        headlineFont: 'Lato'
    },
    links: [
        { id: '1', url: '', title: 'Visit Us Online' },
        { id: '2', url: '', title: 'Talk to Us' },
        { id: '3', url: '', title: 'Instagram' },
        { id: '4', url: '', title: 'Youtube' }
    ],
    socialLinks: [
        { id: 's1', platform: 'website', url: '' },
        { id: 's2', platform: 'facebook', url: '' },
        { id: 's3', platform: 'instagram', url: '' }
    ]
};

export const passwordProtectedPreviewConfig = {
    type: 'password-protected',
    design: {
        headerImage: {
            url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop'
        }
    }
};

export const eventPreviewConfig = {
    type: 'event',
    businessInfo: {
        companyName: 'Sterling & Co.',
        companyNameColor: '#FFC700',
        companyNameFont: 'Lato',
        headline: '4th Annual Company Meetup',
        headlineColor: '#FFFFFF',
        headlineFont: 'Lato',
        description: 'We aim to provide fresh and healthy snacks people on the go.',
        button: 'Get Tickets',
        website: 'http://www.sterlingco.com/tickets'
    },
    socialLinks: [
        { id: 1, platform: 'website', url: '' },
        { id: 2, platform: 'instagram', url: '' },
        { id: 3, platform: 'facebook', url: '' }
    ],
    venue: {
        location: '1000 Marketplace Ave. NY, 10001, United States'
    },
    contactInfo: {
        personName: 'Hellen Grey',
        designation: 'Event Manager',
        channels: [
            { id: 1, type: 'phone', value: '15555551234' },
            { id: 2, type: 'email', value: 'Hellen@gmail.com' }
        ]
    },
    facilities: ['wifi', 'plug', 'wheelchair'],
    design: {
        color: {
            header: '#097D6A',
            light: '#FFC700'
        }
    }
};

export const productPagePreviewConfig = {
    type: 'product-page',
    basicInfo: {
        companyName: 'Dairyland',
        companyTextColor: '#000000',
        companyFont: 'Lato',
        productTitle: 'Chocolate Flavored Milk',
        titleTextColor: '#000000',
        titleFont: 'Lato',
        headline: '325 ml',
        price: '95',
        currency: '₨',
        productImages: [
            { id: 'def-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop' },
            { id: 'def-2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop' },
            { id: 'def-3', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }
        ]
    },
    content: {
        items: [
            { id: '1', title: 'Description', text: "The Dark, Smooth, Creaminess Of Chocolate Romances The Wholesome Goodness Of Real Cow's Milk, Reigniting For The Love For A Healthy, Tasty Beverage." },
            { id: '2', title: 'Ingredient', text: '• Reduced Fat Milk\n• Milk Solids\nCocoa Powder\n• Sugar\n• Emulsifier: Vegetable Oil Origin (E471)\n• Stabilizer (E470) & Chocolate Flavor' }
        ],
        certificates: [
            { id: 'def-cert-1', url: 'https://res.cloudinary.com/date1bmhd/image/upload/v1759749930/ODCzvu_imfdi2.png' },
            { id: 'def-cert-2', url: 'https://res.cloudinary.com/date1bmhd/image/upload/v1759749957/KOursE_uedyzk.png' }
        ],
        buttonText: 'Buy Product',
        buttonLink: 'https://www.dairylandltd.com/'
    },
    video: {
        title: 'Vanilla & Malai...',
        url: 'https://www.youtube.com/watch?v=kYI9P_pkyEw'
    },
    feedback: {
        title: 'Add Your Feedback',
        ratingUrl: 'https://www.dairylandltd.com/floveredmilk/rating',
        textColor: '#FFFFFF',
        font: 'Lato'
    },
    design: {
        color: {
            header: '#FFB03E',
            light: '#031D36',
            dark: '#FFB03E'
        },
        logo: {
            url: 'https://res.cloudinary.com/date1bmhd/image/upload/v1759743320/comapny-logo_xy3fqg.png'
        }
    }
};

export const dynamicUrlPreviewConfig = {
    type: 'dynamic-url'
};

export const videoPreviewConfig = {
    type: 'video'
};

export const imagePreviewConfig = {
    type: 'image'
};

export const customTypePreviewConfig = {
    type: 'custom-type',
    customComponents: []
};

export const getPreviewConfig = (type) => {
    switch (type) {
        case 'menu': return menuPreviewConfig;
        case 'app-store': return appStorePreviewConfig;
        case 'coupon': return couponPreviewConfig;
        case 'business-card': return businessCardPreviewConfig;
        case 'business-page': return businessPagePreviewConfig;
        case 'bio-page': return bioPagePreviewConfig;
        case 'survey': return surveyPreviewConfig;
        case 'lead-generation': return leadGenerationPreviewConfig;
        case 'rating': return ratingPreviewConfig;
        case 'reviews': return reviewsPreviewConfig;
        case 'social-media': return socialMediaPreviewConfig;
        case 'pdf': return pdfPreviewConfig;
        case 'multiple-links': return multipleLinksPreviewConfig;
        case 'password-protected': return passwordProtectedPreviewConfig;
        case 'event': return eventPreviewConfig;
        case 'product-page': return productPagePreviewConfig;
        case 'dynamic-url': return dynamicUrlPreviewConfig;
        case 'video': return videoPreviewConfig;
        case 'image': return imagePreviewConfig;
        case 'custom-type': return customTypePreviewConfig;
        default: return null;
    }
};
