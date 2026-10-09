// Google Tag Manager. Não carrega em localhost / file:// para não sujar os dados durante testes.
(function () {
  var cfg = window.QUIZ_CONFIG || {};
  window.dataLayer = window.dataLayer || [];
  var host = location.hostname;
  var isLocal = location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (!cfg.gtmId || isLocal) return;

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', cfg.gtmId);
})();
