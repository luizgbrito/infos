// Gera ../index.html a partir de steps.json (estrutura de cada etapa do quiz).
// Uso: npm run build  (roda este script e depois compila o CSS com Tailwind)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const steps = JSON.parse(fs.readFileSync(path.join(__dirname, 'steps.json'), 'utf8'));

const SITE = {
  title: 'Bariátrica Natural',
  description:
    'Descubre cómo la Bariátrica Natural desbloquea tu adelgazamiento.\nPlanes personalizados que activan tu metabolismo, resultados visibles en solo 7 días y acompañamiento exclusivo paso a paso.',
  favicon: 'assets/img/md-it9ih-chatgpt-image-30-de-mar-de-2026-17-30-48.png',
  ogImage: 'assets/img/md-it9ih-chatgpt-image-30-de-mar-de-2026-17-30-48.png',
};

const DROP_CLASS = [
  /^jsx-/,
  /^group-\[\.screen-mobile\]/,
  /^@container/,
  /^swiper-(initialized|horizontal|backface-hidden|android|ios|free-mode|watch-progress)$/,
  /^swiper-slide-(active|next|prev|visible|fully-visible)$/,
  /^swiper-pagination-(clickable|bullets|horizontal|bullets-dynamic)$/,
  /^btn-(?!theme)/,
];

