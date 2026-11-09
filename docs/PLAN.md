# Plano de implementação
Status: implementação local concluída, cinco seções revisadas, animações e scroll integrados e build final validado. Publicação fora do escopo desta entrega.
Data: 7 de novembro de 2026.

## Objetivo e fontes
Implementar localmente a landing page atual do Figma, com conteúdo editável, assets originais e as adaptações mobile desenhadas por Lucas.
Desktop: https://www.figma.com/design/QjE7zWQhBFwe7OZbHQGOaD/M%C3%ADdia-kit?node-id=12-2
Mobile: https://www.figma.com/design/QjE7zWQhBFwe7OZbHQGOaD/M%C3%ADdia-kit?node-id=14-2
Os layouts atuais do site prevalecem sobre a apresentação histórica. Não alterar o Figma.
Não há autorização de publicação nesta entrega. Preparar aplicação e preview locais.

## Decisões de base
Vite com TypeScript, HTML semântico e CSS, sem framework de interface. A página tem cinco seções e não requer backend ou roteamento.
Swiper para os dois carrosséis. GSAP e Lenis entram exclusivamente depois do marco estático.
Pacotes e versões efetivamente instalados serão registrados no lockfile. A presença local da fonte Rayton não autoriza sua distribuição: usar os letterings vetoriais existentes com títulos acessíveis.
Dados pendentes permanecem explicitamente pendentes no preview, sem números inventados. Nenhum preço interno entra no site.
As capas e links finais de vídeo ainda precisam ser conferidos: o Figma informa capas provisórias. Modal não deve fingir reproduzir um vídeo inexistente.

## Etapas e specs
| Etapa | Spec | Responsável | Dependência |
| --- | --- | --- | --- |
| 0. Fundação e contratos compartilhados | [00](specs/00-foundation.md) | Coordenador | Todas as specs prontas |
| 1. Apresentação | [01](specs/01-hero.md) | Agente da seção | 0 |
| 2. Resultados | [02](specs/02-results.md) | Agente da seção | 0 |
| 3. Público | [03](specs/03-audience.md) | Agente da seção | 0 |
| 4. Conteúdos em destaque | [04](specs/04-content.md) | Agente da seção | 0 |
| 5. Parcerias e contato | [05](specs/05-contact.md) | Agente da seção | 0 |
| 6. Integração e revisão estática | [06](specs/06-static-review.md) | Coordenador | 1 a 5 |
| 7. Animações GSAP | [07](specs/07-motion.md) | Agente de animações | Marco estático aprovado na etapa 6 |
| 8. Scroll Lenis | [08](specs/08-scroll.md) | Agente de scroll | Marco estático aprovado na etapa 6 |
| 9. Revisão final | [09](specs/09-final-review.md) | Coordenador | 7 e 8 |

## Orquestração
Manter no máximo três agentes de execução junto ao coordenador. Primeira rodada: Apresentação, Resultados e Público. Conforme cada agente finalizar, atribuir Conteúdos e Contato às vagas liberadas.
Cada agente de seção entrega desktop e mobile juntos, com estilos locais e sem editar arquivos compartilhados.
O coordenador é o único dono de package.json, lockfile, entrada da página, tokens e componentes compartilhados. Agentes pedem mudanças nesses contratos por mensagem.
Após integrar as cinco seções, registrar evidências em docs/VALIDATION.md. Somente esse marco libera os agentes de GSAP e Lenis, que têm arquivos separados.
Nenhum agente começa código de seção antes de todas as dez specs estarem gravadas. Revisões posteriores das specs são registradas antes de mudar contratos.

## Conclusão de tarefa
Cada entrega informa arquivos alterados, comportamento implementado, verificação executada e pendências reais.
Build e checagem TypeScript devem passar. Revisão visual compara Figma e navegador a 1440 e 390 px, com verificações adicionais em 320, 768 e 1024 px.
A conclusão local não equivale a conteúdo validado para publicação: datas, métricas, capas e vídeos pendentes são listados no handoff.

