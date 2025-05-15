// main.js - Empire of Likes

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // --- Footer: Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Simplified Temporal Loom Interaction (Prologue Page) ---
    const loomSlider = document.getElementById('loom-slider');
    const sceneSteelMill = document.getElementById('scene-steel-mill');
    const sceneTikTokHouse = document.getElementById('scene-tiktok-house');

    if (loomSlider && sceneSteelMill && sceneTikTokHouse) {
        loomSlider.addEventListener('input', (event) => {
            const value = parseFloat(event.target.value); // Value from 0 to 1
            // Simple toggle for now, could be opacity crossfade
            if (value < 0.5) {
                sceneSteelMill.style.display = 'block';
                sceneTikTokHouse.style.display = 'none';
                // You could adjust opacity for a smoother transition:
                // sceneSteelMill.style.opacity = 1 - (value * 2);
                // sceneTikTokHouse.style.opacity = (value - 0.5) * 2 > 0 ? (value - 0.5) * 2 : 0;
            } else {
                sceneSteelMill.style.display = 'none';
                sceneTikTokHouse.style.display = 'block';
                // sceneSteelMill.style.opacity = (0.5 - value) * 2 > 0 ? (0.5 - value) * 2 : 0;
                // sceneTikTokHouse.style.opacity = (value - 0.5) * 2;
            }
        });
        // Initialize view
        loomSlider.dispatchEvent(new Event('input'));
    }

    // --- Meme Footnote Popover (Conceptual - requires more work for actual popover) ---
    const memeNotes = document.querySelectorAll('.meme-note');
    memeNotes.forEach(note => {
        note.addEventListener('mouseover', () => {
            const memeUrl = note.dataset.memeUrl;
            // In a real implementation, you'd create a popover element here
            // For now, just logging to console
            console.log("Hovering over meme. URL: " + memeUrl);
            // Example: note.title = `Meme: ${memeUrl}`; // Simple tooltip
        });
        // Add mouseout event to hide popover
    });


    // --- Placeholder for QR Easter Egg interaction ---
    // QR codes would typically be static images, but if they trigger JS:
    // const qrElements = document.querySelectorAll('.qr-easter-egg');
    // qrElements.forEach(qr => {
    //     qr.addEventListener('click', () => {
    //         const link = qr.dataset.link;
    //         // window.open(link, '_blank'); or some other interaction
    //     });
    // });


    // --- Placeholder for Reader Polls ---
    // This would require backend integration or a third-party service.
    // Example:
    // const pollForm = document.getElementById('reader-poll-form');
    // if (pollForm) {
    //     pollForm.addEventListener('submit', (event) => {
    //         event.preventDefault();
    //         // Get selected value
    //         // Send data to server / update UI with results
    //         alert("Poll submitted (placeholder)!");
    //     });
    // }

    // --- Placeholder for "Living Dialogue" (Act I, Chapter 1) ---
    // const livingDialogueContainer = document.getElementById('living-dialogue-interactive');
    // if (livingDialogueContainer) {
    //     // Logic to animate messages appearing one by one
    //     // This is a complex UI element.
    //     console.log("Living Dialogue placeholder loaded. Needs JS implementation.");
    // }

    // --- Placeholder for "Spectacle Filter" (Act I, Chapter 2) ---
    // const spectacleFilterContainer = document.getElementById('spectacle-filter-interactive');
    // if (spectacleFilterContainer) {
    //     // Logic for image overlays or canvas manipulation
    //     console.log("Spectacle Filter placeholder loaded. Needs JS implementation.");
    // }

    // Add other page-specific or global JavaScript interactions here.
    // Remember that the act.html and chapter.html pages have their own inline
    // scripts for simulating dynamic content loading. In a full-fledged application,
    // you'd use a proper templating engine or a JavaScript framework (like React, Vue)
    // with routing and data fetching to manage this more robustly.

}); // End DOMContentLoaded

