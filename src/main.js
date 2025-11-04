// --- Sistema de JavaScript "DEFINITIVO" para Peletería Ramirez (Versión Corregida y Optimizada) ---

const App = {
    // 1. INICIALIZACIÓN
    init() {
        this.applyStoredTheme();
        this.cacheDOMElements();
        this.initEventListeners();
        this.initObservers();
        this.initPreloader();
        this.initMagicCursor();
    },

    // 2. CACHÉ DE ELEMENTOS DEL DOM
    cacheDOMElements() {
        this.header = document.querySelector('.header');
        this.themeToggle = document.getElementById('theme-toggle');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.sections = document.querySelectorAll('section[id]');
        this.menuFilters = document.querySelector('.menu-filters');
        this.productCards = document.querySelectorAll('.product-card');
        this.contactForm = document.getElementById('contactForm');
        this.mainHeadline = document.querySelector('.main-headline');
        this.modal = document.getElementById('product-modal');
        this.modalCloseBtn = document.getElementById('modal-close-btn');
        this.logo = document.getElementById('draggable-logo');
        this.magicConeCursor = document.getElementById('magic-cone-cursor');
        this.sparkleSound = document.getElementById('sparkle-sound');
    },

    // 3. MANEJADORES DE EVENTOS
    initEventListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        this.hamburger.addEventListener('click', () => this.navMenu.classList.toggle('active'));
        this.navLinks.forEach(link => link.addEventListener('click', () => this.navMenu.classList.remove('active')));
        if (this.contactForm) this.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        if (this.menuFilters) this.menuFilters.addEventListener('click', this.handleMenuFilter.bind(this));
        
        // --- CORRECCIÓN CLAVE AQUÍ ---
        // Se elimina la condición que bloqueaba el clic en los productos.
        this.productCards.forEach(card => card.addEventListener('click', () => {
            this.openModal(card);
        }));
        
        if (this.modalCloseBtn) this.modalCloseBtn.addEventListener('click', this.closeModal.bind(this));
        if (this.modal) this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) this.closeModal(); });
    },
    
    // --- SECCIÓN DEL CURSOR MÁGICO ---
    initMagicCursor() {
        if (!this.logo || !this.magicConeCursor) return;

        let magicCursorActive = false;
        let throttleTimeout = null;
        const THROTTLE_DELAY = 50;
        let mouseX = -100;
        let mouseY = -100;
        let animationFrameId = null;

        const createParticle = (x, y) => {
            const particle = document.createElement('div');
            document.body.appendChild(particle);
            
            const isSnowman = Math.random() > 0.85;
            particle.className = isSnowman ? 'particle snowman' : 'particle sparkle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            if (!isSnowman) {
                const colors = ['#FFC947', '#F48FB1', '#66BB6A', '#78B227', '#FF3131'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.setProperty('--random-color', randomColor);
            }
            
            const endX = (Math.random() - 0.5) * 150;
            const endY = (Math.random() - 0.5) * 150;
            particle.style.setProperty('--end-x', `${endX}px`);
            particle.style.setProperty('--end-y', `${endY}px`);

            particle.addEventListener('animationend', () => particle.remove());
        };

        const animationLoop = () => {
            if (!magicCursorActive) return;
            this.magicConeCursor.style.left = `${mouseX}px`;
            this.magicConeCursor.style.top = `${mouseY}px`;
            animationFrameId = requestAnimationFrame(animationLoop);
        };

        this.logo.addEventListener('click', (e) => {
            e.preventDefault();
            magicCursorActive = !magicCursorActive;
            document.body.classList.toggle('magic-cursor-active', magicCursorActive);

            if (magicCursorActive) {
                animationFrameId = requestAnimationFrame(animationLoop);
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (magicCursorActive && !throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    createParticle(mouseX, mouseY);
                    throttleTimeout = null;
                }, THROTTLE_DELAY);
            }
        });

        window.addEventListener('click', (e) => {
            if (magicCursorActive && this.sparkleSound && !this.logo.contains(e.target)) {
                this.sparkleSound.currentTime = 0;
                this.sparkleSound.play().catch(err => {});
            }
        });
    },

    // 4. OBSERVADORES DE INTERSECCIÓN
    initObservers() {
        const faderOptions = { threshold: 0.2, rootMargin: "0px 0px -100px 0px" };
        const faderObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.style.getPropertyValue("--delay") || '0s';
                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, faderOptions);
        document.querySelectorAll('.fade-in').forEach(el => faderObserver.observe(el));

        const navObserverOptions = { rootMargin: '-40% 0px -60% 0px' };
        const navObserver = new IntersectionObserver(this.updateActiveNav.bind(this), navObserverOptions);
        this.sections.forEach(section => navObserver.observe(section));
    },

    // 5. LÓGICA DE FUNCIONALIDADES
    handleScroll() {
        const scrollY = window.scrollY;
        this.header.classList.toggle('scrolled', scrollY > 50);
    },
    initPreloader() {
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            this.animateHeadline();
        });
    },
    animateHeadline() {
        if (!this.mainHeadline) return;
        const text = this.mainHeadline.textContent;
        this.mainHeadline.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.03}s`;
            this.mainHeadline.appendChild(span);
        });
    },
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    },
    applyStoredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    },
    updateActiveNav(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) link.classList.add('active');
                });
            }
        });
    },
    handleMenuFilter(e) {
        if (!e.target.classList.contains('filter-btn')) return;
        const filterValue = e.target.dataset.filter;
        this.menuFilters.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        this.productCards.forEach(card => {
            const isVisible = filterValue === 'all' || card.dataset.category === filterValue;
            card.style.display = isVisible ? 'flex' : 'none';
        });
    },
    handleFormSubmit(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            btn.textContent = 'Enviar Mensaje';
            btn.disabled = false;
            this.contactForm.reset();
        }, 1500);
    },
    openModal(card) {
        const title = card.dataset.title;
        const price = card.dataset.price;
        const imgSrc = card.querySelector('img').src;
        if (this.modal) {
            this.modal.querySelector('#modal-title').textContent = title;
            this.modal.querySelector('#modal-price').textContent = price;
            this.modal.querySelector('.modal-image').style.backgroundImage = `url('${imgSrc}')`;
            this.modal.classList.add('active');
            this.modal.setAttribute('aria-hidden', 'false');
        }
    },
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }
};

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => App.init());