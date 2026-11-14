(() => {
  const url = window.SUPERVIVENCIA_CONFIG?.checkoutUrl;
  if (!url) return;
  let target;
  try { target = new URL(url); } catch { return; }
  if (target.protocol !== 'https:') return;
  document.querySelectorAll('[data-checkout]').forEach(link => { link.href = target.href; });
})();
