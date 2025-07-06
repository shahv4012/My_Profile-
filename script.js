document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded Successfully!");

    // --- Smooth Scrolling for Navigation Links (applies to both index.html and portfolio.html) ---
    const smoothScroll = (selector) => {
        document.querySelectorAll(selector).forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Check if it's an internal link (starts with #) or external
                if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                    e.preventDefault(); // Stop default jump to top or section
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        const navHeight = this.closest('nav') ? this.closest('nav').offsetHeight : 0;
                        const offsetTop = targetSection.offsetTop - navHeight - 20; // Adjusted offset for padding

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    };

    // Apply smooth scrolling to index.html navigation
    if (document.querySelector('nav ul li a[href^="#"]')) { // This checks for index.html's nav
        smoothScroll('nav ul li a[href^="#"]');
    }
    // Apply smooth scrolling to portfolio.html navigation
    if (document.querySelector('.portfolio-nav ul li a[href^="#"]')) { // This checks for portfolio.html's nav
        smoothScroll('.portfolio-nav ul li a[href^="#"]');
    }


    // --- Active class for main navigation based on scroll position (only for index.html) ---
    // This part should specifically check if it's the index page before observing
    const mainNav = document.querySelector('nav');
    const isIndexPage = document.body.classList.contains('index-page'); // Add a class 'index-page' to <body> in index.html

    if (mainNav && isIndexPage) { 
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -80% 0px",
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    const currentNavLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                    if (currentNavLink) {
                        currentNavLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- Certificates Toggle Functionality (only for index.html) ---
    const toggleBtn = document.querySelector('.toggle-certificates-btn');
    const certificatesWrapper = document.querySelector('.certificates-wrapper');

    if (toggleBtn && certificatesWrapper) { // Check if elements exist on the page
        certificatesWrapper.style.maxHeight = '0'; // Ensure it's hidden initially by JS
        toggleBtn.textContent = 'Show More Certificates'; // Initial text

        toggleBtn.addEventListener('click', () => {
            if (certificatesWrapper.classList.contains('expanded')) {
                certificatesWrapper.classList.remove('expanded');
                certificatesWrapper.style.maxHeight = '0'; // Collapse with animation
                toggleBtn.textContent = 'Show More Certificates';
            } else {
                certificatesWrapper.classList.add('expanded');
                certificatesWrapper.style.maxHeight = certificatesWrapper.scrollHeight + "px"; // Expand to full height
                toggleBtn.textContent = 'Show Less Certificates';
                document.querySelector('#certificates').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }


    // --- Project Card Slider Functionality (for portfolio.html) ---
    const projectCardsContainer = document.querySelector('.portfolio-slider-container');
    if (projectCardsContainer) { // Check if the portfolio slider container exists
        const projectCards = document.querySelectorAll('.portfolio-grid .project-card');
        const prevBtn = projectCardsContainer.querySelector('.prev-slide');
        const nextBtn = projectCardsContainer.querySelector('.next-slide');
        const dotsContainer = projectCardsContainer.querySelector('.slider-dots-container');

        let currentProjectIndex = 0;
        let autoplayInterval;

        function showProjectCard(index) {
            // Remove active-slide from all and hide them visually
            projectCards.forEach((card, i) => {
                card.classList.remove('active-slide');
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
                card.style.zIndex = '1'; // Ensure non-active slides are behind
                card.setAttribute('aria-hidden', 'true'); // For accessibility
            });

            // Show the active slide
            if (projectCards[index]) {
                projectCards[index].classList.add('active-slide');
                projectCards[index].style.opacity = '1';
                projectCards[index].style.visibility = 'visible';
                projectCards[index].style.zIndex = '2'; // Bring active slide to front
                projectCards[index].setAttribute('aria-hidden', 'false'); // For accessibility
            }
            updateDots(index);
        }

        function nextProjectCard() {
            currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
            showProjectCard(currentProjectIndex);
        }

        function prevProjectCard() {
            currentProjectIndex = (currentProjectIndex - 1 + projectCards.length) % projectCards.length;
            showProjectCard(currentProjectIndex);
        }

        function updateDots(index) {
            if (dotsContainer) {
                dotsContainer.innerHTML = ''; // Clear existing dots
                for (let i = 0; i < projectCards.length; i++) {
                    const dot = document.createElement('button'); // Use button for accessibility
                    dot.classList.add('dot');
                    dot.setAttribute('aria-label', `Go to slide ${i + 1}`); // For accessibility
                    if (i === index) {
                        dot.classList.add('active');
                        dot.setAttribute('aria-current', 'true'); // For accessibility
                    }
                    dot.addEventListener('click', () => {
                        currentProjectIndex = i;
                        showProjectCard(currentProjectIndex);
                        resetAutoplay();
                    });
                    dotsContainer.appendChild(dot);
                }
            }
        }

        function startAutoplay() {
            clearInterval(autoplayInterval);
            if (projectCards.length > 1) {
                autoplayInterval = setInterval(nextProjectCard, 5000);
            }
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Initialize slider functionality
        if (projectCards.length > 0) {
            showProjectCard(currentProjectIndex);
            startAutoplay();

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevProjectCard();
                    resetAutoplay();
                });
                prevBtn.setAttribute('aria-label', 'Previous slide'); // For accessibility
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextProjectCard();
                    resetAutoplay();
                });
                nextBtn.setAttribute('aria-label', 'Next slide'); // For accessibility
            }

            // Keyboard navigation for slider
            projectCardsContainer.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevProjectCard();
                    resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    nextProjectCard();
                    resetAutoplay();
                }
            });

            // Touch events for mobile swipe
            let touchStartX = 0;
            let touchEndX = 0;
            projectCardsContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true }); // passive: true for better scroll performance
            projectCardsContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                if (touchEndX < touchStartX - 50) nextProjectCard();
                if (touchEndX > touchStartX + 50) prevProjectCard();
                resetAutoplay();
            }
        }
    }

    // --- Image Modal/Lightbox Functionality (for portfolio.html) ---
    const imageModal = document.getElementById('imageModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modal-caption');
    const openImageModalButtons = document.querySelectorAll('.open-image-modal');

    if (imageModal && closeModalBtn && modalImage && openImageModalButtons.length > 0) {
        openImageModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                const imageUrl = button.dataset.image;
                const imageAlt = button.closest('.project-card').querySelector('img').alt; // Get alt text from project card image
                const projectTitle = button.closest('.project-card').querySelector('h3').textContent; // Get project title

                if (imageUrl) {
                    modalImage.src = imageUrl;
                    modalImage.alt = imageAlt;
                    if (modalCaption) {
                        modalCaption.textContent = projectTitle;
                    }
                    imageModal.style.display = 'block'; // Show the modal
                    imageModal.classList.remove('closing'); // Ensure fade-in animation
                    document.body.style.overflow = 'hidden'; // Prevent scrolling of main page when modal is open
                }
            });
        });

        // Close modal when X button is clicked
        closeModalBtn.addEventListener('click', () => {
            imageModal.classList.add('closing'); // Add closing animation class
            imageModal.addEventListener('animationend', function handler() {
                imageModal.style.display = 'none'; // Hide after animation
                imageModal.removeEventListener('animationend', handler); // Remove listener to avoid multiple calls
                document.body.style.overflow = ''; // Re-enable scrolling of main page
            });
        });

        // Close modal when clicking outside the content (on the overlay)
        window.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.add('closing');
                imageModal.addEventListener('animationend', function handler() {
                    imageModal.style.display = 'none';
                    imageModal.removeEventListener('animationend', handler);
                    document.body.style.overflow = '';
                });
            }
        });
        
        // Prevent modal from closing when clicking inside the content itself
        imageModal.querySelector('.image-modal-content').addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event from bubbling up to window click listener
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageModal.style.display === 'block') { // Check for 'block' display
                closeModalBtn.click(); // Programmatically click the close button to trigger animation
            }
        });
    }
});
