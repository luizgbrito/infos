/* App — login (gate de demo) + navegación + render de contenido. Sin emojis: íconos SVG.
   ⚠️ El login es un gate de front-end para demo. En producción, la validación real
   la hace tu backend: Cakto (webhook de compra) → base de datos → email de acceso
   por Resend. Reemplazá checkLogin() por una llamada a tu API /auth que valide
   contra esa base. Ver backend/README en el repo. */
(function () {
  var C = window.FUNNEL_CONFIG || {};
  var D = window.APP_DATA || {};
  var I = window.ICON;
  var DEMO_PASS = "secreto21";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var loginSec = $('#login'), appSec = $('#app'), views = $('#views'), tabbar = $('#tabbar');

  var TABS = [
    { v: 'inicio', t: 'Inicio', i: 'home' },
    { v: 'mezcla', t: 'La Mezcla', i: 'cup' },
    { v: 'plan', t: '21 días', i: 'calendar' },
    { v: 'bonos', t: 'Bonos', i: 'gift' },
    { v: 'soporte', t: 'Soporte', i: 'chat' }
  ];

  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = C.whatsappSoporte || '#'; });

  function session() { try { return JSON.parse(localStorage.getItem('sdi_session') || 'null'); } catch (e) { return null; } }
  function setSession(s) { try { localStorage.setItem('sdi_session', JSON.stringify(s)); } catch (e) {} }
  function clearSession() { try { localStorage.removeItem('sdi_session'); } catch (e) {} }

  function buildTabs() {
    tabbar.innerHTML = TABS.map(function (t, k) {
      return '<button class="tab' + (k === 0 ? ' active' : '') + '" data-view="' + t.v + '">' + I(t.i, 22) + '<span class="lbl">' + t.t + '</span></button>';
    }).join('');
    tabbar.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        tabbar.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        render(b.getAttribute('data-view'));
      });
    });
  }
  function selectTab(v) {
    tabbar.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-view') === v); });
  }

  function showApp() { loginSec.classList.add('hidden'); appSec.classList.remove('hidden'); buildTabs(); render('inicio'); }
  function showLogin() { appSec.classList.add('hidden'); loginSec.classList.remove('hidden'); }

  // ---- Login ----
  // Si FUNNEL_CONFIG.authApi está seteado, valida contra tu backend (compra Cakto en la base).
  // Si no, usa el gate demo (contraseña secreto21) para pruebas.
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#email').value.trim(), pass = $('#password').value;
    var btn = $('#loginBtn'); $('#loginError').classList.add('hidden');
    function grant() { var p = session(); setSession({ email: email, start: p && p.start ? p.start : Date.now() }); showApp(); }
    function deny() { $('#loginError').classList.remove('hidden'); btn.disabled = false; btn.textContent = 'Entrar'; }

    if (C.authApi) {
      btn.disabled = true; btn.textContent = 'Verificando...';
      fetch(C.authApi.replace(/\/$/, '') + '/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, code: pass })
      }).then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok) grant(); else deny(); })
        .catch(deny);
      return;
    }
    if (pass === DEMO_PASS && email) grant(); else deny();
  });
  $('#logout').addEventListener('click', function () { clearSession(); showLogin(); });

  function dayNumber() {
    var s = session();
    if (!s || !s.start) return 1;
    return Math.max(1, Math.min(21, Math.floor((Date.now() - s.start) / 86400000) + 1));
  }

  function sec(icon, text) { return '<h3 class="sec">' + I(icon, 20) + '<span>' + text + '</span></h3>'; }

  function render(view) {
    views.scrollTop = 0; window.scrollTo(0, 0);
    views.innerHTML = ({ inicio: vInicio, mezcla: vMezcla, plan: vPlan, bonos: vBonos, soporte: vSoporte }[view] || vInicio)();
  }

  function vInicio() {
    var n = dayNumber(), pct = Math.round((n / 21) * 100);
    var email = (session() && session().email) || '', nombre = email ? email.split('@')[0] : '';
    var hoy = D.plan21[Math.floor((n - 1) / 7)].dias[(n - 1) % 7][1];
    return '<div class="view">' +
      '<div class="hero-card"><span class="pill">TU PLAN</span>' +
      '<h2>¡Hola' + (nombre ? ', ' + nombre : '') + '!</h2>' +
      '<p>Estás en el día ' + n + ' de 21. Seguí el paso de hoy.</p>' +
      '<div class="progress-ring"><div class="ring" style="--p:' + pct + '"><b>' + pct + '%</b></div>' +
      '<div><div class="ring-d">Día ' + n + ' de 21</div><div class="muted">' + hoy + '</div></div></div></div>' +
      sec('cup', 'Tu paso de hoy') +
      '<div class="card"><h4>' + D.mezcla.titulo + '</h4><p class="muted">' + D.mezcla.intro + '</p>' +
      '<a class="cta" href="#" data-goto="mezcla">Ver la receta</a></div>' +
      sec('gift', 'Tus bonos') +
      '<div class="card"><ul class="plain">' +
      '<li>' + I('droplet', 18) + ' 20 licuados para bajar de peso</li>' +
      '<li>' + I('cake', 18) + ' 40 postres que aceleran el metabolismo</li>' +
      '<li>' + I('bolt', 18) + ' Tips para acelerar resultados</li></ul>' +
      '<a class="cta green" href="#" data-goto="bonos">Abrir bonos</a></div></div>';
  }

  function vMezcla() {
    var m = D.mezcla;
    return '<div class="view"><span class="pill">RECETA PRINCIPAL</span>' + sec('cup', m.titulo) +
      '<div class="card"><p class="muted">' + m.intro + '</p>' +
      '<h4>Ingredientes</h4><ul>' + m.ingredientes.map(li).join('') + '</ul>' +
      '<h4 style="margin-top:14px">Preparación</h4><ol class="steps">' + m.preparacion.map(li).join('') + '</ol>' +
      '<p class="muted note">' + m.nota + '</p></div></div>';
  }

  function vPlan() {
    var html = '<div class="view"><span class="pill">RUTINA</span>' + sec('calendar', 'Plan de 21 días');
    D.plan21.forEach(function (w) {
      html += '<div class="week-label">' + w.s + '</div>';
      w.dias.forEach(function (d) {
        html += '<div class="day"><div class="n">' + d[0] + '</div><div><p class="t">' + d[1] + '</p><p class="d">' + d[2] + '</p></div></div>';
      });
    });
    html += sec('star', D.dia22.titulo) + '<div class="card"><p>' + D.dia22.texto + '</p></div></div>';
    return html;
  }

  function vBonos() {
    function recetas(arr) { return arr.map(function (r) {
      return '<details class="recipe"><summary>' + r[0] + '</summary><div class="body"><p class="muted">' + r[1] + '</p></div></details>';
    }).join(''); }
    return '<div class="view"><span class="pill">BONOS</span>' +
      sec('droplet', '20 licuados para bajar de peso') + recetas(D.licuados) +
      sec('cake', '40 postres que aceleran el metabolismo') + recetas(D.postres) +
      sec('bolt', 'Tips para acelerar') + '<div class="card"><ul>' + D.tips.map(li).join('') + '</ul></div>' +
      '<p class="muted mini">Mostramos una muestra. Cargá aquí el set completo de recetas.</p></div>';
  }

  function vSoporte() {
    return '<div class="view"><span class="pill">SOPORTE</span>' + sec('chat', '¿Necesitas ayuda?') +
      '<div class="card"><p>Escríbenos y te respondemos en minutos.</p>' +
      '<a class="cta green" data-wa href="#">' + I('phone', 18) + ' Hablar por WhatsApp</a></div>' +
      '<div class="card"><h4>Guárdala en tu celular</h4><p class="muted">Agregá esta app a la pantalla de inicio para abrirla con un toque: menú del navegador, “Agregar a inicio”.</p></div></div>';
  }

  function li(x) { return '<li>' + x + '</li>'; }

  views.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); var v = g.getAttribute('data-goto'); selectTab(v); render(v); return; }
    var w = e.target.closest('[data-wa]');
    if (w) { w.href = C.whatsappSoporte || '#'; }
  });

  if (session()) showApp();
})();
