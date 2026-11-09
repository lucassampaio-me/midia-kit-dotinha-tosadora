# Spec 01: Apresentação
Responsável: agente exclusivo da seção.
Desktop: 12:3. Mobile: 35:156.
Arquivos exclusivos: src/sections/hero.ts e src/sections/hero.css.

## Contratos obrigatórios
Leia docs/PLAN.md, docs/specs/00-foundation.md e AGENTS.md.
Implemente exclusivamente a seção atribuída, em desktop e mobile. Não edite package.json, lockfile, src/main.ts, src/styles.css, src/shared/* ou outra seção.
Não instalar, importar ou usar GSAP/Lenis antes da etapa 6.
Fonte detalhada: docs/reference/hero-desktop.txt e hero-mobile.txt. Esses arquivos contêm contexto de alta fidelidade, não devem ser importados no site.
Solicite get_screenshot se precisar observar detalhes visuais; carregue figma-design-to-code antes de get_design_context. Se houver resposta sparse, obtenha os nós filhos antes de implementar.
Exporte render(): string e init(root: HTMLElement): () => void no módulo da seção. Importe o CSS local no próprio módulo.
Use assets(group, variable) de ../shared/assets para os nomes presentes nas referências, nunca URLs temporárias. Grupos: hero-desktop, hero-mobile, results-desktop, results-mobile, audience-desktop, audience-mobile, content-desktop, content-mobile, contact-desktop e contact-mobile.
Use sectionTitle(text, group, variable, className?) e eyebrow(label, light?) de ../shared/ui para títulos vetoriais e labels.
Classes precisam começar com o nome da seção. Utilize os tokens globais. Conteúdo integral permanece visível sem animações.
Imagens de capa devem manter 9:16; decorativas têm alt vazio. Preserve os textos e avisos do Figma.
Links e botões precisam de nomes acessíveis e foco visível.
No fim, informe pendências, arquivos e verificações. Não faça commits.

## Implementação e comportamento
Hero creme com card soft arredondado, logo original, decoração recortada, nome Vitória Dota, profissão, biografia e três pilares. Desktop divide texto à esquerda e trilha de capas à direita; mobile empilha o texto e a trilha abaixo.
Reproduzir barra de atalhos desktop e adaptação mobile desenhada. Links âncora #resultados, #publico, #conteudos e #parcerias. Hero usa id apresentacao.
Desktop referência: 832 px de seção, card com margem 16 e altura 800; mobile seção 1323, card com margem 8. Usar dimensões como alvos visuais, sem cortar texto.
Trilha desktop: capas 280 x 497,778, gap 24, primeira elevada e seguintes deslocadas 56 px; viewport 664 x 560. Consultar versão mobile para dimensões próprias.
Usar createCarousel para navegação por toque e teclado. Na fase estática, sem autoplay ou progresso animado. Preservar aparência do indicador 4s como estado inicial e disponibilizar controle de pausa quando autoplay for ativado na etapa 7.
Não tratar as oito camadas repetidas do protótipo como oito vídeos reais. Existem três itens com capas provisórias.
Título hero é h1 com texto acessível Vitória Dota. Logo não pode ser reconstruído com texto comum.

## Critérios de aceite
Corresponder às duas referências, com adaptação fluida nas larguras intermediárias. Sem overflow horizontal da página; somente trilhas intencionais podem recortar capas.
Navegação por teclado, foco visível e imagens sem distorção. Dados não validados continuam identificados como pendentes.
Nenhuma animação GSAP/Lenis ou dependência compartilhada criada pela seção.

