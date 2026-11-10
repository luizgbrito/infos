# El Secreto de la Insulina — Funnel (español neutro LATAM, USD)

Funnel completo listo para publicar: front → quiz → oferta → checkout (Cakto) → upsell → downsell → gracias.
Todo en **español neutro LATAM** (tuteo, sin regionalismos) y precios en **USD**.

## Páginas

| Archivo | Rol |
|---|---|
| `index.html` | **Front** — una sola pantalla, lleva al quiz |
| `quiz.html` | **Quiz** — 15+ pantallas, captura de nombre, IMC, proyección, alertas condicionales → redirige a `oferta.html` |
| `oferta.html` | **Página de venta** — plan, bonos, precio, garantía, FAQ → botón al checkout de Cakto |
| `upsell.html` | **Upsell** post-compra (VSL + botón que se revela) → link de upsell 1-clic de Cakto |
| `downsell.html` | **Downsell** — ruleta que siempre cae en 30% → link de downsell 1-clic de Cakto |
| `gracias.html` | **Gracias / entrega** — acceso a la app + soporte |

## Cómo configurar (1 solo archivo)

Todo se controla desde **`assets/js/config.js`**. No hace falta tocar el HTML.

```js
mecanismo: "El Secreto de la Insulina",   // o una alternativa (ver abajo)
precios: { front: "$9", frontAncla: "$47", bump: "$5", upsell: "$17", downsell: "$11.90", ... },
checkout: { front: "<URL>", upsell: "<URL>", downsell: "<URL>" },   // links de Cakto
whatsappSoporte: "https://wa.me/<numero>"
```

## Economía del funnel (USD)

| Etapa | Ancla | Precio | Rol |
|---|---|---|---|
| Front | $47 | **$9** | Compra el cliente |
| Order bump | $15 | **$5** | Ticket sin fricción |
| Upsell | $49 | **$17** | Donde está la margen |
| Downsell | $17 | **$11.90** | Recupera quien recusó |

Ticket mínimo $9 · máximo $31 (3,4× el front).

## Flujo en Cakto (lo que falta cargar)

El pago, el **order bump**, el **upsell** y el **downsell** se configuran dentro de Cakto. Pasos:

1. **Producto principal** — "El Secreto de la Insulina" · precio **$9** (moneda USD).
2. **Order bump** en el checkout del producto principal:
   - Título: *Las 48 horas: cómo no perder lo que lograste*
   - Precio **$5** (de $15, -67%)
3. **Upsell 1-clic** (post-compra):
   - *Club del Secreto* · **$17** (de $49)
   - Página de upsell: la URL de `upsell.html` publicada
4. **Downsell 1-clic**:
   - *Club del Secreto* con 30% off · **$11.90**
   - Página de downsell: la URL de `downsell.html` publicada
5. **Redirecciones**:
   - Tras aprobar el pago del front → redirigir a `upsell.html`
   - Botón "QUIERO ACTIVAR" del upsell → link de upsell de Cakto; "No quiero…" → `downsell.html`
   - Botón del downsell → link de downsell de Cakto
   - Página de gracias final → `gracias.html`
6. Copiá los 3 links de checkout/upsell/downsell que te da Cakto y pegalos en `config.js`.

## Nombres alternativos al mecanismo

"El Secreto de la Insulina" está saturado (~640 anuncios activos). Alternativas (cambiás solo `config.js`):

- **El Método de la Saciedad** — más fácil de aprobar en Meta (no toca término clínico)
- **El Protocolo de las 3 Señales**
- **La Mezcla de los 21 Días**

## Notas de conformidad (leer antes de escalar)

- **Contadores de "personas comprando ahora"**: deshabilitados a propósito. Con números inventados son motivo de reprobación en Meta y plataformas de pago. Si los usás, que salgan de datos reales.
- **Timers**: son reales (expiran de verdad). No cambian precio automáticamente; si querés que cambien, configuralo en Cakto.
- **Promesas de kg exactos**: en México y Colombia la fiscalización de publicidad en salud es más dura. Versión segura: cambiar "Bajas hasta 12 kg" por "Resultados visibles en el espejo y en la ropa".
- **Garantía**: se usa "La mayoría ofrece 7 días. Yo te doy 30" (neutro), no la afirmación de ley de 7 días (que no aplica en todo país de habla hispana).
- Todas las páginas internas incluyen disclaimer: producto informativo, no sustituye consejo médico, resultados varían.
- Reemplazá la foto placeholder (`assets/img/especialista.svg`) y el VSL del upsell por tus materiales reales.

## Publicar

Es un sitio estático (HTML/CSS/JS, sin build). Se puede servir en **Vercel**, **Netlify**, **GitHub Pages** o Cloudflare Pages arrastrando la carpeta. Localmente:

```bash
npx serve .
```
