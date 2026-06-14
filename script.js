document.addEventListener('DOMContentLoaded', () => {

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== SKILL BAR ANIMATION =====
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                        bar.style.width = bar.dataset.width + '%';
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        skillObserver.observe(skillsSection);
    }

    // ===== STICKY NAV SHADOW =====
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const mainSections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a[href^="#"]');

    if (mainSections.length && navLinks.length) {
        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const link = document.querySelector(`.main-nav ul li a[href="#${entry.target.id}"]`);
                    if (link) link.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -78% 0px' });

        mainSections.forEach(s => activeObserver.observe(s));
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navH = nav ? nav.offsetHeight : 0;
                window.scrollTo({ top: target.offsetTop - navH - 12, behavior: 'smooth' });
                document.getElementById('navMenu')?.classList.remove('open');
            }
        });
    });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!nav?.contains(e.target)) {
                navMenu.classList.remove('open');
            }
        });
    }

    // ===== CERTIFICATES TOGGLE =====
    const toggleBtn = document.getElementById('toggle-certificates');
    const certWrapper = document.querySelector('.certificates-wrapper');

    if (toggleBtn && certWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = certWrapper.classList.contains('expanded');
            certWrapper.classList.toggle('expanded');
            toggleBtn.classList.toggle('open');
            if (isExpanded) {
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show All Certificates';
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Certificates';
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // ===== SCROLL TO TOP =====
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 380);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== PROJECT CARD SLIDER (portfolio.html) =====
    const sliderContainer = document.querySelector('.portfolio-slider-container');
    if (sliderContainer) {
        const cards = sliderContainer.querySelectorAll('.portfolio-grid .project-card');
        const prevBtn = sliderContainer.querySelector('.prev-slide');
        const nextBtn = sliderContainer.querySelector('.next-slide');
        const dotsContainer = sliderContainer.querySelector('.slider-dots-container');
        let current = 0;
        let autoplay;

        function showCard(index) {
            cards.forEach(c => {
                c.classList.remove('active-slide');
                c.style.opacity = '0';
                c.style.visibility = 'hidden';
                c.style.zIndex = '1';
                c.setAttribute('aria-hidden', 'true');
            });
            if (cards[index]) {
                cards[index].classList.add('active-slide');
                cards[index].style.opacity = '1';
                cards[index].style.visibility = 'visible';
                cards[index].style.zIndex = '2';
                cards[index].setAttribute('aria-hidden', 'false');
            }
            buildDots(index);
        }

        function next() { current = (current + 1) % cards.length; showCard(current); }
        function prev() { current = (current - 1 + cards.length) % cards.length; showCard(current); }

        function buildDots(active) {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'dot' + (i === active ? ' active' : '');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                if (i === active) dot.setAttribute('aria-current', 'true');
                dot.addEventListener('click', () => { current = i; showCard(current); resetAutoplay(); });
                dotsContainer.appendChild(dot);
            });
        }

        function startAutoplay() {
            clearInterval(autoplay);
            if (cards.length > 1) autoplay = setInterval(next, 5000);
        }
        function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }

        if (cards.length > 0) {
            showCard(current);
            startAutoplay();
            prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
            nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

            sliderContainer.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
                if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
            });

            let touchStartX = 0;
            sliderContainer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            sliderContainer.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
            }, { passive: true });
        }
    }

    // ===== IMAGE MODAL (portfolio.html) =====
    const imageModal = document.getElementById('imageModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modal-caption');
    const openModalBtns = document.querySelectorAll('.open-image-modal');

    if (imageModal && closeModalBtn && modalImage && openModalBtns.length) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const url = btn.dataset.image;
                const card = btn.closest('.project-card');
                if (url) {
                    modalImage.src = url;
                    modalImage.alt = card?.querySelector('img')?.alt || '';
                    if (modalCaption) modalCaption.textContent = card?.querySelector('h3')?.textContent || '';
                    imageModal.style.display = 'block';
                    imageModal.classList.remove('closing');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeModal() {
            imageModal.classList.add('closing');
            imageModal.addEventListener('animationend', function handler() {
                imageModal.style.display = 'none';
                imageModal.removeEventListener('animationend', handler);
                document.body.style.overflow = '';
            });
        }

        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', e => { if (e.target === imageModal) closeModal(); });
        imageModal.querySelector('.image-modal-content')?.addEventListener('click', e => e.stopPropagation());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && imageModal.style.display === 'block') closeModal();
        });
    }
});
