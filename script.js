/* ============================================================
   PayGlocal — Homepage JavaScript
   ============================================================ */

// ── Tab switching ─────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs__nav').forEach(nav => {
    const btns   = nav.querySelectorAll('.tabs__btn');
    const panels = nav.closest('.tabs').querySelectorAll('.tabs__panel');

    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i] && panels[i].classList.add('active');
      });
    });
  });
}

// ── FAQ accordion ─────────────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__question');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ── Mobile menu ───────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('mobile-close');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

// ── Sticky nav class ──────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Scroll fade-in observer ───────────────────────────────────
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Stat counter animation ────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = (el.dataset.target.split('.')[1] || '').length;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const current = target * eased;
    const formatted = target >= 1000
      ? Math.round(current).toLocaleString('en-US')
      : current.toFixed(decimals);
    el.textContent = prefix + formatted + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

// ── Smooth scroll for anchor links ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── Hero stat carousel ────────────────────────────────────────
function initHeroCarousel() {
  const cards = Array.from(document.querySelectorAll('.hero__stat-card'));
  const dots  = Array.from(document.querySelectorAll('.hero__carousel-dot'));
  if (!cards.length) return;

  const N = cards.length;
  let current = 0;
  let timer;

  function reposition() {
    cards.forEach((card, i) => {
      const diff = ((i - current) % N + N) % N;
      if      (diff === 0)     card.dataset.pos = 'active';
      else if (diff === 1)     card.dataset.pos = 'next';
      else if (diff === N - 1) card.dataset.pos = 'prev';
      else                     card.dataset.pos = 'hidden';
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function advance() {
    current = (current + 1) % N;
    reposition();
  }

  function resetTimer() {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(advance, 5000);
    }
  }

  reposition();
  resetTimer();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { current = i; reposition(); resetTimer(); });
  });
}

// ── Problem section carousel ──────────────────────────────────
function initProblemScrollDriver() {
  const slides = Array.from(document.querySelectorAll('.problem__slide'));
  const prevBtn = document.getElementById('problem-prev');
  const nextBtn = document.getElementById('problem-next');
  if (!slides.length) return;

  const N = slides.length;
  let current = 0;

  function reposition() {
    slides.forEach((slide, i) => {
      const diff = ((i - current) % N + N) % N;
      if      (diff === 0)     slide.dataset.pos = 'active';
      else if (diff === 1)     slide.dataset.pos = 'next';
      else if (diff === N - 1) slide.dataset.pos = 'prev';
      else                     slide.dataset.pos = 'hidden';
    });
  }

  reposition();

  prevBtn && prevBtn.addEventListener('click', () => {
    current = (current - 1 + N) % N;
    reposition();
  });

  nextBtn && nextBtn.addEventListener('click', () => {
    current = (current + 1) % N;
    reposition();
  });

  slides.forEach((slide) => {
    slide.addEventListener('click', () => {
      if (slide.dataset.pos === 'prev') { current = (current - 1 + N) % N; reposition(); }
      if (slide.dataset.pos === 'next') { current = (current + 1) % N; reposition(); }
    });
  });
}

// ── Problem section wave background ──────────────────────────
function initWave() {
  const canvas = document.getElementById('problem-wave');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const layers = [
    { amp: 30, freq: 0.0045, speed: 0.0008, yRatio: 0.35, color: 'rgba(0,97,227,0.07)' },
    { amp: 22, freq: 0.0065, speed: 0.0011, yRatio: 0.52, color: 'rgba(0,97,227,0.05)' },
    { amp: 14, freq: 0.0090, speed: 0.0014, yRatio: 0.68, color: 'rgba(0,97,227,0.04)' },
  ];

  let t = 0;
  let animId;

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    layers.forEach(l => {
      ctx.beginPath();
      const baseY = H * l.yRatio;
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= W; x += 3) {
        ctx.lineTo(x, baseY + Math.sin(x * l.freq + t * l.speed * 60) * l.amp);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = l.color;
      ctx.fill();
    });

    t += 1;
    animId = requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener('pagehide', () => cancelAnimationFrame(animId));
}

// ── Why subtext expand ────────────────────────────────────────
function initWhyExpand() {
  const btn  = document.querySelector('.why__expand-btn');
  const more = document.getElementById('why-sub-more');
  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    more.style.display = expanded ? 'none' : 'inline';
  });
}

// ── Problem subtext expand ────────────────────────────────────
function initProblemExpand() {
  const btn  = document.querySelector('.problem__expand-btn');
  const more = document.getElementById('problem-sub-more');
  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    more.classList.toggle('open', !expanded);
  });
}

// ── Hero tagline typewriter ───────────────────────────────────
function initHeroTagline() {
  const section = document.querySelector('.hero-tagline');
  const el      = document.querySelector('.hero-tagline__text');
  if (!section || !el) return;

  const lineEls   = Array.from(el.querySelectorAll('.hero-tagline__line'));
  const lineTexts = lineEls.map(l => l.textContent.trim());

  el.setAttribute('aria-label', lineTexts.join(' '));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lineEls.forEach(l => { l.textContent = ''; });

  let timer     = null;
  let lineIndex = 0;
  let charIndex = 0;

  function startTyping() {
    timer = setInterval(() => {
      if (lineIndex >= lineTexts.length) { clearInterval(timer); return; }
      charIndex++;
      lineEls[lineIndex].textContent = lineTexts[lineIndex].slice(0, charIndex);
      if (charIndex >= lineTexts[lineIndex].length) {
        lineIndex++;
        charIndex = 0;
      }
    }, 28);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTyping();
        obs.unobserve(section);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(section);
}


// ── Why PayGlocal cards: swipe-in + active highlight ─────────
function initWhyCards() {
  const cards = Array.from(document.querySelectorAll('.why__card'));
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(c => c.classList.add('in-view'));
    return;
  }

  // Swipe each card in when it enters the viewport
  const enterObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in-view'), idx * 80);
        enterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => enterObs.observe(c));

  // Highlight the card closest to the vertical centre of the viewport
  function updateActive() {
    const mid = window.innerHeight / 2;
    let closest = null;
    let minDist = Infinity;

    cards.forEach(c => {
      if (!c.classList.contains('in-view')) return;
      const rect = c.getBoundingClientRect();
      const cardMid = rect.top + rect.height / 2;
      const dist = Math.abs(cardMid - mid);
      if (dist < minDist) { minDist = dist; closest = c; }
    });

    cards.forEach(c => c.classList.toggle('active', c === closest));
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFaq();
  initMobileMenu();
  initNav();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initHeroCarousel();
  initProblemScrollDriver();
  initProblemExpand();
  initWhyExpand();
  initWave();
  initHeroTagline();
  initWhyCards();
});
