/* =====================================================================
   MOTOR DEL QUIZ — El Secreto de la Insulina
   Data-driven: cada pantalla es un objeto. Las respuestas alimentan
   el IMC, la proyección y las alertas condicionales.
   ===================================================================== */
(function () {
  var C = window.FUNNEL_CONFIG || {};
  var MEC = C.mecanismo || "El Secreto de la Insulina";
  var A = {}; // respuestas: {clave: valor}

  var screenEl = document.getElementById('screen');
  var ctaEl = document.getElementById('cta');
  var ctaBtn = document.getElementById('ctaBtn');
  var backEl = document.getElementById('back');
  var barEl = document.getElementById('bar');

  var idx = 0;

  /* ---------------------------------------------------------------
     DEFINICIÓN DE PANTALLAS
     tipo: single | multi | interrupt | name | slider | special
  --------------------------------------------------------------- */
  var S = [
    { tipo: 'single', key: 'edad', q: '¿Qué edad tienes?', opts: [
      ['🌸', '18 a 27 años', '18-27'], ['💐', '28 a 39 años', '28-39'],
      ['🌺', '40 a 54 años', '40-54'], ['🌷', '55 años o más', '55+']
    ]},
    { tipo: 'single', key: 'autoimagen', q: '¿Cómo sientes tu cuerpo hoy?', opts: [
      ['', 'Normal', 'normal'], ['', 'Con algunos kilos de más', 'pocos'],
      ['', 'Con sobrepeso', 'sobrepeso'], ['', 'Con bastante sobrepeso', 'mucho']
    ]},
    { tipo: 'multi', key: 'zonas', q: '¿En qué parte sientes más el cambio en tu cuerpo?', hint: 'Marca todas las que apliquen', opts: [
      ['😊', 'Papada', 'papada'], ['💪', 'Brazos', 'brazos'], ['🫃', 'Abdomen', 'abdomen'],
      ['💝', 'Cintura', 'cintura'], ['🍑', 'Glúteos', 'gluteos'], ['🦵', 'Piernas', 'piernas'],
      ['✨', 'Todo el cuerpo', 'todo']
    ]},
    { tipo: 'interrupt', title: '🤝 No estás sola.',
      body: '<b>87,4%</b> de las mujeres de más de 40 años reportan acumulación de grasa en el abdomen y en la papada aunque no coman de más.',
      btn: 'Entendido, quiero continuar' },
    { tipo: 'single', key: 'historico', q: '¿Ya intentaste bajar de peso antes?', opts: [
      ['😞', 'Sí, varias veces. Bajo y enseguida lo recupero', 'recupero'],
      ['😶', 'Sí, pero nunca logro mantenerlo', 'no_mantengo'],
      ['✨', 'Lo estoy intentando en serio por primera vez', 'primera'],
      ['😩', 'Ya probé de todo y nada funcionó', 'todo']
    ]},
    { tipo: 'multi', key: 'obstaculos', q: '¿Qué es lo que más te frena para bajar de peso hoy?', hint: 'Marca todas las que apliquen', opts: [
      ['💸', 'Ya gasté dinero y no tuve resultados', 'gaste'],
      ['💰', 'No puedo pagar el Ozempic', 'ozempic'],
      ['📉', 'Empiezo y no logro sostenerlo', 'sostener'],
      ['🍫', 'Me da hambre y termino cayendo', 'hambre'],
      ['⏰', 'No tengo tiempo para dietas', 'tiempo']
    ]},
    { tipo: 'interrupt', title: '💉 El Ozempic no es la única salida',
      body: 'La pluma de Ozempic cuesta más de <b>' + (C.precios ? C.precios.ozempic : '$900') + '</b> al mes y deja de funcionar cuando dejas de usarla.<br><br>' +
            '<span class="hl">' + MEC + '</span> hace lo mismo por menos de <b>' + (C.precios ? C.precios.insumo : '$1') + '</b> en el supermercado.<br><br>' +
            'Sin ingredientes caros. Sin farmacia. Solo la licuadora.',
      btn: 'Continuar' },
    { tipo: 'name', q: '¿Cómo te llamas?', btn: 'Continuar' },
    { tipo: 'multi', key: 'objetivos', q: '¿Qué quieres lograr?', hint: 'Marca todas las que apliquen', opts: [
      ['❤️', 'Mejorar mi salud', 'salud'], ['⚖️', 'Bajar de peso de verdad', 'peso'],
      ['💧', 'Desinflamarme en la primera semana', 'desinflamar'],
      ['⚡', 'Tener más energía en el día a día', 'energia'],
      ['🌸', 'Sentirme bien conmigo misma', 'autoestima']
    ]},
    { tipo: 'single', key: 'digestivo', q: '¿Tienes inflamación, abdomen duro o digestión lenta con frecuencia?', opts: [
      ['😣', 'Sí, casi todos los días me siento inflamada', 'si'],
      ['😐', 'A veces, sobre todo en la noche', 'aveces'],
      ['😊', 'Casi nunca', 'casi_nunca']
    ]},
    { tipo: 'slider', key: 'pesoActual', q: '¿Cuál es tu peso actual?', unit: 'kg', min: 45, max: 150, def: 75 },
    { tipo: 'slider', key: 'estatura', q: '¿Cuál es tu estatura?', unit: 'cm', min: 140, max: 195, def: 165 },
    { tipo: 'slider', key: 'pesoDeseado', q: '¿Cuál es tu peso deseado?', unit: 'kg', min: 45, max: 130, def: 65, meta: true },
    { tipo: 'single', key: 'rutina', q: '¿Cómo es tu rutina diaria?', opts: [
      ['🏢', 'Trabajo fuera de casa', 'fuera'], ['🏠', 'Trabajo desde casa', 'casa'],
      ['👨‍👩‍👧', 'Me ocupo de la casa y la familia', 'familia'],
      ['🏃‍♀️', 'Tengo una rutina muy agitada e irregular', 'agitada']
    ]},
    { tipo: 'single', key: 'sueno', q: '¿Cuántas horas duermes por noche?', opts: [
      ['😴', 'Menos de 5 horas', 'menos5'], ['🌙', 'De 5 a 7 horas', '5-7'],
      ['😊', 'De 7 a 9 horas', '7-9'], ['💤', 'Más de 9 horas', 'mas9']
    ]},
    { tipo: 'projection' },
    { tipo: 'processing' },
    { tipo: 'result' },
    { tipo: 'testimonials' },
    { tipo: 'plangen' }
  ];

  /* --------------------------- Helpers --------------------------- */
  function setProgress() {
    var p = Math.min(100, Math.round((idx / (S.length - 1)) * 100));
    barEl.style.width = p + '%';
  }
  function showCta(label, onClick) {
    ctaBtn.textContent = label;
    ctaEl.classList.remove('hidden');
    ctaBtn.onclick = onClick;
  }
  function hideCta() { ctaEl.classList.add('hidden'); ctaBtn.onclick = null; }
  function next() { idx++; if (idx >= S.length) return finish(); render(); }
  function prev() { if (idx > 0) { idx--; render(); } }
  function bmi() {
    var w = +A.pesoActual || 75, h = (+A.estatura || 165) / 100;
    return w / (h * h);
  }
  function bmiClass(v) {
    if (v < 18.5) return 'Bajo peso';
    if (v < 25) return 'Normal';
    if (v < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  /* --------------------------- Render --------------------------- */
  function render() {
    setProgress();
    backEl.style.visibility = idx === 0 ? 'hidden' : 'visible';
    var s = S[idx];
    hideCta();
    screenEl.innerHTML = '';
    window.scrollTo(0, 0);
    ({
      single: rSingle, multi: rMulti, interrupt: rInterrupt, name: rName,
      slider: rSlider, projection: rProjection, processing: rProcessing,
      result: rResult, testimonials: rTesti, plangen: rPlangen
    })[s.tipo](s);
  }

  function optionsHTML(opts, selected) {
    selected = selected || [];
    return '<div class="options">' + opts.map(function (o, i) {
      var sel = selected.indexOf(o[2]) >= 0 ? ' selected' : '';
      return '<button class="opt' + sel + '" data-v="' + o[2] + '" data-i="' + i + '">' +
        (o[0] ? '<span class="em">' + o[0] + '</span>' : '') +
        '<span>' + o[1] + '</span></button>';
    }).join('') + '</div>';
  }

  function rSingle(s) {
    screenEl.innerHTML = '<div class="screen"><h2>' + s.q + '</h2>' + optionsHTML(s.opts) + '</div>';
    screenEl.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () { A[s.key] = b.getAttribute('data-v'); next(); };
    });
  }

  function rMulti(s) {
    var cur = A[s.key] || [];
    screenEl.innerHTML = '<div class="screen"><h2>' + s.q + '</h2>' +
      (s.hint ? '<p class="q-hint">' + s.hint + '</p>' : '') + optionsHTML(s.opts, cur) + '</div>';
    screenEl.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var v = b.getAttribute('data-v'), arr = A[s.key] || [];
        var k = arr.indexOf(v);
        if (k >= 0) { arr.splice(k, 1); b.classList.remove('selected'); }
        else { arr.push(v); b.classList.add('selected'); }
        A[s.key] = arr;
        ctaBtn.disabled = arr.length === 0;
        ctaBtn.style.opacity = arr.length === 0 ? '.5' : '1';
      };
    });
    showCta('Continuar', function () { if ((A[s.key] || []).length) next(); });
    ctaBtn.disabled = cur.length === 0;
    ctaBtn.style.opacity = cur.length === 0 ? '.5' : '1';
  }

  function rInterrupt(s) {
    screenEl.innerHTML = '<div class="screen"><div class="interrupt reveal in">' +
      '<p class="big">' + s.title + '</p><p>' + s.body + '</p></div></div>';
    showCta(s.btn, next);
  }

  function rName(s) {
    screenEl.innerHTML = '<div class="screen"><h2>' + s.q + '</h2>' +
      '<input class="field" id="nameField" type="text" autocomplete="given-name" placeholder="Tu nombre" value="' + (A.nombre || '') + '"></div>';
    var f = document.getElementById('nameField');
    setTimeout(function () { f.focus(); }, 60);
    function valid() { return f.value.trim().length >= 2; }
    function save() {
      A.nombre = f.value.trim();
      try { localStorage.setItem('fn_nombre', A.nombre); } catch (e) {}
    }
    function sync() { ctaBtn.disabled = !valid(); ctaBtn.style.opacity = valid() ? '1' : '.5'; }
    function go() { if (!valid()) { f.focus(); return; } save(); next(); }
    f.addEventListener('input', function () { save(); sync(); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    showCta(s.btn, go);
    sync();
  }

  function rSlider(s) {
    A[s.key] = A[s.key] || s.def;
    screenEl.innerHTML = '<div class="screen"><h2>' + s.q + '</h2>' +
      '<div class="slider-val"><span id="sv">' + A[s.key] + '</span> <small>' + s.unit + '</small></div>' +
      '<input class="range" type="range" id="rg" min="' + s.min + '" max="' + s.max + '" value="' + A[s.key] + '">' +
      (s.meta ? '<div class="meta-live" id="metaLive"></div>' : '') + '</div>';
    var rg = document.getElementById('rg'), sv = document.getElementById('sv');
    function upd() {
      A[s.key] = +rg.value; sv.textContent = rg.value;
      if (s.meta) {
        var diff = (+A.pesoActual || 75) - (+A.pesoDeseado || rg.value);
        var ml = document.getElementById('metaLive');
        ml.textContent = diff > 0 ? ('Meta: bajar ' + Math.round(diff) + ' kg 🎯') : '¡Vamos por tu mejor versión! 🎯';
      }
    }
    rg.addEventListener('input', upd); upd();
    showCta('Continuar', next);
  }

  function rProjection() {
    var hoy = +A.pesoActual || 75, meta = +A.pesoDeseado || 65;
    if (meta >= hoy) meta = hoy - 8;
    var mejor = meta - 2, diff = hoy - mejor;
    var nombre = A.nombre || '';
    var maxH = 150;
    function h(v) { return Math.max(40, Math.round((v / hoy) * maxH)); }
    screenEl.innerHTML = '<div class="screen center">' +
      '<h2>' + (nombre ? nombre + ', ¡' : '¡') + 'ese objetivo es totalmente alcanzable!</h2>' +
      '<p class="q-hint">' + hoy + ' kg hoy → ' + meta + ' kg tu meta</p>' +
      '<div class="section-label">PROYECCIÓN DE RESULTADO</div>' +
      '<div class="chart">' +
        '<div class="bar" style="height:' + h(hoy) + 'px"><span>' + hoy + ' kg</span><small>hoy</small></div>' +
        '<div class="bar meta" style="height:' + h(meta) + 'px"><span>' + meta + ' kg</span><small>meta</small></div>' +
        '<div class="bar meta" style="height:' + h(mejor) + 'px"><span>' + mejor + ' kg</span><small>potencial</small></div>' +
      '</div>' +
      '<div class="meta-live" style="margin-top:28px">🔥 Con el método correcto, puedes llegar hasta <b>' + mejor + ' kg</b>, son ' + diff + ' kg menos.</div>' +
      '</div>';
    showCta('¡VAMOS!', next);
  }

  function rProcessing() {
    var nombre = A.nombre || '';
    screenEl.innerHTML = '<div class="screen">' +
      '<p class="proc-title">🧠 Preparando tu análisis' + (nombre ? ', ' + nombre : '') + '...</p>' +
      '<p class="proc-sub">Nuestro sistema está procesando tus datos</p>' +
      '<div class="proc-bar"><i id="pb"></i></div><div class="proc-pct" id="pp">0%</div>' +
      '<ul class="proc-list">' +
      '<li data-at="20"><span class="state"></span> ⚖️ Calculando rango de peso</li>' +
      '<li data-at="45"><span class="state"></span> 🎂 Evaluando edad</li>' +
      '<li data-at="70"><span class="state"></span> 🔍 Analizando alertas</li>' +
      '<li data-at="95"><span class="state"></span> ✨ Mapeando beneficios</li>' +
      '</ul></div>';
    var pb = document.getElementById('pb'), pp = document.getElementById('pp');
    var items = screenEl.querySelectorAll('.proc-list li');
    var p = 0;
    var iv = setInterval(function () {
      p += 2; if (p > 100) p = 100;
      pb.style.width = p + '%'; pp.textContent = p + '%';
      items.forEach(function (li) { if (p >= +li.getAttribute('data-at')) li.classList.add('on'); });
      if (p >= 100) { clearInterval(iv); setTimeout(next, 500); }
    }, 150);
  }

  /* Alertas condicionales (biblioteca). Se eligen hasta 4. */
  function buildAlerts() {
    var out = [], ob = A.obstaculos || [], z = A.zonas || [];
    if (ob.indexOf('ozempic') >= 0) out.push('🌿 GLP-1 desregulado. Lo que la pluma de ' + (C.precios ? C.precios.ozempic : '$900') + ' trata, ' + MEC + ' lo hace por ' + (C.precios ? C.precios.insumo : '$1') + '.');
    if (A.historico === 'recupero') out.push('🌿 Resistencia al adelgazamiento identificada. Tu cuerpo se adaptó y ' + MEC + ' cambia eso.');
    if (A.digestivo === 'si') out.push('🌿 Inflamación intestinal identificada. ' + MEC + ' empieza a actuar en la primera semana.');
    if (z.indexOf('abdomen') >= 0) out.push('🌿 Acumulación de grasa abdominal identificada. Es exactamente lo que ' + MEC + ' ataca.');
    if (A.rutina === 'agitada') out.push('🌿 Cortisol elevado identificado. ' + MEC + ' actúa sobre la hormona que acumula grasa en el abdomen.');
    if (A.sueno === 'menos5') out.push('🌿 Sueño insuficiente frenando tu metabolismo. ' + MEC + ' actúa sobre ese ciclo.');
    // Rellena hasta 4 con alertas genéricas (4 es el número óptimo; más diluye).
    var pool = [
      '🌿 Metabolismo desregulado identificado. ' + MEC + ' recalibra la señal de saciedad.',
      '🌿 Hormona de la saciedad fuera de sincronía. Es lo que ' + MEC + ' trabaja.',
      '🌿 Resistencia a perder grasa abdominal identificada. ' + MEC + ' la ataca directo.',
      '🌿 Retención de líquidos identificada. ' + MEC + ' actúa desde la primera semana.'
    ];
    for (var i = 0; i < pool.length && out.length < 4; i++) {
      if (out.indexOf(pool[i]) < 0) out.push(pool[i]);
    }
    return out.slice(0, 4);
  }

  function rResult() {
    var nombre = A.nombre || '', v = bmi(), cls = bmiClass(v);
    var alerts = buildAlerts();
    screenEl.innerHTML = '<div class="screen">' +
      '<h2>' + (nombre ? nombre + ', tu' : 'Tu') + ' análisis está listo.</h2>' +
      '<div class="result-card">' +
        '<span class="imc-badge">' + v.toFixed(1) + ' · Tu IMC: ' + cls + '</span>' +
        '<p class="section-label" style="color:#a52121;margin-top:16px">⚠️ Señales de alerta identificadas:</p>' +
        '<ul class="alerts">' + alerts.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>' +
        '<p class="section-label">Beneficios de ' + MEC + ' 👇</p>' +
        '<ul class="benefits">' +
          '<li>✅ Metabolismo reactivado</li>' +
          '<li>✅ Abdomen desinflamado en los primeros días</li>' +
          '<li>✅ Hambre controlada sin medicamentos</li>' +
          '<li>✅ Más energía y salud</li>' +
          '<li>✅ Sin efecto rebote</li>' +
          '<li>✅ Postres que no frenan el resultado</li>' +
        '</ul>' +
      '</div></div>';
    showCta('Continuar', next);
  }

  function rTesti() {
    var items = [
      ['-9 kg', 'Bajé 9 kilos en 21 días. Tuve que regalar varios pantalones.', 'María, 47 años'],
      ['-7 kg', 'Mi presión se normalizó y el médico me bajó la dosis.', 'Rosana, 52 años'],
      ['-11 kg', 'Me miré al espejo y volví a reconocerme.', 'Fernanda, 43 años'],
      ['-8 kg', 'Recuperé la energía para cuidar a mis hijos.', 'Claudia, 36 años']
    ];
    screenEl.innerHTML = '<div class="screen"><h2>Mira quiénes ya transformaron su cuerpo con ' + MEC + '</h2>' +
      items.map(function (t) {
        return '<div class="testi reveal in"><span class="kg">' + t[0] + '</span>' +
          '<p>"' + t[1] + '"</p><div class="who">— ' + t[2] + ' <span class="stars">★★★★★</span></div></div>';
      }).join('') + '</div>';
    showCta('Quiero esa transformación', next);
  }

  function rPlangen() {
    screenEl.innerHTML = '<div class="screen">' +
      '<p class="proc-title">✨ ¡Tu rutina de 21 días de ' + MEC + ' está lista!</p>' +
      '<div class="proc-bar"><i id="pb2"></i></div><div class="proc-pct" id="pp2">0%</div>' +
      '<ul class="proc-list">' +
      '<li data-at="20"><span class="state"></span> Armando tu rutina de 21 días</li>' +
      '<li data-at="45"><span class="state"></span> Personalizando tu ' + MEC + '</li>' +
      '<li data-at="70"><span class="state"></span> Calculando ingredientes y recetas</li>' +
      '<li data-at="88"><span class="state"></span> Preparando tus bonos exclusivos</li>' +
      '<li data-at="100"><span class="state"></span> Rutina lista</li>' +
      '</ul></div>';
    var pb = document.getElementById('pb2'), pp = document.getElementById('pp2');
    var items = screenEl.querySelectorAll('.proc-list li');
    var p = 0;
    var iv = setInterval(function () {
      p += 3; if (p > 100) p = 100;
      pb.style.width = p + '%'; pp.textContent = p + '%';
      items.forEach(function (li) { if (p >= +li.getAttribute('data-at')) li.classList.add('on'); });
      if (p >= 100) { clearInterval(iv); setTimeout(finish, 600); }
    }, 130);
    hideCta();
  }

  function finish() {
    try {
      localStorage.setItem('fn_data', JSON.stringify({
        nombre: A.nombre || '', pesoActual: A.pesoActual, pesoDeseado: A.pesoDeseado,
        edad: A.edad, imc: bmi().toFixed(1)
      }));
    } catch (e) {}
    window.location.href = 'oferta.html';
  }

  backEl.onclick = prev;
  render();
})();
