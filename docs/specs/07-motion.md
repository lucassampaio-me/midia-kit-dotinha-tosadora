# Spec 07: Animações GSAP
Responsável: agente de animações. Dependência obrigatória: ESTÁTICA CONCLUÍDA na spec 06.
Arquivos exclusivos: src/motion/animations.ts. Alterações em seções são solicitadas ao coordenador.

## Contrato
Exportar initAnimations(root: HTMLElement): () => void. Importar gsap e ScrollTrigger apenas nesta fase.
Usar gsap.matchMedia/context com escopo local e cleanup revert. O HTML e a primeira dobra começam visíveis. Quando o movimento é ativado, preparar os grupos fora da tela com opacidade zero antes da rolagem e reproduzir a entrada ao atingir o gatilho. Não aplicar o estado inicial dentro de onEnter, pois isso faz o conteúdo já visível piscar. O foco deve revelar o grupo imediatamente, e movimento reduzido deve restaurar a visibilidade.
Definir animações discretas: entrada de títulos e grupos de cards com deslocamento de até 24 px, duração de aproximadamente 0,5 s e stagger curto. Executar uma vez por grupo. Não animar valores pendentes como contadores nem criar parallax/pinning não solicitado.
Respeitar prefers-reduced-motion e mudanças da preferência sem reload. Não esconder elementos que o usuário já focou.

## Hero automático
Ativar autoplay de 4000 ms no Swiper do hero depois do marco estático. Progresso circular reflete tempo real do próprio autoplay. Usar evento/estado da instância, nunca outro temporizador que derive.
Coordenador integra o hook de autoplay no hero em colaboração com este agente. Autoplay suspende em foco/interação, hover, página oculta ou movimento reduzido; controle de pausar/retomar acessível.
GSAP não pode modificar o transform da trilha/slides que pertencem ao Swiper.

## Aceite
Sem texto cortado, flicker, acúmulo de listeners ou animação repetida após cleanup. Movimento reduzido mantém página completamente utilizável.
A instância Lenis e seu ticker pertencem à spec 08. Não criar outro loop global de scroll.

