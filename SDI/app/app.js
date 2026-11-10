/* App — login (gate de demo) + navegación + render de contenido.
   ⚠️ El login es un gate de front-end para demo. Para producción, conectá
   la autenticación real a tu backend (Supabase Auth): reemplazá checkLogin()
   por una llamada a tu API y guardá el token de sesión. */
(function () {
  var C = window.FUNNEL_CONFIG || {};
  var D = window.APP_DATA || {};
  var DEMO_PASS = "secreto21";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var loginSec = $('#login'), appSec = $('#app'), views = $('#views');

  // WhatsApp de soporte
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = C.whatsappSoporte || '#'; });

  function session() { try { return JSON.parse(localStorage.getItem('sdi_session') || 'null'); } catch (e) { return null; } }
  function setSession(s) { try { localStorage.setItem('sdi_session', JSON.stringify(s)); } catch (e) {} }
  function clearSession() { try { localStorage.removeItem('sdi_session'); } catch (e) {} }

  function showApp() { loginSec.classList.add('hidden'); appSec.classList.remove('hidden'); render('inicio'); }
  function showLogin() { appSec.classList.add('hidden'); loginSec.classList.remove('hidden'); }

  // ---- Login ----
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#email').value.trim(), pass = $('#password').value;
    if (pass === DEMO_PASS && email) {
      setSession({ email: email, start: session() && session().start ? session().start : Date.now() });
      showApp();
    } else {
      $('#loginError').classList.remove('hidden');
    }
  });
  $('#logout').addEventListener('click', function () { clearSession(); showLogin(); });

  // ---- Navegación ----
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      render(t.getAttribute('data-view'));
    });
  });

  function dayNumber() {
    var s = session();
    if (!s || !s.start) return 1;
    var d = Math.floor((Date.now() - s.start) / 86400000) + 1;
    return Math.max(1, Math.min(21, d));
  }

  // ---- Render de vistas ----
  function render(view) {
    views.scrollTop = 0; window.scrollTo(0, 0);
    views.innerHTML = ({ inicio: vInicio, mezcla: vMezcla, plan: vPlan, bonos: vBonos, soporte: vSoporte }[view] || vInicio)();
  }

  function vInicio() {
    var n = dayNumber(), pct = Math.round((n / 21) * 100);
    var email = (session() && session().email) || '';
    var nombre = email ? email.split('@')[0] : '';
    return '<div class="view">' +
      '<div class="hero-card"><span class="pill">TU PLAN</span>' +
      '<h2>¡Hola' + (nombre ? ', ' + nombre : '') + '!</h2>' +
      '<p>Estás en el día ' + n + ' de 21. Seguí el paso de hoy.</p>' +
      '<div class="progress-ring"><div class="ring" style="--p:' + pct + '"><b>' + pct + '%</b></div>' +
      '<div><div style="font-weight:700">Día ' + n + ' de 21</div><div class="muted">' + D.plan21[Math.floor((n-1)/7)].dias[(n-1)%7][1] + '</div></div></div></div>' +
      '<h3 class="sec">🥤 Tu paso de hoy</h3>' +
      '<div class="card"><h4>' + D.mezcla.titulo + '</h4><p class="muted">' + D.mezcla.intro + '</p>' +
      '<a class="cta" href="#" data-goto="mezcla">Ver la receta</a></div>' +
      '<h3 class="sec">🎁 Tus bonos</h3>' +
      '<div class="card"><ul><li>20 licuados para bajar de peso</li><li>40 postres que aceleran el metabolismo</li><li>Tips para acelerar resultados</li></ul>' +
      '<a class="cta green" href="#" data-goto="bonos">Abrir bonos</a></div>' +
      '</div>';
  }

  function vMezcla() {
    var m = D.mezcla;
    return '<div class="view"><span class="pill">RECETA PRINCIPAL</span><h3 class="sec">🥤 ' + m.titulo + '</h3>' +
      '<div class="card"><p class="muted">' + m.intro + '</p>' +
      '<h4>Ingredientes</h4><ul>' + m.ingredientes.map(li).join('') + '</ul>' +
      '<h4 style="margin-top:14px">Preparación</h4><ol style="padding-left:18px">' + m.preparacion.map(li).join('') + '</ol>' +
      '<p class="muted" style="margin-top:12px">💡 ' + m.nota + '</p></div></div>';
  }

  function vPlan() {
    var html = '<div class="view"><span class="pill">RUTINA</span><h3 class="sec">📅 Plan de 21 días</h3>';
    D.plan21.forEach(function (w) {
      html += '<div class="week-label">' + w.s + '</div>';
      w.dias.forEach(function (d) {
        html += '<div class="day"><div class="n">' + d[0] + '</div><div><p class="t">' + d[1] + '</p><p class="d">' + d[2] + '</p></div></div>';
      });
    });
    html += '<h3 class="sec">⭐ ' + D.dia22.titulo + '</h3><div class="card"><p>' + D.dia22.texto + '</p></div></div>';
    return html;
  }

  function vBonos() {
    function recetas(arr) { return arr.map(function (r) {
      return '<details class="recipe"><summary>' + r[0] + '</summary><div class="body"><p class="muted">' + r[1] + '</p></div></details>';
    }).join(''); }
    return '<div class="view"><span class="pill">BONOS</span>' +
      '<h3 class="sec">💧 20 licuados para bajar de peso</h3>' + recetas(D.licuados) +
      '<h3 class="sec">🍰 40 postres que aceleran el metabolismo</h3>' + recetas(D.postres) +
      '<h3 class="sec">⚡ Tips para acelerar</h3><div class="card"><ul>' + D.tips.map(li).join('') + '</ul></div>' +
      '<p class="muted" style="font-size:.8rem;text-align:center;margin-top:10px">Mostramos una muestra. Cargá aquí el set completo de recetas.</p></div>';
  }

  function vSoporte() {
    return '<div class="view"><span class="pill">SOPORTE</span><h3 class="sec">💬 ¿Necesitas ayuda?</h3>' +
      '<div class="card"><p>Escríbenos y te respondemos en minutos.</p>' +
      '<a class="cta green" data-wa href="#">Hablar por WhatsApp</a></div>' +
      '<div class="card"><h4>Guárdala en tu celular</h4><p class="muted">Agregá esta app a la pantalla de inicio para abrirla con un toque: menú del navegador → “Agregar a inicio”.</p></div></div>';
  }

  function li(x) { return '<li>' + x + '</li>'; }

  // Delegación: botones [data-goto] y [data-wa] inyectados
  views.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); var v = g.getAttribute('data-goto');
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-view') === v); });
      render(v); return; }
    var w = e.target.closest('[data-wa]');
    if (w) { w.href = C.whatsappSoporte || '#'; }
  });

  // Auto-login si hay sesión
  if (session()) showApp();
})();
