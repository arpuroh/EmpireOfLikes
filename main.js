// main.js - Empire of Likes - Single Page Interactive V2

document.addEventListener('DOMContentLoaded', () => {
    const siteLoader = document.getElementById('site-loader');
    const mainContent = document.getElementById('main-content');
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksMenu = document.getElementById('nav-links-menu');
    const particleCanvas = document.getElementById('particle-canvas');
    const cursorGlow = document.getElementById('cursor-glow');

    // --- Particle Canvas (Basic) ---
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = Math.random() > 0.5 ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 0, 255, 0.5)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.01;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor(particleCanvas.width / 30); // Adjust density
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                    particles.push(new Particle()); // Replace dead particle
                }
            }
            requestAnimationFrame(animateParticles);
        }
        
        window.addEventListener('resize', () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }

    // --- Cursor Glow ---
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1'; 
        });
        document.addEventListener('mousedown', () => cursorGlow.classList.add('active'));
        document.addEventListener('mouseup', () => cursorGlow.classList.remove('active'));
        document.body.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
    }


    // --- Site Loader ---
    window.addEventListener('load', () => {
        if (siteLoader) {
            siteLoader.classList.add('loaded');
        }
        mainContent.style.opacity = '1'; 
        // Trigger animations for the initially visible section after load
        const initialVisibleSection = document.querySelector('.content-section.active-section') || sections[0];
        if (initialVisibleSection) {
            const elementsToAnimate = initialVisibleSection.querySelectorAll('.animate-on-scroll');
            elementsToAnimate.forEach(el => {
                // Add a slight delay for elements in the first section
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => el.classList.add('is-visible'), delay + 200); // +200 for loader fade
            });
            animateTextReveal(initialVisibleSection.querySelectorAll('.animate-text-reveal'));
        }
    });
    
    // --- Text Reveal Animation ---
    function animateTextReveal(elements) {
        elements.forEach(el => {
            const text = el.textContent.trim();
            const letters = text.split('');
            el.innerHTML = ''; // Clear original text
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter; // Handle spaces
                span.style.animationDelay = `${index * 0.05}s`; // Stagger animation
                el.appendChild(span);
            });
        });
    }
    // Initial call for static text reveals (like site title)
    animateTextReveal(document.querySelectorAll('.site-title.animate-text-reveal'));


    // --- Mobile Navigation Toggle ---
    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            navLinksMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', isExpanded); // Prevent body scroll when menu is open
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) { // Reduced threshold
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Section Activation & Animations ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: `-${siteHeader.offsetHeight + 100}px 0px -40% 0px`, // Adjusted for more centered activation
        threshold: 0.2 // Needs more of the section in view
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

                const elementsToAnimate = entry.target.querySelectorAll('.animate-on-scroll');
                elementsToAnimate.forEach(el => {
                    const delay = parseInt(el.dataset.delay) || 0;
                    setTimeout(() => el.classList.add('is-visible'), delay);
                });
                animateTextReveal(entry.target.querySelectorAll('.animate-text-reveal'));
                // Play sound (conceptual)
                // playSound('section-transition'); 
            } else {
                // Optionally remove 'is-visible' if you want animations to replay on scroll back
                // const elementsToReset = entry.target.querySelectorAll('.animate-on-scroll.is-visible');
                // elementsToReset.forEach(el => el.classList.remove('is-visible'));
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    if (window.location.hash) {
        // Handle initial load with hash, similar to V1 but ensure UI update
        const initialSectionId = window.location.hash.substring(1);
        const initialSection = document.getElementById(initialSectionId);
        if (initialSection) {
            setTimeout(() => {
                const headerOffset = siteHeader.offsetHeight;
                const elementPosition = initialSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'auto' });
                setActiveSectionUI(initialSectionId); // Ensure nav link and section are active
                 // Elements will be animated by the loader's 'load' event listener
            }, 100);
        }
    } else {
        if(sections.length > 0) {
            setActiveSectionUI(sections[0].id); // Activate first section UI
            // Animations for first section handled by loader 'load'
        }
    }

    // --- Footer: Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Enhanced Temporal Loom Interaction ---
    const loomSlider = document.getElementById('loom-slider');
    const sceneSteelMill = document.getElementById('scene-steel-mill');
    const sceneTikTokHouse = document.getElementById('scene-tiktok-house');
    if (loomSlider && sceneSteelMill && sceneTikTokHouse) {
        sceneSteelMill.style.opacity = '1';
        sceneTikTokHouse.style.opacity = '0';
        sceneTikTokHouse.style.display = 'block';
        loomSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            sceneSteelMill.style.opacity = 1 - val;
            sceneTikTokHouse.style.opacity = val;
            // playSound('slider-drag'); // Conceptual
        });
    }

    // --- Interactive: Group Chat Animation ---
    const groupChatInteractive = document.getElementById('group-chat-interactive');
    if (groupChatInteractive) {
        const chatContainer = groupChatInteractive.querySelector('.chat-message-container');
        const messages = [
            { sender: 'them', text: "S&P 5100 GONE. We're Rwanda with Wi-Fi." },
            { sender: 'them', text: "Too real. Nero GIF incoming. 🔥" },
            { sender: 'me', text: "It's not just a day. It's the whole scroll..." },
            { sender: 'them', text: "Deep. So, what's for dinner? 🍕" }
        ];
        let msgIdx = 0;
        const addMessage = () => {
            if (msgIdx < messages.length) {
                const bubble = document.createElement('div');
                bubble.classList.add('chat-bubble', messages[msgIdx].sender);
                bubble.textContent = messages[msgIdx].text;
                chatContainer.appendChild(bubble);
                // Force reflow for animation
                void bubble.offsetWidth; 
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0) scale(1)';
                chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
                msgIdx++;
                // playSound('message-pop'); // Conceptual
                setTimeout(addMessage, 1000 + Math.random() * 800);
            }
        };
        const chatObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && msgIdx === 0) { // Animate only once when visible
                addMessage();
                chatObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.6 });
        chatObserver.observe(groupChatInteractive);
    }
    
    // --- Interactive: Colosseum Filters ---
    const colosseumInteractive = document.getElementById('colosseum-interactive');
    if (colosseumInteractive) {
        const filterButtons = colosseumInteractive.querySelectorAll('.colosseum-controls button');
        const overlayText = colosseumInteractive.querySelector('#colosseum-overlay-text');
        const colosseumImage = colosseumInteractive.querySelector('.colosseum-base-image');
        const filterOverlay = colosseumInteractive.querySelector('#colosseum-filter-overlay');

        const filterData = {
            "gladiator-brands": { text: "Gladiators now sport logos of olive oil conglomerates and chariot manufacturers on their shields.", effect: "hue-rotate(90deg) saturate(1.5)"},
            "doordash-dole": { text: "The grain dole is now 'ColosseumDash' – instant papyrus scroll notifications for your next subsidized meal delivery.", effect: "sepia(0.7) contrast(1.2)"},
            "live-reactions": { text: "Floating '🔥', '💯', and '👎' emojis drift over the arena, reflecting the crowd's sentiment in real-time.", effect: "url(#pixelate)"} // SVG filter needed for pixelate
        };
        // Add SVG filter definition for pixelate (conceptual)
        // <svg><filter id="pixelate"><feFlood flood-color.../></filter></svg>

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterType = button.dataset.filter;
                filterOverlay.classList.remove('active'); // Reset animation
                void filterOverlay.offsetWidth; // Trigger reflow

                overlayText.textContent = filterData[filterType].text || "Select a filter.";
                colosseumImage.style.filter = filterData[filterType].effect || 'none';
                filterOverlay.style.background = filterType === "gladiator-brands" ? 'rgba(0, 255, 0, 0.2)' : 
                                                 filterType === "doordash-dole" ? 'rgba(255, 165, 0, 0.2)' : 
                                                 'rgba(255, 255, 0, 0.2)';
                filterOverlay.classList.add('active');
                // playSound('filter-apply'); // Conceptual
            });
        });
    }

    // --- Interactive: Infinite Scroll Trap ---
    const scrollTrap = document.getElementById('infinite-scroll-trap');
    if (scrollTrap) {
        const scrollWindow = scrollTrap.querySelector('.scroll-trap-window');
        const scrollContent = scrollTrap.querySelector('.scroll-trap-content');
        const breakFreeBtn = scrollTrap.querySelector('#break-free-scroll');
        let itemCount = 0;
        let trapped = true;

        const addDummyItem = () => {
            if (!trapped) return;
            itemCount++;
            const item = document.createElement('div');
            item.classList.add('dummy-feed-item');
            const itemTypes = ["Viral Dance Clip", "Outrageous Political Take", "Sponsored Gadget Review", "Cute Animal Antics", "Misinformation Post", "Self-Help Guru Quote"];
            item.textContent = `Item ${itemCount}: ${itemTypes[Math.floor(Math.random() * itemTypes.length)]}`;
            scrollContent.appendChild(item);
            // Force reflow for animation
            void item.offsetWidth;
            item.style.animationDelay = `${Math.random() * 0.2}s`;
            scrollWindow.scrollTop = scrollWindow.scrollHeight;
            if (itemCount > 15 && Math.random() > 0.7) { // Chance to show break free button
                breakFreeBtn.style.display = 'inline-block';
            }
        };

        scrollWindow.addEventListener('scroll', () => {
            if (trapped && scrollWindow.scrollTop + scrollWindow.clientHeight >= scrollWindow.scrollHeight - 20) {
                for(let i=0; i<3; i++) addDummyItem(); // Add more items when near bottom
            }
        });
        breakFreeBtn.addEventListener('click', () => {
            trapped = false;
            scrollContent.innerHTML += '<p class="dev-note" style="color:var(--color-gold-accent); text-align:center; padding:1rem;">You broke free from the scroll!</p>';
            breakFreeBtn.style.display = 'none';
            // playSound('success-chime'); // Conceptual
        });
        
        const scrollTrapObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && itemCount === 0) { // Start once visible
                for(let i=0; i<5; i++) addDummyItem();
            }
        }, { threshold: 0.5 });
        scrollTrapObserver.observe(scrollTrap);
    }
    
    // --- Interactive: Rosie Morph ---
    const rosieSlider = document.getElementById('rosieMorphSlider');
    const rosieImg2 = document.getElementById('rosie-img2');
    if (rosieSlider && rosieImg2) {
        rosieSlider.addEventListener('input', (e) => {
            rosieImg2.style.opacity = e.target.value / 100;
        });
    }


    // --- Reader Poll: TikTok Regulation ---
    const tiktokPollForm = document.getElementById('tiktok-poll-form');
    const tiktokPollResults = document.getElementById('tiktok-poll-results');
    if (tiktokPollForm && tiktokPollResults) {
        tiktokPollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedOption = tiktokPollForm.querySelector('input[name="tiktok-poll"]:checked');
            if (selectedOption) {
                tiktokPollResults.innerHTML = `Thanks for voting '<strong>${selectedOption.value}</strong>'! <br><small>(In a real app, results would be shown here.)</small>`;
                tiktokPollResults.style.display = 'block';
                tiktokPollForm.style.display = 'none';
                // playSound('poll-vote'); // Conceptual
            } else {
                alert("Please select an option.");
            }
        });
    }

    // --- Interactive: Constellation of Hope ---
    const hopeInput = document.getElementById('hope-input');
    const submitHopeBtn = document.getElementById('submit-hope-btn');
    const hopeDisplayArea = document.getElementById('hope-display-area');
    if (hopeInput && submitHopeBtn && hopeDisplayArea) {
        submitHopeBtn.addEventListener('click', () => {
            const thought = hopeInput.value.trim();
            if (thought) {
                const star = document.createElement('span');
                star.classList.add('hope-star');
                star.textContent = thought;
                // Random positioning for a 'constellation' feel
                star.style.position = 'absolute'; // Ensure parent is relative
                star.style.left = `${Math.random() * 80 + 10}%`; // % of parent width
                star.style.top = `${Math.random() * 70 + 15}%`; // % of parent height
                star.style.transform = `scale(${0.8 + Math.random() * 0.4})`; // Vary size
                hopeDisplayArea.appendChild(star);
                hopeInput.value = '';
                // playSound('star-appear'); // Conceptual
            }
        });
    }

    console.log("Empire of Likes - Single Page Interactive V2 JS Loaded");
});

// Conceptual sound function
// function playSound(soundId) {
//     console.log(`Playing sound: ${soundId}`);
//     // In a real app:
//     // const audio = new Audio(`sounds/${soundId}.mp3`);
//     // audio.play();
// }

