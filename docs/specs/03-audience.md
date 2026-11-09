# Spec 03: Público
Responsável: agente exclusivo da seção.
Desktop: 12:258. Mobile: 35:469.
Arquivos exclusivos: src/sections/audience.ts e src/sections/audience.css.

## Contratos obrigatórios
Leia docs/PLAN.md, docs/specs/00-foundation.md e AGENTS.md.
Implemente exclusivamente a seção atribuída, em desktop e mobile. Não edite package.json, lockfile, src/main.ts, src/styles.css, src/shared/* ou outra seção.
Não instalar, importar ou usar GSAP/Lenis antes da etapa 6.
Fonte detalhada: docs/reference/audience-desktop.txt e audience-mobile.txt. Esses arquivos contêm contexto de alta fidelidade, não devem ser importados no site.
Solicite get_screenshot se precisar observar detalhes visuais; carregue figma-design-to-code antes de get_design_context. Se houver resposta sparse, obtenha os nós filhos antes de implementar.
Exporte render(): string e init(root: HTMLElement): () => void no módulo da seção. Importe o CSS local no próprio módulo.
Use assets(group, variable) de ../shared/assets para os nomes presentes nas referências, nunca URLs temporárias. Grupos: hero-desktop, hero-mobile, results-desktop, results-mobile, audience-desktop, audience-mobile, content-desktop, content-mobile, contact-desktop e contact-mobile.
Use sectionTitle(text, group, variable, className?) e eyebrow(label, light?) de ../shared/ui para títulos vetoriais e labels.
Classes precisam começar com o nome da seção. Utilize os tokens globais. Conteúdo integral permanece visível sem animações.
Imagens de capa devem manter 9:16; decorativas têm alt vazio. Preserve os textos e avisos do Figma.
Links e botões precisam de nomes acessíveis e foco visível.
No fim, informe pendências, arquivos e verificações. Não faça commits.

## Implementação e comportamento
Seção rosa id publico, título Quem me acompanha e introdução em creme. Seletor de plataforma claro e três cards creme para gênero, faixa etária e localização.
Desktop em três colunas; mobile empilha os cards e mantém tabelas legíveis. Cabeçalhos, linhas e notas devem seguir exatamente o Figma.
Usar platformTabs('audience', true) e mountTabs no init, com painéis audience-panel-instagram e audience-panel-tiktok.
Solicitar variantes TikTok se necessário. Os dados pendentes do TikTok não podem herdar números do Instagram.
Preservar tipo de público [seguidores / contas alcançadas], fonte e data de consulta. Não inferir profissões, interesses ou número de pessoas diferentes.
Estruturar distribuições com tabelas semânticas ou listas associando rótulo a valor. Evitar tabelas que forcem overflow na tela 320.

## Critérios de aceite
Corresponder às duas referências, com adaptação fluida nas larguras intermediárias. Sem overflow horizontal da página; somente trilhas intencionais podem recortar capas.
Navegação por teclado, foco visível e imagens sem distorção. Dados não validados continuam identificados como pendentes.
Nenhuma animação GSAP/Lenis ou dependência compartilhada criada pela seção.

