// Page Loader
const pageLoader = document.getElementById('pageLoader');

// Hide loader when page is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        pageLoader.classList.add('loaded');
    }, 500); // Small delay for smoother transition
});

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize counters
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounting = (counter) => {
    const target = parseInt(counter.textContent.replace('+', ''));
    let count = 0;
    const inc = target / speed;
    
    const updateCount = () => {
        if (count < target) {
            count += inc;
            counter.textContent = Math.floor(count) + (counter.textContent.includes('+') ? '+' : '');
            setTimeout(updateCount, 1);
        } else {
            counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
        }
    };
    
    updateCount();
};

// Start counting when stats section is in view
const statsSection = document.querySelector('.stats-row');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => startCounting(counter));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Parallax effect for hero image
const heroImage = document.querySelector('.hero-image');
window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;
    const yPos = (clientY / window.innerHeight - 0.5) * 20;
    
    heroImage.style.transform = `translate(${xPos}px, ${yPos}px)`;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle service item interactions
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        serviceItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        projectItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(',');
            
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 0);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Animate skill progress rings
function setProgress(circle, percent) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

function animateSkills() {
    const circles = document.querySelectorAll('.progress-ring-circle');
    circles.forEach(circle => {
        const percent = circle.getAttribute('data-percent');
        setProgress(circle, 0);
        setTimeout(() => {
            setProgress(circle, percent);
        }, 100);
    });
}

// Initialize skill animations when the section becomes visible
const skillsSection = document.querySelector('.skills-section');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');
const progressCircle = document.querySelector('.progress-ring-circle');
const offset = progressCircle.getTotalLength();

// Update button visibility and progress ring
function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress ring
    const dashoffset = offset - (offset * scrolled) / 100;
    progressCircle.style.strokeDashoffset = dashoffset;
    
    // Show/hide button
    if (winScroll > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Smooth scroll to top
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Listen for scroll events
window.addEventListener('scroll', updateScrollProgress);

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const contactError = document.getElementById('contactError');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        contactSuccess.style.display = 'none';
        contactError.style.display = 'none';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('#', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                contactSuccess.style.display = 'block';
                contactSuccess.textContent = result.message;
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            contactError.style.display = 'block';
            contactError.textContent = error.message || 'Something went wrong. Please try again.';
        }
    });
}

// Handle newsletter form submission (frontend only)
const newsletterForm = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');
const newsletterError = document.getElementById('newsletterError');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous messages
        newsletterSuccess.style.display = 'none';
        newsletterError.style.display = 'none';
        
        // Get the email for validation
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value.trim() : '';
        
        // Simple email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newsletterError.style.display = 'block';
            newsletterError.textContent = 'Please provide a valid email address.';
            return;
        }
        
        // Show success message (no backend call)
        newsletterSuccess.style.display = 'block';
        newsletterSuccess.textContent = 'Thank you for subscribing to my newsletter!';
        newsletterForm.reset();
    });
}
