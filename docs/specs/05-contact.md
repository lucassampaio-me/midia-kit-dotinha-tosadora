# Spec 05: Parcerias e contato
Responsável: agente exclusivo da seção.
Desktop: 13:56. Mobile: 35:1118.
Arquivos exclusivos: src/sections/contact.ts e src/sections/contact.css.

## Contratos obrigatórios
Leia docs/PLAN.md, docs/specs/00-foundation.md e AGENTS.md.
Implemente exclusivamente a seção atribuída, em desktop e mobile. Não edite package.json, lockfile, src/main.ts, src/styles.css, src/shared/* ou outra seção.
Não instalar, importar ou usar GSAP/Lenis antes da etapa 6.
Fonte detalhada: docs/reference/contact-desktop.txt e contact-mobile.txt. Esses arquivos contêm contexto de alta fidelidade, não devem ser importados no site.
Solicite get_screenshot se precisar observar detalhes visuais; carregue figma-design-to-code antes de get_design_context. Se houver resposta sparse, obtenha os nós filhos antes de implementar.
Exporte render(): string e init(root: HTMLElement): () => void no módulo da seção. Importe o CSS local no próprio módulo.
Use assets(group, variable) de ../shared/assets para os nomes presentes nas referências, nunca URLs temporárias. Grupos: hero-desktop, hero-mobile, results-desktop, results-mobile, audience-desktop, audience-mobile, content-desktop, content-mobile, contact-desktop e contact-mobile.
Use sectionTitle(text, group, variable, className?) e eyebrow(label, light?) de ../shared/ui para títulos vetoriais e labels.
Classes precisam começar com o nome da seção. Utilize os tokens globais. Conteúdo integral permanece visível sem animações.
Imagens de capa devem manter 9:16; decorativas têm alt vazio. Preserve os textos e avisos do Figma.
Links e botões precisam de nomes acessíveis e foco visível.
No fim, informe pendências, arquivos e verificações. Não faça commits.

## Implementação e comportamento
Seção id parcerias com margem externa creme e card marrom arredondado. Título Vamos criar juntos?, quatro formatos (Reels, Stories, Eventos e experiências, TikTok), mascote original e contato comercial.
Desktop formatos em grade com mascote grande à direita; mobile lista vertical e mascote central encostada no contato, conforme o frame atual. Não posicionar mascote sobre texto.
Card creme Conte sua ideia, parágrafo de briefing, três canais e marca original fullsize no rodapé.
Links atuais do Figma: WhatsApp https://wa.me/5511980328462, Instagram https://www.instagram.com/dotinha.tosadora/ e TikTok https://www.tiktok.com/@dotinha.tosadora. Exibir telefone (11) 98032-8462 e perfil @dotinha.tosadora.
Sem formulário, backend, preços ou envio de mensagens. Links externos usam rel noopener noreferrer quando abrem nova aba.
Exportar mascote e marca originais a partir dos assets recebidos. Preservar recorte e proporção, sem desenhar substitutos.

## Critérios de aceite
Corresponder às duas referências, com adaptação fluida nas larguras intermediárias. Sem overflow horizontal da página; somente trilhas intencionais podem recortar capas.
Navegação por teclado, foco visível e imagens sem distorção. Dados não validados continuam identificados como pendentes.
Nenhuma animação GSAP/Lenis ou dependência compartilhada criada pela seção.

