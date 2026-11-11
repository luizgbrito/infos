# SDI — El Secreto de la Insulina

Site estático independente na pasta `sdi`, com 28 etapas e URLs próprias.

Entrada: `/sdi/`. Oferta: `/sdi/oferta/`. Checkout temporário: `/sdi/checkout/`.
O arquivo `rotas.json` lista todos os endereços. Cada rota contém seu próprio `index.html`, permitindo acesso direto e atualização da página sem regras de SPA.

Para publicar, use a raiz do repositório como diretório público e mantenha a pasta `sdi`. Não mova apenas o `index.html`: todos os arquivos e a pasta `assets` são necessários.

O produto custa US$9.90 e a mistura tem custo de referência US$1. O checkout foi conectado à oferta principal da Cakto: `https://pay.cakto.com.br/36um3jj_1303524`.

## Upsell e downsell

- Upsell: `https://saludbien.site/up/`, US$17, oferta oficial Cakto `5ievaqo`.
- Downsell: `https://saludbien.site/down/`, US$11.90, oferta oficial Cakto `3362k3w`.
- Cópias das páginas permanecem em `/sdi/up/` e `/sdi/down/`.
- Os dois preços são ofertas de pagamento único do mesmo produto cadastrado, Club del Secreto.
- Aceite e recusa usam os componentes oficiais gerados no painel Cakto e o script público oficial `upsell.js`.
- A recusa do upsell leva ao downsell. O aceite ou a recusa final leva à área de membros conforme o código gerado pela Cakto.
- O produto principal está configurado para abrir `/up/` após a compra aprovada.
- A roleta conserva a animação, os oito setores, os sons Web Audio e os confetes do original. O desconto promocional é fixo em 30%: de US$17 para US$11.90.

## Verificação e pendências

Foram conferidos os acessos diretos das 28 rotas, a conexão ao checkout de US$9.90, o redirecionamento salvo no painel e a navegação de recusa para o downsell. Não foi realizada compra, cobrança real nem teste com dados de cartão.

O checkout da Cakto adapta idioma, moeda local, impostos e formas de pagamento ao país do comprador. No teste em USD, apresentou o produto por US$9.90 e taxa da plataforma de US$0.99, total de US$10.89, sem order bump. Os preços-base dos produtos foram preservados.

O vídeo original do upsell continua em português, identificado na página, aguardando material em espanhol. As logos estão prontas na pasta `branding`, mas o seletor de arquivos da Cakto não respondeu ao controle do navegador; o envio das imagens ao cadastro dos produtos permanece pendente.

A entrega existente do produto principal foi preservada: área de membros externa e e-mail de confirmação imediato. Os arquivos do entregável não foram recebidos nesta conversa; seu conteúdo e acesso não foram auditados.

O botão voltar do navegador acompanha as etapas sem recarregar a aplicação. Atualizar a página abre a etapa indicada pela URL e reinicia as respostas; nenhum dado pessoal é enviado a um servidor pelo quiz.

Os recursos são locais, com exceção da fonte Poppins carregada do Google Fonts. Não há senhas, tokens, identificadores de anúncios ou dados de login no projeto.
