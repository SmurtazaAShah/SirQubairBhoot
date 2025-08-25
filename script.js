// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTypingEffect();
    initNavigation();
    initFAQAccordion();
    initLocationSelector();
    initEnrollForm();
    initScrollEffects();
    initMobileMenu();
    initSlideshow(); // New slideshow initialization
});

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const rotatingText = document.getElementById('rotating-text');
    if (!rotatingText) return;

    const phrases = [
        "O Level",
        "A Level",
        "Edexcel",
        "IGCSE"
    ];

    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;
    let deletingSpeed = 60;
    let pauseTime = 2500;

    function typeText() {
        // Pause animation when page is hidden
        if (document.hidden) {
            setTimeout(typeText, 1000);
            return;
        }

        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isDeleting) {
            // Deleting text
            rotatingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = deletingSpeed;
        } else {
            // Typing text
            rotatingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }
        
        // Ensure consistent height to prevent layout shifts
        rotatingText.style.minHeight = '1.2em';
        rotatingText.style.width = '100%';

        // Check if we should switch to deleting
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            // Pause at the end of typing
            setTimeout(() => {
                isDeleting = true;
                typeText();
            }, pauseTime);
            return;
        }

        // Check if we should switch to typing next phrase
        if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            setTimeout(typeText, 500);
            return;
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start the typing effect
    typeText();
}

// ===== SLIDESHOW FUNCTIONALITY =====
function initSlideshow() {
    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slideshowContainer = document.querySelector('.slideshow-container');

    if (!slides.length || !slideshowContainer) return; // Exit if no slides or container

    let slideIndex = 0;
    let slideshowInterval;

    function showSlides(n) {
        // Pause autoplay when user manually interacts
        clearInterval(slideshowInterval);

        // Hide all slides and remove active class from dots
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));

        // Loop around if index goes out of bounds
        if (n >= slides.length) { slideIndex = 0 }
        else if (n < 0) { slideIndex = slides.length - 1 }
        else { slideIndex = n; }

        // Display the current slide and mark the current dot as active
        slides[slideIndex].style.display = 'block';
        dots[slideIndex].classList.add('active');

        // Announce slide change for screen readers
        slideshowContainer.setAttribute('aria-live', 'polite');
        // For actual announcement, one might set an attribute on an aria-live region
        // or dynamically update text within it, e.g., using a visually-hidden span.
        // For this simple slideshow, setting polite on container is a start.
        
        // Restart autoplay after a brief delay
        startSlideshow();
    }

    function plusSlides(n) {
        showSlides(slideIndex + n);
    }

    function currentSlide(n) {
        showSlides(n);
    }

    function startSlideshow() {
        // Clear any existing interval to prevent multiple intervals running
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            plusSlides(1);
        }, 5000); // Change image every 5 seconds
    }

    // Event listeners for navigation buttons
    prevButton.addEventListener('click', () => plusSlides(-1));
    nextButton.addEventListener('click', () => plusSlides(1));

    // Event listeners for dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index));
    });

    // Initialize the first slide and start autoplay
    showSlides(slideIndex);
}

// ===== NAVIGATION =====
function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        
        // Update header background
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        navLinks.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Update button text for screen readers
        this.textContent = isExpanded ? '☰' : '✕';
    });
    
    // Close mobile menu when clicking on a link
    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
            menuToggle.focus(); // Return focus to toggle button
        }
    });
}

// ===== FAQ ACCORDION =====
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
}

