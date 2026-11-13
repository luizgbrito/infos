'use strict';
const config = window.NEM_CONFIG;
const dialog = document.querySelector('#lightbox');
const content = document.querySelector('#dialog-content');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showDialog(markup) { content.innerHTML = markup; dialog.showModal(); }
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if(e.target!==dialog)return; const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); });
dialog.addEventListener('click', e => {if(e.target.closest('[data-close]'))dialog.close();});
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => showDialog('<h2 id="dialog-title">'+escapeHTML(button.dataset.title)+'</h2><img src="'+escapeHTML(button.dataset.image)+'" alt="'+escapeHTML(button.dataset.title)+'">')));
document.querySelectorAll('[data-price]').forEach(el => {el.textContent=config.kits[el.dataset.price].price.toFixed(2);});
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
 const id=button.dataset.buy; const kit=config.kits[id];
 if(kit.checkoutUrl){
   try { const url=new URL(kit.checkoutUrl); if(url.protocol==='https:') { ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck'].forEach(k=>{const v=new URLSearchParams(location.search).get(k);if(v)url.searchParams.set(k,v);});location.assign(url.href);return;} } catch { /* El resumen sigue accesible ante configuración incompleta. */ }
 }
 document.dispatchEvent(new CustomEvent('nem:kit-selected',{detail:{kit:id,currency:config.currency,price:kit.price}}));
 showDialog('<span class="eyebrow">TU SELECCIÓN</span><h2 id="dialog-title">'+escapeHTML(kit.name)+'</h2><div class="order-price">USD '+kit.price.toFixed(2)+'</div><ul class="order-list"><li>'+(id==='complete'?'50 proyectos + los 5 bonos':'20 proyectos para comenzar')+'</li><li>Material digital en español</li><li>Un pago, sin suscripción</li><li>Garantía de 7 días</li></ul><button class="dialog-back" data-close>Volver a la colección</button>');
}));
if(config.videoUrl){try{const url=new URL(config.videoUrl,location.href);if(['https:','http:'].includes(url.protocol)){const video=document.querySelector('#sales-video');video.src=url.href;video.hidden=false;document.querySelector('.hero-media>img').hidden=true;document.querySelector('.media-link').hidden=true;}}catch{}}
const policies = {
 terms:'<h2 id="dialog-title">Términos de compra</h2><p>Los kits son materiales digitales en español. No incluyen envío físico ni materiales de manualidades. El kit completo contiene 50 proyectos y 5 bonos; el esencial, 20 proyectos sin bonos adicionales.</p><p>Los precios se expresan en dólares estadounidenses. El proveedor de pago informa los medios disponibles, el importe final y cualquier cargo aplicable antes de completar la compra. El acceso se entrega al correo registrado tras la confirmación del pago.</p><p>La garantía es de 7 días desde la compra. Para solicitar asistencia o reembolso, utiliza el canal de atención indicado en el comprobante del pedido.</p>',
 privacy:'<h2 id="dialog-title">Privacidad</h2><p>Esta página no incorpora formularios de registro ni píxeles publicitarios. No solicita tarjetas ni contraseñas. El servicio de alojamiento puede registrar información técnica necesaria para servir la página.</p><p>Al utilizar un enlace de pago, el proveedor del checkout gestiona los datos que ingreses según su propia política de privacidad. Revisa esa información antes de confirmar la compra.</p>'
};
document.querySelectorAll('[data-policy]').forEach(button=>button.addEventListener('click',()=>showDialog(policies[button.dataset.policy])));
const sticky=document.querySelector('.sticky');
new IntersectionObserver(entries=>{sticky.classList.toggle('visible',!entries[0].isIntersecting&&scrollY>100);}).observe(document.querySelector('.hero> .cta'));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');observer.unobserve(e.target);}}),{threshold:.05});document.querySelectorAll('.bonus,.plan,.guarantee-box,.creator').forEach(el=>observer.observe(el));}
