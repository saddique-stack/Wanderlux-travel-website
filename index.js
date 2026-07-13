// =============================================
// WanderLux Travels - Main JavaScript
// Premium Travel Agency Functionality
// =============================================

(function () {
    'use strict';

    // =============================================
    // DOM Ready Handler
    // =============================================
    document.addEventListener('DOMContentLoaded', function () {
        initAOS();
        initLoader();
        initNavbar();
        initScrollTop();
        initCounters();
        initSmoothScroll();
        initActiveNavLinks();
        initDestinationFilter();
        initTourFilter();
        initLightbox();
        initContactForm();
        initNewsletterForm();
    });

    // =============================================
    // AOS Animation Initialization
    // =============================================
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                delay: 0,
                disable: 'mobile'
            });
        }
    }

    // =============================================
    // Loading Screen
    // =============================================
    function initLoader() {
        const loader = document.getElementById('loaderWrapper');
        if (!loader) return;
        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('hidden');
                // Refresh AOS after loader disappears
                if (typeof AOS !== 'undefined') {
                    setTimeout(function () {
                        AOS.refresh();
                    }, 100);
                }
            }, 600);
        });
    }

    // =============================================
    // Sticky Navbar with Scroll Effect
    // =============================================
    function initNavbar() {
        const navbar = document.getElementById('mainNavbar');
        if (!navbar) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Set initial state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }

    // =============================================
    // Scroll to Top Button
    // =============================================
    function initScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // Counter Animation (Intersection Observer)
    // =============================================
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target')) || 0;
                    animateCounter(counter, target);
                    obs.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * eased);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // =============================================
    // Smooth Scrolling for Anchor Links
    // =============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 70;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // =============================================
    // Active Navigation Link Highlighting
    // =============================================
    function initActiveNavLinks() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(function (link) {
            const linkPath = link.getAttribute('href');
            if (!linkPath) return;

            // Extract filename for comparison
            const linkFile = linkPath.split('/').pop();
            const currentFile = currentPath.split('/').pop() || 'index.html';

            if (linkFile === currentFile) {
                link.classList.add('active');
            } else if (currentFile === '' && linkFile === 'index.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // =============================================
    // Dynamic Destination Filtering
    // =============================================
    function initDestinationFilter() {
        const filterBtn = document.getElementById('filterBtn');
        const searchInput = document.getElementById('destinationSearch');
        const regionFilter = document.getElementById('regionFilter');
        const destItems = document.querySelectorAll('.dest-item');

        if (!filterBtn || destItems.length === 0) return;

        filterBtn.addEventListener('click', function () {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const region = regionFilter ? regionFilter.value : 'all';

            destItems.forEach(function (item) {
                const itemRegion = item.getAttribute('data-region') || '';
                const itemText = item.textContent.toLowerCase();
                let show = true;

                // Region filter
                if (region !== 'all' && itemRegion !== region) {
                    show = false;
                }

                // Search filter
                if (searchTerm && !itemText.includes(searchTerm)) {
                    show = false;
                }

                if (show) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Refresh AOS for newly visible items
            if (typeof AOS !== 'undefined') {
                setTimeout(function () {
                    AOS.refresh();
                }, 150);
            }
        });

        // Also filter on Enter key in search
        if (searchInput) {
            searchInput.addEventListener('keyup', function (e) {
                if (e.key === 'Enter') {
                    filterBtn.click();
                }
            });
        }
    }

    // =============================================
    // Dynamic Tour Filtering & Sorting
    // =============================================
    function initTourFilter() {
        const filterBtn = document.getElementById('tourFilterBtn');
        const categoryFilter = document.getElementById('tourCategory');
        const sortFilter = document.getElementById('tourSort');
        const toursGrid = document.getElementById('toursGrid');

        if (!filterBtn || !toursGrid) return;

        filterBtn.addEventListener('click', function () {
            const category = categoryFilter ? categoryFilter.value : 'all';
            const sortBy = sortFilter ? sortFilter.value : 'default';
            const tourItems = Array.from(toursGrid.querySelectorAll('.tour-item'));

            // Filter
            tourItems.forEach(function (item) {
                const itemCategory = item.getAttribute('data-category') || '';
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Sort visible items
            const visibleItems = Array.from(toursGrid.querySelectorAll('.tour-item:not(.hidden)'));

            if (sortBy === 'price-low') {
                visibleItems.sort(function (a, b) {
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                });
            } else if (sortBy === 'price-high') {
                visibleItems.sort(function (a, b) {
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                });
            } else if (sortBy === 'duration') {
                visibleItems.sort(function (a, b) {
                    return parseInt(a.getAttribute('data-duration')) - parseInt(b.getAttribute('data-duration'));
                });
            }

            // Re-append sorted items
            visibleItems.forEach(function (item) {
                toursGrid.appendChild(item);
            });

            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                setTimeout(function () {
                    AOS.refresh();
                }, 150);
            }
        });
    }

    // =============================================
    // Gallery Lightbox
    // =============================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose = document.getElementById('lightboxClose');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!lightbox || galleryItems.length === 0) return;

        galleryItems.forEach(function (item) {
            item.addEventListener('click', function () {
                const src = item.getAttribute('data-src');
                const caption = item.getAttribute('data-caption') || '';
                if (src && lightboxImg) {
                    lightboxImg.src = src;
                    lightboxImg.alt = caption;
                }
                if (lightboxCaption) {
                    lightboxCaption.textContent = caption;
                }
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (lightboxImg) {
                lightboxImg.src = '';
            }
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // =============================================
    // Contact Form Validation
    // =============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            // Reset validation
            form.querySelectorAll('.is-invalid').forEach(function (el) {
                el.classList.remove('is-invalid');
            });

            // Name validation
            const nameInput = document.getElementById('contactName');
            if (nameInput && !nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            }

            // Email validation
            const emailInput = document.getElementById('contactEmail');
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                    emailInput.classList.add('is-invalid');
                    isValid = false;
                }
            }

            // Phone validation
            const phoneInput = document.getElementById('contactPhone');
            if (phoneInput && !phoneInput.value.trim()) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            }

            // Message validation
            const messageInput = document.getElementById('contactMessage');
            if (messageInput && !messageInput.value.trim()) {
                messageInput.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                // Show success
                const successDiv = document.getElementById('formSuccess');
                if (successDiv) {
                    successDiv.classList.remove('d-none');
                }
                form.reset();

                // Scroll to success message
                if (successDiv) {
                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Hide success after 5 seconds
                setTimeout(function () {
                    if (successDiv) {
                        successDiv.classList.add('d-none');
                    }
                }, 5000);
            } else {
                // Scroll to first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });

        // Real-time validation clearing
        form.querySelectorAll('.form-control, .form-select').forEach(function (input) {
            input.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // =============================================
    // Newsletter Form Validation
    // =============================================
    function initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (!emailInput) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const email = emailInput.value.trim();

            if (!email || !emailRegex.test(email)) {
                emailInput.style.borderColor = '#dc3545';
                emailInput.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.15)';
                emailInput.focus();
            } else {
                emailInput.style.borderColor = '#00b894';
                emailInput.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.15)';
                emailInput.value = '';

                // Create temporary success feedback
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="bi bi-check-lg"></i> Subscribed!';
                    btn.style.background = '#00b894';
                    btn.style.borderColor = '#00b894';
                    setTimeout(function () {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                    }, 2500);
                }

                // Reset border after delay
                setTimeout(function () {
                    emailInput.style.borderColor = '';
                    emailInput.style.boxShadow = '';
                }, 2500);
            }
        });

        // Clear error state on input
        const emailInput = document.getElementById('newsletterEmail');
        if (emailInput) {
            emailInput.addEventListener('input', function () {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
        }
    }

})();