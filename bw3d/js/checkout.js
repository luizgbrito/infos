(function () {
  'use strict';
  var config = window.BW3D_CONFIG || {};
  function showMessage() {
    var existing = document.querySelector('.bw3d-alert');
    if(existing) existing.remove();
    var alert = document.createElement('div');
    alert.className='bw3d-alert';alert.setAttribute('role','alert');
    alert.textContent='El checkout se está configurando. Vuelve a intentarlo más tarde.';
    var close=document.createElement('button');close.type='button';close.setAttribute('aria-label','Cerrar aviso');close.textContent='×';
    close.addEventListener('click', function(){alert.remove()});alert.prepend(close);document.body.appendChild(alert);
  }
  function checkoutURL() {
    var raw=(config.checkoutUrl || '').trim();
    if(!raw) return null;
    try {
      var url = new URL(raw);
      if (url.protocol !== 'https:' || !/(^|\.)cakto\.com\.br$/i.test(url.hostname)) return null;
      var params = new URLSearchParams(window.location.search);
      params.forEach(function(value,key){if((/^utm_[a-z0-9_]+$/i.test(key) || /^(fbclid|gclid|ttclid)$/i.test(key)) && !url.searchParams.has(key))url.searchParams.set(key,value)});
      return url.href;
    } catch(e) { return null; }
  }
  document.addEventListener('click',function(e){
    var target=e.target.closest('[data-bw3d-checkout]');
    if(!target) return; e.preventDefault();
    var to=checkoutURL();if(to) window.location.assign(to);else showMessage();
  });
  if(config.metaPixelId && /^\d+$/.test(String(config.metaPixelId))){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',String(config.metaPixelId));fbq('track','PageView');
  }
})();
