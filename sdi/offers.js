(() => {
 const original=document.querySelector('[data-cakto-offer]');
 if(!original)return;
 const offer=window.SDI_OFFERS?.[original.dataset.caktoOffer];
 if(!offer?.configured||!offer.widgetHtml)return;
 const container=document.createElement('div');
 container.id='sdi-cakto-widget';container.innerHTML=offer.widgetHtml;
 original.replaceWith(container);
 document.querySelector('a.decline-link')?.parentElement.remove();
 const style=document.createElement('style');
 style.textContent=`cakto-upsell-buttons{display:block;text-align:center}cakto-upsell-accept::part(button){display:inline-block;background:linear-gradient(180deg,#22c55e,#16a34a);color:#fff;font-family:inherit;font-size:22px;font-weight:800;letter-spacing:.3px;padding:20px 36px;border:0;border-radius:14px;box-shadow:0 10px 24px rgba(22,163,74,.45);cursor:pointer;animation:pulse-green 1.7s ease-in-out infinite}cakto-upsell-reject::part(button){font-family:inherit;background:transparent;color:#6b7280;font-size:14px;border:0;text-decoration:underline;margin:18px auto 0;display:block;cursor:pointer}@media(max-width:480px){cakto-upsell-accept::part(button){font-size:18px;padding:18px 24px}}@media(max-width:360px){cakto-upsell-accept::part(button){font-size:16px;padding:16px 18px}}`;
 document.head.appendChild(style);
 container.querySelectorAll('script').forEach(script=>{const active=document.createElement('script');for(const attr of script.attributes)active.setAttribute(attr.name,attr.value);active.textContent=script.textContent;script.replaceWith(active)});
 // The original countdown still holds a reference to the former CTA.
 // Mirror its expired state onto the official widget without submitting a payment.
 const watch=setInterval(()=>{if(!original.hasAttribute('href')){const accept=container.querySelector('cakto-upsell-accept');if(accept){accept.inert=true;accept.setAttribute('aria-disabled','true');accept.style.opacity='.55';accept.style.pointerEvents='none';} clearInterval(watch)}},500);
})();

