/**
 * Content Loader for Portfolio
 * Reads content from localStorage (admin panel), API, or static JSON file
 * Updates the page dynamically
 */

(function() {
    'use strict';

    // Default content structure
    const defaultContent = {
        hero: {
            badge: 'Media Buyer & Digital Marketer',
            title: 'Scalable Profit Engineering',
            subtitle: "I've managed $8,000,000+ in ad budgets to move e-commerce stores from stagnation to profitable scale.",
            stat1Value: '$8M+',
            stat1Label: 'Ad Spend Managed',
            stat2Value: '3.2x',
            stat2Label: 'Avg. ROAS',
            stat3Value: '150+',
            stat3Label: 'Campaigns Optimized'
        },
        about: {
            title: 'About Me',
            description: 'A results-driven media buyer with expertise in paid social advertising.',
            image: ''
        },
        projects: [],
        skills: [],
        experience: [],
        services: [],
        contact: {
            email: '',
            phone: '',
            linkedin: '',
            twitter: '',
            whatsapp: '',
            whatsappEnabled: true,
            whatsappMessage: 'Hi! I saw your portfolio.'
        },
        settings: {
            siteTitle: 'Media Buyer Portfolio',
            siteDescription: '',
            primaryColor: '#0E7C86',
            accentColor: '#FF6B5F'
        }
    };

    // Load content from sources
    async function loadContent() {
        let content = null;

        // 1. Try localStorage first (admin panel saves here)
        try {
            const stored = localStorage.getItem('portfolio_content');
            if (stored) {
                content = JSON.parse(stored);
                console.log('Content loaded from localStorage');
            }
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
        }

        // 2. Try API if no localStorage content
        if (!content) {
            try {
                const response = await fetch('/api/content');
                if (response.ok) {
                    content = await response.json();
                    console.log('Content loaded from API');
                }
            } catch (e) {
                console.warn('Error loading from API:', e);
            }
        }

        // 3. Fallback to static JSON file
        if (!content) {
            try {
                const response = await fetch('data/content.json');
                if (response.ok) {
                    content = await response.json();
                    console.log('Content loaded from static file');
                }
            } catch (e) {
                console.warn('Error loading from static file:', e);
            }
        }

        // Merge with defaults to ensure all fields exist
        return mergeWithDefaults(content || {});
    }

    function mergeWithDefaults(content) {
        return {
            ...defaultContent,
            ...content,
            hero: { ...defaultContent.hero, ...content.hero },
            about: { ...defaultContent.about, ...content.about },
            contact: { ...defaultContent.contact, ...content.contact },
            settings: { ...defaultContent.settings, ...content.settings }
        };
    }

    // Update page content
    function updatePage(content) {
        // Update Hero Section
        updateHero(content.hero);
        
        // Update About Section
        updateAbout(content.about);
        
        // Update Projects
        updateProjects(content.projects);
        
        // Update Skills
        updateSkills(content.skills);
        
        // Update Experience
        updateExperience(content.experience);
        
        // Update Services
        updateServices(content.services);
        
        // Update Contact
        updateContact(content.contact);
        
        // Update WhatsApp button
        updateWhatsApp(content.contact);
        
        // Update page title and meta
        updateMeta(content.settings);
    }

    function updateHero(hero) {
        if (!hero) return;
        
        // Badge
        const badge = document.querySelector('.hero-badge');
        if (badge) badge.textContent = hero.badge || '';
        
        // Title
        const title = document.querySelector('#hero-title');
        if (title) {
            title.innerHTML = `${hero.title || ''}<span class="hero-title-accent">— where data meets buyer psychology.</span>`;
        }
        
        // Subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle && hero.subtitle) {
            subtitle.innerHTML = hero.subtitle;
        }
        
        // Stats
        const stats = document.querySelectorAll('.hero-stat');
        if (stats.length >= 3) {
            stats[0].querySelector('.stat-value').textContent = hero.stat1Value || '';
            stats[0].querySelector('.stat-label').textContent = hero.stat1Label || '';
            stats[1].querySelector('.stat-value').textContent = hero.stat2Value || '';
            stats[1].querySelector('.stat-label').textContent = hero.stat2Label || '';
            stats[2].querySelector('.stat-value').textContent = hero.stat3Value || '';
            stats[2].querySelector('.stat-label').textContent = hero.stat3Label || '';
        }
    }

    function updateAbout(about) {
        if (!about) return;
        
        const aboutTitle = document.querySelector('#about .section-title');
        if (aboutTitle) aboutTitle.textContent = about.title || 'About Me';
        
        const aboutDesc = document.querySelector('#about .about-description');
        if (aboutDesc && about.description) {
            aboutDesc.innerHTML = about.description.replace(/\n/g, '<br>');
        }
        
        const aboutImage = document.querySelector('#about .about-image img');
        if (aboutImage && about.image) {
            aboutImage.src = about.image;
        }
    }

    function updateProjects(projects) {
        if (!projects || projects.length === 0) return;
        
        const container = document.querySelector('#projects .projects-grid');
        if (!container) return;
        
        // Keep existing projects or replace with dynamic ones
        // For now, we'll just update if there are saved projects
        if (projects.length > 0) {
            container.innerHTML = projects.map((project, index) => `
                <article class="project-card fade-in-up" style="animation-delay: ${index * 0.1}s;" data-project="${index + 1}">
                    <div class="project-image">
                        <div class="project-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="project-content">
                        <span class="project-category">${escapeHtml(project.category || '')}</span>
                        <h3 class="project-title">${escapeHtml(project.title || '')}</h3>
                        <p class="project-description">${escapeHtml(project.description || '')}</p>
                        <div class="project-metrics">
                            ${project.roas ? `<div class="metric"><span class="metric-value">${escapeHtml(project.roas)}</span><span class="metric-label">ROAS</span></div>` : ''}
                            ${project.spend ? `<div class="metric"><span class="metric-value">$${formatNumber(project.spend)}</span><span class="metric-label">Spend</span></div>` : ''}
                        </div>
                    </div>
                </article>
            `).join('');
        }
    }

    function updateSkills(skills) {
        if (!skills || skills.length === 0) return;
        
        const container = document.querySelector('#skills .skills-grid');
        if (!container) return;
        
        container.innerHTML = skills.map((skill, index) => `
            <div class="skill-card fade-in-up" style="animation-delay: ${index * 0.05}s;">
                <div class="skill-header">
                    <h3 class="skill-name">${escapeHtml(skill.name || '')}</h3>
                    <span class="skill-category">${escapeHtml(skill.category || '')}</span>
                </div>
                <div class="skill-level">
                    <div class="skill-progress" style="width: ${skill.level || 0}%"></div>
                </div>
                <span class="skill-percent">${skill.level || 0}%</span>
            </div>
        `).join('');
    }

    function updateExperience(experience) {
        if (!experience || experience.length === 0) return;
        
        const container = document.querySelector('#experience .experience-timeline');
        if (!container) return;
        
        container.innerHTML = experience.map((exp, index) => `
            <article class="experience-card fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <div class="experience-marker"></div>
                <div class="experience-content">
                    <div class="experience-header">
                        <h3 class="experience-title">${escapeHtml(exp.title || '')}</h3>
                        <span class="experience-period">${escapeHtml(exp.period || '')}</span>
                    </div>
                    <p class="experience-company">${escapeHtml(exp.company || '')}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</p>
                    <p class="experience-description">${escapeHtml(exp.description || '')}</p>
                </div>
            </article>
        `).join('');
    }

    function updateServices(services) {
        if (!services || services.length === 0) return;
        
        const container = document.querySelector('#services .services-grid');
        if (!container) return;
        
        container.innerHTML = services.map((service, index) => `
            <article class="service-card fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <div class="service-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                </div>
                <h3 class="service-title">${escapeHtml(service.title || '')}</h3>
                <p class="service-description">${escapeHtml(service.description || '')}</p>
            </article>
        `).join('');
    }

    function updateContact(contact) {
        if (!contact) return;
        
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink && contact.email) {
            emailLink.href = `mailto:${contact.email}`;
            emailLink.textContent = contact.email;
        }
        
        const phoneLink = document.querySelector('a[href^="tel:"]');
        if (phoneLink && contact.phone) {
            phoneLink.href = `tel:${contact.phone}`;
            phoneLink.textContent = contact.phone;
        }
        
        const linkedinLink = document.querySelector('a[href*="linkedin.com"]');
        if (linkedinLink && contact.linkedin) {
            linkedinLink.href = contact.linkedin;
        }
        
        const twitterLink = document.querySelector('a[href*="twitter.com"]');
        if (twitterLink && contact.twitter) {
            twitterLink.href = contact.twitter;
        }
    }

    function updateWhatsApp(contact) {
        const whatsappBtn = document.getElementById('whatsapp-button');
        const whatsappLink = document.getElementById('whatsapp-link');
        
        if (!whatsappBtn || !whatsappLink) return;
        
        if (contact && contact.whatsappEnabled && contact.whatsapp) {
            const message = encodeURIComponent(contact.whatsappMessage || 'Hi! I saw your portfolio...');
            whatsappLink.href = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
            whatsappBtn.hidden = false;
        } else {
            whatsappBtn.hidden = true;
        }
    }

    function updateMeta(settings) {
        if (!settings) return;
        
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && settings.siteDescription) {
            metaDesc.setAttribute('content', settings.siteDescription);
        }
        
        // Update theme colors if specified
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
        }
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--color-accent', settings.accentColor);
        }
    }

    // Utility functions
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', async function() {
        try {
            const content = await loadContent();
            updatePage(content);
            console.log('Content loaded and applied successfully');
        } catch (error) {
            console.error('Error loading content:', error);
        }
    });

    // Listen for storage changes (when admin saves)
    window.addEventListener('storage', async function(e) {
        if (e.key === 'portfolio_content') {
            console.log('Content updated in another tab, reloading...');
            const content = await loadContent();
            updatePage(content);
        }
    });

    // Expose function to manually refresh content
    window.refreshContent = async function() {
        const content = await loadContent();
        updatePage(content);
        return content;
    };

})();
