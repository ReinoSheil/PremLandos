class LandingManager {
    constructor() {
        this.selectors = {
            hero: '#hero',
            ctaMain: '#cta-main',
            ctaLearnMore: '#cta-learn-more',
            scrollArrow: '.scroll-arrow',
            nav: '.nav',
            featureItems: '.feature-item',
            shapes: '.shape',
            mobileMenuToggle: '#mobileMenuToggle',
            navMenu: '.nav-menu',
            connectionModal: '#connectionModal',
            navCta: '#nav-cta',
            esimCta: '#esim-cta',
            numbersCta: '#numbers-cta',
            tariffButtons: '.tariff-button',
            contactForm: '#contact-form',
            acceptCall: '#accept-call',
            formSubmit: '#form-submit',
            stickyCta: '#stickyCta',
            stickyCtaButton: '#sticky-cta-button'
        };
        
        this.state = {
            isModalOpen: false,
            lastScrollY: 0,
            animationFrame: null,
            currentSlide: 0
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initAnimations();
        this.startBackgroundEffects();
        this.startSlideshow();
        console.log('LandingManager initialized');
    }

    cacheElements() {
        this.elements = {};
        Object.keys(this.selectors).forEach(key => {
            if (key === 'featureItems' || key === 'shapes' || key === 'tariffButtons') {
                this.elements[key] = document.querySelectorAll(this.selectors[key]);
            } else {
                this.elements[key] = document.querySelector(this.selectors[key]);
            }
        });
    }

    setupEventListeners() {
        // CTA Interactions
        this.elements.ctaMain?.addEventListener('click', this.handlePrimaryCTA.bind(this));
        this.elements.navCta?.addEventListener('click', this.handlePrimaryCTA.bind(this));
        this.elements.esimCta?.addEventListener('click', this.handlePrimaryCTA.bind(this));
        this.elements.numbersCta?.addEventListener('click', this.handleNumbersCTA.bind(this));
        this.elements.ctaLearnMore?.addEventListener('click', this.handleSecondaryCTA.bind(this));
        this.elements.scrollArrow?.addEventListener('click', this.scrollToFeatures.bind(this));

        // Call button - direct to form
        if (this.elements.acceptCall) {
            this.elements.acceptCall.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Accept call button clicked - opening modal');
                this.handlePrimaryCTA(e);
            });
        }

        // Tariff buttons
        this.elements.tariffButtons.forEach(btn => {
            btn.addEventListener('click', this.handleTariffSelect.bind(this, btn));
        });

        // Mobile menu
        this.elements.mobileMenuToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));

        // Modal close
        document.querySelectorAll('[data-modal-close]').forEach(el => {
            el.addEventListener('click', this.closeModal.bind(this));
        });

        // Forms
        this.elements.contactForm?.addEventListener('submit', this.handleFormSubmission.bind(this));

        // Scroll handling with throttling
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Resize handling
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Hide loading on load
        window.addEventListener('load', this.hideLoading.bind(this));

        // Sticky CTA button
        this.elements.stickyCtaButton?.addEventListener('click', this.handlePrimaryCTA.bind(this));
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            setTimeout(() => {
                loadingState.classList.add('hidden');
            }, 500);
        }
    }

    toggleMobileMenu() {
        this.elements.mobileMenuToggle.classList.toggle('active');
        this.elements.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    handleTariffSelect(btn, e) {
        e.preventDefault();
        const tariff = btn.dataset.tariff;
        this.showConnectionForm(tariff);
    }

    handleNumbersCTA(e) {
        e.preventDefault();
        this.showConnectionForm('numbers');
    }

    initAnimations() {
        this.animateFeatureItems();
    }

    animateFeatureItems() {
        this.elements.featureItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            
            item.addEventListener('mouseenter', this.enhanceFeatureItem.bind(this, item));
            item.addEventListener('mouseleave', this.resetFeatureItem.bind(this, item));
        });
    }

    enhanceFeatureItem(item) {
        const icon = item.querySelector('.feature-icon');
        const content = item.querySelector('.feature-content');
        
        if (icon && content) {
            icon.style.transform = 'scale(1.15) rotate(8deg)';
            content.style.transform = 'translateX(8px)';
            item.style.boxShadow = '0 8px 32px rgba(222, 198, 122, 0.15)';
            item.style.borderColor = 'rgba(222, 198, 122, 0.4)';
        }
    }

    resetFeatureItem(item) {
        const icon = item.querySelector('.feature-icon');
        const content = item.querySelector('.feature-content');
        
        if (icon && content) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            content.style.transform = 'translateX(0)';
            item.style.boxShadow = '';
            item.style.borderColor = '';
        }
    }

    startBackgroundEffects() {
        this.animateFloatingShapes();
        this.createParticleField();
    }

    startSlideshow() {
        const slides = document.querySelectorAll('.luxury-slideshow .slide');
        if (slides.length === 0) return;

        setInterval(() => {
            slides[this.state.currentSlide].classList.remove('active');
            this.state.currentSlide = (this.state.currentSlide + 1) % slides.length;
            slides[this.state.currentSlide].classList.add('active');
        }, 5000);
    }

    animateFloatingShapes() {
        this.elements.shapes.forEach((shape, index) => {
            const delay = index * 2000;
            const duration = 6000 + (index * 1000);
            
            shape.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite`;
        });
    }

    createParticleField() {
        const particlesContainer = document.querySelector('.particles-field');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesContainer, i);
        }
    }

    createParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 15 + 15;
        const opacity = Math.random() * 0.3 + 0.1;
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: `rgba(222, 198, 122, ${opacity})`,
            borderRadius: '50%',
            left: `${posX}%`,
            top: `${posY}%`,
            animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite`,
            willChange: 'transform, opacity'
        });

        container.appendChild(particle);
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - this.state.lastScrollY;
        
        this.updateNavigation(scrollDelta, currentScrollY);
        this.updateStickyCta(currentScrollY);
        this.state.lastScrollY = currentScrollY;
    }

    updateNavigation(scrollDelta, scrollY) {
        if (!this.elements.nav) return;

        const scrolled = scrollY > 100;
        
        this.elements.nav.classList.toggle('scrolled', scrolled);
        
        if (scrolled) {
            Object.assign(this.elements.nav.style, {
                background: 'rgba(4, 14, 31, 0.98)',
                padding: '1rem 0',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            });
        } else {
            Object.assign(this.elements.nav.style, {
                background: 'rgba(4, 14, 31, 0.95)',
                padding: '1.5rem 0',
                backdropFilter: 'blur(10px)',
                boxShadow: 'none'
            });
        }
    }

    updateStickyCta(scrollY) {
        if (!this.elements.stickyCta) return;

        const showThreshold = window.innerHeight / 2;
        this.elements.stickyCta.classList.toggle('visible', scrollY > showThreshold);
    }

    handlePrimaryCTA(e) {
        e.preventDefault();
        this.showConnectionForm();
    }

    handleSecondaryCTA(e) {
        e.preventDefault();
        this.scrollToFeatures();
    }

    scrollToFeatures() {
        const featuresSection = document.querySelector('#features');
        
        if (featuresSection) {
            const offset = 100;
            const targetPosition = featuresSection.getBoundingClientRect().top + window.scrollY - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    showConnectionForm(defaultTariff = null) {
        if (this.state.isModalOpen) return;
        
        this.state.isModalOpen = true;
        const modal = this.elements.connectionModal;
        modal.classList.add('active');
        
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <p class="modal-description">Оставьте заявку, и наш менеджер свяжется с вами в течение 15 минут</p>
            
            <form id="connection-form" class="connection-form" novalidate>
                <div class="form-group">
                    <input type="text" name="name" placeholder="Ваше имя" required 
                           autocomplete="name">
                </div>
                
                <div class="form-group">
                    <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required 
                           autocomplete="tel">
                </div>
                
                <div class="form-group">
                    <select name="tariff">
                        <option value="premium" ${defaultTariff === 'premium' ? 'selected' : ''}>Тариф PREMIUM</option>
                        <option value="exclusive" ${defaultTariff === 'exclusive' ? 'selected' : ''}>Тариф EXCLUSIVE</option>
                        <option value="esim" ${defaultTariff === 'esim' ? 'selected' : ''}>Только eSIM</option>
                        <option value="numbers" ${defaultTariff === 'numbers' ? 'selected' : ''}>Красивый номер</option>
                        <option value="consultation">Только консультация</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-button cta-gold-animation">
                    <span class="button-text">Отправить заявку</span>
                    <span class="button-loader"></span>
                </button>
            </form>
        `;

        const form = modalBody.querySelector('#connection-form');
        form.addEventListener('submit', this.handleFormSubmission.bind(this));

        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            this.setupPhoneMask(phoneInput);
        }

        this.trapFocus(modal);
    }

    setupPhoneMask(input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length === 0) {
                e.target.value = '';
                return;
            }

            if (value.length <= 1) {
                value = '+7' + value;
            } else if (value.length <= 4) {
                value = '+7 (' + value.substring(1, 4);
            } else if (value.length <= 7) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
            } else if (value.length <= 9) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
            } else {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }

            e.target.value = value;
        });
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-button');
        
        if (!this.validateForm(form)) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            await this.submitFormData(new FormData(form));
            this.showSuccessState(form);
        } catch (error) {
            this.showErrorState(form, error);
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e53e3e';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }

            if (input.type === 'tel' && input.value.trim()) {
                const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
                if (!phoneRegex.test(input.value)) {
                    input.style.borderColor = '#e53e3e';
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    submitFormData(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Network error. Please try again.'));
                }
            }, 1500);
        });
    }

    showSuccessState(form) {
        const modalBody = form.parentNode;
        modalBody.innerHTML = `
            <div class="success-state">
                <div class="success-icon">✓</div>
                <h4>Заявка принята!</h4>
                <p>Наш менеджер свяжется с вами в течение 15 минут</p>
                <button class="success-close">Закрыть</button>
            </div>
        `;

        modalBody.querySelector('.success-close').addEventListener('click', this.closeModal.bind(this));
    }

    showErrorState(form, error) {
        alert(`Ошибка: ${error.message}`);
    }

    closeModal() {
        const modal = this.elements.connectionModal;
        modal.classList.remove('active');
        modal.querySelector('.modal-body').innerHTML = '';
        this.state.isModalOpen = false;
        document.body.focus();
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.state.isModalOpen) {
            this.closeModal();
        }
    }

    handleResize() {
        const particlesField = document.querySelector('.particles-field');
        if (particlesField) {
            const currentParticles = particlesField.querySelectorAll('.floating-particle').length;
            const desiredCount = window.innerWidth < 768 ? 8 : 15;
            
            if (currentParticles !== desiredCount) {
                particlesField.innerHTML = '';
                for (let i = 0; i < desiredCount; i++) {
                    this.createParticle(particlesField, i);
                }
            }
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    destroy() {
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
        }
        
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('LandingManager destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LandingManager();
});