// ========================================
// Performance Utilities
// ========================================

// Throttle function to limit event handler execution
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;

    return function(...args) {
        const currentTime = Date.now();
        const timeSinceLastExec = currentTime - lastExecTime;

        if (timeSinceLastExec >= delay) {
            lastExecTime = currentTime;
            func.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastExecTime = Date.now();
                func.apply(this, args);
            }, delay - timeSinceLastExec);
        }
    };
}

// RequestAnimationFrame-based throttle for scroll events
function rafThrottle(func) {
    let rafId = null;
    let lastArgs = null;

    return function(...args) {
        lastArgs = args;
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                func.apply(this, lastArgs);
                rafId = null;
            });
        }
    };
}

// ========================================
// Internationalization (i18n) System
// ========================================

// Get current language from localStorage or browser
function getInitialLanguage() {
    // Check localStorage first
    const savedLang = localStorage.getItem('jakpat-language');
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
        return savedLang;
    }

    // Fallback to browser language detection
    const browserLang = navigator.language || navigator.userLanguage;
    // If browser language starts with 'id' (Indonesian), use Indonesian
    if (browserLang.toLowerCase().startsWith('id')) {
        return 'id';
    }
    // Otherwise default to English
    return 'en';
}

// Current active language
let currentLanguage = getInitialLanguage();

// Update all translatable elements
function updatePageLanguage(lang) {
    if (!translations || !translations[lang]) {
        console.error('Translation data not available for language:', lang);
        return;
    }

    const data = translations[lang];

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');

        let value = data;
        for (const k of keys) {
            value = value[k];
            if (value === undefined) break;
        }

        if (value !== undefined) {
            // Use innerHTML to support HTML tags in translations
            element.innerHTML = value;
        }
    });

    // Update <html lang> attribute
    document.documentElement.setAttribute('lang', lang);

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.meta && data.meta.description) {
        metaDesc.setAttribute('content', data.meta.description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && data.meta && data.meta.keywords) {
        metaKeywords.setAttribute('content', data.meta.keywords);
    }

    // Update JSON-LD structured data
    updateStructuredData(lang, data);

    // Update ARIA labels
    updateAriaLabels(lang, data);

    // Save language preference
    localStorage.setItem('jakpat-language', lang);
    currentLanguage = lang;

    // Update active button state
    updateLanguageButtons(lang);
}

// Update JSON-LD structured data
function updateStructuredData(lang, data) {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');

    scripts.forEach((script, index) => {
        try {
            const jsonData = JSON.parse(script.textContent);

            if (jsonData['@type'] === 'Organization' && data.structuredData.orgDescription) {
                jsonData.description = data.structuredData.orgDescription;
            } else if (jsonData['@type'] === 'Service' && data.structuredData.serviceDescription) {
                jsonData.description = data.structuredData.serviceDescription;
                jsonData.name = lang === 'id' ? 'Jakpat for Universities' : 'Jakpat for Universities';
            }

            script.textContent = JSON.stringify(jsonData, null, 4);
        } catch (e) {
            console.error('Error updating structured data:', e);
        }
    });
}

// Update ARIA labels
function updateAriaLabels(lang, data) {
    // Navigation
    const nav = document.querySelector('.nav');
    if (nav && data.nav.ariaLabel) {
        nav.setAttribute('aria-label', data.nav.ariaLabel);
    }

    const hamburger = document.querySelector('.hamburger');
    if (hamburger && data.nav.hamburgerAriaLabel) {
        hamburger.setAttribute('aria-label', data.nav.hamburgerAriaLabel);
    }

    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && data.nav.mobileMenuAriaLabel) {
        mobileMenu.setAttribute('aria-label', data.nav.mobileMenuAriaLabel);
    }

    const logoLink = document.querySelector('.logo');
    if (logoLink && data.nav.logoAriaLabel) {
        logoLink.setAttribute('aria-label', data.nav.logoAriaLabel);
    }

    // Footer
    const footerNav = document.querySelector('.footer-links');
    if (footerNav && data.footer.ariaLabel) {
        footerNav.setAttribute('aria-label', data.footer.ariaLabel);
    }

    // Update language switcher aria labels (navbar and mobile)
    const navLanguageSwitcher = document.querySelector('.nav-language-switcher');
    if (navLanguageSwitcher && data.footer.languageSwitcher) {
        navLanguageSwitcher.setAttribute('aria-label', data.footer.languageSwitcher);
    }

    const mobileLanguageSwitcher = document.querySelector('.mobile-language-switcher');
    if (mobileLanguageSwitcher && data.footer.languageSwitcher) {
        mobileLanguageSwitcher.setAttribute('aria-label', data.footer.languageSwitcher);
    }

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        if (data.hero.ctaAriaLabel) {
            btn.setAttribute('aria-label', data.hero.ctaAriaLabel);
        }
    });

    const ctaButtonWhite = document.querySelector('.cta-button-white');
    if (ctaButtonWhite && data.cta.buttonAriaLabel) {
        ctaButtonWhite.setAttribute('aria-label', data.cta.buttonAriaLabel);
    }

    // Marquee
    const marquees = document.querySelectorAll('.logo-marquee');
    if (marquees.length > 0 && data.trust.marqueeAriaLabel1) {
        marquees[0]?.setAttribute('aria-label', data.trust.marqueeAriaLabel1);
    }
    if (marquees.length > 1 && data.trust.marqueeAriaLabel2) {
        marquees[1]?.setAttribute('aria-label', data.trust.marqueeAriaLabel2);
    }
}

