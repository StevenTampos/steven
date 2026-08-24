// ==================== PARTICLE SYSTEM ====================
const particlesCanvas = document.getElementById('particles-canvas');
const particlesCtx = particlesCanvas.particlesCtx = particlesCanvas.getContext('2d');

function initParticles() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));

    class Particle {
        constructor() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > particlesCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particlesCanvas.height) this.vy *= -1;
        }

        draw() {
            particlesCtx.beginPath();
            particlesCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            particlesCtx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
            particlesCtx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

        particles.forEach((particle, i) => {
            particle.update();
            particle.draw();

            // Connect nearby particles
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    particlesCtx.beginPath();
                    particlesCtx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - distance / 120)})`;
                    particlesCtx.lineWidth = 0.5;
                    particlesCtx.moveTo(particle.x, particle.y);
                    particlesCtx.lineTo(otherParticle.x, otherParticle.y);
                    particlesCtx.stroke();
                }
            });
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    });
}

// Initialize particles if not reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initParticles();
}

// ==================== TYPING ANIMATION ====================
const codeText = `class Developer {
  name: string = "John Steven Tampos";
  role: string = "Full-Stack Developer";
  school: string = "University of San Carlos";
}

export default new Developer();`;

let i = 0;
const typingSpeed = 15; // milliseconds per character
const codeElement = document.getElementById('typed-code');
const cursorElement = document.getElementById('cursor');
const compileIndicator = document.getElementById('compile-indicator');
const mainContent = document.getElementById('main-content');
const heroSection = document.getElementById('hero');
let animationComplete = false;

// Force scroll to top on load
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Lock scroll during animation
function lockScroll() {
    // Prevent page scroll but allow programmatic scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

// Unlock scroll after animation
function unlockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    animationComplete = true;
}

// Prevent scroll during animation
document.addEventListener('wheel', (e) => {
    if (!animationComplete) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!animationComplete) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent keyboard scrolling (space, arrow keys, page up/down)
document.addEventListener('keydown', (e) => {
    if (!animationComplete) {
        const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, page up, page down, end, home, arrow keys
        if (scrollKeys.includes(e.keyCode)) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Lock scroll initially
lockScroll();

function typeCode() {
    if (i < codeText.length) {
        const char = codeText.charAt(i);

        // Handle syntax highlighting
        if (codeText.substring(i, i + 5) === 'class' ||
            codeText.substring(i, i + 6) === 'string' ||
            codeText.substring(i, i + 6) === 'return' ||
            codeText.substring(i, i + 6) === 'export' ||
            codeText.substring(i, i + 7) === 'default' ||
            codeText.substring(i, i + 3) === 'new') {
            const keyword = codeText.substring(i).split(/[\s\[\]\(\)\{\}:;,]/)[0];
            codeElement.innerHTML += `<span style="color: #00D9FF;">${keyword}</span>`;
            i += keyword.length;
        } else if (char === '"' || char === "'") {
            // Handle strings
            let str = char;
            i++;
            while (i < codeText.length && codeText.charAt(i) !== char) {
                str += codeText.charAt(i);
                i++;
            }
            str += codeText.charAt(i);
            codeElement.innerHTML += `<span style="color: #D4AF37;">${str}</span>`;
            i++;
        } else if (char === '/' && codeText.charAt(i + 1) === '/') {
            // Handle comments
            let comment = '';
            while (i < codeText.length && codeText.charAt(i) !== '\n') {
                comment += codeText.charAt(i);
                i++;
            }
            codeElement.innerHTML += `<span style="color: #6B8199;">${comment}</span>`;
        } else {
            codeElement.textContent += char;
            i++;
        }

        // Auto-scroll the viewport to keep the typing cursor visible
        const cursorRect = cursorElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const cursorBottom = cursorRect.bottom;

        // If cursor is going below 60% of viewport, scroll down smoothly
        if (cursorBottom > viewportHeight * 0.6) {
            // Calculate target scroll position to keep cursor at ~40% of viewport
            const targetPosition = cursorRect.top + window.scrollY - (viewportHeight * 0.4);

            // Log scroll action for debugging
            if (i % 50 === 0) {
                console.log('Auto-scrolling:', {
                    char: i,
                    cursorBottom,
                    viewportHeight,
                    scrollY: window.scrollY,
                    targetPosition
                });
            }

            // Smooth scroll to keep cursor visible
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'instant' // Use instant for typing smoothness
            });
        }

        setTimeout(typeCode, typingSpeed);
    } else {
        // Typing complete, show compile indicator
        setTimeout(() => {
            cursorElement.style.display = 'none';
            compileIndicator.classList.add('active');

            // After compilation, reveal main content
            setTimeout(() => {
                // Pre-load main content behind hero to prevent flash
                mainContent.style.position = 'absolute';
                mainContent.style.top = '0';
                mainContent.style.left = '0';
                mainContent.style.width = '100%';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                mainContent.style.zIndex = '1';

                // Keep hero on top
                heroSection.style.position = 'relative';
                heroSection.style.zIndex = '2';

                // Force browser to render main content
                void mainContent.offsetHeight;

                // Wait a frame for rendering to complete
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Set transition properties
                        heroSection.style.transition = 'opacity 0.8s ease-out';
                        mainContent.style.transition = 'opacity 0.8s ease-in';

                        // Start crossfade
                        heroSection.style.opacity = '0';
                        mainContent.style.opacity = '1';
                        mainContent.classList.add('visible');

                        // After fade completes
                        setTimeout(() => {
                            // Clean up positioning
                            heroSection.style.display = 'none';
                            mainContent.style.position = '';
                            mainContent.style.top = '';
                            mainContent.style.left = '';
                            mainContent.style.width = '';
                            mainContent.style.zIndex = '';
                            heroSection.style.zIndex = '';

                            // Unlock scroll
                            unlockScroll();

                            // Scroll to top
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });

                            // Trigger scroll animations
                            setTimeout(() => {
                                observeElements();
                                // Add tilt effect after content is visible
                                addTiltEffect();
                            }, 100);
                        }, 800); // Duration of fade
                    });
                });
            }, 2200); // Duration of compile animation
        }, 500);
    }
}

// ==================== SCROLL ANIMATIONS ====================
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    });

    // Observe all cards and sections with stagger effect
    const elements = document.querySelectorAll('.project-card, .stat-card, .work-card, .timeline-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add parallax effect to section headers
    const sectionHeaders = document.querySelectorAll('.section h2');
    sectionHeaders.forEach((header, index) => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2}s`;
        observer.observe(header);
    });

    // Observe about text and other content
    const contentElements = document.querySelectorAll('.about-text p, .stats-grid, .section-lead');
    contentElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
        observer.observe(el);
    });
}

