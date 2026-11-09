# Estudo do mascote da Dotinha

O protótipo fica em `public/estudo-mascote/index.html`. Com o servidor do projeto em execução, abra `/estudo-mascote/index.html`. A página é independente do mídia kit e não foi incorporada à navegação principal nem publicada.

Em 9 de novembro de 2026, Lucas decidiu manter o mascote somente nesta página de exemplo. A integração experimental com a home foi removida, incluindo o controle de pausa e os espaçamentos adicionais. Os movimentos aprovados continuam disponíveis no estudo; uma nova integração depende de outro pedido.

## Personagem e arquivos

A referência é o [cachorrinho da identidade no Figma](https://www.figma.com/design/QjE7zWQhBFwe7OZbHQGOaD/M%C3%ADdia-kit?node-id=1-1500), dentro da seção indicada por Lucas. As poses são uma interpretação animável da ilustração, gerada com a ferramenta integrada ImageGen. Não são uma exportação dos vetores originais.

- `public/estudo-mascote/dotinha-sprites.png`: atlas transparente com seis poses de caminhada, repouso e saudação inicial.
- `public/estudo-mascote/dotinha-parts.png`: atlas transparente com corpo e braço separados, preparação do salto, pose aérea, aterrissagem e repouso frontal.
- `public/estudo-mascote/mascot.js`: recorte dos atlas em memória, desenho no canvas e controle de movimento.
- `public/estudo-mascote/style.css`: composição responsiva da página de estudo.
- [Prompt da caminhada](mascot-generation-prompt.txt) e [prompt das partes e do salto](mascot-parts-prompt.txt): instruções completas usadas no ImageGen integrado, sem CLI.

Os arquivos originais gerados foram preservados. Os atlas locais não são alterados pelo navegador. Na saudação, a camada do braço gira no ombro e o corpo permanece imóvel. Na caminhada para a esquerda, o desenho é espelhado.

## Comportamento

O cachorrinho caminha a 42 pixels por segundo sobre os cards. Entre eles, faz uma preparação de 110 ms, uma travessia parabólica de 480 ms e uma aterrissagem de 140 ms. Durante o salto, o ciclo de caminhada para e uma pose específica é usada. Um carinho solicitado no ar aguarda a aterrissagem.

O clique no personagem ou em “Dar um carinho” inicia o aceno por 2,4 segundos. Apenas o braço se movimenta. Há controles para pausar, retomar e recomeçar. A saudação durante a pausa é estática e não retoma o passeio.

O personagem para de andar ao receber foco de teclado ou quando o mouse está sobre ele. O percurso fica limitado ao primeiro card em telas de até 580 pixels. O movimento é suspenso quando a área sai da tela ou a aba fica oculta. A preferência por movimento reduzido mantém o personagem parado e permite a saudação estática.

## Verificação

- Sintaxe do JavaScript e build de produção do projeto concluídos.
- Controles, carregamento das imagens e ausência de rolagem horizontal conferidos no navegador.
- Saudação verificada comparando a posição do personagem e os pixels do corpo com os pixels do braço em momentos diferentes.
- Dois saltos observados, um de subida e outro de descida: 484 ms e 483 ms de voo, sem ciclo de caminhada no ar.
- Layout de 390 × 844 e modo de movimento reduzido verificados, incluindo resposta estática ao carinho.

Os testes de navegador desta sessão estão em `tmp/mascot-browser-check.js`, `tmp/mascot-motion-check.js` e `tmp/mascot-reduced-check.js`. As capturas de revisão estão em `tmp/mascot-desktop.png`, `tmp/mascot-wave.png` e `tmp/mascot-mobile-final.png`.

O estudo usa a fonte que já estava presente no projeto. A pendência de comprovação de licença web registrada no README continua aplicável antes de eventual publicação.
