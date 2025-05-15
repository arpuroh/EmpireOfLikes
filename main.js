// main.js - Empire of Likes - Single Page Interactive V2.1

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const siteLoader = document.getElementById('site-loader');
    const mainContent = document.getElementById('main-content');
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksMenu = document.getElementById('nav-links-menu');
    const particleCanvas = document.getElementById('particle-canvas');
    const cursorGlow = document.getElementById('cursor-glow');

    // --- Particle Canvas ---
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const particleDensity = Math.floor((window.innerWidth * window.innerHeight) / 20000); // Adjust density based on screen area

        const setupCanvas = () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 1.5 + 0.3; // Slightly smaller, more numerous
                this.speedX = (Math.random() * 0.6 - 0.3) * 0.5; // Slower, more drift-like
                this.speedY = (Math.random() * 0.6 - 0.3) * 0.5;
                this.baseColor = Math.random() > 0.5 ? [0, 255, 255] : [255, 0, 255]; // Cyan or Magenta
                this.opacity = Math.random() * 0.3 + 0.1; // More subtle
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                // Wrap particles around screen edges
                if (this.x < 0) this.x = particleCanvas.width;
                if (this.x > particleCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particleCanvas.height;
                if (this.y > particleCanvas.height) this.y = 0;

                this.opacity -= 0.001; // Fade out slowly
            }
            draw() {
                ctx.fillStyle = `rgba(${this.baseColor[0]}, ${this.baseColor[1]}, ${this.baseColor[2]}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleDensity; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].opacity <= 0) { // Replace faded particles
                    particles.splice(i, 1);
                    i--;
                    particles.push(new Particle());
                }
            }
            requestAnimationFrame(animateParticles);
        }
        
        window.addEventListener('resize', () => {
            setupCanvas();
            initParticles(); // Re-initialize on resize for new density
        });

        setupCanvas();
        initParticles();
        animateParticles();
    }

    // --- Cursor Glow ---
    if (cursorGlow) {
        let mouseX = -100, mouseY = -100; // Start off-screen
        let glowX = -100, glowY = -100;
        const trailSpeed = 0.15; // How quickly the glow follows the cursor

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursorGlow.style.opacity !== '1') cursorGlow.style.opacity = '1';
        });

        function updateGlowPosition() {
            glowX += (mouseX - glowX) * trailSpeed;
            glowY += (mouseY - glowY) * trailSpeed;
            cursorGlow.style.transform = `translate(${glowX - cursorGlow.offsetWidth / 2}px, ${glowY - cursorGlow.offsetHeight / 2}px)`;
            requestAnimationFrame(updateGlowPosition);
        }
        updateGlowPosition(); // Start the animation loop

        document.addEventListener('mousedown', () => cursorGlow.classList.add('active'));
        document.addEventListener('mouseup', () => cursorGlow.classList.remove('active'));
        document.body.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
        document.body.addEventListener('mouseenter', () => { if(mouseX > -100) cursorGlow.style.opacity = '1'}); // Show on re-enter
    }

    // --- Site Loader ---
    window.addEventListener('load', () => {
        if (siteLoader) siteLoader.classList.add('loaded');
        if (mainContent) mainContent.style.opacity = '1';
        
        const initialVisibleSection = document.querySelector('.content-section.active-section') || (sections.length > 0 ? sections[0] : null);
        if (initialVisibleSection) {
            const elementsToAnimate = initialVisibleSection.querySelectorAll('.animate-on-scroll');
            elementsToAnimate.forEach(el => {
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => el.classList.add('is-visible'), delay + 300); // Increased delay for loader
            });
            animateTextReveal(initialVisibleSection.querySelectorAll('.animate-text-reveal'));
        }
    });
    
    // --- Text Reveal Animation ---
    function animateTextReveal(elements) {
        elements.forEach(el => {
            if (el.dataset.revealed) return; // Prevent re-animating
            el.dataset.revealed = true;

            const text = el.textContent.trim();
            const words = text.split(/(\s+)/); // Split by words, keeping spaces
            el.innerHTML = ''; 
            let charDelay = 0;
            words.forEach((word) => {
                if (word.match(/\s+/)) { // If it's a space
                    const spaceSpan = document.createElement('span');
                    spaceSpan.innerHTML = '&nbsp;'; // Use &nbsp; for spaces
                     el.appendChild(spaceSpan);
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block'; // To animate as a block
                    word.split('').forEach((letter) => {
                        const span = document.createElement('span');
                        span.textContent = letter;
                        span.style.animationDelay = `${charDelay * 0.03}s`; // Stagger letter animation
                        wordSpan.appendChild(span);
                        charDelay++;
                    });
                    el.appendChild(wordSpan);
                }
            });
        });
    }
    animateTextReveal(document.querySelectorAll('.site-title.animate-text-reveal'));

    // --- Mobile Navigation Toggle ---
    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            navLinksMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', isExpanded);
        });
    }

    // --- Smooth Scrolling & Active Nav Link Highlighting ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = siteHeader.offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                if (navLinksMenu.classList.contains('active')) {
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinksMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });
    
    // --- Header Style Change on Scroll ---
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
        // Optional: Hide header on scroll down, show on scroll up
        // if (currentScroll > lastScrollTop && currentScroll > siteHeader.offsetHeight){
        //   siteHeader.style.top = `-${siteHeader.offsetHeight}px`; // Hide
        // } else {
        //   siteHeader.style.top = "0"; // Show
        // }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
    }, false);


    // --- Intersection Observer for Section Activation & Animations ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: `-${siteHeader.offsetHeight + 50}px 0px -35% 0px`, // Fine-tuned margin
        threshold: 0.25 // Section needs to be a bit more in view
    };

    const setActiveSectionUI = (sectionId) => {
        sections.forEach(section => {
            section.classList.toggle('active-section', section.id === sectionId);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                setActiveSectionUI(sectionId);
                const elementsToAnimate = entry.target.querySelectorAll('.animate-on-scroll:not(.is-visible)');
                elementsToAnimate.forEach(el => {
                    const delay = parseInt(el.dataset.delay) || 0;
                    setTimeout(() => el.classList.add('is-visible'), delay);
                });
                animateTextReveal(entry.target.querySelectorAll('.animate-text-reveal:not([data-revealed="true"])'));
                // playSound('section-reveal');
            } else {
                 // If you want sections to fade out when not primary:
                 // entry.target.classList.remove('active-section');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));
    
    const handleInitialLoa