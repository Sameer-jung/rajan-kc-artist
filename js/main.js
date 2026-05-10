/* ═══════════════════════════════════════════════════════
   RAJAN KC — INTERACTIVE SYSTEMS
   Cursor · Parallax · Glitch · Scroll Reveal · Marquee
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const isTouchLike = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── CURSOR ─────────────────────────────────────────── */
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  const cursorLabel = document.getElementById('cursor-label');
  const customCursorEnabled = !!(cursorOuter && cursorInner && cursorLabel && supportsHover && !isTouchLike && !prefersReducedMotion);
  let mx = -200, my = -200;
  let ox = -200, oy = -200;

  if (customCursorEnabled) {
    function updateCursorInner(e) {
      mx = e.clientX;
      my = e.clientY;
      cursorInner.style.left = mx + 'px';
      cursorInner.style.top = my + 'px';
    }

    function animateCursorOuter() {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      cursorOuter.style.left = ox + 'px';
      cursorOuter.style.top = oy + 'px';
      requestAnimationFrame(animateCursorOuter);
    }

    function setCursorHover(label) {
      document.body.classList.add('cursor-hover');
      cursorLabel.textContent = label || '';
    }

    function clearCursorHover() {
      document.body.classList.remove('cursor-hover');
      cursorLabel.textContent = '';
    }

    document.addEventListener('mousemove', updateCursorInner);
    animateCursorOuter();

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => setCursorHover(el.dataset.cursor));
      el.addEventListener('mouseleave', clearCursorHover);
    });

    document.addEventListener('mouseleave', () => {
      cursorOuter.style.opacity = '0';
      cursorInner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorOuter.style.opacity = '1';
      cursorInner.style.opacity = '1';
    });
  } else {
    document.body.classList.add('no-custom-cursor');
  }

  /* ── HERO PARALLAX ──────────────────────────────────── */
  const heroImg = document.querySelector('.hero-portrait-img');
  const heroSection = document.getElementById('hero');
  const heroTextPanel = document.querySelector('.hero-text-panel');

  if (heroImg && heroSection && supportsHover && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width  - 0.5;
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;
      heroImg.style.transform = `scale(1.06) translate(${nx * 18}px, ${ny * 12}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImg.style.transform = 'scale(1.06) translate(0px, 0px)';
    });
  }

  /* ── SCROLL PARALLAX ────────────────────────────────── */
  let ticking = false;
  const nav = document.querySelector('nav');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (heroImg && heroTextPanel && !prefersReducedMotion) {
          heroImg.style.marginTop = (scrollY * 0.28) + 'px';
          const heroOpacity = Math.max(0, 1 - scrollY / 650);
          heroTextPanel.style.opacity = heroOpacity;
        }

        if (nav) {
          if (scrollY > 60) {
            nav.style.background = 'rgba(4,4,10,0.92)';
            nav.style.backdropFilter = 'blur(12px)';
            nav.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
          } else {
            nav.style.background = '';
            nav.style.backdropFilter = '';
            nav.style.borderBottom = '';
          }
        }

        if (backToTop) {
          backToTop.classList.toggle('visible', scrollY > 420);
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── GLITCH EFFECT ──────────────────────────────────── */
  const glitchEl = document.querySelector('.glitch');

  function fireGlitch() {
    if (!glitchEl) return;
    glitchEl.classList.add('active');
    setTimeout(() => glitchEl.classList.remove('active'), 160);
  }

  // Random interval: 3–7 seconds
  function scheduleGlitch() {
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
      fireGlitch();
      scheduleGlitch();
    }, delay);
  }

  if (!prefersReducedMotion) {
    scheduleGlitch();
  }

  /* ── SCROLL REVEAL ──────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in-view'));
  }

  /* ── TRACK CARD TILT ────────────────────────────────── */
  if (supportsHover && !prefersReducedMotion) {
    document.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width  - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${nx * 5}deg) rotateX(${-ny * 4}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
      });
    });
  }

  /* ── MARQUEE PAUSE ON HOVER ─────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && supportsHover) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── PLATFORM ITEMS STAGGER ─────────────────────────── */
  const platformItems = document.querySelectorAll('.platform-item');
  if (platformItems.length) {
    platformItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    });
    if (prefersReducedMotion) {
      platformItems.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    } else if ('IntersectionObserver' in window) {
      const platformObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            platformItems.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, i * 80);
            });
            platformObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      platformObserver.observe(platformItems[0].parentElement);
    } else {
      platformItems.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }
  }

  /* ── SMOOTH SCROLL NAV ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ── ACTIVE NAV STATE ───────────────────────────────── */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navAnchors.length && 'IntersectionObserver' in window) {
    const sectionLinkPairs = [];
    navAnchors.forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) sectionLinkPairs.push({ section, link });
    });

    const setActiveLink = (activeLink) => {
      navAnchors.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    // Bias active link updates toward sections occupying the center viewport band.
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) {
        const activePair = sectionLinkPairs.find(({ section }) => section === visible[0].target);
        if (activePair) {
          setActiveLink(activePair.link);
        }
      }
    }, { threshold: [0.3, 0.6], rootMargin: '-25% 0px -55% 0px' }); // Center-band viewport weighting.

    sectionLinkPairs.forEach(({ section }) => sectionObserver.observe(section));
  }

  /* ── BACK TO TOP ────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

})();
