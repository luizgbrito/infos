(() => {
  const base = new URL('.', document.currentScript.src);
  const slugs = ["", "edad", "cuerpo", "zonas-del-cuerpo", "a-tu-ritmo", "mezcla", "nombre", "bienestar", "experiencias", "tus-habitos", "dificultades", "ingredientes", "objetivos", "digestion", "como-funciona", "peso-actual", "altura", "peso-deseado", "rutina", "sueno", "tu-meta", "compromiso", "prioridad", "preparando-analisis", "resultado", "referencias", "preparando-plan", "oferta"];
  function pageFromLocation() {
    const path = decodeURIComponent(location.pathname);
    const relative = path.startsWith(base.pathname) ? path.slice(base.pathname.length).replace(/^\/+|\/+$/g, '') : '';
    const index = slugs.indexOf(relative === 'index.html' ? '' : relative);
    const legacy = Number(new URLSearchParams(location.search).get('page'));
    return legacy >= 1 && legacy <= slugs.length ? legacy : index >= 0 ? index + 1 : 1;
  }
  window.SDI_ROUTES = {
    base: base.pathname,
    pageFromLocation,
    sync(page) {
      const slug = slugs[Math.max(0, Math.min(slugs.length - 1, page - 1))];
      const destination = base.pathname + (slug ? slug + '/' : '');
      if (location.pathname !== destination || new URLSearchParams(location.search).has('page')) {
        const query = new URLSearchParams(location.search);
        query.delete('page');
        history.pushState({sdiPage: page}, '', destination + (query.size ? '?' + query : ''));
      }
    }
  };
  window.QUIZ_CONFIG = {checkout: new URL('checkout/', base).href, precio: 'US$9.90', precioTachado: '', cuotas: 'Pago único en USD'};
})();