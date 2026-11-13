# NEM — Navidad entre Manos
Página de vendas estática em espanhol neutro LATAM. Pasta independente para `luizgbrito/infos/NEM/`. Não altera outros produtos do repositório.

## Preview
Abra por um servidor estático: `python3 -m http.server 4173 --directory NEM` a partir da pasta que contém NEM. Acesse http://localhost:4173. CSS, JS, logo e imagens locais; sem dependências de instalação.

## Conectar a Cakto
Edite apenas `config.js`:
- `kits.complete.checkoutUrl`: checkout do kit de 50 projetos + 5 bônus.
- `kits.basic.checkoutUrl`: checkout do kit de 20 projetos.
- `price`: USD 9.90 / 4.90 nesta versão. Confirmar no checkout.
- `videoUrl`: caminho do vídeo final em espanhol; vazio mantém a foto de apresentação.
Os botões com checkout válido em HTTPS redirecionam para ele e preservam parâmetros UTM. Enquanto as URLs estiverem vazias, abrem um resumo do kit sem fingir que houve compra. Não há banners de indisponibilidade na página.

## Conteúdo
Paleta e sequência de conversão aproximadas da referência, código próprio. As fotografias dos projetos foram preservadas. As quatro etapas, as quatro capas de bônus e o cascanueces foram localizados por geração de imagem. O avatar Lucía é uma personagem ilustrada de marca, não a autora original. Logo próprio sem marca de plataforma. Os depoimentos são trechos traduzidos, com nomes e contexto da edição brasileira; não foram apresentados como resultados da edição LATAM. Não foram importados números de clientes, nota média ou avaliações como se fossem do novo produto. Nenhum pixel, rastreador, checkout ou código executável de terceiros foi copiado.

## Pendências operacionais
Inserir os dois checkouts, vídeo em espanhol, dados definitivos de suporte e responsável nos termos/privacidade; produzir e validar os entregáveis e garantir que a oferta corresponda ao conteúdo. Os preços e as condições comerciais devem coincidir com o checkout. O quiz não faz parte do escopo: a referência não contém quiz.

## Imagens
A procedência das fotos está em `ASSETS.json`. As imagens localizadas e o avatar foram gerados com a ferramenta de imagem integrada; ver `IMAGE-PROMPTS.md`. Pequenos textos de mockups gerados devem ser revisados na finalização dos entregáveis; os mockups não são os PDFs finais.

## Ajuste visual de 13/11/2026
Fontes originais incorporadas localmente (DM Sans, Playfair Display e Dancing Script). Kit completo com gradiente vermelho, bordas douradas, preço amarelo e CTA verde; kit básico bege. Dois carrosséis contínuos em sentidos opostos com pausa, navegação manual, arraste e respeito a movimento reduzido. Repetições visuais não duplicam a navegação por teclado/leitor de tela.

Valores em US$: completo 9.90, referência 57.90; básico 4.90, referência 24.90; cada bônus 9.90, cascanueces 19.90. Os valores riscados são ancoragens comerciais configuráveis e estão explicitamente identificados como valores de referência, sem alegação de venda anterior. Todos ficam centralizados em `config.js`.

Validação visual em 375 × 812 e 1440 × 900, sem overflow horizontal; movimento e pausa de ambas as faixas verificados; sete preços riscados presentes e ausência de erros capturados no console.

## Depoimentos enviados em 13/11/2026
As sete conversas únicas das imagens em espanhol fornecidas foram distribuídas em duas no topo e cinco na seção de depoimentos. A colagem contém um balão duplicado, que não foi repetido. Os painéis são separados por recortes de apresentação em CSS, preservando as imagens enviadas sem reescrever mensagens. O primeiro depoimento abre a versão individual em maior resolução. Todas as imagens podem ser ampliadas.
Os botões visíveis de navegação/pausa dos carrosséis de projetos foram retirados; a animação, o arraste e a pausa ao interagir continuam disponíveis. O comando de pausa permanece acessível ao teclado sem ocupar espaço no layout normal.
