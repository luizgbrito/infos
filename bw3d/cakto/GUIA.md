# Cakto — Biblical World 3D

## Dados fiéis à página de vendas

- Produto: **Biblical World 3D — Sistema Completo**
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

Os parâmetros `utm_*`, `fbclid`, `gclid` e `ttclid` são encaminhados quando a URL real do checkout está configurada. A pasta `supabase/` contém a migração e a função `bw3d-cakto` para registrar compras aprovadas e UTMs. A função verifica a assinatura da Cakto e a idade da entrega, filtra o produto e a oferta e registra cada pedido uma única vez. Ela descarta o restante do payload, incluindo dados de contato e pagamento.

No projeto Supabase escolhido, aplique a migração e publique a função `bw3d-cakto` com a configuração incluída. A Cakto autentica a chamada com HMAC e não envia JWT do Supabase. No painel Cakto, selecione somente este produto e o evento `purchase_approved`, usando a URL publicada da função. Configure `BW3D_CAKTO_WEBHOOK_SECRET`, `BW3D_CAKTO_PRODUCT_ID` e `BW3D_CAKTO_OFFER_ID` como segredos da função, com os valores da conta. A função usa `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` exclusivamente no servidor. Não coloque esses valores no Git ou no JavaScript da página.

Envie o evento de teste do painel Cakto para verificar entrega e assinatura. O exemplo fixo da Cakto não corresponde à oferta real, então deve retornar sucesso sem registrar compra. Para validar a gravação e a atribuição de ponta a ponta, use um pedido autorizado da oferta correta em ambiente de teste e confirme que um reenvio não duplica o registro.

## Status

O produto de US$ 27 está ativo na Cakto com a oferta principal e a entrega pela Área de Membros V3. A aula “Empieza aquí · Descarga la colección” foi publicada para membros pagos com o ZIP completo. A prévia da aula mostra o material disponível. O checkout da oferta principal está configurado em `js/config.js`. A função e a migração Supabase estão preparadas no repositório e aguardam a identificação do projeto Supabase de produção.
