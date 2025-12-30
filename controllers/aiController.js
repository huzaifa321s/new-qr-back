const Groq = require('groq-sdk');

const generateQRConfig = async (req, res) => {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY || 'gsk_PlaceholderKey'
    });

    try {
        const { prompt, type, conversationHistory } = req.body;

        console.log('=== AI Generation Request ===');
        console.log('Prompt:', prompt);
        console.log('Type:', type);
        console.log('============================');

        if (!process.env.GROQ_API_KEY) {
            console.warn('GROQ_API_KEY is missing in environment variables.');
        }

        const systemPrompt = `You are an expert QR code configuration generator. Generate ONLY valid JSON without any markdown formatting.

${type ? `
CRITICAL: You MUST generate a configuration for type: "${type}"
Use the exact schema for ${type.toUpperCase()} type shown below.
DO NOT generate any other type.
` : 'Detect the appropriate type from the user prompt.'}

CRITICAL RULES:
1. Return ONLY raw JSON - NO markdown, NO code blocks, NO explanations
2. ${type ? `Generate EXACTLY the ${type} type` : 'DETECT the correct QR type from the user\'s prompt'}
3. Use diverse, realistic colors (NEVER repeat the same color scheme)
4. Use real Unsplash image URLs
5. Generate unique, creative content
6. Vary QR dot styles: square, rounded, dots, classy, classy-rounded, extra-rounded

SCHEMA FOR ${type ? type.toUpperCase() : 'DETECTED TYPE'}:

${type === 'rating' || !type ? `
RATING:
{
  "type": "rating",
  "qrName": "Feedback Form",
  "pageConfig": {
    "design": { "color": { "header": "#5b8fd9", "dark": "#5b8fd9", "light": "#FF5E3B" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" }, "headerImage": { "url": "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267" } },
    "basicInfo": { "name": "Business Name", "website": "https://example.com" },
    "rating": { "question": "How was your experience?", "type": "stars", "allowComment": true },
    "socialLinks": [{ "id": "1", "platform": "facebook", "url": "https://facebook.com" }]
  },
  "qrDesign": { "dots": { "style": "rounded", "color": "#5b8fd9" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "extra-rounded", "color": "#5b8fd9" }, "cornersDot": { "style": "dot", "color": "#FF5E3B" } }
}
` : ''}

${type === 'reviews' || !type ? `
REVIEWS:
{
  "type": "reviews",
  "qrName": "Review Collection",
  "pageConfig": {
    "design": { "color": { "header": "#2e3192", "dark": "#2e3192", "light": "#C0E1DD" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" }, "headerImage": { "url": "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=267" } },
    "basicInfo": { "organizationName": "COMPANY NAME", "title": "Give us your feedback", "description": "We value your opinion", "website": "https://example.com" },
    "categories": [{ "id": 1, "name": "Service", "subcategories": ["Quality", "Speed"] }],
    "social": { "website": "https://example.com" }
  },
  "qrDesign": { "dots": { "style": "dots", "color": "#2e3192" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "square", "color": "#2e3192" }, "cornersDot": { "style": "square", "color": "#C0E1DD" } }
}
` : ''}

${type === 'event' || !type ? `
EVENT:
{
  "type": "event",
  "qrName": "Event Invitation",
  "pageConfig": {
    "businessInfo": { "companyName": "Company", "headline": "Event Title", "description": "Event description", "button": "Get Tickets", "website": "https://example.com" },
    "venue": { "location": "123 Main St, City" },
    "contactInfo": { "personName": "Contact Person", "designation": "Event Manager", "channels": [{ "id": 1, "type": "email", "value": "contact@example.com" }] },
    "facilities": ["wifi"],
    "design": { "color": { "header": "#097D6A", "light": "#FFC700" } },
    "socialLinks": [{ "id": 1, "platform": "website", "url": "https://example.com" }]
  },
  "qrDesign": { "dots": { "style": "classy", "color": "#097D6A" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "extra-rounded", "color": "#097D6A" }, "cornersDot": { "style": "dot", "color": "#FFC700" } }
}
` : ''}

${type === 'coupon' || !type ? `
COUPON:
{
  "type": "coupon",
  "qrName": "Discount Coupon",
  "pageConfig": {
    "design": { "color": { "dark": "#7c3aed", "light": "#08B8CE" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" } },
    "businessInfo": { "title": "Store Name" },
    "coupon": { "title": "Special Offer", "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400", "offer": "Get 50% OFF", "code": "SAVE50", "expiry": "Dec 31, 2024", "location": "123 Main St", "buttonTitle": "GET COUPON", "callToAction": "https://example.com", "terms": "Valid for online purchases only" }
  },
  "qrDesign": { "dots": { "style": "classy-rounded", "color": "#7c3aed" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "extra-rounded", "color": "#7c3aed" }, "cornersDot": { "style": "dot", "color": "#08B8CE" } }
}
` : ''}

${type === 'business-card' || !type ? `
BUSINESS-CARD:
{
  "type": "business-card",
  "qrName": "Business Card",
  "pageConfig": {
    "design": { "color": { "header": "#0f3485", "dark": "#0f3485", "light": "#ffffff" }, "profile": { "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" } },
    "personalInfo": { "name": "FULL NAME", "title": "Job Title", "company": "Company Name", "about": "Professional bio" },
    "contact": { "phone": "1234567890", "email": "email@example.com", "website": "https://example.com", "address": "123 Main St", "mapUrl": "#" },
    "social": { "website": true, "linkedin": true }
  },
  "qrDesign": { "dots": { "style": "rounded", "color": "#0f3485" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "square", "color": "#0f3485" }, "cornersDot": { "style": "dot", "color": "#0f3485" } }
}
` : ''}

${type === 'business-page' || !type ? `
BUSINESS-PAGE:
{
  "type": "business-page",
  "qrName": "Business Page",
  "pageConfig": {
    "design": { "color": { "header": "#0f3485", "dark": "#0f3485", "light": "#ffffff" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" }, "heroImage": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800" },
    "businessInfo": { "title": "Business Name", "subtitle": "Tagline", "description": "Description" },
    "timings": { "Monday": { "isOpen": true, "open": "09:00 AM", "close": "06:00 PM" } },
    "facilities": { "wifi": true },
    "contact": { "phone": "1234567890", "email": "email@example.com", "website": "https://example.com" }
  },
  "qrDesign": { "dots": { "style": "square", "color": "#0f3485" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "square", "color": "#0f3485" }, "cornersDot": { "style": "dot", "color": "#0f3485" } }
}
` : ''}

${type === 'product-page' || !type ? `
PRODUCT-PAGE:
{
  "type": "product-page",
  "qrName": "Product Showcase",
  "pageConfig": {
    "basicInfo": { "companyName": "Brand", "productTitle": "Product Name", "headline": "Size/Variant", "price": "99", "currency": "$", "productImages": [{ "id": "1", "url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" }] },
    "content": { "items": [{ "id": "1", "title": "Description", "text": "Product details" }], "buttonText": "Buy Now", "buttonLink": "https://example.com" },
    "design": { "color": { "header": "#FFB03E", "light": "#031D36", "dark": "#FFB03E" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" } }
  },
  "qrDesign": { "dots": { "style": "rounded", "color": "#FFB03E" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "extra-rounded", "color": "#FFB03E" }, "cornersDot": { "style": "dot", "color": "#031D36" } }
}
` : ''}

${type === 'bio-page' || !type ? `
BIO-PAGE:
{
  "type": "bio-page",
  "qrName": "Bio Page",
  "pageConfig": {
    "design": { "color": { "header": "#8b5cf6", "dark": "#8b5cf6", "light": "#ffffff" }, "profile": { "url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" } },
    "basicInfo": { "name": "FULL NAME", "companyName": "Job Title", "description": "Bio description" },
    "contact": { "phone": "1234567890", "phoneButtonTitle": "Call Me", "email": "email@example.com", "emailButtonTitle": "Email Me", "website": "https://example.com", "websiteButtonTitle": "Visit Website" },
    "social": { "facebook": "https://facebook.com", "instagram": "https://instagram.com" }
  },
  "qrDesign": { "dots": { "style": "classy-rounded", "color": "#8b5cf6" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "extra-rounded", "color": "#8b5cf6" }, "cornersDot": { "style": "dot", "color": "#8b5cf6" } }
}
` : ''}

${type === 'menu' || !type ? `
MENU:
{
  "type": "menu",
  "qrName": "Restaurant Menu",
  "pageConfig": {
    "design": { "color": { "dark": "#7f1d1d", "light": "#ffffff" }, "logo": { "url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100" } },
    "businessInfo": { "title": "Restaurant Name", "subtitle": "Tagline", "description": "Description", "website": "https://example.com" },
    "menu": [
      { "name": "Dish 1", "price": "10.00 $", "description": "Description", "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
      { "name": "Dish 2", "price": "12.00 $", "description": "Description", "image": "https://images.unsplash.com/photo-1512152272829-e3139601d179?w=200" }
    ],
    "timings": { "Mon-Sun": { "isOpen": true, "open": "08:00 AM", "close": "10:00 PM" } },
    "social": { "website": true }
  },
  "qrDesign": { "dots": { "style": "square", "color": "#000000" }, "background": { "color": "#ffffff" }, "cornersSquare": { "style": "square", "color": "#000000" }, "cornersDot": { "style": "dot", "color": "#000000" } }
}
` : ''}

USER PROMPT: "${prompt}"

IMPORTANT:
${type ? `- You MUST generate type: "${type}"` : '- Detect the most appropriate type'}
- Use DIVERSE color schemes (don't repeat colors)
- Generate realistic, creative content matching the prompt
- Vary QR dot styles for visual diversity
- Use real Unsplash image URLs
- Fill ALL required fields

Return ONLY the JSON configuration for ${type ? type.toUpperCase() : 'the detected type'}, nothing else.`;

        const messages = conversationHistory || [{ role: 'user', content: systemPrompt }];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.85,
            max_tokens: 4096,
            top_p: 0.95,
            stream: false
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content received from AI');
        }

        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const config = JSON.parse(jsonString);

        res.json({ success: true, data: config });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate QR configuration',
            details: error.message
        });
    }
};

module.exports = { generateQRConfig };