// Update language button active state
function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// Language switcher event listeners
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            if (lang !== currentLanguage) {
                updatePageLanguage(lang);
            }
        });
    });
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply initial language
    updatePageLanguage(currentLanguage);

    // Initialize language switcher
    initLanguageSwitcher();

    // Initialize hamburger menu
    initHamburgerMenu();
});

// Hamburger menu initialization
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Update aria-expanded attribute
            hamburger.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ========================================
// Smooth scrolling for navigation links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburger = document.querySelector('.hamburger');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Navigation background on scroll + active section tracking
// OPTIMIZED: Using RAF throttle to prevent performance issues
const handleScroll = rafThrottle(() => {
    const nav = document.querySelector('.nav');

    // Add scrolled class for navbar shrink effect
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Track active section - Cache selectors
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    // Optimized: Only check sections that are visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });

    // Batch DOM updates
    navLinks.forEach(link => {
        const shouldBeActive = link.getAttribute('href') === `#${currentSection}`;
        const isActive = link.classList.contains('active');

        if (shouldBeActive && !isActive) {
            link.classList.add('active');
        } else if (!shouldBeActive && isActive) {
            link.classList.remove('active');
        }
    });
});

window.addEventListener('scroll', handleScroll, { passive: true });

// Testimonials toggle functionality - OPTIMIZED to avoid reflow
function toggleTestimonials() {
    const container = document.querySelector('.testimonials-container');
    const button = document.querySelector('.show-more-btn');
    const showText = button.querySelector('.show-text');
    const hideText = button.querySelector('.hide-text');

    container.classList.toggle('testimonials-expanded');

    // Update aria-expanded attribute
    const isExpanded = container.classList.contains('testimonials-expanded');
    button.setAttribute('aria-expanded', isExpanded);

    // Use visibility for better performance (avoid layout thrashing)
    if (isExpanded) {
        showText.style.display = 'none';
        hideText.style.display = 'inline';
    } else {
        showText.style.display = 'inline';
        hideText.style.display = 'none';
    }
}

// ========================================
// Performance Optimization: Pause Animations
// ========================================

// Pause animations when tab is not visible to save CPU/GPU
document.addEventListener('visibilitychange', () => {
    const animatedElements = document.querySelectorAll('.marquee-content, .hero::after, .hero-blob-1, .hero-blob-2, .cta-section::before');

    if (document.hidden) {
        // Tab is hidden - pause all animations
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Tab is visible - resume animations
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Intersection Observer to pause off-screen animations
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const animations = entry.target.querySelectorAll('.marquee-content');

        if (!entry.isIntersecting) {
            // Element is off-screen - pause animations
            animations.forEach(anim => {
                anim.style.animationPlayState = 'paused';
            });
        } else {
            // Element is visible - resume animations
            animations.forEach(anim => {
                anim.style.animationPlayState = 'running';
            });
        }
    });
}, observerOptions);

// Observe sections with heavy animations
document.addEventListener('DOMContentLoaded', () => {
    const universityTrust = document.querySelector('.university-trust');
    if (universityTrust) {
        animationObserver.observe(universityTrust);
    }
});
