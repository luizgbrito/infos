(function () {
  'use strict';

  var CFG = window.QUIZ_CONFIG || {};
  var root = document.getElementById('step-root');
  var progressFill = document.getElementById('progress-fill');
  var templates = Array.prototype.slice.call(document.querySelectorAll('template[data-step]'));
  var STORAGE_KEY = 'barinatural_quiz';

  var state = { index: -1, name: '', answers: {} };
  var timers = [];
  var swipers = [];

  // Réguas (altura / peso) por etapa
  var RULERS = {
    nq9XBZ: { min: 140, max: 220, value: 180, units: ['cm', 'pol'], key: 'altura' },
    snhJ5b: { min: 40, max: 250, value: 70, units: ['kg', 'lb'], key: 'peso_actual' },
    '1dNqPK': { min: 40, max: 250, value: 70, units: ['kg', 'lb'], key: 'peso_ideal' },
  };

  function track(event, data) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event };
    for (var k in data || {}) payload[k] = data[k];
    window.dataLayer.push(payload);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: state.name, answers: state.answers }));
    } catch (e) {}
  }

  function clearStep() {
    timers.forEach(clearTimeout);
    timers = [];
    swipers.forEach(function (s) {
      try {
        s.destroy(true, false);
      } catch (e) {}
    });
    swipers = [];
  }

  function later(fn, ms) {
    var t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  /* ---------- navegação ---------- */

  function go(index) {
    if (index < 0 || index >= templates.length) return;
    var first = state.index === -1;
    state.index = index;
    if (first) return mount(index);
    root.classList.add('is-leaving');
    setTimeout(function () {
      mount(index);
      root.classList.remove('is-leaving');
    }, 200);
  }

  function next() {
    go(state.index + 1);
  }

  function mount(index) {
    clearStep();
    var tpl = templates[index];
    var stepId = tpl.getAttribute('data-step');
    root.innerHTML = '';
    root.appendChild(tpl.content.cloneNode(true));
    root.setAttribute('data-step', stepId);

    progressFill.style.width = tpl.getAttribute('data-progress') + '%';

    root.querySelectorAll('[data-var="name"]').forEach(function (el) {
      el.textContent = state.name;
    });
    root.querySelectorAll('.cmp').forEach(function (el, i) {
      el.style.setProperty('--i', i);
    });

    initOptions(stepId);
    initInputs(stepId);
    initButtons(stepId);
    initRulers(stepId);
    initCarousels();
    initRings();
    initVideos();
    if (root.querySelector('[data-checkout]')) initFinal();

    window.scrollTo(0, 0);
    preload(index + 1);
    track('quiz_step', { quiz_step_index: index + 1, quiz_step_id: stepId });
  }

  function preload(index) {
    var tpl = templates[index];
    if (!tpl) return;
    tpl.content.querySelectorAll('img[src]').forEach(function (img) {
      var i = new Image();
      i.src = img.getAttribute('src');
    });
  }

  /* ---------- opções ---------- */

  function optionItems() {
    return Array.prototype.slice.call(root.querySelectorAll('button[style*="--opt-"]')).map(function (b) {
      return b.parentElement;
    });
  }

  function optionLabel(item) {
    var c = item.querySelector('.content');
    return c ? c.textContent.trim() : '';
  }

  function initOptions(stepId) {
    var items = optionItems();
    if (!items.length) return;
    var multi = !!root.querySelector('button.btn');

    items.forEach(function (item) {
      item.querySelector('button').addEventListener('click', function () {
        if (multi) {
          item.classList.toggle('active');
          item.classList.toggle('scale-[--scale-active]');
          state.answers[stepId] = items
            .filter(function (i) {
              return i.classList.contains('active');
            })
            .map(optionLabel);
          refreshGate();
        } else {
          if (root.hasAttribute('data-locked')) return;
          root.setAttribute('data-locked', '');
          item.classList.add('active', 'scale-[--scale-active]');
          state.answers[stepId] = optionLabel(item);
          save();
          track('quiz_answer', { quiz_step_id: stepId, quiz_answer: state.answers[stepId] });
          setTimeout(function () {
            root.removeAttribute('data-locked');
            next();
          }, 250);
        }
      });
    });
  }

  /* ---------- campos ---------- */

  function initInputs(stepId) {
    root.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', refreshGate);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var btn = root.querySelector('button.btn');
          if (btn) btn.click();
        }
      });
    });
  }

  function gateOpen() {
    var inputs = Array.prototype.slice.call(root.querySelectorAll('input[required]'));
    if (inputs.length) {
      return inputs.every(function (i) {
        return i.value.trim() !== '';
      });
    }
    return !!root.querySelector('.active > button[style*="--opt-"]');
  }

  function refreshGate() {
    var open = gateOpen();
    root.querySelectorAll('[data-gated]').forEach(function (wrap) {
      wrap.classList.toggle('is-disabled', !open);
    });
  }

  /* ---------- botões ---------- */

  function initButtons(stepId) {
    refreshGate();
    root.querySelectorAll('button.btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.parentElement;
        if (wrap.classList.contains('is-disabled')) return;

        if (btn.id === 'begin_checkout') return goCheckout();

        var input = root.querySelector('input[required]');
        if (input) {
          var value = input.value.trim();
          state.answers[stepId] = value;
          // a primeira etapa com campo de texto é o nome
          if (!state.name && /nombre/i.test(root.textContent)) state.name = value;
        }
        if (state.answers[stepId] !== undefined) {
          track('quiz_answer', { quiz_step_id: stepId, quiz_answer: state.answers[stepId] });
        }
        save();
        next();
      });
    });
  }

  function goCheckout() {
    var url = CFG.checkoutUrl;
    if (!url) return;
    var params = new URLSearchParams(location.search);
    var qs = params.toString();
    if (qs) url += (url.indexOf('?') === -1 ? '?' : '&') + qs;
    track('begin_checkout', {});
    window.location.href = url;
  }

  /* ---------- régua ---------- */

  function toUnit(value, unit) {
    if (unit === 'lb') return Math.round(value * 2.20462);
    if (unit === 'pol') {
      var inches = Math.round(value / 2.54);
      return Math.floor(inches / 12) + "'" + (inches % 12) + '"';
    }
    return value;
  }

  function rulerSlides(cfg, unit) {
    var html = '';
    for (var v = cfg.min; v <= cfg.max; v++) {
      var rel = v - cfg.min;
      if (rel % 10 === 0) {
        html +=
          '<div class="swiper-slide !h-auto"><div class="pt-16 pb-[28px]"><div class="flex flex-col text-[--theme-background-contrast-7] items-center"><div class="m-auto h-10 w-[1px] bg-[--theme-background-contrast-4]"></div><span class="mt-2">' +
          toUnit(v, unit) +
          '</span></div></div></div>';
      } else {
        html +=
          '<div class="swiper-slide !h-auto"><div class="pt-16 pb-[28px]"><div class="m-auto bg-[--theme-background-contrast-4] w-[1px] ' +
          (rel % 5 === 0 ? 'h-8' : 'h-4') +
          '"></div></div></div>';
      }
    }
    return html;
  }

  function initRulers(stepId) {
    var el = root.querySelector('[data-ruler]');
    var cfg = RULERS[stepId];
    if (!el || !cfg) return;

    var wrapper = el.querySelector('.swiper-wrapper');
    var display = el.querySelector(':scope > span');
    var unitButtons = Array.prototype.slice.call(el.closest('.cmp').querySelectorAll('button'));
    var unit = cfg.units[0];
    var value = cfg.value;

    function render() {
      var shown = toUnit(value, unit);
      display.innerHTML = unit === 'pol' ? String(shown) : shown + '<small class="text-xl">' + unit + '</small>';
      state.answers[stepId] = unit === 'pol' ? String(shown) : shown + unit;
    }

    wrapper.innerHTML = rulerSlides(cfg, unit);
    var swiper = new Swiper(el, {
      slidesPerView: 30,
      centeredSlides: true,
      initialSlide: value - cfg.min,
      freeMode: { enabled: true, sticky: true, momentumRatio: 0.6 },
      watchSlidesProgress: true,
      on: {
        slideChange: function (s) {
          value = cfg.min + s.activeIndex;
          render();
        },
      },
    });
    swipers.push(swiper);
    render();

    unitButtons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        unit = cfg.units[i];
        unitButtons.forEach(function (b, j) {
          b.classList.toggle('btn-theme', i === j);
          b.classList.toggle('text-[--theme-background-contrast-6]', i !== j);
        });
        wrapper.querySelectorAll('.swiper-slide span').forEach(function (span, k) {
          span.textContent = toUnit(cfg.min + k * 10, unit);
        });
        render();
      });
    });
  }

  /* ---------- carrossel ---------- */

  function initCarousels() {
    root.querySelectorAll('[data-carousel]').forEach(function (el) {
      var pagination = el.closest('.cmp').querySelector('.swiper-pagination');
      var hidden = el.closest('.cmp.hidden');
      var swiper = new Swiper(el, {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 8,
        observer: true,
        observeParents: true,
        pagination: pagination
          ? { el: pagination, clickable: true, dynamicBullets: true, dynamicMainBullets: 1 }
          : undefined,
      });
      if (hidden) el._swiper = swiper;
      swipers.push(swiper);
    });
  }

  /* ---------- anel de progresso ---------- */

  function initRings() {
    root.querySelectorAll('[data-ring]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-ring'), 10) || 0;
      var path = el.querySelector('.CircularProgressbar-path');
      var label = el.querySelector('[data-ring-label]');
      var LEN = 282.743;
      var DURATION = 1200;

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          path.style.strokeDashoffset = LEN * (1 - target / 100) + 'px';
        });
      });

      var start = null;
      function tick(ts) {
        if (!el.isConnected) return;
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / DURATION);
        label.textContent = Math.round(target * p) + '%';
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      later(function () {
        label.textContent = target + '%';
      }, DURATION + 100);
    });
  }

  /* ---------- vídeo (VTurb) ---------- */

  var sdkLoaded = false;

  function initVideos() {
    root.querySelectorAll('[data-vturb]').forEach(function (el) {
      var id = el.getAttribute('data-vturb');
      if (!id || !CFG.vturbAccount) return;
      var base =
        'https://scripts.converteai.net/' + CFG.vturbAccount + '/players/' + id + '/v4/embed.html';
      el.innerHTML =
        '<div id="ifr_' +
        id +
        '_wrapper" style="margin: 0 auto; width: 100%; max-width: 400px;">' +
        '<div style="position: relative; padding: 100% 0 0 0;" id="ifr_' +
        id +
        '_aspect">' +
        '<iframe frameborder="0" allowfullscreen id="ifr_' +
        id +
        '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" referrerpolicy="origin"></iframe>' +
        '</div></div>';
      el.querySelector('iframe').src = base + (location.search || '?') + '&vl=' + encodeURIComponent(location.href);
    });

    if (!sdkLoaded && root.querySelector('[data-vturb]')) {
      sdkLoaded = true;
      var s = document.createElement('script');
      s.src = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }

  /* ---------- tela final ---------- */

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function initFinal() {
    var revealMs = (CFG.revealDelaySeconds || 0) * 1000;
    var bannerMs = (CFG.bannerDelaySeconds || 0) * 1000;
    var avisoMs = (CFG.avisoDelaySeconds || 0) * 1000;

    // Blocos ocultos (aviso, banner, carrossel, botão de compra, depoimentos)
    later(function () {
      root.querySelectorAll('.cmp.hidden').forEach(function (el) {
        el.classList.remove('hidden');
        var sw = el.querySelector('[data-carousel]');
        if (sw && sw._swiper) sw._swiper.update();
      });
    }, revealMs);

    // Banner de escassez com a data de hoje
    var bnDate = root.querySelector('#bn-date');
    var bnWrap = root.querySelector('.bn-wrap');
    if (bnDate) {
      var now = new Date();
      bnDate.textContent = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear();
    }
    if (bnWrap) {
      later(function () {
        bnWrap.style.display = 'block';
      }, bannerMs);
    }

    // Aviso de cupos restantes
    var aviso = root.querySelector('#aviso');
    var current = root.querySelector('#current_date');
    if (aviso && current) {
      var date = new Date();
      date.setMinutes(date.getMinutes() - 4);
      date.setSeconds(date.getSeconds() - 24);
      var message =
        '<b>Última actualización del nº de cupos restantes:</b> Día ' +
        pad(date.getDate()) +
        '/' +
        pad(date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' a las ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        '.';
      later(function () {
        current.innerHTML = message;
        aviso.style.display = 'block';
      }, avisoMs);
    }
  }

  /* ---------- início ---------- */

  if (CFG.blockContextMenu) {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  }

  go(0);

  // Acesso para depuração: QUIZ.go(27) abre a tela final, por exemplo
  window.QUIZ = { go: go, state: state, config: CFG };
})();
