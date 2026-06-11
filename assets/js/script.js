/**
 * Meher Krishna Bheri Portfolio
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // Start fetching and rendering portfolio cards
    renderPortfolioCards().then(() => {
        // Initialize components that depend on portfolio cards
        initVideoModal();
        initScrollReveal();
        initPortfolioFilter();
        initCustomCursor();
    }).catch(err => {
        console.error("Error loading portfolio cards:", err);
    });

    // Initialize all other independent components immediately
    initTimelineScrollytelling();
    initYouTubeAPI();
    initCounters();
    initBackToTop();
    initSwiper();
    initTestimonialRail();
    initNewsletterForm();
    initContactForm();
    initServicePanel();
    initMagneticButtons();
});

// ================================================
// 0. Render Portfolio Cards Dynamically
// ================================================

function getYouTubeId(url) {
    if (!url) return '';
    // Regex for youtu.be, youtube.com (watch, embed, v, vi, feeds, etc.)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

function parseCSV(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                row[row.length - 1] += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push("");
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            lines.push(row);
            row = [""];
        } else {
            row[row.length - 1] += char;
        }
    }
    if (row.length > 1 || row[0] !== "") {
        lines.push(row);
    }
    return lines;
}

async function renderPortfolioCards() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    
    let portfolioData = [];
    
    try {
        const response = await fetch('./portfolio.csv');
        if (!response.ok) throw new Error('Failed to load portfolio.csv');
        const csvText = await response.text();
        
        const lines = parseCSV(csvText);
        if (lines.length > 1) {
            const headers = lines[0].map(h => h.trim().toLowerCase());
            const titleIdx = headers.indexOf('title') !== -1 ? headers.indexOf('title') : 0;
            const categoriesIdx = headers.indexOf('categories') !== -1 ? headers.indexOf('categories') : 1;
            const tagsIdx = headers.indexOf('tags') !== -1 ? headers.indexOf('tags') : 2;
            const youtubeUrlIdx = headers.indexOf('youtubeurl') !== -1 ? headers.indexOf('youtubeurl') : 3;
            const featuredIdx = headers.indexOf('featured') !== -1 ? headers.indexOf('featured') : 4;
            
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i];
                if (row.length < 2 || !row[titleIdx]) continue;
                
                const categories = (row[categoriesIdx] || '').split(',').map(c => c.trim()).filter(c => c.length > 0);
                const tags = (row[tagsIdx] || '').split(',').map(t => t.trim()).filter(t => t.length > 0);
                const youtubeUrl = (row[youtubeUrlIdx] || '').trim();
                const featured = (row[featuredIdx] || '').trim().toUpperCase() === 'TRUE';
                
                portfolioData.push({ title: row[titleIdx].trim(), categories, tags, youtubeUrl, featured });
            }
        }
    } catch (err) {
        console.error("Error reading portfolio data:", err);
        return;
    }
    
    let html = '';
    
    // Create a sorted copy of the data, placing featured projects first
    const sortedData = [...portfolioData].sort((a, b) => {
        const aFeatured = a.featured === true ? 1 : 0;
        const bFeatured = b.featured === true ? 1 : 0;
        return bFeatured - aFeatured;
    });
    
    sortedData.forEach(item => {
        const videoId = getYouTubeId(item.youtubeUrl);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        const categoriesJson = JSON.stringify(item.categories).replace(/"/g, '&quot;');
        let tagsHtml = `<div class="portfolio-card__tags-wrapper" style="position: absolute; top: 16px; left: 16px; z-index: 3; display: flex; gap: 6px; flex-wrap: wrap; pointer-events: none;">`;
        if (item.tags && item.tags.length > 0) {
            item.tags.forEach(tag => {
                tagsHtml += `<span class="portfolio-card__tag" style="position: static; margin: 0; top: auto; left: auto;">${tag}</span>`;
            });
        }
        tagsHtml += `</div>`;
        
        html += `
        <div class="portfolio-card" data-categories="${categoriesJson}" data-video="${embedUrl}">
            <div class="portfolio-card__thumb">
                <div class="portfolio-card__bg" style="background-image: url('${thumbnailUrl}')"></div>
                <div class="portfolio-card__overlay">
                    <a href="javascript:void(0)" class="portfolio-card__play" aria-label="View Project">
                        <i class="fa-solid fa-play"></i>
                    </a>
                </div>
                ${tagsHtml}
            </div>
            <div class="portfolio-card__body">
                <h4 class="portfolio-card__title">${item.title}</h4>
            </div>
        </div>`;
    });
    
    grid.innerHTML = html;
}

// ================================================
// 1. YouTube API Loader
// ================================================

function initYouTubeAPI() {
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    } else {
        onYouTubeIframeAPIReady();
    }
}

window.onYouTubeIframeAPIReady = function () {
    initBannerVideo();
};

// ================================================
// 2. Banner Background Video
// ================================================

function initBannerVideo() {
    const el = document.getElementById('banner-video-background');
    if (!el) return;

    new YT.Player('banner-video-background', {
        videoId: 'pVA0G01aDfk',
        playerVars: {
            autoplay: 1,
            controls: 0,
            mute: 1,
            loop: 1,
            playlist: 'pVA0G01aDfk',
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            showinfo: 0,
            origin: window.location.origin,
            enablejsapi: 1
        },
        events: {
            onReady: function (e) {
                e.target.mute();
                e.target.playVideo();
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    e.target.playVideo();
                }
            }
        }
    });
}



// ================================================
// 4. Back to Top Button
// ================================================

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }, { passive: true });

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================================
// 7. Video Modal (project play buttons)
// ================================================

function initVideoModal() {
    const overlay    = document.getElementById('modal-overlay');
    const videoFrame = document.getElementById('my-video-frame');
    const closeBtn   = document.getElementById('modal-close-btn');
    const playBtns   = document.querySelectorAll('.request-loader, .portfolio-card');

    if (!overlay || !videoFrame) return;

    function openModal(videoUrl) {
        videoFrame.src = videoUrl;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        videoFrame.src = '';
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    playBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const url = this.getAttribute('data-video');
            if (url) openModal(url);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
}

// ================================================
// 8. Counter Animation
// ================================================

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                
                // If the timeline loader is still active, wait for it to finish!
                var loader = document.getElementById('tl-loader');
                if (loader && !loader.classList.contains('tl-hidden')) {
                    document.addEventListener('timelineReady', function() {
                        // Small extra delay to allow the CSS fade-out to complete
                        setTimeout(function() {
                            animateCounter(entry.target);
                        }, 500);
                    }, { once: true });
                } else {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
}

function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000; // ms
    const start    = performance.now();

    function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ================================================
// 9. Scroll Reveal
// ================================================

function initScrollReveal() {
    // Elements that get auto-reveal (without inline reveal class already set)
    const revealTargets = document.querySelectorAll(
        '.card-trust-us, .team-container, ' +
        '.project-video-container, .accordion-item, ' +
        '.portfolio-card, .contact-form-container'
    );

    revealTargets.forEach(function (el) {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // All reveal elements (including those already classed in HTML)
    const allReveal = document.querySelectorAll('.reveal');

    // Apply nth-child stagger per parent group
    var parentGroups = {};
    allReveal.forEach(function (el) {
        var parent = el.parentElement;
        var key = parent ? (parent.className || parent.tagName) : 'root';
        if (!parentGroups[key]) parentGroups[key] = [];
        parentGroups[key].push(el);
    });

    Object.values(parentGroups).forEach(function (group) {
        group.forEach(function (el, i) {
            // Only apply auto-stagger if no inline --reveal-delay is already set
            if (!el.style.getPropertyValue('--reveal-delay')) {
                el.style.setProperty('--reveal-delay', (i * 80) + 'ms');
            }
        });
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.07,
        rootMargin: '0px 0px -30px 0px'
    });

    allReveal.forEach(function (el) {
        observer.observe(el);
    });

    // Dedicated observer for repeating reveal animations
    const repeatObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Reset animation when out of view
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1, // Lower threshold to ensure it triggers even on smaller screens or taller containers
        rootMargin: '50px 0px 50px 0px' // Trigger slightly before it fully enters
    });

    const allRepeatReveal = document.querySelectorAll('.reveal-repeat');
    allRepeatReveal.forEach(function (el) {
        repeatObserver.observe(el);
    });
}

// ================================================
// 10. Swiper - Partners
// ================================================

function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    // Partners Carousel
    try {
        if (document.querySelector('.swiperpartner')) {
            new Swiper('.swiperpartner', {
                slidesPerView: 'auto',
                spaceBetween: 60,
                loop: true,
                speed: 5000,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                freeMode: {
                    enabled: true,
                    momentum: false
                },
                breakpoints: {
                    320: { slidesPerView: 2, spaceBetween: 15 },
                    576: { slidesPerView: 3, spaceBetween: 20 },
                    768: { slidesPerView: 4, spaceBetween: 25 },
                    992: { slidesPerView: 5, spaceBetween: 30 },
                    1200: { slidesPerView: 7, spaceBetween: 40 }
                }
            });
        }
    } catch (e) {
        console.error("Swiper partner error:", e);
    }


}

// ================================================
// 11. Newsletter Form
// ================================================

function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('newsletter');
        if (!email || !email.value.trim()) return;

        // Simulate success feedback
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn ? btn.textContent : '';

        if (btn) {
            btn.textContent = 'Subscribed!';
            btn.style.backgroundColor = '#28a745';
            setTimeout(function () {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                email.value = '';
            }, 3000);
        }
    });
}

// ================================================
// 12. Smooth hover tilt effect on project cards
// ================================================

(function () {
    const cards = document.querySelectorAll('.project-video-container');

    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width / 2;
            const cy     = rect.height / 2;
            const tiltX  = ((y - cy) / cy) * 3;
            const tiltY  = ((cx - x) / cx) * 3;

            card.style.transform = 'perspective(1000px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.01)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
})();

// ================================================
// 13. Accordion: close all when another opens
// ================================================

(function () {
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Scroll accordiont item into view slightly
            const target = this.closest('.accordion-item');
            if (target) {
                setTimeout(function () {
                    const rect = target.getBoundingClientRect();
                    if (rect.top < 80) {
                        window.scrollBy({ top: rect.top - 100, behavior: 'smooth' });
                    }
                }, 400);
            }
        });
    });
})();



// ================================================
// 15. Contact Form Submission
// ================================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get button to show loading and success states
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        const originalText = btn.innerHTML;
        const originalBg = btn.style.backgroundColor;

        // Simulate submitting state
        btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ms-2 fs-5"></i>';
        btn.disabled = true;

        setTimeout(function () {
            // Success state
            btn.innerHTML = 'Message Sent! <i class="fa-solid fa-check ms-2 fs-5"></i>';
            btn.style.backgroundColor = '#28a745'; // Green success color
            btn.style.borderColor = '#28a745';
            
            // Clear inputs
            form.reset();

            // Reset button after 3 seconds
            setTimeout(function () {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = originalBg;
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 3000);
        }, 1500); // Simulate network request
    });
}

// ================================================
// 16. Timeline Scrollytelling
// ================================================

function initTimelineScrollytelling() {
    var TOTAL_FRAMES = 81;
    var FRAME_PATH_PREFIX = './timeline sequence v2/';
    // frame filenames: timeline_sequence_new00.jpg … timeline_sequence_new80.jpg
    function framePath(i) {
        return FRAME_PATH_PREFIX + 'timeline_sequence_new' + String(i - 1).padStart(2, '0') + '.jpg';
    }

    // ── DOM refs ──
    var section   = document.getElementById('timeline-section');
    var loader    = document.getElementById('tl-loader');
    var canvas    = document.getElementById('timeline-canvas');
    var progress  = document.getElementById('tl-progress');
    var counter   = document.getElementById('tl-frame-counter');
    if (!section || !canvas) return;

    var ctx = canvas.getContext('2d');

    // ── State ──
    var frames        = new Array(TOTAL_FRAMES);
    var loaded        = 0;
    var rafId         = null;
    var currentFrame  = 0;
    var targetFrame   = 0;
    var isDrawPending = false;

    // ── Overlays config (scrollProgress ranges) ──
    var beats = [
        { id: 'tl-text-0', start: 0.00, end: 1.00 }   // Hero panel — stays entire scroll
    ];
    var beatEls = beats.map(function(b) {
        return { el: document.getElementById(b.id), cfg: b };
    });

    // ── Hero sub-element beats: each reveals at its scroll threshold ──
    var heroBeats = [
        { id: 'tl-beat-name',    threshold: 0.01 },   // Name    — 1% (prevents load flash)
        { id: 'tl-beat-tagline', threshold: 0.03 },   // Tagline — 3%
        { id: 'tl-beat-desc',    threshold: 0.07 },   // Desc    — 7%
        { id: 'tl-beat-badges',  threshold: 0.11 },   // Badges  — 11%
        { id: 'tl-beat-divider', threshold: 0.15 },   // Divider — 15%
        { id: 'tl-beat-btns',    threshold: 0.19 },   // Buttons — 19%
        { id: 'tl-beat-social',  threshold: 0.23 },   // Social  — 23%
        { id: 'tl-beat-hint',    threshold: 0.27 }    // Hint    — 27%
    ];
    var heroEls = heroBeats.map(function(b) {
        return { el: document.getElementById(b.id), threshold: b.threshold };
    });

    // ── Canvas sizing (HiDPI, cover fit) ──
    var dpr        = window.devicePixelRatio || 1;
    var imgW       = 0;
    var imgH       = 0;
    var drawParams = { x: 0, y: 0, w: 0, h: 0 };

    function computeDrawParams() {
        var cw = canvas.offsetWidth;
        var ch = canvas.offsetHeight;
        if (!imgW || !imgH) { return; }
        var imgAspect    = imgW / imgH;
        var canvasAspect = cw / ch;
        var dw, dh, dx, dy;
        if (imgAspect > canvasAspect) {
            dh = ch;  dw = ch * imgAspect;
            dy = 0;   dx = (cw - dw) / 2;
        } else {
            dw = cw;  dh = cw / imgAspect;
            dx = 0;   dy = (ch - dh) / 2;
        }
        drawParams = { x: dx * dpr, y: dy * dpr, w: dw * dpr, h: dh * dpr };
    }

    function resizeCanvas() {
        canvas.width  = canvas.offsetWidth  * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        computeDrawParams();
        drawFrame(currentFrame);
    }

    // ── Draw a frame by index (0-based) ──
    function drawFrame(idx) {
        var img = frames[idx];
        if (!img || !img.complete) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, drawParams.x, drawParams.y, drawParams.w, drawParams.h);
        if (counter) counter.textContent = String(idx + 1).padStart(3, '0') + ' / ' + TOTAL_FRAMES;
    }

    // ── rAF draw loop with lerp ──
    var isDrawing = false;
    var lerpFactor = 0.08; // Adjust for smoothness

    function renderLoop() {
        if (Math.abs(targetFrame - currentFrame) > 0.1) {
            currentFrame += (targetFrame - currentFrame) * lerpFactor;
            drawFrame(Math.round(currentFrame));
            requestAnimationFrame(renderLoop);
        } else {
            currentFrame = targetFrame;
            drawFrame(Math.round(currentFrame));
            isDrawing = false;
        }
    }

    function scheduleDrawFrame(idx) {
        targetFrame = idx;
        if (!isDrawing) {
            isDrawing = true;
            requestAnimationFrame(renderLoop);
        }
    }

    // ── Scroll handler ──
    function onScroll() {
        var rect     = section.getBoundingClientRect();
        var sectionH = section.offsetHeight - window.innerHeight;
        var scrolled = -rect.top;
        var prog = Math.min(Math.max(scrolled / sectionH, 0), 1);

        // frame index
        var idx = Math.round(prog * (TOTAL_FRAMES - 1));
        idx = Math.min(Math.max(idx, 0), TOTAL_FRAMES - 1);
        scheduleDrawFrame(idx);

        // progress bar
        if (progress) progress.style.width = (prog * 100) + '%';

        // hero overlay panel (fades in/out as a whole)
        beatEls.forEach(function(b) {
            if (!b.el) return;
            var active = prog >= b.cfg.start && prog <= b.cfg.end;
            if (active) {
                b.el.classList.add('tl-visible');
            } else {
                b.el.classList.remove('tl-visible');
            }
        });

        // hero sub-element beats — reveal each element as scroll hits its threshold
        heroEls.forEach(function(h) {
            if (!h.el) return;
            if (prog >= h.threshold) {
                h.el.classList.add('tl-beat-active');
            } else {
                // re-hide if user scrolls back up above the threshold
                h.el.classList.remove('tl-beat-active');
            }
        });
    }

    // ── Preload frames optimally ──
    function preloadFrames(onComplete) {
        var firstImg = new Image();
        firstImg.onload = function() {
            frames[0] = firstImg;
            imgW = firstImg.naturalWidth;
            imgH = firstImg.naturalHeight;
            computeDrawParams();
            
            // Hide loader and make interactive immediately after frame 1
            onComplete();
            
            // Sequentially load the rest in the background in batches of 5
            var currentIndex = 1;
            function loadNextBatch() {
                var batchSize = Math.min(5, TOTAL_FRAMES - currentIndex);
                if (batchSize <= 0) return;
                
                var batchLoaded = 0;
                for (var i = 0; i < batchSize; i++) {
                    (function(idx) {
                        var img = new Image();
                        img.onload = img.onerror = function() {
                            frames[idx] = img;
                            batchLoaded++;
                            if (batchLoaded === batchSize) {
                                currentIndex += batchSize;
                                setTimeout(loadNextBatch, 10); // Let main thread breathe
                            }
                        };
                        img.src = framePath(idx + 1);
                    })(currentIndex + i);
                }
            }
            loadNextBatch();
        };
        firstImg.onerror = function() {
            onComplete(); // Fallback if frame 1 fails
        };
        firstImg.src = framePath(1);
    }

    // ── Init ──
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    preloadFrames(function() {
        // All frames loaded — hide loader, draw first frame
        if (loader) loader.classList.add('tl-hidden');
        drawFrame(0);
        onScroll(); // sync overlays to current scroll position

        // Dispatch an event so counters know the hero section is visible!
        document.dispatchEvent(new Event('timelineReady'));
    });
}

// ================================================
// 17. Portfolio Showcase Filter
// ================================================

function initPortfolioFilter() {
    var filtersWrap = document.getElementById('portfolio-filters');
    var grid        = document.getElementById('portfolio-grid');
    if (!filtersWrap || !grid) return;

    var btns  = filtersWrap.querySelectorAll('.pf-btn');
    var cards = grid.querySelectorAll('.portfolio-card');

    // Inject the keyframe animation into the document once
    if (!document.getElementById('pf-keyframes')) {
        var style = document.createElement('style');
        style.id = 'pf-keyframes';
        style.textContent = '@keyframes portfolioFadeIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }';
        document.head.appendChild(style);
    }

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            // Update active button
            btns.forEach(function (b) { b.classList.remove('pf-btn--active'); });
            this.classList.add('pf-btn--active');

            // Filter cards with a fade animation
            var delay = 0;
            cards.forEach(function (card) {
                var categoriesAttr = card.getAttribute('data-categories');
                var categories = [];
                try {
                    if (categoriesAttr) categories = JSON.parse(categoriesAttr);
                } catch(e) {}
                
                var isMatch = (filter === 'all') || categories.includes(filter);

                if (isMatch) {
                    card.classList.remove('is-hidden');
                    card.style.animationDelay = delay + 'ms';
                    card.style.animation = 'none';
                    void card.offsetWidth; // reflow
                    card.style.animation = 'portfolioFadeIn 420ms ease forwards';
                    delay += 60;
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

// ================================================
// 18. Service Panel — Hover/Click Interaction
// ================================================

function initServicePanel() {
    var list   = document.getElementById('svc-list');
    var panel  = document.getElementById('svc-panel');
    if (!list || !panel) return;

    var items  = list.querySelectorAll('.svc-item');
    var panels = panel.querySelectorAll('.svc-panel__item');

    var isMobile = window.matchMedia('(max-width: 991.98px)').matches;

    function activate(id) {
        items.forEach(function (item) {
            item.classList.toggle('svc-item--active', item.getAttribute('data-svc') === id);
        });
        panels.forEach(function (p) {
            p.classList.toggle('svc-panel__item--active', p.getAttribute('data-panel') === id);
        });
    }

    items.forEach(function (item) {
        // Desktop: hover
        item.addEventListener('mouseenter', function () {
            if (!window.matchMedia('(max-width: 991.98px)').matches) {
                activate(this.getAttribute('data-svc'));
            }
        });
        // Mobile + Desktop: click/tap
        item.addEventListener('click', function () {
            activate(this.getAttribute('data-svc'));
        });
    });
}

// ================================================
// 19. Horizontal Testimonial Rail
// ================================================

function initTestimonialRail() {
    const rail = document.getElementById('testimonial-rail');
    if (!rail) return;

    // Clone the inner HTML to create a seamless infinite marquee
    const originalContent = rail.innerHTML;
    rail.innerHTML = originalContent + originalContent;
}

// ================================================
// 20. Custom Cursor (Awwwards Interaction)
// ================================================

function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover states for Video/Portfolio thumbs
    const videoThumbs = document.querySelectorAll('.portfolio-card__thumb');
    videoThumbs.forEach(function(thumb) {
        thumb.addEventListener('mouseenter', function() {
            cursor.classList.add('play-mode');
        });
        thumb.addEventListener('mouseleave', function() {
            cursor.classList.remove('play-mode');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
}

// ================================================
// 21. Magnetic Buttons
// ================================================

function initMagneticButtons() {
    const magnets = document.querySelectorAll('.hero-btn, .btn');
    
    magnets.forEach(function(magnet) {
        // Prevent conflict with default button animations if needed, 
        // but adding transform translation usually layers well.
        magnet.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, color 0.3s';
        
        magnet.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;
            
            // Limit magnetic pull to ~30% of movement
            this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        
        magnet.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
        });
    });
}
