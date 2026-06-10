/**
 * Montra - Film & Video Production Studio
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    initTimelineScrollytelling();
    initYouTubeAPI();
    initVideoModal();
    initCounters();
    initScrollReveal();
    initBackToTop();
    initSwiper();
    initTestimonialRail();
    initNewsletterForm();
    initContactForm();
    initPortfolioFilter();
    initServicePanel();
});

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
    const playBtns   = document.querySelectorAll('.request-loader');

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
                animateCounter(entry.target);
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
                    320: { slidesPerView: 2, spaceBetween: 30 },
                    576: { slidesPerView: 3, spaceBetween: 40 },
                    768: { slidesPerView: 4, spaceBetween: 50 },
                    992: { slidesPerView: 5, spaceBetween: 60 },
                    1200: { slidesPerView: 6, spaceBetween: 70 }
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

    // ── Canvas sizing (HiDPI, contain fit) ──
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
            dw = cw;  dh = cw / imgAspect;
            dx = 0;   dy = (ch - dh) / 2;
        } else {
            dh = ch;  dw = ch * imgAspect;
            dy = 0;   dx = (cw - dw) / 2;
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
                var cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
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
