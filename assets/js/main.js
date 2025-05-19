// Main JavaScript file for all pages

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get hamburger button and nav menu elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Check if elements exist before adding event listeners
    if (hamburger && navLinks) {
        // Toggle menu when hamburger is clicked
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            //console.log('Hamburger clicked, menu toggled');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                //console.log('Nav link clicked, menu closed');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && !e.target.closest('#navbar')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                //console.log('Clicked outside, menu closed');
            }
        });
    } else {
        console.error('Hamburger menu elements not found');
    }
});



// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Add active class to current page in navigation
document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav-links li a');
    const navLength = navLinks.length;
    
    for (let i = 0; i < navLength; i++) {
        if (navLinks[i].getAttribute('href') === currentLocation.substring(currentLocation.lastIndexOf('/') + 1)) {
            navLinks[i].classList.add('active');
        } else if (currentLocation.substring(currentLocation.lastIndexOf('/') + 1) === '' && navLinks[i].getAttribute('href') === 'index.html') {
            navLinks[i].classList.add('active');
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation on scroll (simple implementation)
window.addEventListener('scroll', revealElements);

function revealElements() {
    const elements = document.querySelectorAll('.section-heading, .skill-item, .project-card, .contact-item, .about-image, .about-text');
    
    for (let i = 0; i < elements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = elements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            elements[i].classList.add('visible');
        }
    }
}

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formStatus = document.getElementById('formStatus');
            formStatus.style.color = 'var(--info-color)';
            formStatus.innerHTML = 'Sending message...';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Log the data being sent (for debugging)
            //console.log('Sending form data:', { name, email, subject, message });

            // Check if any field is empty
            if (!name || !email || !subject || !message) {
                formStatus.style.color = 'var(--error-color)';
                formStatus.innerHTML = 'Please fill in all fields.';
                return;
            }

            // Use the full URL to your backend server
            fetch('https://portfoliomohit.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            })
            .then(response => {
                //console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log('Response data:', data);
                if (data.success) {
                    formStatus.style.color = 'var(--success-color)';
                    formStatus.innerHTML = 'Message sent successfully! I will get back to you soon.';
                    document.getElementById('contactForm').reset();
                } else {
                    formStatus.style.color = 'var(--error-color)';
                    formStatus.innerHTML = data.error || 'Something went wrong. Please try again later.';
                }

                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.style.color = 'var(--error-color)';
                formStatus.innerHTML = 'Error sending message. Please try again later.';

                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            });
        });
    } else {
        console.warn('Contact form not found on this page');
    }
});

        
        // Animate contact items on scroll
        window.addEventListener('scroll', () => {
            const contactItems = document.querySelectorAll('.contact-item, .faq-item');
            
            contactItems.forEach((item, index) => {
                const windowHeight = window.innerHeight;
                const elementTop = item.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    // Delayed animation for each item
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        });
        
        // Apply initial styles for animation
        document.addEventListener('DOMContentLoaded', () => {
            const contactItems = document.querySelectorAll('.contact-item, .faq-item');
            contactItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.5s ease';
            });
            
            // Trigger animation on page load
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 300);
        });

// Add this JavaScript code before the closing </body> tag
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    // Add click event to the theme toggle button
    themeToggle.addEventListener('click', toggleTheme);
});