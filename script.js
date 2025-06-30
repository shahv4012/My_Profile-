document.addEventListener('DOMContentLoaded', () => {
    console.log("Amirul Shah's Resume Website Loaded Successfully!");

    // Example: Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // You can add more interactive elements here if needed,
    // like a "scroll to top" button, dynamic content loading, etc.
});
