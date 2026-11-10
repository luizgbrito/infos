/* Utilidades compartidas: aplica config, scroll reveal, timers, 1-clic. */
(function () {
  var C = window.FUNNEL_CONFIG || {};

  // Reemplaza {{clave}} en el texto por valores de config.
  function val(path) {
    var parts = path.split('.'), o = C;
    for (var i = 0; i < parts.length; i++) { if (o == null) return ''; o = o[parts[i]]; }
    return o == null ? '' : o;
  }
  function applyTokens(root) {
    var map = {
      mecanismo: C.mecanismo, club: C.nombreClub,
      front: val('precios.front'), frontAncla: val('precios.frontAncla'),
      bump: val('precios.bump'), bumpAncla: val('precios.bumpAncla'),
      upsell: val('precios.upsell'), upsellAncla: val('precios.upsellAncla'),
      downsell: val('precios.downsell'),
      insumo: val('precios.insumo'), ozempic: val('precios.ozempic'),
      semanal: val('precios.semanal'), consulta: val('precios.consulta'),
      mujeres: val('social.mujeres')
    };
    (root || document).querySelectorAll('[data-t]').forEach(function (el) {
      var k = el.getAttribute('data-t');
      if (map[k] != null && map[k] !== '') el.textContent = map[k];
    });
    // Links de checkout
    document.querySelectorAll('[data-link]').forEach(function (el) {
      var k = el.getAttribute('data-link');
      el.setAttribute('href', val('checkout.' + k) || '#');
    });
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      el.setAttribute('href', C.whatsappSoporte || '#');
    });
  }
  window.applyTokens = applyTokens;

  // Scroll reveal
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // Timer con cuenta regresiva real (mm:ss). Al llegar a 0 dispara data-onzero.
  window.startTimer = function (el, seconds, onZero) {
    function render(s) {
      var m = Math.floor(s / 60), r = s % 60;
      el.textContent = (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
    }
    render(seconds);
    var iv = setInterval(function () {
      seconds--; if (seconds <= 0) { seconds = 0; render(0); clearInterval(iv); if (onZero) onZero(); return; }
      render(seconds);
    }, 1000);
  };

  // Nombre guardado en el quiz (para personalizar oferta/upsell)
  window.getName = function () {
    try { return localStorage.getItem('fn_nombre') || ''; } catch (e) { return ''; }
  };
  window.personalize = function () {
    var n = window.getName();
    document.querySelectorAll('[data-name]').forEach(function (el) {
      el.textContent = n ? n : (el.getAttribute('data-fallback') || '');
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    applyTokens(document);
    initReveal();
    window.personalize && window.personalize();
  });
})();
