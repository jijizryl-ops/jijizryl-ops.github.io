/* ============================================
   JIZRYL ARBOLEDA — ENHANCED PORTFOLIO JS
   ============================================ */

/* ---- THEME ---- */
function applyTheme(theme) {
  const body = document.body;
  const btn = document.getElementById('theme-btn');
  if (theme === 'light') {
    body.classList.add('light-mode');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    body.classList.remove('light-mode');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const newTheme = isLight ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
}

/* ---- TYPING EFFECT ---- */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const text = "Jizryl S. Arboleda";
  let i = 0;
  el.innerHTML = '<span class="jz-cursor">|</span>';

  // Add cursor style
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .jz-cursor {
      display: inline-block;
      color: var(--gold);
      animation: blinkCursor 0.75s step-end infinite;
      font-weight: 300;
      margin-left: 2px;
    }
    @keyframes blinkCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(cursorStyle);

  function type() {
    if (i < text.length) {
      el.innerHTML = text.substring(0, i + 1) + '<span class="jz-cursor">|</span>';
      i++;
      setTimeout(type, 90);
    } else {
      // Keep blinking cursor at end
      el.innerHTML = text + '<span class="jz-cursor">|</span>';
    }
  }
  setTimeout(type, 400);
}

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const items = document.querySelectorAll(
    '.jz-work-card, .jz-testi-card, .jz-skill-group, .jz-album-card, .jz-highlight-card, .jz-project-card, .jz-expertise-card, .jz-timeline-item, .jz-contact-item'
  );
  items.forEach((el, i) => {
    el.classList.add('jz-reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

/* ---- NAVBAR SCROLL EFFECT ---- */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '8px 0';
    } else {
      nav.style.padding = '14px 0';
    }
  }, { passive: true });
}

/* ---- ACTIVE NAV LINK ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.jz-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) link.classList.add('active');
    });
  }, { passive: true });
}

/* ---- SMOOTH CLOSE MOBILE NAV ON LINK CLICK ---- */
function initMobileNav() {
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ---- CONTACT FORM FEEDBACK ---- */
function initForm() {
  const form = document.querySelector('.jz-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }
  });
}

/* ---- STAT COUNTER ANIMATION ---- */
function initStatCounters() {
  const stats = document.querySelectorAll('.jz-stat-num');
  if (!stats.length) return;

  const parseTarget = (el) => {
    const txt = el.textContent.trim();
    const num = parseFloat(txt.replace(/[^0-9.]/g, ''));
    const suffix = txt.replace(/[0-9.]/g, '');
    return { num, suffix };
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const { num, suffix } = parseTarget(el);
      const duration = 1800;
      const steps = 60;
      const increment = num / steps;
      let current = 0;
      let step = 0;
      const isFloat = num % 1 !== 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(increment * step, num);
        el.textContent = (isFloat ? current.toFixed(1) : Math.ceil(current)) + suffix;
        if (step >= steps) clearInterval(timer);
      }, duration / steps);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ---- MOUSE PARALLAX ON HERO PROFILE ---- */
function initHeroParallax() {
  const wrap = document.querySelector('.jz-profile-wrap');
  if (!wrap) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    wrap.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
  });
}

/* ---- GOLD CURSOR GLOW ---- */
function initCursorGlow() {
  const cursor = document.createElement('div');
  cursor.id = 'jz-cursor-glow';
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 20px; height: 20px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,197,66,0.5) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Scale up on hovering interactive elements
  document.querySelectorAll('a, button, .jz-work-card, .jz-testi-card, .jz-skill-group').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '50px';
      cursor.style.height = '50px';
      cursor.style.background = 'radial-gradient(circle, rgba(245,197,66,0.3) 0%, transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'radial-gradient(circle, rgba(245,197,66,0.5) 0%, transparent 70%)';
    });
  });
}

/* ---- SCROLL PROGRESS BAR ---- */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'jz-scroll-progress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #f5c542, #fad96a);
    z-index: 9999; transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(245,197,66,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ---- PAGE LOAD FADE IN ---- */
function initPageFade() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
}

/* ---- CARD TILT EFFECT ---- */
function initCardTilt() {
  const cards = document.querySelectorAll('.jz-work-card, .jz-testi-card, .jz-highlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- SECTION DIVIDER ANIMATION ---- */
function initSectionDividers() {
  document.querySelectorAll('.jz-section-header').forEach(header => {
    const line = document.createElement('div');
    line.className = 'jz-divider-line';
    header.appendChild(line);
  });
}

/* ---- HERO PARTICLES ---- */
function initHeroParticles() {
  const hero = document.querySelector('.jz-hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 197, 66, ${p.opacity})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  };
  draw();
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Active nav style (merged from second listener)
  const style = document.createElement('style');
  style.textContent = `.jz-link.active { color: var(--gold) !important; background: var(--gold-dim); }`;
  document.head.appendChild(style);

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  initTyping();
  initScrollReveal();
  initNavScroll();
  initActiveNav();
  initMobileNav();
  initForm();

  // New enhancements
  initStatCounters();
  initHeroParallax();
  initCursorGlow();
  initScrollProgress();
  initCardTilt();
  initSectionDividers();
  initHeroParticles();
  initPageFade();
});