// ==================== SMOOTH SCROLL ====================
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

// ==================== PROJECT CARD TILT EFFECT ====================
function addTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Add smooth transition when mouse enters
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;

            // Remove transition during movement for immediate response
            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;

            // Add glow effect that follows cursor
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            card.style.setProperty('--glow-x', `${glowX}%`);
            card.style.setProperty('--glow-y', `${glowY}%`);
        });

        card.addEventListener('mouseleave', () => {
            // Smooth transition back to normal
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = '';
        });
    });
}

// ==================== INITIALIZE ====================
// Fix white screen bug on reload at bottom of page
window.addEventListener('load', () => {
    // Check if user has already seen the animation (page reload scenario)
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');

    // If scrolled down on load, skip hero animation
    if (window.scrollY > 100 || hasSeenAnimation) {
        // Skip animation, show main content immediately
        heroSection.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
        mainContent.classList.add('visible');
        unlockScroll();
        observeElements();
        addTiltEffect();
    } else {
        // Show hero animation for first load
        setTimeout(() => {
            typeCode();
        }, 500);
    }
});

// Mark that animation has been seen this session
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('hasSeenAnimation', 'true');
});

// ==================== MAGNETIC BUTTON EFFECT ====================
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.contact-link, .nav-link');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.3;
            const moveY = y * 0.3;

            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// ==================== STAT COUNTER ANIMATION ====================
function animateStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');

    const observerOptions = {
        threshold: 0.8,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.match(/\d+/)?.[0] || 0);
                const suffix = text.replace(/\d+/, '');

                if (number > 0) {
                    let current = 0;
                    const increment = number / 50;
                    const duration = 1500;
                    const stepTime = duration / 50;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            target.textContent = number + suffix;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, stepTime);
                }
            }
        });
    }, observerOptions);

    statValues.forEach(stat => observer.observe(stat));
}

// Initialize stat counter animation
animateStatCounters();

// ==================== NETWORK VISUALIZATION (Optional Enhancement) ====================
// Create subtle animated connection lines between project cards
function createNetworkLines() {
    const canvas = document.createElement('canvas');
    canvas.id = 'network-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.3';

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 217, 255, 0.4)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// Initialize network visualization after hero animation
setTimeout(() => {
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        createNetworkLines();
    }
}, 4000);

// ==================== PERFORMANCE OPTIMIZATION ====================
// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrolled / docHeight) * 100;

            // Update scroll progress bar
            if (scrollProgress) {
                scrollProgress.style.width = scrollPercent + '%';
            }

            ticking = false;
        });

        ticking = true;
    }
}, { passive: true });

// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
        // Perform scroll-dependent operations here if needed
    });
}, { passive: true });

// ==================== RIPPLE EFFECT ====================
function createRipple(event) {
    const card = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    card.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Add ripple effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', createRipple);
});

// ==================== MAGNETIC EFFECT ====================
function addMagneticEffect(elements) {
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = 0.3;
            element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Apply magnetic effect to nav links and contact links
addMagneticEffect(document.querySelectorAll('.nav-link, .contact-link, .project-link'));

// Image Modal Functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');

// Make project images clickable with modal
document.querySelectorAll('.project-image, .work-card-image, .research-image').forEach(imageContainer => {
    imageContainer.style.cursor = 'pointer';

    // For research images (direct img elements)
    if (imageContainer.classList.contains('research-image')) {
        imageContainer.addEventListener('click', () => {
            modal.classList.add('active');
            modalImg.src = imageContainer.src;
            modalCaption.textContent = imageContainer.alt || 'Research Image';
            document.body.style.overflow = 'hidden';
        });
    } else {
        // For project and work card images (container elements)
        imageContainer.addEventListener('click', () => {
            const img = imageContainer.querySelector('img');
            if (img && img.src) {
                modal.classList.add('active');
                modalImg.src = img.src;
                modalCaption.textContent = img.alt || 'Project Image';
                document.body.style.overflow = 'hidden';
            }
        });
    }
});

// Close modal when clicking X
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Lazy load images if any are added later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== CUSTOM CURSOR ====================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth follow effect
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// ==================== FLOATING PARTICLES ====================
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.prepend(particleContainer);

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${i % 2 === 0 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(233, 165, 104, 0.4)'};
            border-radius: 50%;
            left: ${startX}%;
            top: ${startY}%;
            opacity: ${opacity};
            animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
            box-shadow: 0 0 ${size * 3}px ${i % 2 === 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(233, 165, 104, 0.3)'};
        `;

        particleContainer.appendChild(particle);
    }
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        25% {
            transform: translate(20px, -30px) scale(1.2);
        }
        50% {
            transform: translate(-15px, -60px) scale(0.8);
        }
        75% {
            transform: translate(25px, -30px) scale(1.1);
        }
    }
`;
document.head.appendChild(style);

createParticles();

// Add cursor interaction on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursor.style.borderColor = 'var(--accent-cyan)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        cursor.style.borderColor = 'rgba(56, 189, 248, 0.5)';
    });
});

console.log('%c👨‍💻 Portfolio by John Steven Tampos', 'color: #00D9FF; font-size: 16px; font-weight: bold;');
console.log('%cInterested in the code? Check out the repo or reach out!', 'color: #D4AF37; font-size: 12px;');
