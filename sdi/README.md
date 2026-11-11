# SDI — El Secreto de la Insulina

Site estático independente na pasta `sdi`, com 28 etapas e URLs próprias.

Entrada: `/sdi/`. Oferta: `/sdi/oferta/`. Checkout temporário: `/sdi/checkout/`.
O arquivo `rotas.json` lista todos os endereços. Cada rota contém seu próprio `index.html`, permitindo acesso direto e atualização da página sem regras de SPA.

Para publicar, use a raiz do repositório como diretório público e mantenha a pasta `sdi`. Não mova apenas o `index.html`: todos os arquivos e a pasta `assets` são necessários.

O produto custa US$9.90 e a mistura tem custo de referência US$1. O checkout permanece sem cobrança, conforme solicitado. Para conectar o pagamento, altere apenas `checkout` em `config.js`.

O botão voltar do navegador acompanha as etapas sem recarregar a aplicação. Atualizar a página abre a etapa indicada pela URL e reinicia as respostas; nenhum dado pessoal é enviado a um servidor pelo quiz.

Os recursos são locais, com exceção da fonte Poppins carregada do Google Fonts. Não há senhas, tokens, identificadores de anúncios ou dados de login no projeto.
