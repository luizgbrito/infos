/* Rastreio das ofertas (modelo do Secreto de la Insulina, versão 2): Supabase + pixel no navegador + API de Conversões.
   Na página, antes deste arquivo:
   <script>window.DM_TRACK = { offer: "SDI", endpoint: "https://SEU-PROJETO.supabase.co/functions/v1/track", pixel: "ID_DO_PIXEL", value: 9.9, currency: "USD", contentId: "" };</script>
   Opcionais: checkout ("pay.cakto.com.br"), quiz (seletor da barra de progresso), quizSteps (total de etapas), leadAtStep (etapa que vira Lead),
   downsellModal / downsellAccept / downsellDismiss (ids do modal de saída). */
(function () {
  if (window.__dmTrack) return; window.__dmTrack = 1;
  var C = window.DM_TRACK || {};
  if (!C.offer || !C.endpoint) return;
  var h = location.hostname; if (h === 'localhost' || h === '127.0.0.1') return;
  var CHECKOUT = C.checkout || 'pay.cakto.com.br';
  var d = document;

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function uuid() {
    return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  // Sessão: uma por aba. É o sck que vai para o checkout e volta no webhook da venda.
  var sid = ss('t_sid'); if (!sid) { sid = uuid(); ss('t_sid', sid); }

  // UTMs: URL > sessão > memória de 7 dias.
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  var q = new URLSearchParams(location.search), utm = {}, fresh = false;
  KEYS.forEach(function (k) { var v = q.get(k); if (v) { utm[k] = v.split('::')[0].slice(0, 300); fresh = true; } });
  if (fresh) { ss('t_utm', JSON.stringify(utm)); ls('t_utm_mem', JSON.stringify({ v: utm, exp: Date.now() + 7 * 864e5 })); }
  else {
    try { utm = JSON.parse(ss('t_utm') || 'null') || {}; } catch (e) { utm = {}; }
    if (!Object.keys(utm).length) { try { var m = JSON.parse(ls('t_utm_mem') || 'null'); if (m && m.exp > Date.now()) utm = m.v; } catch (e) {} }
  }

  // Clique do anúncio: o fbclid vai inteiro (cortar quebra a correspondência do _fbc).
  function clickId(v) { return /^[A-Za-z0-9_-]{1,600}$/.test(v || '') ? v : null; }
  var fbclid = clickId(q.get('fbclid'));
  if (fbclid) { ss('t_fbclid', fbclid); ls('t_fbclid', fbclid); ss('t_fbc', 'fb.1.' + Date.now() + '.' + fbclid); ls('t_fbc', ss('t_fbc')); }
  else fbclid = clickId(ss('t_fbclid') || ls('t_fbclid'));
  function cookie(n) { var p = n + '='; var e = d.cookie.split('; ').find(function (x) { return x.indexOf(p) === 0; }); return e ? decodeURIComponent(e.slice(p.length)) : null; }
  function ids() {
    var c = cookie('_fbc'); var fbc = /^fb\.\d\.\d{13}\.[A-Za-z0-9_-]{6,600}$/.test(c || '') ? c : null;
    if (fbclid && !(fbc && fbc.slice(-fbclid.length - 1) === '.' + fbclid)) fbc = ss('t_fbc') || ls('t_fbc');
    var p = cookie('_fbp'); return { fbc: fbc, fbp: /^fb\.\d\.\d{13}\.\d{1,30}$/.test(p || '') ? p : null };
  }

  function post(body) {
    try {
      // text/plain evita a pré-checagem de CORS (o evento sai mesmo durante a ida para o checkout).
      fetch(C.endpoint, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(body) }).catch(function () {});
    } catch (e) {}
  }
  var first = !ss('t_visit'); if (first) ss('t_visit', '1');
  function send(name, extra) {
    var m = ids(); var b = { offer: C.offer, sid: sid, name: name, url: location.href.slice(0, 800), utm: utm, fbc: m.fbc, fbp: m.fbp };
    if (first) { b.visit = 1; b.ref = d.referrer || null; b.fbclid = fbclid; first = false; }
    for (var k in extra || {}) b[k] = extra[k];
    post(b);
  }

  // Pixel do navegador: o mesmo event_id vai para o servidor e a Meta conta uma vez só.
  if (C.pixel && !window.fbq) {
    var f = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    f.push = f; f.loaded = true; f.version = '2.0'; f.queue = []; window.fbq = f; window._fbq = f;
    var s = d.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js'; d.head.appendChild(s);
  }
  if (C.pixel) { window.fbq('set', 'autoConfig', false, C.pixel); window.fbq('init', C.pixel, { external_id: sid }); }
  function meta(name, extra) {
    var id = uuid();
    if (C.pixel && window.fbq) {
      var p = name === 'PageView' ? {} : (C.value != null ? { value: Number(C.value), currency: C.currency || 'USD' } : {});
      if (name !== 'PageView' && C.contentId) { p.content_ids = [C.contentId]; p.content_type = 'product'; }
      window.fbq('trackSingle', C.pixel, name, p, { eventID: id });
    }
    var x = { event_id: id }; for (var k in extra || {}) x[k] = extra[k];
    send(name, x);
  }
  meta('PageView');
  meta('ViewContent');

  // Etapas do quiz: deduzidas da barra de progresso (largura = (etapa - 1) / total).
  var step = 1, lastStep = 0, leadSent = false, maxPct = 0;
  if (C.quiz) {
    var TOTAL = Number(C.quizSteps) || 28;
    var readStep = function () { var bar = d.querySelector(C.quiz); if (!bar) return step; var w = parseFloat(bar.style.width) || 0; return Math.round(w * TOTAL / 100) + 1; };
    var checkStep = function () {
      var st = readStep(); step = st;
      if (st !== lastStep) { lastStep = st; send('quiz_step', { step: st }); if (!leadSent && C.leadAtStep && st >= C.leadAtStep) { leadSent = true; meta('Lead', { step: st }); } }
    };
    new MutationObserver(checkStep).observe(d.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    checkStep();
  }

  // Rolagem: marcos de 25, 50, 75 e 100%.
  var marks = [25, 50, 75, 100], hit = {};
  function pct() { var e = d.documentElement, b = d.body; var sc = Math.max(e.scrollHeight, b.scrollHeight) - innerHeight; return sc <= 0 ? 100 : Math.min(100, Math.round((scrollY || e.scrollTop) / sc * 100)); }
  var tick = false;
  addEventListener('scroll', function () { if (tick) return; tick = true; setTimeout(function () { tick = false; var p = pct(); if (p > maxPct) maxPct = p; marks.forEach(function (mk) { if (p >= mk && !hit[mk]) { hit[mk] = 1; send('scroll_depth', { step: mk }); } }); }, 300); }, { passive: true });

  // Online agora.
  function ping() { if (!d.hidden) send('ping', { step: C.quiz ? step : maxPct }); }
  setTimeout(ping, 1500); setInterval(ping, 60000);
  d.addEventListener('visibilitychange', function () { if (!d.hidden) ping(); });

  // Checkout: o link leva UTMs, clique do anúncio e a sessão (sck e src), e vira InitiateCheckout.
  function decorate(a) {
    try {
      var u = new URL(a.href, location.href); if (u.href.indexOf(CHECKOUT) < 0) return null;
      KEYS.forEach(function (k) { if (utm[k]) u.searchParams.set(k, utm[k]); });
      var m = ids(); if (fbclid) u.searchParams.set('fbclid', fbclid); if (m.fbc) u.searchParams.set('fbc', m.fbc); if (m.fbp) u.searchParams.set('fbp', m.fbp);
      u.searchParams.set('sck', sid); u.searchParams.set('src', sid);
      a.href = u.toString(); return u;
    } catch (e) { return null; }
  }
  function decorateAll() { d.querySelectorAll('a[href*="' + CHECKOUT + '"]').forEach(decorate); }
  if (d.readyState !== 'loading') decorateAll(); else d.addEventListener('DOMContentLoaded', decorateAll);
  var lastIc = 0;
  function onClick(e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a || !decorate(a)) return;
    send('checkout_click', { step: C.quiz ? step : maxPct });
    if (Date.now() - lastIc > 3000) { lastIc = Date.now(); meta('InitiateCheckout'); }
  }
  d.addEventListener('click', onClick, true); d.addEventListener('auxclick', onClick, true);
  // Para botões que navegam por código (sem <a>): window.dmCheckout(url) decora e registra.
  window.dmCheckout = function (url) { var a = d.createElement('a'); a.href = url; decorate(a); send('checkout_click', { step: step }); meta('InitiateCheckout'); return a.href; };

  // Modal de saída com downsell (ids configuráveis; padrão do SDI).
  var DM = C.downsellModal || 'downsell-exit-modal', DA = C.downsellAccept || 'downsell-modal-accept', DD = C.downsellDismiss || 'downsell-modal-dismiss';
  d.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('#' + DA)) send('downsell_accept', { step: step });
    else if (e.target.closest('#' + DD)) send('downsell_dismiss', { step: step });
  }, true);
  var dm = d.getElementById(DM), shown = false;
  if (dm) new MutationObserver(function () { var vis = dm.style.display === 'flex' || (!dm.classList.contains('hidden') && dm.offsetParent !== null); if (vis && !shown) { shown = true; send('downsell_shown', { step: step }); } }).observe(dm, { attributes: true, attributeFilter: ['style', 'class'] });
})();