const localImg = (src) => src.replace(/^https?:\/\/media\.inlead\.cloud\/uploads\/\d+\/[\d-]+\//, 'assets/img/');

function cleanClasses($, root) {
  root.find('[class]').addBack('[class]').each((_, el) => {
    const kept = ($(el).attr('class') || '')
      .split(/\s+/)
      .filter((c) => c && !DROP_CLASS.some((re) => re.test(c)));
    if (kept.length) $(el).attr('class', kept.join(' '));
    else $(el).removeAttr('class');
  });
}

let enabledBtnTpl = null; // wrapper de botão habilitado (pulso + borda 3D), reaproveitado nos desabilitados

function transformStep(step, index) {
  const $ = cheerio.load(`<div id="__root">${step.html}</div>`, null, false);
  const kids = $('#__root').children();
  const header = kids.eq(0);
  const content = kids.eq(1);

  content.find('script, style, link').remove();

  // Vídeos VTurb: o iframe é injetado pelo app.js
  content.find('.ratio-auto-video-content').each((_, el) => {
    const iframe = $(el).find('iframe').first();
    const id = (iframe.attr('id') || '').replace(/^ifr_/, '');
    $(el).empty().attr('data-vturb', id);
  });

  // Régua (altura/peso) x carrossel
  content.find('.swiper').each((_, el) => {
    const sw = $(el);
    const wrapper = sw.find('.swiper-wrapper').first();
    wrapper.removeAttr('style');
    if (sw.hasClass('swiper-free-mode')) {
      sw.attr('data-ruler', '');
      wrapper.empty();
    } else {
      sw.attr('data-carousel', '');
      sw.find('.swiper-slide').removeAttr('style');
      const pag = sw.closest('[data-layer-id]').find('.swiper-pagination');
      pag.empty().removeAttr('style');
    }
  });

  // Anel de progresso
  content.find('[data-test-id="CircularProgressbarWithChildren"]').each((_, el) => {
    const label = $(el).find('[data-test-id="CircularProgressbarWithChildren__children"] > div').first();
    const target = parseInt(label.text(), 10) || 0;
    $(el).attr('data-ring', String(target));
    label.text('0%').attr('data-ring-label', '');
    const p = $(el).find('.CircularProgressbar-path');
    p.attr('style', (p.attr('style') || '').replace(/stroke-dashoffset:\s*[\d.]+px/, 'stroke-dashoffset: 282.743px'));
  });

  // Componentes (camadas)
  content.find('[data-layer-id]').each((_, el) => {
    const e = $(el);
    e.removeAttr('data-layer-id').removeAttr('style').addClass('cmp');
  });

  // Opções: estado inicial sem seleção
  content.find('.active').each((_, el) => {
    const e = $(el);
    if ((e.attr('class') || '').includes('group/item')) e.removeClass('active').removeClass('scale-[--scale-active]');
  });

  // Botões
  content.find('[id^="pulse"]').each((_, el) => $(el).removeAttr('id').addClass('btn-pulse'));
  content.find('button.btn').each((_, el) => {
    const btn = $(el);
    const wrap = btn.parent();
    if (!enabledBtnTpl && wrap.children().length === 3) enabledBtnTpl = $.html(wrap);
    if (wrap.hasClass('opacity-75') && enabledBtnTpl) {
      const $$ = cheerio.load(enabledBtnTpl, null, false);
      const nb = $$('button.btn');
      nb.attr('id', btn.attr('id')).html(btn.html());
      const fresh = $$.root().children().first();
      fresh.addClass('is-disabled').attr('data-gated', '');
      wrap.replaceWith($$.html(fresh));
    }
  });

  // Checkout
  content.find('a#begin_checkout-button').attr('href', '#').attr('data-checkout', '');

  content.find('img').each((_, el) => {
    const e = $(el);
    e.attr('src', localImg(e.attr('src') || ''));
    e.removeAttr('fetchpriority');
    if (index > 0) e.attr('loading', 'eager');
  });
  content.find('[aria-hidden]').removeAttr('aria-hidden');
  cleanClasses($, content);

  let html = $.html(content);
  html = html.replace(/Teste/g, '<span data-var="name"></span>');

  return { id: step.id.replace(/^step_/, ''), progress: parseFloat(step.p), html, header };
}

const out = steps.map(transformStep);

// Cabeçalho (logo + barra de progresso) vem da primeira etapa e fica fixo entre as etapas
const $h = cheerio.load(`<div id="__root">${steps[0].html}</div>`, null, false);
const header = $h('#__root').children().eq(0);
header.find('img').each((_, el) => {
  const e = $h(el);
  e.attr('src', localImg(e.attr('src'))).attr('alt', SITE.title).attr('fetchpriority', 'high');
});
header.find('.bg-featured[style*="width"]').attr('id', 'progress-fill').attr('style', `width: ${out[0].progress}%;`);
cleanClasses($h, header);
const headerHtml = $h.html(header);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const templates = out
  .map(
    (s, i) =>
      `<template data-step="${s.id}" data-index="${i}" data-progress="${s.progress}">${s.html}</template>`
  )
  .join('\n');

const page = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="MobileOptimized" content="320">
<meta name="HandheldFriendly" content="True">
<meta name="referrer" content="no-referrer-when-downgrade">
<title>${SITE.title}</title>
<meta name="description" content="${esc(SITE.description)}">
<meta name="theme-color" content="#ffffff">
<link rel="shortcut icon" href="${SITE.favicon}">
<link rel="icon" href="${SITE.favicon}">
<link rel="apple-touch-icon" sizes="180x180" href="${SITE.favicon}">
<meta property="og:title" content="${SITE.title}">
<meta property="og:description" content="${esc(SITE.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.title}">
<meta property="og:image" content="${SITE.ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap">
<link rel="dns-prefetch" href="https://scripts.converteai.net">
<link rel="dns-prefetch" href="https://cdn.converteai.net">
<link rel="stylesheet" href="assets/vendor/swiper-bundle.min.css">
<link rel="stylesheet" href="assets/css/styles.css">
<script src="assets/js/config.js"></script>
<script src="assets/js/tracking.js"></script>
</head>
<body class="group/body">
<main>
  <div id="step-shell" class="main-content flex flex-col gap-4 p-3 justify-start min-h-[95svh] md:p-5 md:gap-6">
    ${headerHtml}
    <div id="step-root" class="w-full"></div>
    <div class="py-10"></div>
  </div>
</main>

${templates}

<script src="assets/vendor/swiper-bundle.min.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), page);
console.log(`index.html gerado: ${out.length} etapas, ${(page.length / 1024).toFixed(0)} KB`);
