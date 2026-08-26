document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const nav = document.getElementById('nav');
    const themeToggle = document.querySelector('.theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const setTheme = (theme, persist = true) => {
        document.documentElement.dataset.theme = theme;
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        themeToggle?.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        themeToggle?.setAttribute('title', `Switch to ${nextTheme} mode`);

        if (persist) {
            try {
                localStorage.setItem('portfolio-theme', theme);
            } catch {
                // The page still works when browser storage is unavailable.
            }
        }
    };

    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    const updateNav = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    const closeMenu = () => {
        nav.classList.remove('menu-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 680) {
            closeMenu();
        }
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll(
        '.about-grid, .language-grid, .project-card, .work-card, .experience-col, .contact-content'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach(element => element.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

        revealTargets.forEach((element, index) => {
            element.classList.add('reveal');
            element.style.transitionDelay = `${Math.min(index % 2, 1) * 90}ms`;
            revealObserver.observe(element);
        });
    }

    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm?.addEventListener('submit', event => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        contactForm.reset();
        formFeedback.textContent = 'Thanks! Your message was submitted successfully.';
        formFeedback.hidden = false;
    });

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalButton = document.querySelector('.modal-close');
    let lastFocusedElement = null;

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lastFocusedElement?.focus();
    };

    const openModal = (image, trigger) => {
        if (!modal || !image) return;
        lastFocusedElement = trigger;
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt || '';
        modalCaption.textContent = image.alt || 'Project preview';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeModalButton?.focus();
    };

    document.querySelectorAll('.project-image, .work-card-image, .research-image').forEach(container => {
        container.addEventListener('click', () => {
            const image = container.matches('img') ? container : container.querySelector('img');
            openModal(image, container);
        });

        container.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const image = container.matches('img') ? container : container.querySelector('img');
                openModal(image, container);
            }
        });

        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', `View ${container.querySelector('img')?.alt || container.alt || 'image'} larger`);
    });

    closeModalButton?.addEventListener('click', closeModal);

    modal?.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
});
