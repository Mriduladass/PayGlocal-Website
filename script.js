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
        if (panels[i]) {
          panels[i].classList.add('active');
          panels[i].querySelectorAll('.products__carousel').forEach(c => {
            c.dispatchEvent(new Event('tab-shown'));
          });
        }
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


// ── Stats ribbon wave ─────────────────────────────────────────
function initStatsWave() {
  const canvas = document.getElementById('stats-wave');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Two ribbon bundles, each made of parallel sine curves whose
  // amplitude follows a bell curve across the bundle — matching
  // the expanding / contracting ribbon look of the source image.
  const bundles = [
    { yRatio: 0.38, lines: 32, spread: 4.5, amp: 62, freq: 0.0042, speed: 0.022, phase: 0 },
    { yRatio: 0.68, lines: 24, spread: 3.8, amp: 44, freq: 0.0055, speed: 0.018, phase: 2.1 },
  ];

  let t = 0;
  let animId;

  function drawBundle(b, W, H) {
    const centerY = H * b.yRatio;
    for (let i = 0; i < b.lines; i++) {
      const ratio    = i / (b.lines - 1);
      // Bell-curve amplitude: peaks at the bundle centre, tapers at edges
      const ampScale = Math.sin(ratio * Math.PI);
      const amp      = b.amp * ampScale;
      const baseY    = centerY + (i - b.lines / 2) * b.spread;
      const alpha    = 0.035 + 0.09 * ampScale;

      ctx.beginPath();
      for (let x = 0; x <= W + 2; x += 2) {
        const y = baseY + amp * Math.sin(x * b.freq - (t * b.speed + b.phase));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.lineWidth   = 0.9;
      ctx.stroke();
    }
  }

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    bundles.forEach(b => drawBundle(b, W, H));
    t += 1;
    animId = requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener('pagehide', () => cancelAnimationFrame(animId));
}

// ── Why PayGlocal interactive phone ───────────────────────────
function initWhyScroll() {
  const section = document.getElementById('why');
  if (!section) return;

  const slides  = Array.from(section.querySelectorAll('.why__slide'));
  const steps   = Array.from(section.querySelectorAll('.why__step'));
  const dots    = Array.from(section.querySelectorAll('.why__phone-dot'));
  const prevBtn = section.querySelector('.why__phone-prev');
  const nextBtn = section.querySelector('.why__phone-next');
  const N = slides.length;
  if (!N) return;

  let current = 0;

  function goTo(idx) {
    if (idx === current || idx < 0 || idx >= N) return;
    slides[current].classList.remove('why__slide--active');
    slides[idx].classList.add('why__slide--active');
    steps.forEach((s, i) => s.classList.toggle('why__step--active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('why__phone-dot--active', i === idx));
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === N - 1;
    current = idx;
  }

  // Step list clicks
  steps.forEach((step, i) => {
    step.addEventListener('click', () => goTo(i));
  });

  // Prev / next buttons
  if (prevBtn) {
    prevBtn.disabled = true;
    prevBtn.addEventListener('click', () => goTo(current - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goTo(current + 1));
  }
}

// ── Products track carousel ───────────────────────────────────
function initProductCarousel() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.products__carousel').forEach(carousel => {
    const grid = carousel.querySelector('.products__grid');
    if (!grid) return;
    const originalCards = Array.from(grid.querySelectorAll('.product-card'));
    const N = originalCards.length;
    if (!N) return;

    // Build card structure: content wrapper at top, illustration at bottom.
    // Guard on product-card__content (not illustration) so data-illus-src cards
    // with a pre-existing illustration div still get restructured correctly.
    originalCards.forEach(card => {
      if (card.querySelector('.product-card__content')) return;
      const illus = document.createElement('div');
      illus.className = 'product-card__illustration';
      const src = card.dataset.illusSrc;
      if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        illus.appendChild(img);
      }
      const content = document.createElement('div');
      content.className = 'product-card__content';
      while (card.firstChild) content.appendChild(card.firstChild);
      card.appendChild(content);
      card.appendChild(illus);
    });

    // Track: [clone(N-2), clone(N-1), card[0], ..., card[N-1], clone(0), clone(1)]
    const CLONES = 2;
    for (let i = 0; i < CLONES; i++) {
      grid.prepend(originalCards[(N - 1 - i + N) % N].cloneNode(true));
    }
    for (let i = 0; i < CLONES; i++) {
      grid.appendChild(originalCards[i % N].cloneNode(true));
    }

    const all = Array.from(grid.children);
    const CARD_GAP = 20;
    const INTERVAL = 3200;
    let current = CLONES;
    let busy = false;
    let timer = null;
    let busySafe = null;

    // BUG FIX 1: read actual rendered card width so the offset is correct at every
    // responsive breakpoint (CSS changes card width to 280px at <=1024px).
    function cardWidth() {
      const w = all[CLONES] ? all[CLONES].offsetWidth : 0;
      return w > 0 ? w : 340;
    }

    function getOffset(idx) {
      const cw = cardWidth();
      return carousel.offsetWidth / 2 - cw / 2 - idx * (cw + CARD_GAP);
    }

    function setCardTransitions(value) {
      all.forEach(c => { c.style.transition = value; });
    }

    function render(animate) {
      grid.style.transition = animate
        ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
        : 'none';
      if (!animate) grid.offsetHeight;
      grid.style.transform = `translateX(${getOffset(current)}px)`;
      all.forEach((c, i) => { c.dataset.pos = i === current ? 'active' : ''; });
    }

    // Silent clone-to-real jump: suppress card transitions to prevent scale flash
    function jumpIfClone() {
      if (current >= CLONES && current < CLONES + N) return;
      if (current < CLONES) current += N;
      else current -= N;
      setCardTransitions('none');
      render(false);
      grid.offsetHeight;
      setCardTransitions('');
    }

    // BUG FIX 5: respect prefers-reduced-motion (mirrors the hero carousel logic)
    function startTimer() {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(() => navigate(1), INTERVAL);
    }

    function stopTimer() {
      clearInterval(timer);
    }

    function navigate(dir) {
      if (busy || carousel.offsetWidth === 0) return;
      busy = true;
      current += dir;
      render(true);
      // BUG FIX 3: if transitionend never fires (background tab, interrupted paint),
      // this timeout guarantees busy is cleared so the carousel doesn't freeze.
      clearTimeout(busySafe);
      busySafe = setTimeout(() => { busy = false; }, 700);
    }

    render(false);
    // BUG FIX 4: only start the timer for panels that are actually visible on load
    if (carousel.offsetWidth > 0) startTimer();

    // Only handle the GRID's own transitionend — card scale bubbles fire with the
    // same propertyName and would trigger the clone-jump mid-animation without this check
    grid.addEventListener('transitionend', e => {
      if (e.target !== grid || e.propertyName !== 'transform') return;
      clearTimeout(busySafe); // normal end — cancel the safety fallback
      jumpIfClone();
      busy = false;
    });

    // Pause auto-play on hover; resume on leave
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', () => { if (carousel.offsetWidth > 0) startTimer(); });

    // Touch swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopTimer();
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) navigate(dx > 0 ? -1 : 1);
      if (carousel.offsetWidth > 0) startTimer();
    }, { passive: true });

    // Prev/next buttons — reset the countdown so the timer doesn't fire
    // immediately after a manual click
    carousel.querySelectorAll('.products__carousel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigate(parseInt(btn.dataset.dir, 10));
        startTimer();
      });
    });

    // Click a non-active real card to jump directly to it
    all.forEach((card, i) => {
      if (i < CLONES || i >= CLONES + N) return;
      card.addEventListener('click', () => {
        if (i === current || busy) return;
        busy = true;
        current = i;
        render(true);
        startTimer();
      });
    });

    // Re-layout and start auto-play when a hidden tab panel becomes visible
    carousel.addEventListener('tab-shown', () => requestAnimationFrame(() => {
      render(false);
      startTimer();
    }));

    // BUG FIX 2: re-center on window resize — card width changes at the 1024px
    // breakpoint so the offset must be recalculated when the viewport crosses it
    let resizeId = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(() => render(false), 100);
    }, { passive: true });
  });
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
  initStatsWave();
  initHeroTagline();
  initWhyScroll();
  initProductCarousel();
});
