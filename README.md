# Mídia kit da Dotinha Tosadora

Landing page de Vitória Dota, implementada a partir dos layouts desktop e mobile atuais do Figma. O projeto usa Vite, TypeScript, HTML semântico e CSS. O carrossel de apresentação usa Swiper. Na seção Conteúdo, GSAP coordena a sequência circular de capas e a abertura do texto de cada item. A camada de movimento e rolagem usa GSAP e Lenis.

## Executar localmente

Com Node.js e npm disponíveis, execute na raiz do projeto:

```powershell
npm install
npm run dev
```

Abra o endereço local informado pelo Vite. O servidor fica restrito ao próprio computador por padrão.

```powershell
npm run check
npm run build
npm run preview
```

O build gera a pasta dist. Não há backend ou variáveis de ambiente necessárias. A entrega não inclui publicação ou configuração de hospedagem.

## Referências e organização

- [Desktop no Figma](https://www.figma.com/design/QjE7zWQhBFwe7OZbHQGOaD/M%C3%ADdia-kit?node-id=12-2) e [mobile no Figma](https://www.figma.com/design/QjE7zWQhBFwe7OZbHQGOaD/M%C3%ADdia-kit?node-id=14-2) são as referências de layout.
- [Plano](docs/PLAN.md) e [specs](docs/specs/00-foundation.md) documentam as etapas, os contratos e a divisão entre agentes.
- [Validação](docs/VALIDATION.md) registra os checks executados, as evidências e os limites da revisão.
- src/sections contém um módulo e um CSS para cada seção. Cada módulo exporta render e init; init retorna uma função de limpeza.
- src/shared reúne assets, títulos, tabs, carrossel e modal. Os seletores de plataforma e as instâncias de carrossel permanecem independentes.
- src/motion reúne animações e scroll. Essa camada foi iniciada somente após a revisão da página estática.
- public/assets contém os arquivos originais recebidos do Figma. docs/reference guarda o contexto consultado e não é importado no site.

## Estudo do mascote

O mascote animado está disponível somente em `/estudo-mascote/index.html`, com o servidor local em execução. A página reúne os movimentos aprovados de caminhada, salto e aceno. A home não carrega esse personagem nem seus controles. Consulte [o registro do estudo](docs/mascot-study.md) para os assets, prompts e verificações realizadas.

O versionamento inclui o código, os assets, os prints de referência e os estudos de arte. Dependências, build, capturas temporárias e cópias automáticas do Blender ficam fora do Git. O auxiliar histórico `tmp/brand_titles.py` foi preservado por ser uma referência da documentação do projeto.

## Atualizar o conteúdo

Os textos de apresentação ficam em hero.ts; métricas e seus avisos em results.ts; distribuições de audiência em audience.ts; conteúdos em destaque em content.ts; formatos e canais em contact.ts.

Os dados entre colchetes são pendentes do Figma e precisam de conferência antes de uso público. Instagram e TikTok têm estruturas independentes. Totais do período, medianas habituais e resultados acumulados de publicações devem continuar separados.

## Vídeos

Os Reels usados no site estão listados em src/shared/videos.ts, com a descrição de cada um, a data de publicação e a duração do take. O hero mostra cinco deles, na ordem de heroReels. A seção Conteúdo mostra todos, na ordem de contentReels.

Cada vídeo tem quatro arquivos em public/videos: a capa estática (`-thumb.webp`), usada nos itens inativos; o take curto e mudo (`-take.webm` e `-take.mp4`), que toca no item ativo; e o vídeo completo em WebM, aberto no modal com um link para a publicação no Instagram. Com movimento reduzido, os takes não tocam e a capa permanece.

Os arquivos são gerados por scripts/build-videos.sh a partir dos downloads originais em videos-instagram/, que fica fora do Git. Para mudar um trecho, altere os tempos no início do script e a duração correspondente em videos.ts, e rode `bash scripts/build-videos.sh --takes-only`. O script precisa do ffmpeg com libvpx, libopus, libx264 e libwebp.

Os textos dos cards da seção Conteúdo ficam em content.ts. Os resultados vêm de prints-posts-selecionados/metricas.md e são acumulados desde a publicação até a data de consulta, que aparece no card. Ao atualizar as métricas, troque os números e a data de consulta juntos e mantenha cada resultado associado ao vídeo da mesma publicação.

O Figma atual informa cinco anos de experiência, preservados no hero. A apresentação histórica registrada em AGENTS.md informava quatro.

## Fontes e identidade

O texto usa DM Sans, carregada pelo Google Fonts. Os cinco títulos principais são texto HTML e usam Rayton Brink Regular, carregada localmente por @font-face de public/fonts/raytonbrink-regular.otf, com preload e font-display: swap. Os tamanhos e as quebras se adaptam ao espaço disponível.

A fonte foi incluída a pedido de Lucas a partir do arquivo instalado no Windows. O arquivo informa copyright de Zarma Type (2025), mas não contém licença de uso web. A autorização para distribuição web continua pendente de comprovação antes da publicação.

O logo, o mascote, as ilustrações e os ícones foram preservados. As capas mantêm proporção 9:16. O conteúdo de orientação interna e os preços discutidos no orçamento não fazem parte da página.

Os assets já estão incluídos localmente. scripts/download-assets.mjs registra os downloads desta sessão; os endereços temporários do Figma expiram, portanto um novo download futuro pode exigir atualizar as referências pelo MCP. O site usa somente os arquivos locais.
