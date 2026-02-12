// Mobile menu with accessibility
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        // Set ARIA attributes
        menuToggle.setAttribute('aria-label', 'Меню');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('role', 'button');
        
        menuToggle.addEventListener('click', function() {
            const isActive = nav.classList.contains('active');
            nav.classList.toggle('active');
            menuToggle.innerHTML = isActive ? '☰' : '✕';
            menuToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? '' : 'hidden';
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    });
    
    // Header scroll effect with debounce for performance
    const header = document.querySelector('.header');
    let isScrolled = false;
    
    function updateHeader() {
        if (window.scrollY > 50 && !isScrolled) {
            header.classList.add('header--scrolled');
            isScrolled = true;
        } else if (window.scrollY <= 50 && isScrolled) {
            header.classList.remove('header--scrolled');
            isScrolled = false;
        }
    }
    
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial check
    
    // Active link highlighting
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentLocation) {
            link.classList.add('active');
        }
        
        // Also check for root index.html
        if (currentLocation === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // Responsive image handling
    function checkImageSizes() {
        const images = document.querySelectorAll('.studio-image, .service-image, .team-photo, .team-full-photo, .comfort-photo, .map-photo, .gallery-item, .image-fullwidth, .image-left-right-item');
        
        images.forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                // Ensure images cover their containers properly on all screen sizes
                img.style.objectFit = 'cover';
                img.style.width = '100%';
                img.style.height = '100%';
            }
        });
    }
    
    // Call on load and resize
    checkImageSizes();
    window.addEventListener('resize', function() {
        checkImageSizes();
    }, { passive: true });
});

// Form submission with validation
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const nameInput = form.querySelector('input[placeholder*="имя"], input[name="name"], input[placeholder*="Ваше имя"]');
    const phoneInput = form.querySelector('input[type="tel"], input[placeholder*="+7"], input[placeholder*="+0"]');
    
    if (nameInput && phoneInput) {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        if (name && phone) {
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            
            // Reset selected master option styling if exists
            const masterOptions = document.querySelectorAll('.master-option.selected');
            masterOptions.forEach(option => {
                option.classList.remove('selected');
            });
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    } else {
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        form.reset();
    }
}

// Smooth scroll for anchor links with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        }
    });
});

// Lazy loading fallback for older browsers
if ('loading' in HTMLImageElement.prototype) {
    console.log('Браузер поддерживает lazy loading');
} else {
    // Dynamically load lazy loading polyfill
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    script.integrity = 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.async = true;
    document.body.appendChild(script);
    
    // Change img tags to use lazyload
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.classList.add('lazyload');
        img.setAttribute('data-src', img.src);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    });
}

// Fix for vh units on mobile
function setVhProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update hero height on mobile
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.height = `calc(var(--vh, 1vh) * 100)`;
    }
}

window.addEventListener('resize', setVhProperty, { passive: true });
window.addEventListener('orientationchange', setVhProperty, { passive: true });
setVhProperty();