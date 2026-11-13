/* Tracking proprio via Supabase. Configure SUPABASE_URL e SUPABASE_ANON_KEY abaixo. */
(function () {
  var SUPABASE_URL = 'https://viphjxuewsfksudbmzhk.supabase.co';      // https://xxxx.supabase.co
  var SUPABASE_ANON_KEY = 'sb_publishable_jIQuHVoPprDCgKDhEMnYQw_XHg40n_i';
  var CHECKOUT_MATCH = 'pay.cakto.com.br';
  var HEARTBEAT_MS = 60000;
  
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
  var fbclid = q.get('fbclid');
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

  // ---- etapa do quiz: deduzida da barra de progresso (largura = (etapa-1)/28)
  var step = 1, lastSent = 0;
  function readStep() {
    var bar = document.querySelector('.progress-bar-fill');
    if (!bar) return step === 1 || step === 29 ? step : 1;
    var w = parseFloat(bar.style.width) || 0;
    return Math.round(w * 28 / 100) + 1;
  }
  function checkStep() {
    var s = readStep(); step = s;
    if (s !== lastSent) { lastSent = s; event('quiz_step', s); }
  }
  var root = document.getElementById('root');
  if (root) new MutationObserver(function () { checkStep(); }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  checkStep();

  // ---- heartbeat "online agora"
  function ping() { if (!document.hidden) send('live_session_ping', { p_session_id: sid, p_step: step, p_campaign: utm.utm_campaign || null }, true); }
  ping(); setInterval(ping, HEARTBEAT_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) ping(); });

  // ---- clique no checkout: registra e repassa UTMs para a Cakto
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.href.indexOf(CHECKOUT_MATCH) < 0) return;
    try {
      var u = new URL(a.href);
      KEYS.forEach(function (k) { if (utm[k]) u.searchParams.set(k, utm[k]); });
      u.searchParams.set('sck', sid);
      a.href = u.toString();
    } catch (err) {}
    event('checkout_click', step);
  }, true);

  // modal de saida (botao navega por JS, nao e <a>)
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest;
    if (!t) return;
    if (e.target.closest('#downsell-modal-accept')) event('downsell_accept', step);
    else if (e.target.closest('#downsell-modal-dismiss')) event('downsell_dismiss', step);
  }, true);
  var dm = document.getElementById('downsell-exit-modal');
  if (dm) new MutationObserver(function () { if (dm.style.display === 'flex') event('downsell_shown', step); }).observe(dm, { attributes: true, attributeFilter: ['style'] });
})();
