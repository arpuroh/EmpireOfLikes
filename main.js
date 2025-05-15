// main.js - Empire of Likes - Single Page Interactive V4 (Debug & Style Refinements)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Cache ---
    const siteLoader = document.getElementById('site-loader');
    const mainContent = document.getElementById('main-content');
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksMenu = document.getElementById('nav-links-menu');
    const particleCanvas = document.getElementById('particle-canvas');
    const cursorGlow = document.getElementById('cursor-glow');
    const currentYearSpan = document.getElementById('current-year');
    const loomSlider = document.getElementById('loom-slider');
    const sceneSteelMill = document.getElementById('scene-steel-mill');
    const sceneTikTokHouse = document.getElementById('scene-tiktok-house');
    const groupChatInteractive = document.getElementById('group-chat-interactive');
    const colosseumInteractive = document.getElementById('colosseum-interactive');
    const scrollTrapInteractive = document.getElementById('infinite-scroll-trap');
    const rosieMorphInteractive = document.getElementById('rosie-morph-interactive');
    const tiktokPollForm = document.getElementById('tiktok-poll-form');
    const constellationOfHope = document.getElementById('constellation-of-hope');

    // --- Particle Canvas ---
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const setupCanvas = () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() * 1 - 0.5) * 0.3; // Slower
                this.speedY = (Math.random() * 1 - 0.5) * 0.3; // Slower
                this.color = Math.random() > 0.66 ? 'rgba(0, 255, 255, 0.3)' : Math.random() > 0.33 ? 'rgba(255, 0, 255, 0.3)' : 'rgba(255, 215, 0, 0.2)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
                if (this.size > 0.05) this.size -= 0.003; else this.size = 0; // Vanish faster
            }
            draw() {
                if (this.size > 0) {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor(particleCanvas.width / 40); // Adjusted density
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        let lastTime = 0;
        const fps = 24; // Reduced FPS for potentially smoother feel on less powerful devices
        const frameInterval = 1000 / fps;

        function animateParticles(currentTime) {
            requestAnimationFrame(animateParticles);
            const deltaTime = currentTime - lastTime;

            if (deltaTime > frameInterval) {
                lastTime = currentTime - (deltaTime % frameInterval);
                ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
                for (let i = particles.length - 1; i >= 0; i--) { // Iterate backwards for safe removal
                    particles[i].update();
                    particles[i].draw();
                    if (particles[i].size === 0) {
                        particles.splice(i, 1);
                        if (particles.length < (particleCanvas.width / 40)) {
                           particles.push(new Particle());
                        }
                    }
                }
            }
        }
        
        window.addEventListener('resize', () => {
            setupCanvas();
            initParticles();
        });

        setupCanvas();
        initParticles();
        animateParticles(0);
    }

    // --- Cursor Glow ---
    if (cursorGlow) {
        let cursorTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(cursorTimeout);
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; // Use transform
            cursorGlow.style.opacity = '1';
            cursorTimeout = setTimeout(() => {
                cursorGlow.style.opacity = '0';
            }, 2000); 
        });
        document.addEventListener('mousedown', () => cursorGlow.classList.add('active'));
        document.addEventListener('mouseup', () => cursorGlow.classList.remove('active'));
        document.body.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
    }

    // --- Site Loader ---
    window.addEventListener('load', () => {
        if (siteLoader) siteLoader.classList.add('loaded');
        if (mainContent) mainContent.style.opacity = '1';
        
        // Animate elements in the initially visible section after loader
        const currentHash = window.location.hash;
        let initialSectionToAnimate;
        if (currentHash && document.querySelector(currentHash)) {
            initialSectionToAnimate = document.querySelector(currentHash);
        } else if (sections.length > 0) {
            initialSectionToAnimate = sections[0];
            if(initialSectionToAnimate) initialSectionToAnimate.classList.add('active-section'); // Ensure first section is active
        }

        if (initialSectionToAnimate) {
            const elementsToAnimate = initialSectionToAnimate.querySelectorAll('.animate-on-scroll');
            elementsToAnimate.forEach(el => {
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => el.classList.add('is-visible'), delay + 300);
            });
            animateTextReveal(initialSectionToAnimate.querySelectorAll('.animate-text-reveal'));
        }
    });
    
    // --- Text Reveal Animation ---
    function animateTextReveal(elements) {
        elements.forEach(el => {
            if (el.dataset.revealed) return;
            const text = el.textContent.trim();
            const letters = text.split('');
            el.innerHTML = ''; 
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter;
                span.style.animationDelay = `${index * 0.03 + 0.1}s`;
                el.appendChild(span);
            });
            el.dataset.revealed = true;
        });
    }
    const staticTextReveals = document.querySelectorAll('.site-title.animate-text-reveal');
    if (staticTextReveals) animateTextReveal(staticTextReveals);

    // --- Mobile Navigation Toggle ---
    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isExpanded.toString());
            navLinksMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', isExpanded);
        });
    }

    // --- Smooth Scrolling & Active Nav Link Highlighting ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === "#" || !targetId.startsWith("#")) return;
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
                // Calculate position relative to document, not viewport
                const targetPosition = targetSection.offsetTop - headerOffset;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                if (navLinksMenu && navLinksMenu.classList.contains('active')) {
                    if (menuToggle) {
                        menuToggle.classList.remove('open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                    navLinksMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });
    
    // --- Header Style Change on Scroll ---
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) siteHeader.classList.add('scrolled');
            else siteHeader.classList.remove('scrolled');
        });
    }

    // --- Intersection Observer for Section Activation & Animations ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: `-${(siteHeader ? siteHeader.offsetHeight : 70) - 10}px 0px -60% 0px`, // Adjust rootMargin to trigger when section is more centered
        threshold: 0.1 // A small part of the section needs to be visible
    };

    const setActiveSectionUI = (sectionId) => {
        sections.forEach(section => {
            const isActive = section.id === sectionId;
            section.classList.toggle('active-section', isActive);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    };
    
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    setActiveSectionUI(sectionId);
                    entry.target.classList.add('active-section'); // Explicitly add active class

                    const elementsToAnimate = entry.target.querySelectorAll('.animate-on-scroll:not(.is-visible)');
                    elementsToAnimate.forEach(el => {
                        const delay = parseInt(el.dataset.delay) || 0;
                        setTimeout(() => el.classList.add('is-visible'), delay);
                    });
                    animateTextReveal(entry.target.querySelectorAll('.animate-text-reveal:not([data-revealed="true"])'));
                } else {
                    // Only remove active-section if it's not the one currently in hash (for direct navigation)
                    if (window.location.hash !== `#${sectionId}`) {
                        entry.target.classList.remove('active-section');
                    }
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => sectionObserver.observe(section));
        
        // Initial check for active section on page load
        let initialSectionId = sections[0].id; // Default to first section
        if (window.location.hash && window.location.hash !== "#") {
            const hashId = window.location.hash.substring(1);
            if (document.getElementById(hashId)) {
                initialSectionId = hashId;
            }
        }
        setActiveSectionUI(initialSectionId);
        const initialSectionElement = document.getElementById(initialSectionId);
        if (initialSectionElement && !(siteLoader && !siteLoader.classList.contains('loaded'))) {
            // If loader is already gone, or no loader, make sure first section is visible
            initialSectionElement.classList.add('active-section');
            // Animations for this section are handled by the loader 'load' event or above observer
        }
    }


    // --- Footer: Current Year ---
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Enhanced Temporal Loom Interaction ---
    if (loomSlider && sceneSteelMill && sceneTikTokHouse) {
        sceneSteelMill.style.opacity = '1';
        sceneTikTokHouse.style.opacity = '0';
        sceneTikTokHouse.style.display = 'block';
        loomSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            sceneSteelMill.style.opacity = 1 - val;
            sceneTikTokHouse.style.opacity = val;
        });
    }

    // --- Interactive: Group Chat Animation ---
    if (groupChatInteractive) {
        const chatContainer = groupChatInteractive.querySelector('.chat-message-container');
        if (chatContainer) {
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
                    void bubble.offsetWidth; 
                    bubble.style.opacity = '1';
                    bubble.style.transform = 'translateY(0) scale(1)';
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    msgIdx++;
                    setTimeout(addMessage, 1000 + Math.random() * 800);
                }
            };
            const chatObserver = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && msgIdx === 0) {
                    addMessage();
                    chatObserver.unobserve(entries[0].target);
                }
            }, { threshold: 0.6 });
            chatObserver.observe(groupChatInteractive);
        }
    }
    
    // --- Interactive: Colosseum Filters ---
    if (colosseumInteractive) {
        const filterButtons = colosseumInteractive.querySelectorAll('.colosseum-controls button');
        const overlayTextEl = colosseumInteractive.querySelector('#colosseum-overlay-text');
        const colosseumImage = colosseumInteractive.querySelector('.colosseum-base-image');
        const filterOverlay = colosseumInteractive.querySelector('#colosseum-filter-overlay');

        if (filterButtons.length > 0 && overlayTextEl && colosseumImage && filterOverlay) {
            const filterData = {
                "gladiator-brands": { text: "Gladiators now sport logos of olive oil conglomerates and chariot manufacturers on their shields.", effect: "hue-rotate(90deg) saturate(1.5)", overlayColor: 'rgba(0, 255, 0, 0.3)'},
                "doordash-dole": { text: "The grain dole is now 'ColosseumDash' – instant papyrus scroll notifications for your next subsidized meal delivery.", effect: "sepia(0.7) contrast(1.2)", overlayColor: 'rgba(255, 165, 0, 0.3)'},
                "live-reactions": { text: "Floating '🔥', '💯', and '👎' emojis drift over the arena, reflecting the crowd's sentiment in real-time.", effect: "saturate(0.3) brightness(1.5)", overlayColor: 'rgba(255, 255, 0, 0.3)'}
            };

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filterType = button.dataset.filter;
                    if (filterData[filterType]) {
                        filterOverlay.classList.remove('active');
                        void filterOverlay.offsetWidth; 

                        overlayTextEl.textContent = filterData[filterType].text;
                        colosseumImage.style.filter = filterData[filterType].effect;
                        filterOverlay.style.backgroundColor = filterData[filterType].overlayColor;
                        filterOverlay.classList.add('active');
                    }
                });
            });
        }
    }

    // --- Interactive: Infinite Scroll Trap ---
    if (scrollTrapInteractive) {
        const scrollWindow = scrollTrapInteractive.querySelector('.scroll-trap-window');
        const scrollContent = scrollTrapInteractive.querySelector('.scroll-trap-content');
        const breakFreeBtn = scrollTrapInteractive.querySelector('#break-free-scroll');
        
        if (scrollWindow && scrollContent && breakFreeBtn) {
            let itemCount = 0;
            let trapped = true;
            const itemTypes = ["Viral Dance Clip", "Outrageous Political Take", "Sponsored Gadget Review", "Cute Animal Antics", "Misinformation Post", "Self-Help Guru Quote", "Clickbait Article", "Unboxing Video"];

            const addDummyItem = () => {
                if (!trapped) return;
                itemCount++;
                const item = document.createElement('div');
                item.classList.add('dummy-feed-item');
                item.textContent = `Item ${itemCount}: ${itemTypes[Math.floor(Math.random() * itemTypes.length)]}`;
                scrollContent.appendChild(item);
                void item.offsetWidth;
                item.style.animationDelay = `${Math.random() * 0.1}s`;
                scrollWindow.scrollTop = scrollWindow.scrollHeight;
                if (itemCount > 10 && itemCount < 25 && Math.random() > 0.85) {
                    breakFreeBtn.style.display = 'inline-block';
                } else if (itemCount >= 25) {
                     breakFreeBtn.style.display = 'inline-block';
                }
            };

            scrollWindow.addEventListener('scroll', () => {
                if (trapped && scrollWindow.scrollTop + scrollWindow.clientHeight >= scrollWindow.scrollHeight - 30) {
                    for(let i=0; i<2; i++) addDummyItem();
                }
            });
            breakFreeBtn.addEventListener('click', () => {
                trapped = false;
                scrollContent.innerHTML += '<p class="dev-note" style="color:var(--color-gold-accent); text-align:center; padding:1rem; font-size:1.2em;">You resisted the endless scroll!</p>';
                breakFreeBtn.style.display = 'none';
            });
            
            const scrollTrapObserver = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && itemCount === 0) {
                    for(let i=0; i<5; i++) addDummyItem();
                }
            }, { threshold: 0.5 });
            scrollTrapObserver.observe(scrollTrapInteractive);
        }
    }
    
    // --- Interactive: Rosie Morph ---
    if (rosieMorphInteractive) {
        const rosieSliderEl = rosieMorphInteractive.querySelector('#rosieMorphSlider');
        const rosieImg2 = rosieMorphInteractive.querySelector('#rosie-img2');
        if (rosieSliderEl && rosieImg2) {
            rosieSliderEl.addEventListener('input', (e) => {
                rosieImg2.style.opacity = e.target.value / 100;
            });
        }
    }

    // --- Reader Poll: TikTok Regulation ---
    if (tiktokPollForm) {
        const tiktokPollResults = tiktokPollForm.parentElement.querySelector('#tiktok-poll-results');
        if (tiktokPollResults) {
            tiktokPollForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const selectedOption = tiktokPollForm.querySelector('input[name="tiktok-poll"]:checked');
                if (selectedOption) {
                    tiktokPollResults.innerHTML = `Thanks for voting '<strong>${selectedOption.value}</strong>'! <br><small>(In a real app, results would be aggregated.)</small>`;
                    tiktokPollResults.style.display = 'block';
                    tiktokPollForm.style.display = 'none';
                } else {
                    alert("Please select an option to cast your vote.");
                }
            });
        }
    }

    // --- Interactive: Constellation of Hope ---
    if (constellationOfHope) {
        const hopeInput = constellationOfHope.querySelector('#hope-input');
        const submitHopeBtn = constellationOfHope.querySelector('#submit-hope-btn');
        const hopeDisplayArea = constellationOfHope.querySelector('#hope-display-area');

        if (hopeInput && submitHopeBtn && hopeDisplayArea) {
            submitHopeBtn.addEventListener('click', () => {
                const thought = hopeInput.value.trim();
                if (thought) {
                    const star = document.createElement('span');
                    star.classList.add('hope-star');
                    star.textContent = thought;
                    star.style.left = `${Math.random() * 85 + 5}%`; 
                    star.style.top = `${Math.random() * 75 + 10}%`; 
                    star.style.transform = `scale(${0.7 + Math.random() * 0.5}) rotate(${Math.random()*30-15}deg)`;
                    star.style.animationDelay = `${Math.random() * 0.3}s`;
                    hopeDisplayArea.appendChild(star);
                    hopeInput.value = '';
                }
            });
        }
    }

    console.log("Empire of Likes - Single Page Interactive V4 (Debug) JS Loaded");
});
