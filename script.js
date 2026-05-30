/* ===================================================
   ALEX RIVERA – PORTFOLIO JAVASCRIPT
   GSAP | AOS | Particles | Typed | Interactions
=================================================== */

'use strict';

/* ──────────────────────────────────
   1. LOADER
────────────────────────────────── */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initHeroAnimations();
  }, 300);
});

// Prevent scrolling while loading
document.body.style.overflow = 'hidden';


/* ──────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower
(function followCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(followCursor);
})();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, .stat-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    cursorFollower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    cursorFollower.classList.remove('hover');
  });
});


/* ──────────────────────────────────
   3. PARTICLE CANVAS
────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 35;

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color   = Math.random() > 0.5 ? '#00e5ff' : '#8b5cf6';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // Connection lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00e5ff';
          ctx.globalAlpha = (1 - dist / 100) * 0.06;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ──────────────────────────────────
   4. NAVBAR
────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

// Scroll blur
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveSection();
  toggleBackToTop();
});

// Hamburger
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Active section highlight
const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
  let current = '';
  sections.forEach(sec => {
    const top    = sec.offsetTop - 120;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}


/* ──────────────────────────────────
   5. TYPED TEXT
────────────────────────────────── */
const typedEl = document.getElementById('typedText');
const phrases = [
  'Web Developer'
];
let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 60 : 90);
}

setTimeout(typeLoop, 600); // Start after loader


/* ──────────────────────────────────
   6. HERO GSAP ANIMATIONS
────────────────────────────────── */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero content stagger
  gsap.from('.hero-badge',         { opacity: 0, y: 30, duration: 0.7, delay: 0.2 });
  gsap.from('.hero-greeting',      { opacity: 0, y: 30, duration: 0.7, delay: 0.35 });
  gsap.from('.hero-name',          { opacity: 0, y: 40, duration: 0.8, delay: 0.5 });
  gsap.from('.hero-role-wrapper',  { opacity: 0, y: 30, duration: 0.7, delay: 0.65 });
  gsap.from('.hero-desc',          { opacity: 0, y: 30, duration: 0.7, delay: 0.8 });
  gsap.from('.hero-actions',       { opacity: 0, y: 30, duration: 0.7, delay: 0.95 });
  gsap.from('.hero-socials',       { opacity: 0, y: 20, duration: 0.7, delay: 1.1 });
  gsap.from('.hero-visual',        { opacity: 0, x: 60, duration: 0.9, delay: 0.4 });
  gsap.from('.scroll-indicator',   { opacity: 0, y: 20, duration: 0.6, delay: 1.5 });

  // Floating badges GSAP
  gsap.to('.badge-react', { y: '-=10', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0 });
  gsap.to('.badge-node',  { y: '-=12', duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.8 });
  gsap.to('.badge-js',    { y: '-=8',  duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
  gsap.to('.badge-git',   { y: '-=10', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.4 });
}


/* ──────────────────────────────────
   7. AOS INIT
────────────────────────────────── */
AOS.init({
  duration: 750,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});


/* ──────────────────────────────────
   8. SKILL BAR ANIMATION
────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* ──────────────────────────────────
   9. COUNTER ANIMATION
────────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur    = 1800;
  const step   = 16;
  const increment = target / (dur / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(n => counterObserver.observe(n));


/* ──────────────────────────────────
   10. CONTACT FORM
────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, condition, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (condition(el.value.trim())) {
    el.classList.remove('error');
    err.textContent = '';
    return true;
  } else {
    el.classList.add('error');
    err.textContent = msg;
    return false;
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const v1 = validateField('formName',    'nameError',    v => v.length >= 2, 'Please enter your name (min 2 chars).');
  const v2 = validateField('formEmail',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
  const v3 = validateField('formSubject', 'subjectError', v => v.length >= 3, 'Subject must be at least 3 characters.');
  const v4 = validateField('formMessage', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');

  if (!(v1 && v2 && v3 && v4)) return;

  // Simulate send
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 2000);
});

// Live validation
['formName', 'formEmail', 'formSubject', 'formMessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
  });
});


/* ──────────────────────────────────
   11. BUTTON RIPPLE EFFECT
────────────────────────────────── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect  = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


/* ──────────────────────────────────
   12. BACK TO TOP
────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────
   13. FOOTER YEAR
────────────────────────────────── */
document.getElementById('footerYear').textContent = new Date().getFullYear();


/* ──────────────────────────────────
   14. SMOOTH SCROLL (all anchor links)
────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ──────────────────────────────────
   15. ANIMATED GRADIENT BORDER (skill cards)
────────────────────────────────── */
let gradientAngle = 0;

function animateCardBorders() {
  gradientAngle = (gradientAngle + 0.4) % 360;
  document.querySelectorAll('.skill-card:hover').forEach(card => {
    card.style.setProperty(
      '--grad-angle',
      `${gradientAngle}deg`
    );
  });
  requestAnimationFrame(animateCardBorders);
}
animateCardBorders();


/* ──────────────────────────────────
   16. SECTION REVEAL (GSAP Scroll)
────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  // Parallax on hero bg
  gsap.to('.hero-bg-gradient', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: 100,
    opacity: 0,
  });
});


/* ──────────────────────────────────
   17. SKILL CARD HOVER GLOW
────────────────────────────────── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});


/* ──────────────────────────────────
   18. PROJECT CARD 3D TILT
────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
    const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});


/* ──────────────────────────────────
   19. FLOATING ICON RESET (resize)
────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    AOS.refresh();
  }, 200);
});
