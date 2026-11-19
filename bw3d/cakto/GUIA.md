# Cakto — Biblical World 3D

## Dados fiéis à página de vendas

- Produto: **Biblical World 3D™ — Sistema Completo**
- Oferta efetiva: **US$ 27,00**, pagamento único, moeda `USD`.
- **US$ 54,00 é apenas preço de referência tachado** na página; não é uma segunda oferta.
- Descrição pronta em `configuracao.json`, acima de 100 caracteres.
- Nenhum order bump ou upsell é confirmado pelos arquivos existentes.

## Operação da API

Documentação: https://docs.cakto.com.br/internacional/vender-em-dolar

O fluxo oficial é `POST /public_api/token/`, depois `GET /public_api/products/` (conferir duplicidade) e `POST /public_api/products/`. Produto USD com `currency: USD` e `type: unique`; a Cakto gera oferta padrão e checkout automaticamente.

Pré-visualização que não chama a API: `python3 cakto/criar_produto.py` executado da pasta `bw3d`.

Para execução autorizada em uma máquina com acesso à conta e à internet: configurar `BW3D_SALES_PAGE`, `CAKTO_CLIENT_ID`, `CAKTO_CLIENT_SECRET` como variáveis de ambiente e executar `python3 cakto/criar_produto.py --create`. Não compartilhar nem versionar credenciais.

Depois: listar checkouts do produto na Cakto, copiar o endereço efetivo `https://pay.cakto.com.br/{id_da_oferta}`, colocar em `js/config.js`, executar `python3 validar.py`, publicar com `bash publicar.sh` e testar uma compra.

## Entrega digital e segurança

O ZIP contém **ativos da landing page** (21 imagens e quatro arquivos de vídeo demonstrativos). **Não contém os nove guias em PDF, as seis obras adicionais completas, o aplicativo interativo nem as 18 animações completas que a página anuncia.** Não configurar entrega de conteúdos ausentes ou alegar que já estão disponibilizados. É indispensável confirmar a titularidade/licença dos materiais antes de distribuí-los comercialmente.

## Rastreamento

Os parâmetros `utm_*`, `fbclid`, `gclid` e `ttclid` são encaminhados pelo código do checkout. Para rastreio server-side, registrar webhook da Cakto para a URL real de Supabase Edge Function. Validar assinatura/origem do evento, implementar idempotência e deduplicar o evento de compra com o Pixel. Nenhuma URL de Supabase ou chave de webhook foi incluída, porque não estão verificadas.

## Status

O script de criação NÃO foi executado contra a conta real; não há credenciais nesta sessão. Nenhum produto, checkout, order bump, webhook ou entrega foi cadastrado remotamente.
