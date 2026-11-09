# Validação da landing page
Data: 7 de novembro de 2026.

## Marco estático
**ESTÁTICA CONCLUÍDA.** As cinco seções foram integradas, revisadas e liberadas para as specs 07 e 08.

- Build Vite e checagem TypeScript passaram após a integração das cinco seções e as correções de layout.
- Os 144 assets recebidos do Figma foram baixados para public/assets. Arquivos locais não vazios; nenhuma URL temporária é usada no runtime.
- Capturas desktop e mobile inspecionadas contra os frames 12:2 e 14:2. Evidências em tmp/static-desktop-reviewed.png e tmp/static-mobile-reviewed.png e capturas individuais dos agentes.
- Foram conferidas larguras de 320, 390, 768, 1024 e 1440 px. A largura mínima do body foi removida para não provocar overflow com a scrollbar clássica do Windows em 320 px.
- O carrossel do hero responde ao teclado e mantém capas 9:16 com vizinhas visíveis. Corrigida a especificidade da largura dos slides.
- Conteúdos navega entre três itens, volta ao início e responde aos previews laterais e à paginação. A composição mobile é própria, com card abaixo da capa.
- Os seletores Instagram/TikTok funcionam de forma independente. Navegação por setas e atributos de seleção conferidos. Os estados pendentes e as fontes próprias de cada plataforma foram preservados.
- O modal abre com foco em Fechar, fecha com Escape e restaura foco e overflow. Sem URL real, informa que o vídeo será disponibilizado.
- Contato usa os links do Figma, mascote original com recorte mobile corrigido e marca original no rodapé.
- Nenhum erro de JavaScript foi listado pelo navegador na revisão estática.

## Limites da comparação
O navegador Windows usa scrollbar clássica de 15 px, reduzindo a largura útil quando o viewport tem o tamanho nominal do frame. Os agentes também fizeram capturas com scrollbar oculta somente na sessão de QA para comparar a geometria com o Figma. Essa alteração não faz parte do CSS do produto.
As imagens com loading lazy foram aguardadas ou tornadas eager apenas na sessão de captura, evitando falsos erros de imagem ausente.

## Correção final estática
Ajustado o espaçamento de letras do valor habitual de Resultados no mobile em -0,25 px para corresponder à linha do Figma sem reduzir o tamanho da fonte.

## Revisão de animação e scroll
Concluída após o marco estático, pelos agentes das specs 07 e 08.

- GSAP faz entradas discretas uma vez por grupo. A primeira dobra continua imediatamente visível. ResizeObserver, imagens e fontes atualizam as medidas do ScrollTrigger.
- O hero troca a cada 4 segundos e o círculo usa o evento autoplayTimeLeft do Swiper. O índice mudou durante o teste de ciclo. Pausar interrompeu o avanço e Retomar reativou o autoplay.
- O autoplay suspende por foco, hover, interação manual, modal, página oculta, saída do viewport e preferência de movimento reduzido. O teste de movimento reduzido desativou o autoplay e exibiu seu estado no controle.
- Lenis usa uma instância e um ticker GSAP. A inicialização repetida manteve um único callback; o cleanup idempotente removeu o ticker e a classe Lenis.
- A navegação até #publico atualizou o hash, terminou com foco na seção e respeitou o scroll-margin de 24 px. A navegação até #resultados também foi conferida no build de produção.
- O modal suspendeu Lenis, restaurou sua execução ao fechar, manteve a posição e devolveu o foco ao botão da publicação.
- Build final e checagem TypeScript passaram. O build foi servido com npm run preview em http://127.0.0.1:4173/ e aberto no navegador.
- No build de produção, as cinco seções e todos os assets carregaram, sem imagens quebradas ou erros JavaScript listados. Não houve overflow horizontal nas larguras de 320, 390, 768, 1024 e 1440 px.
- Capturas finais inspecionadas: tmp/final-desktop.png e tmp/final-mobile.png. Foram feitas com movimento reduzido para estabilizar o primeiro item do hero durante a comparação. Isso não altera a preferência do sistema do usuário.

Os testes de navegador foram feitos em Chromium com tamanhos de viewport simulados. Não houve teste em um aparelho iOS ou Android físico.

## Conteúdo pendente antes de publicação
As métricas, datas, amostras e bases de audiência ainda contêm placeholders do Figma. As capas são provisórias e ainda não há arquivos/URLs dos três vídeos. A Rayton Brink foi incluída posteriormente como fonte local a pedido de Lucas. A comprovação da licença de uso web permanece pendente. Não há publicação ou deploy nesta entrega.

## Ajuste posterior: entradas sem piscar
Lucas identificou que o conteúdo já estava revelado e piscava ao chegar à seção. A versão anterior criava o fromTo no onEnter, aplicando o estado inicial tarde demais. A revisão estática e as capturas com movimento reduzido não detectaram essa falha de comportamento.

Corrigido em src/motion/animations.ts: grupos fora da tela recebem opacidade zero e deslocamento de 24 px na inicialização. Os tweens são preparados pausados; o ScrollTrigger apenas inicia sua reprodução. A entrada dura 0,7 s, com intervalo de 0,08 s entre itens. Conteúdo já visível permanece visível. O carrossel de conteúdos entra como um conjunto, preservando a transparência de suas capas laterais.

