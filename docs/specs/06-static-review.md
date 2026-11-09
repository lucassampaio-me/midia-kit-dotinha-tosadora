# Spec 06: Integração e marco estático
Responsável: coordenador. Dependência: cinco seções entregues.

## Trabalho
Montar seções na ordem do Figma e executar todos os init com cleanup. Conferir estilos compartilhados, identidade, espaçamento e transições de fundo.
Validar carrosséis manuais, seleção de plataforma independente, links, modal, Escape, foco restaurado e bloqueio/restauração do scroll.
Revisar navegador em 1440 e 390 px contra os renders do Figma, além de 320, 768 e 1024. Corrigir overflow, proporção, cortes e ilegibilidade.
Conferir cada imagem visível contra asset, camada, arquivo não vazio e geometria renderizada. Verificar falhas no console e nas requisições.
Rodar checagem TypeScript e build. Não criar testes que apenas repitam strings de implementação.
Registrar evidências, limitações e pendências em docs/VALIDATION.md.

## Marco de liberação
Só marcar ESTÁTICA CONCLUÍDA se as cinco seções estiverem integradas, as interações essenciais funcionarem, os checks passarem e a inspeção visual ocorrer.
GSAP/Lenis só podem ser instalados e seus agentes iniciados após esse registro.
Se preview/navegador não puder ser executado, registrar o impedimento e resolver antes de declarar o marco; não afirmar validação inexistente.

