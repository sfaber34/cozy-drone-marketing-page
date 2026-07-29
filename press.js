// Press page: copy-to-clipboard buttons. Everything else is main.js or plain HTML.
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const el = document.querySelector(btn.dataset.copy);
    if (!el) return;
    // Collapse HTML whitespace for the visible blocks; <pre> keeps its layout
    const text = el.tagName === 'PRE'
      ? el.textContent.trim()
      : el.textContent.replace(/\s+/g, ' ').trim();
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = 'Copied!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1400);
    } catch {
      // Clipboard API can be denied — select the text so a manual copy works
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
});
