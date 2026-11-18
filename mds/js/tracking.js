/* Tracking proprio via Supabase — pagina de vendas Supervivencia LATAM.
   Preencha SUPABASE_URL e SUPABASE_ANON_KEY (chave publishable/anon) abaixo. */
(function () {
  var SUPABASE_URL = 'https://zbiwjzxcbfxwgivsotzu.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_BBy2qONODtRQVhuNe7ng0g_iaBVXRPz';
  var HEARTBEAT_MS = 60000;

  if (SUPABASE_URL.indexOf('__') === 0) return;      // nao configurado ainda
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return;

  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function uuid() {
    return (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
  }
  var sid = ss('t_sid'); if (!sid) { sid = uuid(); ss('t_sid', sid); }

  // ---- UTMs: URL > sessao > memoria de 7 dias
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  var q = new URLSearchParams(location.search), utm = {}, fresh = false;
  KEYS.forEach(function (k) { var v = q.get(k); if (v) { utm[k] = v.split('::')[0].slice(0, 100); fresh = true; } });
  var config = window.SUPERVIVENCIA_CONFIG || {};
  var fbclid = clickId(q.get('fbclid'));
  if (fbclid) {
    ss('t_fbclid', fbclid);
    ss('t_fbc', 'fb.1.' + Date.now() + '.' + fbclid);
  } else {
    fbclid = clickId(ss('t_fbclid'));
  }

  function clickId(value) {
    return /^[a-zA-Z0-9_-]{1,512}$/.test(value || '') ? value : null;
  }

  function cookie(name) {
    var prefix = name + '=';
    var entry = document.cookie.split('; ').find(function (part) { return part.startsWith(prefix); });
    return entry ? entry.slice(prefix.length) : null;
  }

  function metaIdentifiers() {
    var cookieFbc = cookie('_fbc');
    var fbc = /^fb\.\d+\.\d{13}\.[a-zA-Z0-9_-]{1,512}$/.test(cookieFbc || '') ? cookieFbc : null;
    if (fbclid && !fbc?.endsWith('.' + fbclid)) fbc = ss('t_fbc');
    var fbp = cookie('_fbp');
    return {
      fbc: fbc,
      fbp: /^fb\.\d+\.\d{13}\.\d{1,30}$/.test(fbp || '') ? fbp : null
    };
  }

  if (fresh) {
    ss('t_utm', JSON.stringify(utm));
    ls('t_utm_mem', JSON.stringify({ v: utm, exp: Date.now() + 7 * 864e5 }));
  } else {
    try { utm = JSON.parse(ss('t_utm') || 'null') || {}; } catch (e) { utm = {}; }
    if (!Object.keys(utm).length) {
      try { var m = JSON.parse(ls('t_utm_mem') || 'null'); if (m && m.exp > Date.now()) utm = m.v; } catch (e) {}
    }
  }

  function send(path, body, rpc) {
    try {
      fetch(SUPABASE_URL + (rpc ? '/rest/v1/rpc/' : '/rest/v1/') + path, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Prefer: 'return=minimal' },
        body: JSON.stringify(body)
      }).catch(function () {});
    } catch (e) {}
  }
  function event(name, step, meta) {
    send('events', { session_id: sid, name: name, step: step || null, utm_source: utm.utm_source || null,
      utm_campaign: utm.utm_campaign || null, utm_content: utm.utm_content || null, meta: meta || null });
  }

  // ---- visita (1x por sessao)
  if (!ss('t_visit')) {
    ss('t_visit', '1');
    send('visits', { session_id: sid, page_url: location.href.slice(0, 500), referrer: document.referrer || null,
      user_agent: navigator.userAgent, utm_source: utm.utm_source || null, utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null, utm_content: utm.utm_content || null, utm_term: utm.utm_term || null,
      utm_id: utm.utm_id || null, fbclid: fbclid ? fbclid.slice(0, 512) : null });
  }

  // ---- profundidade de scroll: marcos 25/50/75/100 (step = % atingido)
  var marks = [25, 50, 75, 100], hit = {}, maxPct = 0;
  function pct() {
    var d = document.documentElement, b = document.body;
    var scrollable = Math.max(d.scrollHeight, b.scrollHeight) - window.innerHeight;
    if (scrollable <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY || d.scrollTop) / scrollable * 100));
  }
  function checkScroll() {
    var p = pct(); if (p > maxPct) maxPct = p;
    marks.forEach(function (m) { if (p >= m && !hit[m]) { hit[m] = 1; event('scroll_depth', m); } });
  }
  var scrollTick = false;
  window.addEventListener('scroll', function () {
    if (scrollTick) return; scrollTick = true;
    setTimeout(function () { scrollTick = false; checkScroll(); }, 300);
  }, { passive: true });
  checkScroll();

  // ---- heartbeat "online agora" (step = maior % de scroll atingido)
  function ping() { if (!document.hidden) send('live_session_ping', { p_session_id: sid, p_step: maxPct, p_campaign: utm.utm_campaign || null }, true); }
  ping(); setInterval(ping, HEARTBEAT_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) ping(); });

  function initPixel() {
    if (!config.metaPixelId) return;
    if (!window.fbq) {
      var pixel = function () {
        if (pixel.callMethod) pixel.callMethod.apply(pixel, arguments);
        else pixel.queue.push(arguments);
      };
      pixel.push = pixel;
      pixel.loaded = true;
      pixel.version = '2.0';
      pixel.queue = [];
      window.fbq = pixel;
      window._fbq = pixel;
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
    window.fbq('set', 'autoConfig', false, config.metaPixelId);
    window.fbq('init', config.metaPixelId);
  }

  function metaEvent(name, checkout) {
    if (!config.metaPixelId) return;
    var id = uuid();
    var params = name === 'PageView' ? {} : {
      content_type: 'product',
      content_ids: ['61098992-7838-417f-ab8d-1786d5921083'],
      currency: 'USD',
      value: 9.90
    };
    var match = metaIdentifiers();
    window.fbq('trackSingle', config.metaPixelId, name, params, { eventID: id });
    if (!config.metaTrackingUrl) return;
    fetch(config.metaTrackingUrl, {
      method: 'POST', keepalive: true,
      // A simple cross-origin POST avoids a preflight during checkout navigation.
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({
        name: name, event_id: id, session_id: sid,
        source_url: location.origin + location.pathname,
        fbc: match.fbc, fbp: match.fbp,
        checkout: checkout || undefined
      })
    }).catch(function () {});
  }

  initPixel();
  metaEvent('PageView');
  metaEvent('ViewContent');

  function decorateCheckout(link, checkoutSession) {
    if (!link?.hasAttribute('data-checkout')) return;
    var url = new URL(link.href);
    if (url.origin !== 'https://pay.cakto.com.br') return;
    KEYS.forEach(function (key) { if (utm[key]) url.searchParams.set(key, utm[key]); });
    var match = metaIdentifiers();
    if (fbclid) url.searchParams.set('fbclid', fbclid);
    if (match.fbc) url.searchParams.set('fbc', match.fbc);
    if (match.fbp) url.searchParams.set('fbp', match.fbp);
    url.searchParams.set('sck', checkoutSession);
    link.href = url.href;
    return url;
  }

  document.querySelectorAll('a[data-checkout]').forEach(function (link) {
    decorateCheckout(link, sid);
  });
  function onCheckout(eventObject) {
    if (eventObject.defaultPrevented || eventObject.button > 1) return;
    var link = eventObject.target?.closest?.('a[data-checkout]');
    var checkout = decorateCheckout(link, sid);
    if (!checkout) return;
    event('checkout_click', maxPct);
    metaEvent('InitiateCheckout', { utm: utm, fbclid: fbclid });
  }
  document.addEventListener('click', onCheckout, true);
  document.addEventListener('auxclick', onCheckout, true);
})();
