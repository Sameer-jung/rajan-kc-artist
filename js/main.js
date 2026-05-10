/* ═══════════════════════════════════════════════════════
   RAJAN KC — INTERACTIVE SYSTEMS
   Cursor · Parallax · Glitch · Scroll Reveal · Marquee
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CURSOR ─────────────────────────────────────────── */
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  const cursorLabel = document.getElementById('cursor-label');

  let mx = -200, my = -200;
  let ox = -200, oy = -200;

  function updateCursorInner(e) {
    mx = e.clientX;
    my = e.clientY;
    cursorInner.style.left = mx + 'px';
    cursorInner.style.top  = my + 'px';
  }

  // Smooth trailing outer cursor
  function animateCursorOuter() {
    ox += (mx - ox) * 0.14;
    oy += (my - oy) * 0.14;
    cursorOuter.style.left = ox + 'px';
    cursorOuter.style.top  = oy + 'px';
    requestAnimationFrame(animateCursorOuter);
  }

  document.addEventListener('mousemove', updateCursorInner);
  animateCursorOuter();

  // Hover states
  function setCursorHover(label) {
    document.body.classList.add('cursor-hover');
    cursorLabel.textContent = label || '';
  }
  function clearCursorHover() {
    document.body.classList.remove('cursor-hover');
    cursorLabel.textContent = '';
  }

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorHover(el.dataset.cursor));
    el.addEventListener('mouseleave', clearCursorHover);
  });

  /* ── HERO PARALLAX ──────────────────────────────────── */
  const heroImg = document.querySelector('.hero-portrait-img');
  const heroSection = document.getElementById('hero');

  if (heroImg && heroSection) {
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

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Hero portrait scroll drift
        if (heroImg) {
          heroImg.style.marginTop = (scrollY * 0.28) + 'px';
          const heroOpacity = Math.max(0, 1 - scrollY / 650);
          document.querySelector('.hero-text-panel').style.opacity = heroOpacity;
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

  scheduleGlitch();

  /* ── SCROLL REVEAL ──────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── TRACK CARD TILT ────────────────────────────────── */
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

  /* ── MARQUEE PAUSE ON HOVER ─────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── NAV SCROLL BEHAVIOR ────────────────────────────── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(4,4,10,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
    } else {
      nav.style.background = '';
      nav.style.backdropFilter = '';
      nav.style.borderBottom = '';
    }
  }, { passive: true });

  /* ── PLATFORM ITEMS STAGGER ─────────────────────────── */
  const platformItems = document.querySelectorAll('.platform-item');
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

  if (platformItems.length) {
    platformItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    });
    platformObserver.observe(platformItems[0].parentElement);
  }

  /* ── SMOOTH SCROLL NAV ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CURSOR HIDE ON LEAVE ───────────────────────────── */
  document.addEventListener('mouseleave', () => {
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorOuter.style.opacity = '1';
    cursorInner.style.opacity = '1';
  });

})();
