document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Functionality
    const sidebar = document.getElementById('sidebar');
    const moreBtn = document.getElementById('more-btn');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (moreBtn) moreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // 2. Theme Switching Logic with Persistence
    const root = document.documentElement;
    const body = document.body;

    // Functions to apply settings
    function applyColor(color) {
        if (!color) return;
        root.style.setProperty('--green', color);
        localStorage.setItem('themeColor', color);

        // Update UI if present
        document.querySelectorAll('.theme-grid .t-swatch').forEach(c => {
            if (c.getAttribute('data-color') === color) {
                c.style.borderColor = 'var(--text)';
            } else {
                c.style.borderColor = 'transparent';
            }
        });
    }

    function applyFlavor(flavor) {
        if (!flavor) return;
        // Reset
        body.classList.remove('latte', 'frappe');

        if (flavor === 'latte') body.classList.add('latte');
        if (flavor === 'frappe') body.classList.add('frappe');

        localStorage.setItem('themeFlavor', flavor);

        // Update UI if present
        document.querySelectorAll('.theme-opt').forEach(opt => {
            if (opt.textContent.trim().toLowerCase() === flavor) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Init Logic
    const savedColor = localStorage.getItem('themeColor');
    const savedFlavor = localStorage.getItem('themeFlavor') || 'mocha'; // Default mocha

    if (savedColor) applyColor(savedColor);
    applyFlavor(savedFlavor);

    // Event Listeners
    const themeCircles = document.querySelectorAll('.theme-circle');
    themeCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            const color = circle.getAttribute('data-color');
            applyColor(color);
        });
    });

    const themeOpts = document.querySelectorAll('.theme-opt');
    themeOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const flavor = opt.textContent.trim().toLowerCase();
            applyFlavor(flavor);
        });
    });

    // 4. Clickable Cards (Delegation or specific binding)
    const cards = document.querySelectorAll('.clickable-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const link = card.getAttribute('data-link');
            if (link) {
                // Check if external or pdf
                if (link.startsWith('http') || link.endsWith('.pdf')) {
                    window.open(link, '_blank');
                } else {
                    // Internal navigation
                    window.location.href = link;
                }
            }
        });
    });
    // 5. Time Widget Code
    function updateTime() {
        const timeElement = document.getElementById('u-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
        }
    }
    setInterval(updateTime, 1000);
    updateTime(); // init

});
