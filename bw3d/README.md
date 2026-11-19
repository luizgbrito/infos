# Biblical World 3D — Español LATAM (V6)

Página estática para `/bw3d/`. Publicação segura: `bash publicar.sh` em ambiente com GitHub autenticado. Execute `python3 validar.py` nesta pasta para verificar recursos locais, JS e integridade básica.

## Configuração necessária antes da venda

- Substitua `checkoutUrl` em `js/config.js` pelo endereço HTTPS **real** da Cakto. Nenhum link de venda foi inventado.
- Caso use Meta Pixel, configure um único ponto de emissão e deduplicação com CAPI/Supabase para evitar dupla contagem.
- Verifique todas as mídias: várias capas de livros e páginas ainda exibem títulos em inglês, e o FAQ informa entregáveis em inglês. Não anuncie os entregáveis como traduzidos.
- Valide a página em navegadores desktop e mobile e realize uma compra de teste antes de começar tráfego.

## Verificações realizadas

- Referências a arquivos locais resolvidas; 21 imagens e 4 vídeos presentes.
- Sintaxe JavaScript verificada com Node.js.
- Script obsoleto de conversão de moedas de terceiros removido; precificação USD fixa preservada.
- Botão principal e CTA após FAQ utilizam checkout Cakto configurável; demais CTAs rolam até a oferta.
- URL do checkout mantém UTMs e identificadores de cliques.
- Recursos e auditoria registrados em `AUDITORIA.json`.

## Limites

Sem URL real da Cakto e sem traduções verificadas das artes e entregáveis, esta página ainda não está pronta para campanha paga. Não foi confirmada publicação remota no GitHub.

## Atualizações V5

- Imagens com dimensões intrínsecas, decodificação assíncrona e carregamento progressivo das imagens fora da primeira dobra.
- Estilos defensivos para mobile e foco visível de navegação por teclado.
- Testes ampliados de integridade de imagens, CTAs, assets, hierarquia H1 e linguagem.
- Navegação Chromium bloqueada por política do ambiente, tanto em `file://` como `http://127.0.0.1`; não declarar QA visual aprovado.
- Nenhuma informação não fornecida foi substituída ou inventada.

## Revisão V6
- Validação adicional da sintaxe de todos os scripts JavaScript inline.
- Metadados de compartilhamento com arte original local e vídeo com carregamento de metadados.
- Arquivo `.nojekyll` e guia de publicação em `DEPLOY.md`.
- GitHub não publicado: rede do ambiente de arquivos sem acesso ao domínio GitHub.
- Imagens com textos internos originais em inglês foram preservadas (não atribuir tradução inexistente).

## Revisão V7
- Encontrado no GitHub remoto `bw3d/index.html` existente, mas recursos consultados em `bw3d/js/`, `bw3d/images/` e `bw3d/media/` ausentes.
- Adicionado `publicar.sh` para publicar todo o projeto, sem modificar outras pastas do repositório.
- Não há confirmação de push remoto, Cakto ou QA visual.

## Revisão V8 — integridade da oferta
- Removidos contador aleatório de visitantes, cronômetro que reiniciava e notificações fictícias de compras.
- Preços existentes preservados; depoimentos existentes não foram verificados individualmente.
- GitHub contém `bw3d/index.html`, mas não se confirmou publicação completa de recursos binários.
- Teste visual completo de navegador não homologado; o ambiente bloqueia acesso direto a arquivos e servidores locais.

## QA V9
Teste visual offline real de hero e CTAs em 390 px e 1365 px. Ver `QA_VISUAL_V9.md` e capturas na pasta `qa/`. Não confundir com homologação de produção.

## Pacote Cakto — integração preparada (2026-11-18)
- `cakto/configuracao.json`: cadastro realista baseado na página, USD 27; US$54 permanece apenas ancoragem visual.
- `cakto/criar_produto.py`: pré-visualização segura e criação via API **somente** com `--create`, credenciais de ambiente, URL HTTPS real e checagem prévia do catálogo.
- `cakto/GUIA.md`: sequência de cadastro, checkout, entrega e webhook, com lacunas explicitadas.
- Sem credenciais/autenticação Cakto nesta sessão, **não houve cadastro remoto**. Os materiais digitais completos anunciados na página não estão neste ZIP de landing page.
