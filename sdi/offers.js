(() => {
  const original = document.querySelector('[data-cakto-offer]');
  if (!original) return;
  const offer = window.SDI_OFFERS?.[original.dataset.caktoOffer];
  // Replace with the official Cakto widget generated for this merchant/offer.
  // No checkout or one-click IDs from the reference seller are reused.
  if (offer?.configured && offer.widgetHtml) {
    const container = document.createElement('div');
    container.id = 'sdi-cakto-widget';
    container.innerHTML = offer.widgetHtml;
    original.replaceWith(container);
    container.querySelectorAll('script').forEach(script => {
      const active = document.createElement('script');
      for (const attr of script.attributes) active.setAttribute(attr.name, attr.value);
      active.textContent = script.textContent;
      script.replaceWith(active);
    });
  }
  // Keep the payment session and campaign parameters on the next offer.
  document.querySelectorAll('a.decline-link').forEach(link => {
    const next = new URL(link.href);
    new URLSearchParams(location.search).forEach((value,key) => next.searchParams.set(key,value));
    link.href = next.href;
  });
})();
