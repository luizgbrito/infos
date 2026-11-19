# Publicação verificada de Biblical World 3D

Destino pretendido: repositório `luizgbrito/infos`, pasta `bw3d/`. O HTML da pasta já foi encontrado no remoto, mas o envio integral das mídias desta versão **não foi confirmado**. Não trate o site como publicado apenas porque `index.html` existe.

## Publicar

Em um computador com Git autenticado e acesso ao GitHub, descompacte o pacote e execute, dentro da pasta `bw3d`:

```bash
python3 validar.py
bash publicar.sh --dry-run
bash publicar.sh
```

O script clona a branch padrão, copia os recursos completos e valida a presença de imagens, vídeos, JS e HTML. Faz commit apenas em `bw3d/`, sem modificar outras pastas. Se não conseguir acessar GitHub ou não houver identidade Git configurada, falha sem publicar. Não apaga arquivos remotos desconhecidos.

Se o repositório for publicado com GitHub Pages na raiz da branch principal, o endereço usual será `https://luizgbrito.github.io/infos/bw3d/`, **desde que Pages esteja habilitado e o site seja servido nessa estrutura**. O endereço não foi homologado.

## Pendências comerciais documentadas (não substituir por dados inventados)

- `js/config.js` tem `checkoutUrl` vazio. Insira somente a URL HTTPS real da Cakto e faça uma compra de teste.
- As artes originais incluem textos em inglês. A página HTML já está em espanhol, mas a localização visual completa não foi concluída.
- O idioma dos materiais entregues não foi verificado como espanhol; não prometer tradução que ainda não exista.
- Validar em página hospedada os vídeos, as fontes, os elementos interativos, as UTMs, os eventos e a responsividade. Testes locais/offline não substituem homologação de produção.
