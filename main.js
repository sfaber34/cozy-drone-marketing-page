// Cozy Drone — landing page behavior. No dependencies, no build step.

/* ── Trailer ──────────────────────────────────────────────────────────
   The video stays a static thumbnail until clicked, so YouTube's ~1MB of
   scripts never loads for visitors who don't watch it. Set data-video-id
   on .video in index.html to switch this on.
   ─────────────────────────────────────────────────────────────────── */
(function trailer() {
  const box = document.querySelector('.video');
  if (!box) return;

  const id = box.dataset.videoId?.trim();
  if (!id) return; // leave the "Trailer incoming" placeholder in place

  const title = box.dataset.title || 'Trailer';

  box.innerHTML = `
    <button class="video-facade" type="button" aria-label="Play ${title}">
      <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="">
      <span class="play" aria-hidden="true">▶</span>
    </button>`;

  // maxres doesn't exist for every upload; fall back to the always-present size
  const thumb = box.querySelector('img');
  thumb.addEventListener('error', () => {
    thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }, { once: true });

  box.querySelector('.video-facade').addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.title = title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    box.replaceChildren(frame);
  });
})();

/* ── Screenshot carousel ──────────────────────────────────────────
   The scrolling and snapping are pure CSS. This only adds the dots,
   the counter, and the arrow buttons — so the rail still swipes and
   scrolls if this never runs.
   ─────────────────────────────────────────────────────────────── */
(function carousel() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const rail = gallery.querySelector('.rail');
  const slides = [...rail.querySelectorAll('.slide')];
  if (slides.length < 2) return;

  const dots = gallery.querySelector('.rail-dots');
  const count = gallery.querySelector('.rail-count');
  const navs = [...gallery.querySelectorAll('.rail-nav')];
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Screenshot ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dots.append(dot);
  });
  const dotEls = [...dots.children];

  // Derived from layout rather than hardcoded, so the gap can change freely
  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;

  function go(i) {
    const width = step();
    if (!width) return;
    index = Math.max(0, Math.min(slides.length - 1, i));
    rail.scrollTo({ left: index * width });
    paint();
  }

  function paint() {
    dotEls.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
    if (count) {
      count.textContent = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
    }
    navs.forEach((n) => {
      n.disabled = Number(n.dataset.dir) < 0
        ? index === 0
        : index === slides.length - 1;
    });
  }

  navs.forEach((n) => {
    n.addEventListener('click', () => go(index + Number(n.dataset.dir)));
  });

  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
  });

  // Keep the dots honest when someone swipes or trackpad-scrolls the rail
  let settle;
  rail.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const width = step();
      if (!width) return;
      const i = Math.round(rail.scrollLeft / width);
      if (i !== index) { index = i; paint(); }
    }, 90);
  }, { passive: true });

  // Snap position drifts if the viewport changes mid-scroll
  window.addEventListener('resize', () => go(index));

  gallery.classList.add('is-ready');
  paint();
})();

/* ── Screenshot lightbox ─────────────────────────────────────────── */
(function lightbox() {
  const box = document.getElementById('lightbox');
  const shots = [...document.querySelectorAll('.slide img')];
  if (!box || !shots.length) return;

  const full = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  let at = 0;
  let lastFocused = null;

  function show(i) {
    at = (i + shots.length) % shots.length;
    full.src = shots[at].currentSrc || shots[at].src;
    full.alt = shots[at].alt;
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    full.src = '';
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  shots.forEach((img, i) => {
    img.tabIndex = 0;
    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  box.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
})();

/* ── Footer year ─────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
