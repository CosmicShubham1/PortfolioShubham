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

    // 6. Copy Code Functionality
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.nextElementSibling.querySelector('code');
            if (codeBlock) {
                const text = codeBlock.innerText; // Use innerText to preserve formatting
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });

    // 7. Recent Commits
    const commitList = document.querySelector('.commit-list');
    if (commitList) {
        const username = 'CosmicShubham1';


        const renderCommits = (commits) => {
            if (!commits || !Array.isArray(commits)) return;

            const detailPromises = commits.map(item => {
                return fetch(item.url)
                    .then(res => {
                        if (!res.ok) throw new Error('Detail fetch failed');
                        return res.json();
                    })
                    .then(details => ({
                        message: item.commit.message,
                        html_url: item.html_url,
                        date: item.commit.author.date,
                        stats: details.stats,
                    }))
                    .catch(() => ({
                        message: item.commit.message,
                        html_url: item.html_url,
                        date: item.commit.author.date,
                        stats: null
                    }));
            });

            Promise.all(detailPromises).then(detailedCommits => {
                commitList.innerHTML = '';

                const timeAgo = (dateString) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const seconds = Math.floor((now - date) / 1000);
                    let interval = seconds / 31536000;
                    if (interval > 1) return Math.floor(interval) + "y ago";
                    interval = seconds / 2592000;
                    if (interval > 1) return Math.floor(interval) + "m ago";
                    interval = seconds / 86400;
                    if (interval > 1) return Math.floor(interval) + "d ago";
                    interval = seconds / 3600;
                    if (interval > 1) return Math.floor(interval) + "h ago";
                    interval = seconds / 60;
                    if (interval > 1) return Math.floor(interval) + "m ago";
                    return Math.floor(seconds) + "s ago";
                };

                detailedCommits.forEach((commit, index) => {
                    const li = document.createElement('li');
                    li.className = 'commit-item';
                    if (index === detailedCommits.length - 1) {
                        li.style.borderBottom = 'none';
                    }

                    const msgSpan = document.createElement('span');
                    msgSpan.className = 'commit-msg';
                    msgSpan.textContent = commit.message.split('\n')[0];
                    msgSpan.title = commit.message;

                    const metaSpan = document.createElement('span');
                    metaSpan.className = 'commit-meta';
                    metaSpan.style.display = 'flex';
                    metaSpan.style.gap = '10px';
                    metaSpan.style.alignItems = 'center';

                    const timeSpan = document.createElement('span');
                    timeSpan.textContent = timeAgo(commit.date);
                    timeSpan.style.color = 'var(--subtext0)';
                    timeSpan.style.fontSize = '0.75rem';

                    const statsSpan = document.createElement('span');
                    if (commit.stats) {
                        if (commit.stats.additions > commit.stats.deletions) {
                            statsSpan.style.color = '#a6e3a1';
                            statsSpan.textContent = `+${commit.stats.additions}`;
                        } else {
                            statsSpan.style.color = '#f38ba8';
                            statsSpan.textContent = `-${commit.stats.deletions}`;
                        }
                    }

                    metaSpan.appendChild(timeSpan);
                    metaSpan.appendChild(statsSpan);
                    li.style.cursor = 'pointer';
                    li.onclick = () => window.open(commit.html_url, '_blank');
                    li.appendChild(msgSpan);
                    li.appendChild(metaSpan);
                    commitList.appendChild(li);
                });
            });
        };

        // Strategy: Try Events API -> Fallback to Repos API (sorted by updated)
        fetch(`https://api.github.com/users/${username}/events/public`)
            .then(res => {
                if (!res.ok) throw new Error('Events fetch failed');
                return res.json();
            })
            .then(events => {
                const pushEvent = events.find(event => event.type === 'PushEvent');
                if (pushEvent) {
                    return fetch(`https://api.github.com/repos/${pushEvent.repo.name}/commits?per_page=3`)
                        .then(res => res.json());
                } else {
                    // Fallback to most recently updated repo
                    return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`)
                        .then(res => res.json())
                        .then(repos => {
                            if (!repos || repos.length === 0) throw new Error('No repos found');
                            return fetch(`https://api.github.com/repos/${repos[0].full_name}/commits?per_page=3`)
                                .then(res => res.json());
                        });
                }
            })
            .then(commits => renderCommits(commits))
            .catch(e => {
                console.error('GitHub Activity Error:', e);
                // Last ditch effort: Try fetching repos direct if events failed hard
                fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`)
                    .then(res => res.json())
                    .then(repos => {
                        if (!repos || repos.length === 0) throw new Error('No repos');
                        return fetch(`https://api.github.com/repos/${repos[0].full_name}/commits?per_page=3`)
                            .then(res => res.json());
                    })
                    .then(commits => renderCommits(commits))
                    .catch(err => {
                        commitList.innerHTML = `
                        <li class="commit-item" style="border:none;">
                            <span class="commit-msg" style="color: var(--subtext0);">Activity hidden (API Limit).</span>
                        </li>`;
                    });
            });

        // Fetch Total Commits Count (approximate via Search API)
        // Note: Unauthenticated search has strict rate limits.
        fetch(`https://api.github.com/search/commits?q=author:${username}`, {
            headers: {
                'Accept': 'application/vnd.github.cloak-preview'
            }
        })
            .then(res => res.json())
            .then(data => {
                const infoSpan = document.getElementById('commits-info');
                if (infoSpan && data.total_count) {
                    infoSpan.textContent = `[${data.total_count} Total Commits]`;
                }
            })
            .catch(err => console.log('Total commits fetch skipped:', err));
    }

});
