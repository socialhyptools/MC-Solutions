/* =========================================================
   MC Solutions — Main JavaScript
   ========================================================= */

'use strict';

/* ---- Scroll Progress ---- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (Math.min(window.scrollY / max, 1) * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Navbar ---- */
function initNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();

  // Mark active link
  const page = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
  document.querySelectorAll('.mobile-nav .nav-link').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const burger  = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;

  const open  = () => { mobileNav.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileNav.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };

  burger.addEventListener('click', () => mobileNav.classList.contains('open') ? close() : open());
  mobileNav.querySelectorAll('.nav-link, .nav-cta').forEach(a => a.addEventListener('click', close));
}

/* ---- Intersection Observer (reveal on scroll) ---- */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---- Counter Animation ---- */
function animateCount(el, end, duration = 2000) {
  const startTime = performance.now();
  const isFloat = String(end).includes('.');
  const step = (now) => {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = eased * end;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? end.toFixed(1) : end;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target, parseFloat(e.target.dataset.count));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ---- Hero Canvas Particles ---- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const N = 55;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    o: Math.random() * 0.35 + 0.05,
  }));

  const LINK_DIST = 130;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw links
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(180,140,20,${0.07 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,162,39,${p.o})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  };
  draw();
}

/* ---- Card Tilt Effect (subtle) ---- */
function initTilt() {
  const cards = document.querySelectorAll('.svc-card, .sf-card, .val-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-sub');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#10B981,#059669)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3500);
  });
}

/* ---- Smooth Scroll (anchors) ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ---- Popup Quote Form ---- */
function initPopup() {
  const overlay  = document.getElementById('quotePopup');
  const closeBtn = document.getElementById('popupClose');
  if (!overlay || !closeBtn) return;

  if (!sessionStorage.getItem('popupDismissed')) {
    setTimeout(() => overlay.classList.add('active'), 2000);
  }

  function closePopup() {
    overlay.classList.remove('active');
    sessionStorage.setItem('popupDismissed', '1');
  }

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  const form = document.getElementById('popupForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-sub');
      btn.textContent = "Thank you! We'll reach out soon.";
      btn.style.background = 'linear-gradient(135deg,#C9A227,#9A7A12)';
      setTimeout(closePopup, 2400);
    });
  }
}

/* ---- Init All ---- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initReveal();
  initCounters();
  initHeroCanvas();
  initTilt();
  initContactForm();
  initSmoothScroll();
  initPopup();
});