// ===== LOCATION SELECTOR =====
function initLocationSelector() {
    const locationOptions = document.querySelectorAll('.location-option');
    const locationCards = document.querySelectorAll('.location-card'); // Desktop-only elements
    const modeSelect = document.getElementById('mode');
    
    // Function to check if it's a mobile view
    const isMobile = () => window.innerWidth <= 480;
    
    locationOptions.forEach(option => {
        option.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            const accordionDetails = this.querySelector('.location-details-accordion');

            if (isMobile()) {
                // Mobile view: Accordion behavior
                const wasActive = this.classList.contains('active');
                const currentEnrollBtn = this.querySelector('.enroll-btn');

                // Close all accordions first
                locationOptions.forEach(opt => {
                    opt.classList.remove('active');
                    const details = opt.querySelector('.location-details-accordion');
                    if (details) {
                        details.classList.remove('active');
                    }
                });

                if (!wasActive) {
                    this.classList.add('active');
                    if (accordionDetails) {
                        accordionDetails.classList.add('active');
                    }
                    // Update enroll button text
                    if (currentEnrollBtn) {
                        currentEnrollBtn.textContent = `Enroll for ${location.charAt(0).toUpperCase() + location.slice(1)} Classes`;
                    }
                } else {
                    // If it was active, it's now closed, update enroll button to generic
                    if (currentEnrollBtn) {
                        currentEnrollBtn.textContent = 'Enroll for Classes';
                    }
                }

            } else {
                // Desktop view: Original behavior
                locationOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                // Hide all location cards first
                locationCards.forEach(card => {
                    card.classList.remove('active');
                });
                // Show the corresponding location card
                document.getElementById(`${location}-card`).classList.add('active');
            }
            
            // Update enroll form mode if it exists
            if (modeSelect) {
                switch(location) {
                    case 'dha':
                        modeSelect.value = 'DHA';
                        break;
                    case 'bahadurabad':
                        modeSelect.value = 'Bahadurabad';
                        break;
                    case 'gulshan':
                        modeSelect.value = 'Gulshan';
                        break;
                    case 'johar':
                        modeSelect.value = 'Johar';
                        break;
                    case 'online':
                        modeSelect.value = 'Online';
                        break;
                }
            }
        });
    });

    // Handle resize to switch between desktop/mobile behavior
    window.addEventListener('resize', () => {
        locationOptions.forEach(option => {
            const accordionDetails = option.querySelector('.location-details-accordion');
            if (isMobile()) {
                // On mobile, ensure desktop cards are hidden and accordions are correctly sized/hidden
                locationCards.forEach(card => card.classList.remove('active')); // Hide desktop cards
                if (!option.classList.contains('active')) {
                    if (accordionDetails) {
                        accordionDetails.style.maxHeight = null;
                        accordionDetails.classList.remove('active');
                    }
                }
            } else {
                // On desktop, ensure accordions are closed and desktop cards are visible/active
                option.classList.remove('active');
                if (accordionDetails) {
                    accordionDetails.style.maxHeight = null;
                    accordionDetails.classList.remove('active');
                }
                // Activate the first card by default if no option is active
                const activeOption = document.querySelector('.location-option.active');
                if (!activeOption) {
                    const firstOption = document.querySelector('.location-option');
                    if (firstOption) {
                        firstOption.classList.add('active');
                        const firstLocation = firstOption.getAttribute('data-location');
                        const firstCard = document.getElementById(`${firstLocation}-card`);
                        if (firstCard) firstCard.classList.add('active');
                    }
                }
            }
        });
    });

    // Initial setup based on current screen size
    if (!isMobile()) {
        // On desktop, ensure a default location card is active if none is
        const activeOption = document.querySelector('.location-option.active');
        if (!activeOption) {
            const firstOption = document.querySelector('.location-option');
            if (firstOption) {
                firstOption.classList.add('active');
                const firstLocation = firstOption.getAttribute('data-location');
                const firstCard = document.getElementById(`${firstLocation}-card`);
                if (firstCard) firstCard.classList.add('active');
            }
        }
    }
}

// ===== ENROLL FORM =====
function initEnrollForm() {
    const enrollForm = document.getElementById('enroll-form');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    
    if (!enrollForm) return;
    
    // Form submission
    enrollForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Perform validation for all required fields
        const requiredFields = enrollForm.querySelectorAll('[required]');
        let allFieldsValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allFieldsValid = false;
            }
        });

        if (!allFieldsValid) {
            showToast('Please fill in all required fields.', 'error');
            return; // Stop here if validation fails
        }
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Show success message
        showToast('Thank you for your interest! We will contact you soon.', 'success');
        
        // Reset form
        this.reset();
    });
    
    // WhatsApp button functionality
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Perform validation for all required fields
            const requiredFields = enrollForm.querySelectorAll('[required]');
            let allFieldsValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    allFieldsValid = false;
                }
            });
    
            if (!allFieldsValid) {
                showToast('Please fill in all required fields.', 'error');
                // Stop here if validation fails, do not proceed to WhatsApp
                return;
            }
            
            // Get form values
            const form = document.getElementById('enroll-form');
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Construct WhatsApp message including contact number
            const message = `Hi Sir Qubair, I'd like to enroll in a group class. Here are my details:\n\n` +
                            `- Name: ${formObject['full-name'] || ''}\n` +
                            `- Contact Number: ${formObject['contact-number'] || ''}\n` +
                            `- City/Country: ${formObject['country-city'] || ''}\n` +
                            `- Level (AS/A2/O Levels/IGCSE/Edexcel): ${formObject['curriculum-focus'] || ''}\n` +
                            `- Mode (DHA/Bahadurabad/Gulshan/Johar/Online): ${formObject['mode'] || ''}\n` +
                            `- Exam Board (Cambridge/Edexcel): ${formObject['exam-board'] || ''}\n` +
                            `\nMessage: ${formObject['message'] || ''}`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/923368920131?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Form validation
    const requiredFields = enrollForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// ===== FORM VALIDATION =====
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate required fields
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate email format
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    toast.textContent = message;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
    
    // Add slide-out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-header, .class-card, .achievement-card, .affiliation-card, .testimonial-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
const throttledScrollHandler = throttle(function() {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Debounce resize events
const debouncedResizeHandler = debounce(function() {
    // Handle responsive adjustments
}, 250);

window.addEventListener('resize', debouncedResizeHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation for location selector
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('location-option')) {
            e.preventDefault();
            activeElement.click();
        }
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
        // Trap focus within mobile menu when open
        const focusableElements = navMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement && lastElement) {
            firstElement.focus();
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting logic here
});

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment the following lines if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// ===== ANALYTICS READY (OPTIONAL) =====
// Add your analytics tracking code here
function trackEvent(eventName, eventData) {
    // Example: Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Example: Facebook Pixel event tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'enroll-form') {
        trackEvent('form_submit', {
            form_name: 'enroll_form',
            form_type: 'enrollment'
        });
    }
});

// Track WhatsApp clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('#whatsapp-btn')) {
        trackEvent('whatsapp_click', {
            button_location: 'enroll_form',
            action: 'contact'
        });
    }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTypingEffect,
        initNavigation,
        initFAQAccordion,
        initLocationSelector,
        initEnrollForm,
        showToast,
        validateField
    };
}
