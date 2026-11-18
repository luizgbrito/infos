# Configuração da Cakto

A conta da Cakto não está conectada a esta conversa. O cadastro, envio dos PDFs e testes de pagamento precisam ser feitos no painel autenticado.

## Operação

1. Confirmar USD e países LATAM habilitados.
2. Criar quatro produtos e respectivas ofertas conforme `ofertas.json`.
3. Vincular os seis módulos e quatro bônus ao produto principal em **Cakto Members**.
4. Inserir dois order bumps em Produtos → Activa360 → Order Bump; ambos precisam de preços/ofertas próprios.
5. Configurar o upsell após a compra do produto principal.
6. Enviar as 13 versões em PDF apenas pelo painel de membros, sem colocá-las no GitHub público.
7. Após gerar checkout público, inserir a URL em `window.A360_LAUNCH.checkoutUrl` no site.
8. Fazer compra de teste para front-end, bump 1, bump 2 e upsell, incluindo recusa/aceite.

Os pacotes de arte, logos, capas e PDFs foram organizados separadamente para upload.