O build e TypeScript passaram. No preview de produção, a opacidade inicial dos cards e do carrossel foi zero; amostragem de 80 frames durante a entrada encontrou valores intermediários, terminou em um e não encontrou regressão de opacidade. O movimento reduzido restaurou todos os grupos para opacidade um e desativou autoplay. O foco por teclado revela imediatamente o grupo correspondente.

## Ajuste posterior: títulos com fonte local

Os cinco títulos principais passaram de imagens SVG para texto HTML com Rayton Brink Regular. O arquivo OTF original (45.568 bytes) fica em public/fonts, com @font-face, preload, font-display: swap e fallback serifado. DM Sans continua nos demais textos. As imagens e o logo da identidade foram preservados.

O build, incluindo a checagem TypeScript, passou. No Chromium, document.fonts confirmou Rayton Brink carregada e todos os cinco títulos sem imagens internas. Foram conferidas as larguras de 320, 390, 800, 1024 e 1440 px, sem overflow horizontal da página ou dos títulos. Capturas revisadas: tmp/font-desktop.png e tmp/font-mobile.png. O arquivo da fonte também foi confirmado em dist/fonts.

O arquivo informa copyright de Zarma Type (2025), sem texto de licença web nos metadados. A fonte foi incluída por solicitação explícita de Lucas; não houve publicação ou deploy.


## Ajuste posterior: sequência do hero, loop e títulos

O hero recebeu uma timeline GSAP com entrada de logo e navegação, letras de “Vitória Dota” com SplitText, profissão, parágrafos, pilares e carrossel. A inicialização aguarda as fontes. O SplitText preserva o nome acessível durante a animação e restaura o HTML original ao terminar. A entrada é ignorada com movimento reduzido ou acesso direto por âncora.

O carrossel do hero usa loop com dois conjuntos das três capas, preservando a proporção 9:16. A transição dura 850 ms, com suavização de deslocamento, altura e opacidade. O anel mostra somente o progresso e contém o controle de pausa/retomada. Os botões de play das capas ainda não abrem modal, conforme solicitado. Os controles usam assets locais Phosphor Duotone, com licença em public/assets/phosphor-LICENSE.

A altura de linha dos cinco títulos passou de 1,3 para 0,95, com compensação inferior de 0,12 em para a folga da Rayton Brink. Não há recorte por overflow nos títulos.

Build e TypeScript passaram. No Chromium foram conferidos sete avanços do loop, incluindo a passagem do último item para o primeiro. A pausa manteve índice e progresso por cinco segundos; a retomada reativou o avanço. A amostragem da entrada confirmou opacidades intermediárias das letras e restauração do texto ao terminar. Movimento reduzido desativou autoplay e SplitText. Conferidas larguras de 320, 390, 768, 1024 e 1440 px sem overflow horizontal; nenhuma imagem quebrada ou erro JavaScript foi encontrado. Capturas em tmp/hero-split-desktop.png, tmp/hero-split-mobile.png e tmp/hero-carousel-mobile-final.png. Não houve publicação.


## Ajuste posterior: menu flutuante no mobile

Até 799 px, o menu fica fixo na parte inferior, centralizado com largura máxima de 440 px, sombra e afastamento de 16 px mais a área segura do dispositivo. O header deixa de reservar o espaço do menu. O fim da página e a área de rolagem recebem folga para manter o conteúdo acessível acima da navegação. O menu do desktop mantém sua posição no header.

Build e TypeScript passaram. No Chromium, as larguras de 320 e 390 px mantiveram o menu dentro da tela, sem overflow. O atalho Parcerias atualizou a âncora e permaneceu clicável sobre a seção de contato. Capturas em tmp/mobile-floating-menu.png e tmp/mobile-floating-menu-contact.png.


## Ajuste posterior: troca unificada dos conteúdos

A seção Conteúdo passou a usar uma sequência circular coordenada por GSAP. Cada capa mantém sua identidade durante o deslocamento: o texto anterior recolhe e desaparece, a capa lateral cresce até o foco e seu texto se revela. A entrada da seção apresenta primeiro o centro e depois alterna os lados até as pontas. Conforme o ajuste seguinte solicitado por Lucas, cada item aparece na própria posição, apenas com fade e escala de 90% a 100% do seu tamanho final, sem deslocamento. O texto ativo acompanha a entrada do seu item; o recolhimento e a revelação do texto ficam na troca entre conteúdos. O movimento global da seção foi removido para evitar duas animações concorrentes.

São três capas de cada lado, repetindo os três conteúdos provisórios existentes. O espaço entre itens é de 20 px, sem sobreposição entre capas. As laterais diminuem em telas intermediárias para preservar o espaço. No celular, a capa continua em 9:16 e o texto aparece abaixo; a altura da área considera o maior texto para evitar conflito com os controles.

Build e TypeScript passaram. No Chromium, foram revisadas telas de 1740, 1440, 390 e 320 px. A medição dos seis intervalos no desktop confirmou 20 px em todos. Foram conferidos navegação rápida, ciclo circular, clique em capa a dois passos do foco, paginação, setas do teclado e swipe por eventos de ponteiro. Quarenta avanços com movimento reduzido mantiveram o índice esperado, sete itens visíveis e apenas um bloco de texto aberto. Nenhum erro JavaScript ou overflow horizontal foi encontrado nas verificações. Evidências em tmp/qa-content/equal-gap-wide.png, equal-gap-desktop.png e equal-gap-mobile.png. Não houve publicação.
