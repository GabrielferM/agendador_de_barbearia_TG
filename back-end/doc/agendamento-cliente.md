# Agendamento do cliente

## Implementado

O fluxo público em `/agendar` permite escolher filial, barbeiro, serviços e horário. A confirmação exige uma sessão de cliente existente; cadastro público e reagendamento pelo cliente continuam fora deste fluxo. `/cliente/agendamentos` permite consultar e cancelar os próprios compromissos, com motivo obrigatório e somente nas transições já permitidas (`PENDENTE`/`CONFIRMADO` para `CANCELADO`).

A arquitetura permanece Controller → AgendamentoService → caso de uso → PrismaService. O caso de uso de disponibilidade fica em [listar-horarios-disponiveis-agendamento.service.ts](../src/modules/agendamento/service/listar-horarios-disponiveis-agendamento.service.ts).

### Contratos

| Operação | Contrato |
| --- | --- |
| Filiais | `GET /publico/filiais`, somente ativas, paginado. |
| Barbeiros | `GET /publico/barbeiros?idFilial=1`, filtro opcional compatível com a página inicial; somente profissional/usuário/filial ativos. |
| Serviços | `GET /publico/servicos`, somente ativos, paginado. |
| Disponibilidade | `GET /agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-01-07&servicoIds=3&servicoIds=4`, público. |
| Confirmação | `POST /agendamentos`, autenticado, com CSRF e validação da identidade do cliente. |
| Consulta | `GET /agendamentos`, paginado e restrito ao cliente da sessão. |
| Cancelamento | `PATCH /agendamentos/:id` com `status: "CANCELADO"` e `motivoCancelamento`, autenticado e com CSRF. |

A disponibilidade retorna `fuso`, `duracaoTotalMinutos`, `valorTotal` como string decimal e `horarios: [{ inicio, fim }]` em ISO com fuso. Nenhum dado dos agendamentos ocupados é retornado. IDs de serviço não podem se repetir. Datas inexistentes, passadas e vínculos inativos/incompatíveis retornam 400; recursos inexistentes, 404; sobreposição na gravação, 409. Ausência de opções retorna 200 com lista vazia, inclusive aos domingos.

O contrato de criação continua aceitando `idCliente`, `idFilial`, `idBarbeiro`, `inicio`, `servicoIds` e observação opcional. A fachada verifica `idCliente` contra a sessão e define origem `SITE`. Os IDs de Cliente e Usuario são compartilhados no schema. Não são aceitos valores financeiros calculados pelo cliente.

As respostas de agendamento para clientes selecionam explicitamente resumo da filial/endereço, nome profissional, serviços, valores aplicados, datas, status e observações do próprio cliente. Não incluem cadastro pessoal do barbeiro/cliente, CNPJ, comissões, observações internas nem hashes. Respostas administrativas preservam seu comportamento anterior; os DTOs Swagger de agendamento documentam os campos comuns consumidos pela jornada.

### Expediente e concorrência

[expediente.ts](../src/modules/agendamento/constants/expediente.ts) centraliza a configuração tipada: segunda a sábado, 09h–18h, sem pausa, opções a cada 30 minutos, fuso IANA `America/Sao_Paulo`. O atendimento precisa terminar até as 18h. Hoje é permitido apenas para inícios estritamente futuros. A conversão independe do fuso do processo e do navegador. Não há bloqueio por feriados nem expediente individual por filial/barbeiro.

Somente `PENDENTE`, `CONFIRMADO` e `EM_ATENDIMENTO` bloqueiam horários. Intervalos adjacentes são aceitos: há sobreposição quando `inicio < outroFim && fim > outroInicio`. A consulta busca os intervalos ocupados uma vez e filtra as opções em memória. Ela não faz reserva temporária.

Criação e alterações de início/duração revalidam expediente, vínculos e serviços ativos dentro da transação serializável. Os preços e durações de uma criação vêm do banco; os itens são gravados atomicamente. Edições sem substituição de itens mantêm os valores aplicados. O helper existente repete `P2034` até três tentativas; conflito persistente retorna 409. Cancelar não exige que o horário ainda pertença ao expediente atual.

## Frontend e integração

A filial única é selecionada automaticamente: sua etapa não aparece, mas nome e endereço permanecem no resumo. Com múltiplas filiais, a seleção é a primeira etapa e exige uma escolha válida. Sem filial ativa, a jornada informa a ausência e bloqueia o avanço. Os catálogos são carregados respeitando todas as páginas. Trocar filial limpa barbeiro, data e horário e preserva somente serviços ainda ativos; uma filial removida do catálogo deixa de ser uma escolha válida. Trocar barbeiro limpa data/horário; trocar serviços preserva data e limpa horário. Disponibilidade usa `staleTime: 0` e chave com todas as escolhas; respostas antigas não substituem uma consulta nova.

O rascunho vive em memória acima das rotas, preservando escolhas e observação na navegação para login. O retorno permitido é exclusivamente `/agendar` e somente para cliente. A confirmação requer novo clique após login, reconsulta os catálogos e a disponibilidade, e não repete mutações automaticamente. Recarregar a página reinicia o rascunho. Sucesso, abandono explícito e logout o limpam; expiração da sessão mantém as escolhas e solicita login novamente.

O calendário usa HeroUI e sua biblioteca de datas `@internationalized/date`, declarada como dependência direta. Não há persistência de credenciais ou rascunho no navegador. O adapter verifica status e campos essenciais da resposta; erros HTTP não são transformados em catálogos vazios. Em 409, o horário é limpo e o cliente retorna à seleção. Se o envio tiver resultado incerto por falha de rede, a interface orienta consultar a listagem antes de tentar novamente.

## Validação e limites

Veja [testes do backend](testes.md) e [testes do frontend](../../front-end/docs/testes.md). Os testes HTTP usam Prisma simulado, portanto não comprovam concorrência real. Testes com PostgreSQL devem usar uma instância descartável, dados fictícios e as migrations existentes; nunca preparar ou limpar o banco de desenvolvimento automaticamente.

Melhorias pendentes: expediente por filial, feriados/pausas, cadastro público, reagendamento pelo cliente e chave de idempotência para criação. Essas melhorias não são garantias do fluxo atual.
