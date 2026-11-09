# Spec 04: Conteúdos em destaque
Responsável: agente exclusivo da seção.
Desktop: 13:2. Mobile: 35:1091.
Arquivos exclusivos: src/sections/content.ts e src/sections/content.css.

## Contratos obrigatórios
Leia docs/PLAN.md, docs/specs/00-foundation.md e AGENTS.md.
Implemente exclusivamente a seção atribuída, em desktop e mobile. Não edite package.json, lockfile, src/main.ts, src/styles.css, src/shared/* ou outra seção.
Não instalar, importar ou usar GSAP/Lenis antes da etapa 6.
Fonte detalhada: docs/reference/content-desktop.txt e content-mobile.txt. Esses arquivos contêm contexto de alta fidelidade, não devem ser importados no site.
Solicite get_screenshot se precisar observar detalhes visuais; carregue figma-design-to-code antes de get_design_context. Se houver resposta sparse, obtenha os nós filhos antes de implementar.
Exporte render(): string e init(root: HTMLElement): () => void no módulo da seção. Importe o CSS local no próprio módulo.
Use assets(group, variable) de ../shared/assets para os nomes presentes nas referências, nunca URLs temporárias. Grupos: hero-desktop, hero-mobile, results-desktop, results-mobile, audience-desktop, audience-mobile, content-desktop, content-mobile, contact-desktop e contact-mobile.
Use sectionTitle(text, group, variable, className?) e eyebrow(label, light?) de ../shared/ui para títulos vetoriais e labels.
Classes precisam começar com o nome da seção. Utilize os tokens globais. Conteúdo integral permanece visível sem animações.
Imagens de capa devem manter 9:16; decorativas têm alt vazio. Preserve os textos e avisos do Figma.
Links e botões precisam de nomes acessíveis e foco visível.
No fim, informe pendências, arquivos e verificações. Não faça commits.

## Implementação e comportamento
Seção creme id conteudos, título Um pouco do meu universo e descrição. Carrossel circular com três conteúdos, capa ativa 9:16 e cards laterais menores/opacos.
Atualização de 9 de novembro de 2026: o carrossel passou a ter oito Reels reais, definidos em src/shared/videos.ts. Os itens inativos mostram a capa, o item ativo toca um take curto e mudo, e Visualizar vídeo abre o vídeo completo em WebM com link para o Instagram. Os textos e as métricas de cada card estão em content.ts.
Desktop: capa em foco 270 x 480 e card de texto à direita com sobreposição de 20 px; laterais recortadas nas bordas. Mobile: capa central e card de texto abaixo sobreposto, seguindo referência de 390, não apenas reduzindo o desktop.
Usar createCarousel. Controles Anterior/Próximo, paginação clicável e clique nos itens laterais mudam foco. Texto, resultado e metadados acompanham o item ativo. Não usar GSAP para posicionar.
Visualizar vídeo chama openVideo compartilhado. Usar URL apenas se existir fonte real correspondente. Sem vídeo disponível, dialog informa pendência de forma clara. Não ligar fotos provisórias a resultados de outro post.
Consultar variantes restantes do componente para os textos de cada conteúdo. Não inventar métricas, datas ou URLs.
Init retorna cleanup que destrói a instância e remove listeners. Nenhum seletor global genérico pode controlar o carrossel do hero.

## Critérios de aceite
Corresponder às duas referências, com adaptação fluida nas larguras intermediárias. Sem overflow horizontal da página; somente trilhas intencionais podem recortar capas.
Navegação por teclado, foco visível e imagens sem distorção. Dados não validados continuam identificados como pendentes.
Nenhuma animação GSAP/Lenis ou dependência compartilhada criada pela seção.

