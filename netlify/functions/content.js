// Netlify Function: Content API
// Handles CRUD operations for portfolio content
// Uses Netlify Blobs for persistent storage
// Authentication is optional for single-user sites

const { getStore } = require('@netlify/blobs');

const defaultContent = {
    hero: {
        badge: 'Media Buyer & Digital Marketer',
        title: 'Scalable Profit Engineering',
        subtitle: "I've managed $8,000,000+ in ad budgets to move e-commerce stores from stagnation to profitable scale. We don't buy clicks — we build systems that attract high-LTV customers.",
        stat1Value: '$8M+',
        stat1Label: 'Ad Spend Managed',
        stat2Value: '3.2x',
        stat2Label: 'Avg. ROAS',
        stat3Value: '150+',
        stat3Label: 'Campaigns Optimized'
    },
    about: {
        title: 'About Me',
        description: 'A results-driven media buyer with expertise in paid social advertising, conversion optimization, and data-driven marketing strategies.',
        image: ''
    },
    projects: [
        {
            id: 'proj-1',
            title: 'E-commerce Scale Campaign',
            category: 'E-commerce',
            description: 'Scaled a fashion e-commerce brand from $50K to $500K monthly ad spend while maintaining 4.2x ROAS.',
            spend: 500000,
            roas: '4.2x',
            image: '',
            link: ''
        },
        {
            id: 'proj-2',
            title: 'SaaS Lead Generation',
            category: 'SaaS',
            description: 'Built a lead generation system that reduced CPA by 60% while doubling monthly qualified leads.',
            spend: 120000,
            roas: '3.8x',
            image: '',
            link: ''
        }
    ],
    skills: [
        { id: 'skill-1', name: 'Facebook Ads', category: 'Advertising', level: 95 },
        { id: 'skill-2', name: 'Google Ads', category: 'Advertising', level: 90 },
        { id: 'skill-3', name: 'Data Analysis', category: 'Analytics', level: 85 },
        { id: 'skill-4', name: 'Conversion Optimization', category: 'Strategy', level: 88 }
    ],
    experience: [
        {
            id: 'exp-1',
            title: 'Senior Media Buyer',
            company: 'Digital Marketing Agency',
            period: '2021 - Present',
            location: 'Remote',
            description: 'Managing $2M+ monthly ad spend across multiple e-commerce brands. Achieved average 3.5x ROAS across portfolio.'
        }
    ],
    services: [
        {
            id: 'srv-1',
            title: 'Paid Advertising',
            description: 'Full-funnel paid social and search advertising campaigns on Facebook, Instagram, Google, and TikTok.',
            icon: 'target'
        },
        {
            id: 'srv-2',
            title: 'Conversion Optimization',
            description: 'Data-driven landing page optimization, A/B testing, and funnel analysis to maximize ROI.',
            icon: 'chart'
        }
    ],
    contact: {
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/yourprofile',
        twitter: 'https://twitter.com/yourhandle',
        whatsapp: '+1234567890',
        whatsappEnabled: true,
        whatsappMessage: 'Hi! I saw your portfolio and would like to discuss a potential project.'
    },
    settings: {
        siteTitle: 'Media Buyer Portfolio',
        siteDescription: 'Portfolio website for a Media Buyer / Digital Marketer specializing in profitable scale systems and high-LTV customer acquisition.',
        siteKeywords: 'Media Buyer, Digital Marketer, Ad Campaign Optimization, ROAS, CPA, KPI Dashboard',
        googleAnalytics: '',
        primaryColor: '#0E7C86',
        accentColor: '#FF6B5F',
        roasThreshold: 1.5,
        cpaMultiplier: 1.3
    }
};

// Helper function to get content store
async function getContentStore(context) {
    try {
        // Use Netlify Blobs for persistent storage
        const store = await getStore({
            name: 'portfolio-content',
            consistency: 'strong'
        });
        return store;
    } catch (error) {
        console.error('Error getting content store:', error);
        return null;
    }
}

// Helper function to load content from Blobs
async function loadContent(store) {
    try {
        const stored = await store.get('content', { type: 'json' });
        if (stored) {
            // Merge with defaults to ensure all fields exist
            return {
                ...defaultContent,
                ...stored,
                hero: { ...defaultContent.hero, ...stored.hero },
                about: { ...defaultContent.about, ...stored.about },
                contact: { ...defaultContent.contact, ...stored.contact },
                settings: { ...defaultContent.settings, ...stored.settings }
            };
        }
    } catch (error) {
        console.log('No stored content found, using defaults');
    }
    return { ...defaultContent };
}

// Helper function to save content to Blobs
async function saveContent(store, content) {
    try {
        await store.setJSON('content', content);
        return true;
    } catch (error) {
        console.error('Error saving content:', error);
        return false;
    }
}

exports.handler = async (event, context) => {
    // Get user context (optional)
    const { user } = context.clientContext || {};
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Get the content store
    const store = await getContentStore(context);
    
    // If Blobs not available, fall back to in-memory with warning
    if (!store) {
        console.warn('Netlify Blobs not available, using in-memory storage (data will not persist)');
    }

    try {
        switch (event.httpMethod) {
            case 'GET':
                if (store) {
                    const content = await loadContent(store);
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(content)
                    };
                } else {
                    // Fallback to default content
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(defaultContent)
                    };
                }

            case 'PUT':
                // Authentication is optional for single-user sites
                // Log if user is authenticated but don't require it
                if (user) {
                    console.log('Content update by authenticated user:', user.email);
                } else {
                    console.log('Content update without authentication (single-user mode)');
                }
                
                const newContent = JSON.parse(event.body);
                
                // Validate content structure
                if (!newContent || typeof newContent !== 'object') {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Invalid content format' })
                    };
                }

                // Merge with default content to ensure all fields exist
                const mergedContent = {
                    ...defaultContent,
                    ...newContent,
                    hero: { ...defaultContent.hero, ...newContent.hero },
                    about: { ...defaultContent.about, ...newContent.about },
                    contact: { ...defaultContent.contact, ...newContent.contact },
                    settings: { ...defaultContent.settings, ...newContent.settings }
                };

                // Save to Blobs if available
                if (store) {
                    const saved = await saveContent(store, mergedContent);
                    if (!saved) {
                        return {
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({ error: 'Failed to save content' })
                        };
                    }
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Content updated successfully',
                        content: mergedContent,
                        persisted: !!store
                    })
                };

            case 'POST':
                // Same as PUT for content updates
                goto PUT;

            case 'DELETE':
                // Reset to defaults
                if (store) {
                    await saveContent(store, defaultContent);
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Content reset to defaults'
                    })
                };

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Content API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
