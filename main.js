// main.js - Empire of Likes - Single Page Interactive V3

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Cache ---
    const siteLoader = document.getElementById('site-loader');
    const mainContent = document.getElementById('main-content');
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link'); // Includes footer nav link
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
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2.5 + 0.5; // Slightly larger particles
                this.speedX = (Math.random() * 1 - 0.5) * 0.5; // Slower movement
                this.speedY = (Math.random() * 1 - 0.5) * 0.5;
                this.color = Math.random() > 0.66 ? 'rgba(0, 255, 255, 0.4)' : Math.random() > 0.33 ? 'rgba(255, 0, 255, 0.4)' : 'rgba(255, 215, 0, 0.3)'; // Cyan, Magenta, Gold mix
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
                if (this.size > 0.1) this.size -= 0.005; // Slower shrink
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
            const numberOfParticles = Math.floor(particleCanvas.width / 35);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        let lastTime = 0;
        const fps = 30; // Target FPS
        const frameInterval = 1000 / fps;

        function animateParticles(currentTime) {
            requestAnimationFrame(animateParticles);
            const deltaTime = currentTime - lastTime;

            if (deltaTime > frameInterval) {
                lastTime = currentTime - (deltaTime % frameInterval);
                ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    if (particles[i].size <= 0.1) {
                        particles.splice(i, 1);
                        i--;
                        if (particles.length < (particleCanvas.width / 35)) { // Maintain particle count
                           particles.push(new Particle());
                        }
                    }
                }
            }
        }
        
        window.addEventListener('resize', () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles(0); // Start animation loop
    }

    // --- Cursor Glow ---
    if (cursorGlow) {
        let cursorTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(cursorTimeout);
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
            cursorTimeout = setTimeout(() => {
                cursorGlow.style.opacity = '0';
            }, 3000); // Fade out after 3 seconds of inactivity
        });
        document.addEventListener('mousedown', () => cursorGlow.classList.add('active'));
        document.addEventListener('mouseup', () => cursorGlow.classList.remove('active'));
        document.body.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
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
            if (el.dataset.revealed) return; // Animate only once
            const text = el.textContent.trim();
            const letters = text.split('');
            el.innerHTML = ''; 
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter;
                span.style.animationDelay = `${index * 0.03 + 0.1}s`; // Faster, slight base delay
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
            if (!targetId || targetId === "#") return; // Basic check for valid href
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                
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
        rootMargin: `-${(siteHeader ? siteHeader.offsetHeight : 70) + 50}px 0px -35% 0px`, // Adjusted rootMargin
        threshold: 0.25 // Section more in view
    };

    const setActiveSectionUI = (sectionId) => {
        sections.forEach(section => {
            section.classList.toggle('active-section', section.id === sectionId);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    };
    
    if (sections.length > 0) {
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
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => sectionObserver.observe(section));
        
        // Initial check
        let initialSectionActivated = false;
        if (window.location.hash && window.location.hash !== "#") {
            const initialSectionId = window.location.hash.substring(1);
            const initialSection = document.getElementById(initialSectionId);
            if (initialSection) {
                setTimeout(() => {
                    const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
                    const elementPosition = initialSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'auto' });
                    // setActiveSectionUI is handled by observer, but ensure elements animate if loader already finished
                    if (siteLoader && siteLoader.classList.contains('loaded')) {
                         const elementsToAnimate = initialSection.querySelectorAll('.animate-on-scroll');
                         elementsToAnimate.forEach(el => {
                            const delay = parseInt(el.dataset.delay) || 0;
                            setTimeout(() => el.classList.add('is-visible'), delay);
                         });
                         animateTextReveal(initialSection.querySelectorAll('.animate-text-reveal'));
                    }
                }, 100);
                initialSectionActivated = true;
            }
        }
        if (!initialSectionActivated) {
             setActiveSectionUI(sections[0].id);
             // First section animations are handled by the loader's 'load' event
        }
    }


    // --- Footer: Current Year ---
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Enhanced Temporal Loom Interaction ---
    if (loomSlider && sceneSteelMill && sceneTikTokHouse) {
        sceneSteelMill.style.opacity = '1';
        sceneTikTokHouse.style.opacity = '0';
        sceneTikTokHouse.style.display = 'block'; // Keep in layout
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
                if (itemCount > 10 && itemCount < 25 && Math.random() > 0.85) { // Chance to show break free button
                    breakFreeBtn.style.display = 'inline-block';
                } else if (itemCount >= 25) { // Always show after 25 items
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
                    tiktokPollResults.innerHTML = `Thanks for voting '<strong>${selectedOption.value}</strong>'! <br><small>(Results would typically be aggregated.)</small>`;
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

    console.log("Empire of Likes - Single Page Interactive V3 JS Loaded");
});
