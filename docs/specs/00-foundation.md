# Spec 00: Fundação e componentes compartilhados
Responsável: coordenador. Dependência: todas as specs gravadas.

## Escopo
Criar projeto Vite + TypeScript com HTML/CSS sem framework. Configurar scripts dev, build e preview e checagem TypeScript. Usar src/main.ts para montar seções na ordem do Figma.
Instalar apenas Vite, TypeScript e Swiper na fase estática. GSAP e Lenis só após etapa 6.
Definir tokens de cor: cream #FFFFEB, brown #633B22, pink #C27484, peach #EECBA4, gold #D89A5C e soft #F5E7DC.
DM Sans para texto. Letterings originais como imagens SVG acompanhadas de heading textual acessível. Não redistribuir Rayton Brink.
Contêiner desktop de 1312 px em tela 1440 (64 px por lado). Mobile de 342 px em tela 390 (24 px por lado). Cards externos têm margem 16 desktop e 8 mobile. Conteúdo fluido entre referências; breakpoint inicial 800 px, ajustável após comparação.
Normalizar box-sizing, margem, largura mínima, foco e imagens sem impor width/height globais que deformem os SVGs.

## APIs compartilhadas
src/shared/assets.ts: assets(group: string, variable: string): string, com erro claro para referência inexistente.
src/shared/ui.ts: eyebrow(label: string, light?: boolean): string; sectionTitle(text: string, group: string, variable: string, className?: string): string, gera h2 com imagem decorativa e texto acessível; platformTabs(id: string, light?: boolean): string; mountTabs(root: HTMLElement): () => void.
platformTabs gera tablist Instagram/TikTok com data-platform, aria-controls e ids exclusivos. Painéis de cada seção usam data-platform-panel="instagram" ou "tiktok" e id "{id}-panel-{platform}". mountTabs controla hidden, aria-selected, tabindex, setas, Home e End. Estados de seções independentes.
src/shared/carousel.ts: createCarousel(element: HTMLElement, options: SwiperOptions): Swiper. Importa Swiper e módulos Navigation, Pagination, Keyboard, A11y e Autoplay e CSS local da biblioteca. Somente opções e seletores escopados por instância. Não ativar autoplay antes do marco estático. Exportar type SwiperOptions.
src/shared/modal.ts: openVideo({ title, poster, url? }): void. Dialog compartilhado com título, fechar, Escape, clique no backdrop, foco restaurado e bloqueio de scroll. Sem url, informar que o vídeo será disponibilizado, sem iframe fictício. Só incorporar fonte de vídeo reconhecida; URL de publicação social deve abrir link, não fingir arquivo MP4.

## Assets e referências
Baixar com curl -L os assets fornecidos pelo contexto Figma. Gerar public/assets e mapa src/shared/assets.ts. Confirmar arquivos não vazios. Não publicar imagens de slides nem notas internas.
Guardar as referências em docs/reference e a documentação de biblioteca em docs/reference/libraries.md.

## Aceite
Contratos existem antes do início dos agentes. Aplicação abre com entrada única e cinco slots. Assets têm arquivos locais; nenhuma URL temporária entra no runtime.

