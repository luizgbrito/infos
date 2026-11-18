# Auditoria e publicação — Activa360

Data: 2026-11-18

## Publicação GitHub
- Repositório: `luizgbrito/infos` (público)
- Pasta: `a360/`
- Arquivos: `index.html` (HTML/CSS/JS) + 33 recursos visuais em `assets/`.
- Configuração Cakto: `cakto/ofertas.json` e `cakto/README.md`.

## Comparação com referência GeriActiva
A página preserva a lógica de venda da referência, adaptada ao posicionamento Activa360:
1. Faixa promocional e abertura da promessa
2. Depoimentos
3. Método simples
4. Contraste Antes/Después e diferenciação com Sistema 4D
5. Benefícios e apresentação dos seis módulos (concorrente vende cinco tomos)
6. Carrossel com quinze amostras internas
7. Público, objeções e quatro bônus
8. Oferta ancorada, garantia e CTA
9. Prova social visual e FAQ

## QA executado
- Resoluções: **320 px**, **390 px**, **768 px**, **1440 px**.
- Rolagem horizontal: **nenhuma** nas resoluções verificadas.
- Hero: mockup 3D realista ao lado do PDF animado, três benefícios numa só linha em 320/390 px e CTA centralizado.
- Carrossel: **15 páginas**; clique de navegação validado de 1/15 para 2/15 após 650 ms da animação.
- Seções inspecionadas no mobile: `metodo`, `contenido`, `muestras`, `bonos`, `oferta`, `resultados`.
- Scripts e links relativos: verificações sem erro; alguns recursos são lazy-loaded por design.
- Margem externa em mobile: **5 px por lado**, aplicada em telas até 690 px.

## Limitações e publicação comercial
- **Checkout Cakto não conectado:** não há URL real de checkout em `window.A360_LAUNCH.checkoutUrl`, logo os botões de compra não estão prontos para transações.
- **Cakto sem conexão autenticada:** os quatro produtos, áreas de membros, bumps e upsell ainda não foram criados na conta do cliente.
- **PDFs pagos:** 13 arquivos mantidos fora do GitHub público, disponíveis em pacote separado para subir na Cakto Members.
- **Moeda:** confirmar aceitação de USD no painel Cakto e nos países LATAM visados.
- **Prova comercial:** conferir documentação dos números de clientes, satisfação, avaliações e condições de escassez antes de anunciar. A redação foi preservada conforme solicitação explícita do proprietário.
- **Materiais de atividade terapêutica:** revisão técnica especializada recomendada antes da comercialização como orientação clínica.

## Estrutura preparada para Cakto
1. Front-end US$ 17 — seis módulos + quatro bônus.
2. Order Bump 1 US$ 7,90 — 100 sessões.
3. Order Bump 2 US$ 5,90 — kit profissional.
4. Upsell US$ 27 — programa de 12 semanas.

Os dois bumps são **propostas de Activa360**; não houve comprovação de que sejam os mesmos order bumps da GeriActiva.
