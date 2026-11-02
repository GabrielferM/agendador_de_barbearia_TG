# Área do cliente — revisão visual

Capturas em Chromium headless com sessão e respostas HTTP simuladas, sem uso de
banco real. Os dados são fictícios. “Antes” corresponde à base `main` em `bf5e1fb`;
“depois” corresponde à implementação desta PR. Desktop: 1440 × 1000; celular:
390 × 844. As telas de lista são capturadas na íntegra; o modal usa o viewport.

| Interface | Antes, desktop | Depois, desktop | Antes, celular | Depois, celular |
| --- | --- | --- | --- | --- |
| Lista | [Imagem](antes-lista-desktop.png) | [Imagem](depois-lista-desktop.png) | [Imagem](antes-lista-celular.png) | [Imagem](depois-lista-celular.png) |
| Cancelamento | [Imagem](antes-cancelamento-desktop.png) | [Imagem](depois-cancelamento-desktop.png) | [Imagem](antes-cancelamento-celular.png) | [Imagem](depois-cancelamento-celular.png) |
| Confirmação após agendar | [Imagem](antes-sucesso-desktop.png) | [Imagem](depois-sucesso-desktop.png) | [Imagem](antes-sucesso-celular.png) | [Imagem](depois-sucesso-celular.png) |

| Estado adicional | Desktop | Celular |
| --- | --- | --- |
| Histórico com status finais e pendente passado | [Imagem](depois-historico-desktop.png) | [Imagem](depois-historico-celular.png) |
| Detalhes expandidos | [Imagem](depois-detalhes-desktop.png) | [Imagem](depois-detalhes-celular.png) |
| Vazio | [Imagem](depois-vazio-desktop.png) | [Imagem](depois-vazio-celular.png) |
| Erro | [Imagem](depois-erro-desktop.png) | [Imagem](depois-erro-celular.png) |
| Carregamento | [Imagem](depois-carregando-desktop.png) | [Imagem](depois-carregando-celular.png) |
| Textos longos e 24 registros | [Imagem](depois-longos-desktop.png) | [Imagem](depois-longos-celular.png) |

A inspeção percorreu abas, expansão dos detalhes, paginação de dez itens, abertura
e fechamento do diálogo por Escape, foco inicial no motivo e retorno ao botão de
origem. Também percorreu cancelamento com conflito 409 preservando o motivo,
nova tentativa com sucesso e atualização das contagens. O fluxo real da interface
foi percorrido de seleção de barbeiro até a confirmação final, com o calendário
HeroUI real e HTTP simulado. Conferiu ausência de overflow horizontal nos estados
capturados depois da alteração. Erros 409/503 no console foram provocados pelos
cenários de falha, sem erros JavaScript da aplicação.

Estas evidências não comprovam sessão, autorização, persistência nem concorrência
em uma API/PostgreSQL reais. O carregamento completo por páginas pode custar mais
requisições para históricos extensos; veja o [guia da jornada](../../../back-end/doc/agendamento-cliente.md).

Também foram verificadas larguras de 320 e 768 px, sem overflow horizontal.
