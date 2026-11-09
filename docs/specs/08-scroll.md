# Spec 08: Scroll Lenis
Responsável: agente de scroll. Dependência obrigatória: ESTÁTICA CONCLUÍDA na spec 06.
Arquivos exclusivos: src/motion/scroll.ts.

## Contrato
Exportar initScroll(root: HTMLElement): () => void. Lenis tem uma única instância e integração com GSAP ticker e ScrollTrigger.update.
Não usar autoRaf e ticker manual simultaneamente. Converter segundos do ticker para milissegundos ao chamar raf, conforme documentação.
Manter âncoras reais, hash, teclado e acesso direto às seções. Destino não pode ficar escondido atrás da navegação. Não bloquear scroll touch nativo nem gestos horizontais do Swiper.
Usar anchors conforme versão efetivamente instalada e documentação atual. Movimento reduzido desativa suavização. Sem JavaScript ou falha de inicialização, scroll nativo funciona.

## Modal e ciclo de vida
Respeitar dialog aberto: suspender suavização e permitir scroll interno do modal. Retomar ao fechar sem saltar posição.
Remover callback do ticker e listener de scroll no cleanup, destruir Lenis e restaurar alterações globais. Coordenador integra sinalização de modal se necessária.
Não editar animações, hero, tokens ou contratos compartilhados sem mensagem ao coordenador.

## Aceite
Uma única fonte de frames, sem jitter nas seções, âncoras funcionais, modal rolável, movimento reduzido e cleanup conferidos. Validar desktop e touch/mobile.

