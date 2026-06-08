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
    initNewsletterForm();
    initProjectHeading();
    initContactForm();
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
    initTestimonialVideo();
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
// 3. Testimonial Background Video
// ================================================

function initTestimonialVideo() {
    const el = document.getElementById('testimonial-video-background');
    if (!el) return;

    new YT.Player('testimonial-video-background', {
        videoId: '6J1XlyCxtPw',
        playerVars: {
            autoplay: 1,
            controls: 0,
            mute: 1,
            loop: 1,
            playlist: '6J1XlyCxtPw',
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
    // Add reveal class to key elements
    const revealTargets = document.querySelectorAll(
        '.card-trust-us, .card-testimonial, .team-container, ' +
        '.project-video-container, .card-core-service, .accordion-item'
    );

    revealTargets.forEach(function (el) {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(function (el) {
        observer.observe(el);
    });
}

// ================================================
// 10. Swiper - Partners
// ================================================

function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.swiperpartner', {
        slidesPerView: 'auto',
        spaceBetween: 60,
        loop: true,
        speed: 3000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        },
        freeMode: {
            enabled: true,
            momentum: false
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            576: {
                slidesPerView: 3,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 50
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 60
            },
            1200: {
                slidesPerView: 6,
                spaceBetween: 70
            }
        }
    });
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
// 14. Hide/Show Project Heading on Scroll
// ================================================

function initProjectHeading() {
    const heading = document.querySelector('.project-section-heading');
    if (!heading) return;

    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;

    window.addEventListener('scroll', function () {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            heading.classList.add('is-hidden');
        } else {
            heading.classList.remove('is-hidden');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

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
    var TOTAL_FRAMES = 119;
    var FRAME_PATH_PREFIX = './timeline-frames/';
    // frame filenames: 00001.jpg … 00119.jpg
    function framePath(i) {
        return FRAME_PATH_PREFIX + String(i).padStart(5, '0') + '.jpg';
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

    // ── Preload all frames ──
    function preloadFrames(onComplete) {
        var firstLoaded = false;
        for (var i = 0; i < TOTAL_FRAMES; i++) {
            (function(index) {
                var img = new Image();
                img.onload = function() {
                    frames[index] = img;
                    loaded++;
                    // grab image dimensions from first loaded frame
                    if (!imgW) {
                        imgW = img.naturalWidth;
                        imgH = img.naturalHeight;
                        computeDrawParams();
                    }
                    // draw first frame as soon as it's ready
                    if (!firstLoaded && index === 0) {
                        firstLoaded = true;
                        drawFrame(0);
                    }
                    if (loaded === TOTAL_FRAMES) {
                        onComplete();
                    }
                };
                img.onerror = function() {
                    loaded++;
                    if (loaded === TOTAL_FRAMES) onComplete();
                };
                img.src = framePath(index + 1);
                frames[index] = img;
            })(i);
        }
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
