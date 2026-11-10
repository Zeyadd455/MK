/* ============================================================
   Mohamed Khaled Portfolio - Main JavaScript
   Full Dynamic Synchronization with Admin Dashboard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ==================== THEME (LIGHT / DARK) ====================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.setAttribute('data-theme', 'light');
            if (mobileThemeToggle) {
                mobileThemeToggle.innerHTML = '<span class="mobile-theme-icon"><i class="fas fa-moon"></i></span><span class="mobile-theme-text">Dark Mode</span>';
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.removeAttribute('data-theme');
            if (mobileThemeToggle) {
                mobileThemeToggle.innerHTML = '<span class="mobile-theme-icon"><i class="fas fa-sun"></i></span><span class="mobile-theme-text">Light Mode</span>';
            }
        }
        localStorage.setItem('mk_theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Initialize saved theme
    const savedTheme = localStorage.getItem('mk_theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            document.body.style.overflow = 'visible';
            if (window.AOS) {
                AOS.init({
                    duration: 800,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 80,
                });
            }
            animateCounters();
        }, 1200);
    });

    // ==================== CUSTOM CURSOR ====================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 4 + 'px';
            cursorDot.style.top = mouseY - 4 + 'px';
        });
        
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX - 20 + 'px';
            cursorOutline.style.top = outlineY - 20 + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        const bindCursorHover = () => {
            const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .service-card, .filter-btn');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        };
        bindCursorHover();
    }

    // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (currentScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        updateActiveSection();
    });
    
    if (navToggle && mobileMenuOverlay) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 1800;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(update);
        });
    }

    // ==================== DYNAMIC DATA FROM DASHBOARD ====================
    function loadDynamicData() {
        const raw = localStorage.getItem('mk_dashboard_data');
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            if (!data) return;

            // 1. Settings & SEO
            if (data.settings) {
                if (data.settings.metaTitle) document.title = data.settings.metaTitle;
                if (data.settings.heroTagline) {
                    const badge = document.querySelector('.hero-badge span:last-child');
                    if (badge) badge.textContent = data.settings.heroTagline;
                }
                if (data.settings.heroDescription) {
                    const heroDesc = document.querySelector('.hero-description');
                    if (heroDesc) heroDesc.textContent = data.settings.heroDescription;
                }
            }

            // 2. Profile Info
            if (data.profile) {
                const p = data.profile;
                if (p.name) {
                    const aboutStrong = document.querySelector('.about-text strong');
                    if (aboutStrong) aboutStrong.textContent = p.name;
                    
                    const infoValues = document.querySelectorAll('.about-info-grid .info-value');
                    if (infoValues.length >= 1) infoValues[0].textContent = p.name;
                    
                    const placeholderSpan = document.querySelector('.about-img-placeholder span');
                    if (placeholderSpan) placeholderSpan.textContent = p.name;

                    const footerCopyright = document.querySelector('.footer-bottom p');
                    if (footerCopyright) footerCopyright.innerHTML = `&copy; 2026 ${p.name}. All Rights Reserved.`;
                }

                if (p.about) {
                    const aboutParas = document.querySelectorAll('.about-content .about-text');
                    if (aboutParas.length > 0) aboutParas[0].textContent = p.about;
                }

                if (p.location) {
                    const infoValues = document.querySelectorAll('.about-info-grid .info-value');
                    if (infoValues.length >= 2) infoValues[1].textContent = p.location;
                    const contactLoc = document.querySelector('.contact-item:nth-child(3) div span:last-child');
                    if (contactLoc) contactLoc.textContent = p.location;
                }

                if (p.email) {
                    const infoValues = document.querySelectorAll('.about-info-grid .info-value');
                    if (infoValues.length >= 3) infoValues[2].textContent = p.email;
                    const contactEmail = document.querySelector('.contact-item:nth-child(1) a');
                    if (contactEmail) {
                        contactEmail.textContent = p.email;
                        contactEmail.href = `mailto:${p.email}`;
                    }
                }

                if (p.phone) {
                    const infoValues = document.querySelectorAll('.about-info-grid .info-value');
                    if (infoValues.length >= 4) infoValues[3].textContent = p.phone;
                    const contactPhone = document.querySelector('.contact-item:nth-child(2) a');
                    if (contactPhone) {
                        contactPhone.textContent = p.phone;
                        contactPhone.href = `tel:${p.phone.replace(/\s+/g, '')}`;
                    }
                }

                if (p.experience) {
                    const expNumber = document.querySelector('.about-experience-badge .exp-number');
                    if (expNumber) expNumber.textContent = `${p.experience}+`;
                }

                if (p.skills) {
                    const skillsContainer = document.querySelector('.about-skills');
                    if (skillsContainer) {
                        const skillsArr = p.skills.split(',').map(s => s.trim()).filter(Boolean);
                        skillsContainer.innerHTML = skillsArr.map(s => `<div class="skill-tag">${s}</div>`).join('');
                    }
                }

                if (p.photo) {
                    const imgContainer = document.querySelector('.about-image');
                    if (imgContainer) {
                        imgContainer.innerHTML = `
                            <img src="${p.photo}" alt="${p.name || 'Profile'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);">
                            <div class="about-image-border"></div>
                        `;
                    }
                }
            }

            // 3. Stats
            if (data.stats) {
                const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
                if (statNumbers.length >= 3) {
                    if (data.stats.projects) statNumbers[0].setAttribute('data-count', data.stats.projects);
                    if (data.stats.clients) statNumbers[1].setAttribute('data-count', data.stats.clients);
                    if (data.stats.years) statNumbers[2].setAttribute('data-count', data.stats.years);
                }
            }

            // 4. Social Links
            if (data.social) {
                const s = data.social;
                const setHref = (selector, val) => {
                    document.querySelectorAll(selector).forEach(el => {
                        if (val && val.trim()) {
                            el.href = val.trim();
                            el.style.display = '';
                        }
                    });
                };
                if (s.instagram) setHref('.hero-social a[aria-label="Instagram"], .contact-socials a i.fa-instagram', s.instagram);
                if (s.youtube) setHref('.hero-social a[aria-label="YouTube"], .contact-socials a i.fa-youtube', s.youtube);
                if (s.tiktok) setHref('.hero-social a[aria-label="TikTok"], .contact-socials a i.fa-tiktok', s.tiktok);
                if (s.behance) setHref('.hero-social a[aria-label="Behance"], .contact-socials a i.fa-behance', s.behance);
                if (s.linkedin) setHref('.contact-socials a i.fa-linkedin-in', s.linkedin);
                if (s.whatsapp) {
                    const clean = s.whatsapp.replace(/\D+/g, '');
                    setHref('.contact-socials a i.fa-whatsapp', `https://wa.me/${clean}`);
                }
            }

            // 5. Portfolio Grid
            if (Array.isArray(data.projects) && data.projects.length > 0) {
                const grid = document.getElementById('portfolio-grid');
                if (grid) {
                    const categoryLabels = {
                        editing: 'Video Editing',
                        content: 'Content Creation',
                        motion: 'Motion Graphics',
                        social: 'Social Media'
                    };
                    grid.innerHTML = data.projects.map((proj, idx) => {
                        const catLabel = categoryLabels[proj.category] || proj.category || 'Video Editing';
                        const mediaHtml = proj.thumb 
                            ? `<img src="${proj.thumb}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                            : `<div class="card-placeholder" style="background: ${proj.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};">
                                 <i class="${proj.icon || 'fas fa-film'}"></i>
                               </div>`;
                        
                        const playHref = proj.url ? proj.url : '#showreel';
                        const targetAttr = proj.url ? 'target="_blank"' : '';

                        return `
                            <div class="portfolio-item" data-category="${proj.category}" data-aos="fade-up" data-aos-delay="${(idx % 3 + 1) * 100}">
                                <div class="portfolio-card">
                                    <div class="card-media">
                                        ${mediaHtml}
                                        <div class="card-overlay">
                                            <a href="${playHref}" ${targetAttr} class="card-play" aria-label="Watch video"><i class="fas fa-play"></i></a>
                                        </div>
                                    </div>
                                    <div class="card-info">
                                        <span class="card-category">${catLabel}</span>
                                        <h3 class="card-title">${proj.title}</h3>
                                        <p class="card-description">${proj.description || ''}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }

            // 6. Services Grid
            if (Array.isArray(data.services) && data.services.length > 0) {
                const servicesGrid = document.querySelector('.services-grid');
                if (servicesGrid) {
                    servicesGrid.innerHTML = data.services.map((srv, idx) => {
                        const numStr = String(idx + 1).padStart(2, '0');
                        const featuredClass = srv.featured ? 'featured' : '';
                        const badgeHtml = srv.featured ? '<div class="service-badge">Most Popular</div>' : '';
                        const featuresHtml = Array.isArray(srv.features) && srv.features.length > 0
                            ? `<div class="service-features">${srv.features.map(f => `<span>${f}</span>`).join('')}</div>`
                            : '';

                        return `
                            <div class="service-card ${featuredClass}" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
                                ${badgeHtml}
                                <div class="service-icon">
                                    <i class="${srv.icon || 'fas fa-film'}"></i>
                                </div>
                                <div class="service-number">${numStr}</div>
                                <h3 class="service-title">${srv.title}</h3>
                                <p class="service-description">${srv.description}</p>
                                ${featuresHtml}
                            </div>
                        `;
                    }).join('');
                }
            }

            // 7. Testimonials Slider
            if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
                const slider = document.querySelector('.testimonials-slider');
                if (slider) {
                    const cardsHtml = data.testimonials.map((t, idx) => `
                        <div class="testimonial-card ${idx === 0 ? 'active' : ''}">
                            <div class="testimonial-quote">
                                <i class="fas fa-quote-left"></i>
                            </div>
                            <p class="testimonial-text">"${t.text}"</p>
                            <div class="testimonial-author">
                                <div class="author-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="author-info">
                                    <h4>${t.name}</h4>
                                    <span>${t.role}</span>
                                </div>
                            </div>
                        </div>
                    `).join('');

                    const dotsHtml = data.testimonials.map((_, idx) => `
                        <span class="dot ${idx === 0 ? 'active' : ''}"></span>
                    `).join('');

                    slider.innerHTML = `
                        ${cardsHtml}
                        <div class="testimonial-nav">
                            <button class="testimonial-prev"><i class="fas fa-arrow-left"></i></button>
                            <div class="testimonial-dots">
                                ${dotsHtml}
                            </div>
                            <button class="testimonial-next"><i class="fas fa-arrow-right"></i></button>
                        </div>
                    `;
                }
            }

            // 8. Showreel Video & Cover
            setupShowreel();

        } catch (e) {
            console.error('Error applying dynamic data:', e);
        }
    }

    // ==================== VIDEO EMBED URL EXTRACTOR ====================
    function extractVideoEmbedUrl(url) {
        if (!url || typeof url !== 'string') return null;
        const trimmed = url.trim();
        if (!trimmed) return null;

        // YouTube: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>, youtube.com/shorts/<id>
        const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }

        // Vimeo: vimeo.com/<id>
        const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        if (trimmed.includes('embed') || trimmed.startsWith('http')) {
            return trimmed;
        }

        return null;
    }

    function setupShowreel() {
        const raw = localStorage.getItem('mk_dashboard_data');
        let videoUrl = 'https://youtu.be/rzl9EQTk4G0';
        
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (data.showreelUrl && data.showreelUrl.trim() !== '') {
                    videoUrl = data.showreelUrl.trim();
                }
            } catch(e) {}
        }

        const iframe = document.getElementById('showreel-iframe');
        if (!iframe) return;

        const embedUrl = extractVideoEmbedUrl(videoUrl);
        if (!embedUrl) return;

        if (iframe.getAttribute('src') !== embedUrl) {
            iframe.src = embedUrl;
        }
    }

    // Run dynamic load and showreel immediately
    loadDynamicData();
    setupShowreel();

    // ==================== PORTFOLIO FILTER ====================
    function setupPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.classList.add('show');
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('show');
                    }
                });
            };
        });
    }
    setupPortfolioFilter();

    // ==================== TESTIMONIALS SLIDER ====================
    let testimonialInterval = null;
    function setupTestimonialsSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        let currentTestimonial = 0;
        
        if (testimonialCards.length === 0) return;

        function showTestimonial(index) {
            testimonialCards.forEach(card => card.classList.remove('active'));
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            
            if (testimonialCards[index]) testimonialCards[index].classList.add('active');
            if (testimonialDots[index]) testimonialDots[index].classList.add('active');
            currentTestimonial = index;
        }
        
        if (prevBtn) {
            prevBtn.onclick = () => {
                let index = currentTestimonial - 1;
                if (index < 0) index = testimonialCards.length - 1;
                showTestimonial(index);
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = () => {
                let index = currentTestimonial + 1;
                if (index >= testimonialCards.length) index = 0;
                showTestimonial(index);
            };
        }
        
        testimonialDots.forEach((dot, index) => {
            dot.onclick = () => showTestimonial(index);
        });
        
        if (testimonialInterval) clearInterval(testimonialInterval);
        testimonialInterval = setInterval(() => {
            let index = currentTestimonial + 1;
            if (index >= testimonialCards.length) index = 0;
            showTestimonial(index);
        }, 5000);
    }
    setupTestimonialsSlider();

    // ==================== TILT EFFECT ON CARDS ====================
    function setupCardTilt() {
        if (window.innerWidth > 768) {
            const cards = document.querySelectorAll('.portfolio-card, .service-card');
            cards.forEach(card => {
                card.onmousemove = (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                };
                card.onmouseleave = () => {
                    card.style.transform = '';
                };
            });
        }
    }
    setupCardTilt();

    // ==================== REAL-TIME STORAGE EVENT & POLLING ====================
    // Keep portfolio in sync instantly even on file:// protocol where storage event might not fire
    function refreshDynamicContent() {
        loadDynamicData();
        setupShowreel();
        setupPortfolioFilter();
        setupTestimonialsSlider();
        setupCardTilt();
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'mk_dashboard_data') {
            refreshDynamicContent();
            animateCounters();
        }
    });

    let lastDashboardDataStr = localStorage.getItem('mk_dashboard_data');
    function pollDataChanges() {
        const current = localStorage.getItem('mk_dashboard_data');
        if (current !== lastDashboardDataStr) {
            lastDashboardDataStr = current;
            refreshDynamicContent();
        }
    }
    window.addEventListener('focus', pollDataChanges);
    setInterval(pollDataChanges, 1000);

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            const messages = JSON.parse(localStorage.getItem('mk_messages') || '[]');
            messages.push({
                ...data,
                date: new Date().toISOString(),
                read: false
            });
            localStorage.setItem('mk_messages', JSON.stringify(messages));
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==================== PARTICLES (HERO) ====================
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(124, 58, 237, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ==================== ADMIN PORTAL ACCESS ====================
    const adminModal = document.getElementById('admin-auth-modal');
    const openAdminBtn = document.getElementById('open-admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-modal');
    const pinInputs = document.querySelectorAll('.pin-digit');
    const adminError = document.getElementById('admin-auth-error');

    function showAdminModal() {
        if (!adminModal) return;
        adminModal.classList.add('active');
        if (pinInputs.length > 0) {
            pinInputs[0].focus();
        }
    }

    function hideAdminModal() {
        if (!adminModal) return;
        adminModal.classList.remove('active');
        pinInputs.forEach(input => input.value = '');
        if (adminError) adminError.classList.remove('show');
    }

    const mobileAdminLink = document.getElementById('mobile-admin-link');

    if (openAdminBtn) {
        openAdminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAdminModal();
        });
    }

    if (mobileAdminLink) {
        mobileAdminLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mobileOverlay = document.getElementById('mobile-menu-overlay');
            const navToggleBtn = document.getElementById('nav-toggle');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            if (navToggleBtn) navToggleBtn.classList.remove('active');
            document.body.style.overflow = '';
            showAdminModal();
        });
    }

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', hideAdminModal);
    }

    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) hideAdminModal();
        });
    }

    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                } else {
                    validateAndSubmitPin();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            } else if (e.key === 'Escape') {
                hideAdminModal();
            }
        });
    });

    window.handleAdminLogin = function(e) {
        if (e) e.preventDefault();
        validateAndSubmitPin();
    };

    function validateAndSubmitPin() {
        let enteredPin = '';
        pinInputs.forEach(input => enteredPin += input.value);
        const correctPin = localStorage.getItem('mk_admin_pin') || '1234';

        if (enteredPin === correctPin) {
            if (adminError) adminError.classList.remove('show');
            sessionStorage.setItem('mk_admin_authenticated', 'true');
            window.location.href = 'admin/index.html';
        } else {
            if (adminError) {
                adminError.classList.add('show');
                setTimeout(() => adminError.classList.remove('show'), 2500);
            }
            pinInputs.forEach(input => input.value = '');
            if (pinInputs.length > 0) pinInputs[0].focus();
        }
    }

    // Shortcut: Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            showAdminModal();
        }
    });

    // Triple click on Logo opens admin modal
    const navLogo = document.querySelector('.nav-logo');
    let logoClicks = 0;
    let logoClickTimer = null;
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            logoClicks++;
            if (logoClicks === 3) {
                e.preventDefault();
                showAdminModal();
                logoClicks = 0;
                clearTimeout(logoClickTimer);
            } else {
                clearTimeout(logoClickTimer);
                logoClickTimer = setTimeout(() => { logoClicks = 0; }, 800);
            }
        });
    }

    // ==================== HERO PLAY BUTTON ====================
    const heroPlayBtn = document.getElementById('hero-play-btn');
    if (heroPlayBtn) {
        heroPlayBtn.onclick = () => {
            const showreelSection = document.getElementById('showreel');
            if (showreelSection) {
                showreelSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
    }
});
