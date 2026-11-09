# Spec 02: Resultados
Responsável: agente exclusivo da seção.
Desktop: 12:183. Mobile: 35:436.
Arquivos exclusivos: src/sections/results.ts e src/sections/results.css.

## Contratos obrigatórios
Leia docs/PLAN.md, docs/specs/00-foundation.md e AGENTS.md.
Implemente exclusivamente a seção atribuída, em desktop e mobile. Não edite package.json, lockfile, src/main.ts, src/styles.css, src/shared/* ou outra seção.
Não instalar, importar ou usar GSAP/Lenis antes da etapa 6.
Fonte detalhada: docs/reference/results-desktop.txt e results-mobile.txt. Esses arquivos contêm contexto de alta fidelidade, não devem ser importados no site.
Solicite get_screenshot se precisar observar detalhes visuais; carregue figma-design-to-code antes de get_design_context. Se houver resposta sparse, obtenha os nós filhos antes de implementar.
Exporte render(): string e init(root: HTMLElement): () => void no módulo da seção. Importe o CSS local no próprio módulo.
Use assets(group, variable) de ../shared/assets para os nomes presentes nas referências, nunca URLs temporárias. Grupos: hero-desktop, hero-mobile, results-desktop, results-mobile, audience-desktop, audience-mobile, content-desktop, content-mobile, contact-desktop e contact-mobile.
Use sectionTitle(text, group, variable, className?) e eyebrow(label, light?) de ../shared/ui para títulos vetoriais e labels.
Classes precisam começar com o nome da seção. Utilize os tokens globais. Conteúdo integral permanece visível sem animações.
Imagens de capa devem manter 9:16; decorativas têm alt vazio. Preserve os textos e avisos do Figma.
Links e botões precisam de nomes acessíveis e foco visível.
No fim, informe pendências, arquivos e verificações. Não faça commits.

## Implementação e comportamento
Seção creme id resultados. Título Conteúdo que encontra pessoas, descrição do período, seletor Instagram/TikTok e cards de desempenho.
Desktop: três cards de totais lado a lado e dois cards inferiores para Reels e Stories; mobile empilha os cinco cards conforme o frame. Preservar o aviso de desempenho anterior e as notas de metodologia.
Usar platformTabs('results') e mountTabs no init. Manter Instagram e TikTok independentes e renderizar painéis com ids results-panel-instagram / results-panel-tiktok.
Não copiar dados do Instagram para TikTok. Solicitar contexto das variantes TikTok se o retorno atual trouxer somente Instagram. Campos pendentes devem seguir o estado pendente do design, sem fabricar números.
Separar totais de 30 dias das medianas de amostras habituais. Não transformar visualizações em pessoas ou prometer entrega.
Títulos das métricas, ícones, data, fonte e notas são parte do escopo. Conteúdo de métrica deve ficar em estrutura de dados editável local à seção.

## Critérios de aceite
Corresponder às duas referências, com adaptação fluida nas larguras intermediárias. Sem overflow horizontal da página; somente trilhas intencionais podem recortar capas.
Navegação por teclado, foco visível e imagens sem distorção. Dados não validados continuam identificados como pendentes.
Nenhuma animação GSAP/Lenis ou dependência compartilhada criada pela seção.

