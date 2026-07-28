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

/* ── Screenshot lightbox ─────────────────────────────────────────── */
(function lightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;

  const full = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  let lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    full.src = src;
    full.alt = alt;
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

  document.querySelectorAll('.shot img').forEach((img) => {
    img.tabIndex = 0;
    img.addEventListener('click', () => open(img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img.src, img.alt);
      }
    });
  });

  box.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) close();
  });
})();

/* ── Footer year ─────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
