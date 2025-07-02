document.addEventListener('DOMContentLoaded', () => {
    console.log("Amirul Shah's Resume Website Loaded Successfully!");

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Get the offset of the sticky navigation bar
                const navHeight = document.querySelector('nav').offsetHeight;
                const offsetTop = targetSection.offsetTop - navHeight - 20; // -20 for a little padding

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Optional: Add active class to navigation links
                document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Optional: Add/remove active class based on scroll position (more advanced)
    // This makes the navigation link highlight as you scroll to its section
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    const observerOptions = {
        root: null, // observe against the viewport
        // rootMargin helps define when the intersection starts/ends relative to the viewport
        // e.g., "-20% 0px -80% 0px" means 20% from top and 80% from bottom of viewport
        // This is useful for sticky headers
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0 // A section is considered intersecting as soon as any part of it is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links first
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                // Add 'active' class to the corresponding link
                const currentNavLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (currentNavLink) {
                    currentNavLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Certificates Toggle Functionality ---
    const toggleBtn = document.querySelector('.toggle-certificates-btn');
    const certificatesWrapper = document.querySelector('.certificates-wrapper');

    // Set initial text for the button (in case CSS makes it hidden by default)
    // If you always want it hidden on load, uncomment the line below.
    // certificatesWrapper.style.maxHeight = '0'; // If you set max-height to 0 in CSS, this might not be needed
    toggleBtn.textContent = 'Show More Certificates'; // Initial text

    toggleBtn.addEventListener('click', () => {
        if (certificatesWrapper.classList.contains('expanded')) {
            // If currently expanded, collapse it
            certificatesWrapper.classList.remove('expanded');
            toggleBtn.textContent = 'Show More Certificates';
        } else {
            // If currently collapsed, expand it
            certificatesWrapper.classList.add('expanded');
            toggleBtn.textContent = 'Show Less Certificates';
            // Optional: Scroll to the certificates section header if expanding from bottom
            document.querySelector('#certificates').scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Scroll to the top of the section
            });
        }
    });
});
