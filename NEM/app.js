'use strict';
const config = window.NEM_CONFIG;
const dialog = document.querySelector('#lightbox');
const content = document.querySelector('#dialog-content');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function projectPreview(title,src){return '<h2 id="dialog-title">'+escapeHTML(title)+'</h2><div class="localized-photo"><img src="'+escapeHTML(src)+'" alt="'+escapeHTML(title)+'"></div><p class="localized-caption">Paso a paso · '+escapeHTML(title)+'</p>';}
function showDialog(markup) { content.innerHTML = markup; dialog.showModal(); }
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if(e.target!==dialog)return; const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); });
dialog.addEventListener('click', e => {if(e.target.closest('[data-close]'))dialog.close();});
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => showDialog(projectPreview(button.dataset.title,button.dataset.image))));
document.querySelectorAll('[data-reference]').forEach(el => {el.textContent='US$ '+config.kits[el.dataset.reference].referencePrice.toFixed(2);});
document.querySelectorAll('[data-bonus-reference]').forEach(el => {el.textContent='US$ '+config.bonusReferencePrice.toFixed(2);});
document.querySelectorAll('[data-premium-reference]').forEach(el => {el.textContent='US$ '+config.premiumReferencePrice.toFixed(2);});
document.querySelectorAll('[data-price]').forEach(el => {el.textContent=config.kits[el.dataset.price].price.toFixed(2);});
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
 const id=button.dataset.buy; const kit=config.kits[id];
 if(kit.checkoutUrl){
   try { const url=new URL(kit.checkoutUrl); if(url.protocol==='https:') { ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck'].forEach(k=>{const v=new URLSearchParams(location.search).get(k);if(v)url.searchParams.set(k,v);});location.assign(url.href);return;} } catch { /* El resumen sigue accesible ante configuración incompleta. */ }
 }
 document.dispatchEvent(new CustomEvent('nem:kit-selected',{detail:{kit:id,currency:config.currency,price:kit.price}}));
 showDialog('<span class="eyebrow">TU SELECCIÓN</span><h2 id="dialog-title">'+escapeHTML(kit.name)+'</h2><div class="order-price">US$ '+kit.price.toFixed(2)+'</div><ul class="order-list"><li>'+(id==='complete'?'50 proyectos + los 5 bonos':'20 proyectos para comenzar')+'</li><li>Material digital en español</li><li>Un pago, sin suscripción</li><li>Garantía de 7 días</li></ul><button class="dialog-back" data-close>Volver a la colección</button>');
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

// Two continuous rows; repeated images remain clickable but stay outside keyboard and screen-reader navigation.
const carousels=document.querySelector('.projects-marquees');
const pauseControl=document.querySelector('[data-carousel="pause"]');
if(carousels){
 document.querySelectorAll('.carousel-set').forEach(group=>{const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('button').forEach(b=>{b.tabIndex=-1;b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>showDialog(projectPreview(b.dataset.title,b.dataset.image)));});group.parentElement.appendChild(copy);});
 let manualPaused=false;
 function setPaused(value){
 const rows=[...document.querySelectorAll('.marquee')];
 const offsets=value&&!manualPaused?rows.map(row=>{const track=row.querySelector('.marquee-track');const matrix=new DOMMatrixReadOnly(getComputedStyle(track).transform);const span=row.querySelector('.carousel-set').getBoundingClientRect().width;return (row.scrollLeft-matrix.m41+span)%span;}):null;
 manualPaused=value;carousels.classList.toggle('paused',value);pauseControl.setAttribute('aria-pressed',String(value));pauseControl.textContent=value?'Reanudar animación':'Pausar animación';
 if(offsets)rows.forEach((row,i)=>row.scrollLeft=offsets[i]);
 else if(!value)rows.forEach(row=>row.scrollLeft=0);
 }
 pauseControl.addEventListener('click',()=>setPaused(!manualPaused));
 document.querySelectorAll('[data-carousel="previous"],[data-carousel="next"]').forEach(button=>button.addEventListener('click',()=>{setPaused(true);document.querySelectorAll('.marquee').forEach(row=>row.scrollBy({left:(button.dataset.carousel==='next'?1:-1)*220,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}));
 carousels.addEventListener('pointerdown',()=>setPaused(true));
 carousels.addEventListener('focusin',()=>carousels.classList.add('focus-paused'));
 carousels.addEventListener('focusout',e=>{if(!carousels.contains(e.relatedTarget))carousels.classList.remove('focus-paused');});
 new IntersectionObserver(entries=>carousels.classList.toggle('in-view',entries[0].isIntersecting),{threshold:.05}).observe(carousels);
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){setPaused(true);pauseControl.hidden=true;}
}

// Provided Spanish conversations: independent collage viewports and tap-to-expand.
const testimonialMedia={"arboles": {"title": "Árboles navideños hechos a mano", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:367/517;--proof-width:418.528610%;--proof-left:0.000000%;--proof-top:0.000000%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Árboles navideños hechos a mano, conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": "assets/testimonio-arboles-es.webp"}, "globo": {"title": "Globo navideño artesanal", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:390/517;--proof-width:393.846154%;--proof-left:-96.666667%;--proof-top:0.000000%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Globo navideño artesanal, conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}, "cliente": {"title": "Conversación sobre los primeros proyectos", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:379/517;--proof-width:405.277045%;--proof-left:-205.277045%;--proof-top:0.000000%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Conversación sobre los primeros proyectos, conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}, "fernanda": {"title": "Conversación de Fernanda S.", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:380/497;--proof-width:404.210526%;--proof-left:0.000000%;--proof-top:-106.036217%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Conversación de Fernanda S., conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}, "camila": {"title": "Conversación de Camila", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:349/497;--proof-width:440.114613%;--proof-left:-113.180516%;--proof-top:-106.036217%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Conversación de Camila, conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}, "mariana": {"title": "Conversación de Mariana S.", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:363/497;--proof-width:423.140496%;--proof-left:-210.192837%;--proof-top:-106.036217%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Conversación de Mariana S., conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}, "juliana": {"title": "Conversación de Juliana", "panel": "<span class=\"testimonial-crop\" style=\"--proof-ratio:397/497;--proof-width:386.901763%;--proof-left:-286.901763%;--proof-top:-106.036217%\"><img src=\"assets/testimonios-collage-es.webp\" alt=\"Conversación de Juliana, conversación en español\" width=\"1536\" height=\"1024\" loading=\"lazy\" decoding=\"async\"></span>", "full": null}};
document.querySelectorAll('[data-testimonial]').forEach(button=>button.addEventListener('click',()=>{
 const item=testimonialMedia[button.dataset.testimonial];
 const visual=item.full?'<img class="testimonial-full" src="'+escapeHTML(item.full)+'" alt="'+escapeHTML(item.title)+'">':item.panel;
 showDialog('<h2 id="dialog-title">'+escapeHTML(item.title)+'</h2><div class="testimonial-enlarged">'+visual+'</div>');
}));
