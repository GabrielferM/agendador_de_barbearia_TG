# Administração integrada

## Implementado: clientes

`/admin/clientes` exige `GERENCIAR_USUARIOS`. Lista, indicadores e datas vêm de `GET /dashboard/administrador/clientes`; busca por nome/telefone/e-mail, status e paginação são executados no servidor. Indicadores são globais, independentemente da busca. Cadastro/detalhe/edição/exclusão usam `/clientes` e `/clientes/:id`. Senha e CPF são informados na criação; senha vazia na edição preserva a anterior. O PATCH aceita `StatusUsuario` (ATIVO, INATIVO, BLOQUEADO), alterando o usuário relacionado atomicamente com o cadastro.

Exclusão é física e bloqueada por agendamentos; inativação usa edição de status. A tela confirma a exclusão, preserva formulários em falhas, verifica status HTTP e invalida caches após gravações. Não usa demonstração como fallback. As permissões do servidor continuam sendo a autoridade.

## Matriz de implementação

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Clientes: lista, busca, status, indicadores | GET dashboard/administrador/clientes; métricas derivadas de Usuario e Agendamento | GERENCIAR_USUARIOS | Testes de busca, erro HTTP e cadastro; consulta paginada real |
| Clientes: cadastro, detalhe, edição, status, exclusão | POST/GET/PATCH/DELETE clientes; Usuario e Cliente | GERENCIAR_USUARIOS | DTO de status e sanitização; exclusão com vínculos deve retornar conflito |

## Regra para novas alterações

Não derive totais globais da página carregada. Alterações de catálogo e agenda precisam invalidar os respectivos indicadores. Preserve contratos de sessão/CSRF e os estados de carregamento, vazio e falha.

## Validação e limites

Testes com respostas HTTP/Prisma simuladas não comprovam persistência em PostgreSQL. Cada PR informa checks executados e limitações de banco e navegador. Consulte [testes](testes.md) e [integração HTTP](integracao-api.md).

## Implementado: barbeiros

`/admin/barbeiros` usa GET `dashboard/administrador/barbeiros` (busca, status profissional, paginação) e CRUD `/barbeiros`. Exige `GERENCIAR_USUARIOS`. Indicadores são globais; a lista é filtrada. Filiais ativas vêm do catálogo público, percorrendo todas as páginas, sem exigir a permissão de gerenciar filiais. Filial ausente bloqueia novo cadastro. Status profissional ATIVO/INATIVO/AFASTADO não altera `Usuario.status`. Exclusão com agendamentos/comissões retorna conflito.

Especialidades, jornada individual, disponibilidade percentual e comissão fixa foram retiradas da tela integrada porque não são persistidas. A descrição cadastral e as métricas reais de atendimento/receita/comissões permanecem. A foto é cadastrada por URL; não há upload.

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Barbeiros: lista, busca, status e métricas | GET dashboard/administrador/barbeiros; agregados de Agendamento/Comissao | GERENCIAR_USUARIOS | Busca/paginação no servidor com ordenação estável |
| Barbeiros: CRUD e filial | POST/GET/PATCH/DELETE barbeiros; GET público/filiais | GERENCIAR_USUARIOS | Detalhe/edição persistem campos reais; vínculos impedem exclusão |

## Implementado: serviços

`/admin/servicos` exige GERENCIAR_SERVICOS e usa GET dashboard/administrador/servicos com busca, ativo e paginação. Indicadores são globais: ativos, mais realizado e receita dos atendimentos concluídos dividida pela quantidade desses atendimentos (ticket médio). POST/GET/PATCH/DELETE /servicos implementam cadastro, detalhe, edição e exclusão. PATCH aceita `ativo` booleano. Nome, descrição, preço base e duração são persistidos; preços e durações históricos dos itens de agendamento não são alterados.

Categoria, filtro de categoria e percentual fixo de comissão foram removidos por ausência no schema. Exclusão com itens vinculados retorna conflito; inativação permanece disponível e impede novas seleções pelo catálogo público/agendamento.

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Serviços: busca, situação, lista e indicadores | GET dashboard/administrador/servicos | GERENCIAR_SERVICOS | Paginação real; total global não depende da página |
| Serviços: CRUD e ativação | POST/GET/PATCH/DELETE servicos; Servico.ativo | GERENCIAR_SERVICOS | Payload de preço/ativação; preservação dos itens históricos |

## Implementado: agendamentos

`/admin/agendamentos` exige GERENCIAR_AGENDAMENTOS. A agenda consulta GET dashboard/administrador/agendamentos por período (máximo de 31 dias), busca por nome do cliente/profissional, IDs de cliente/barbeiro/filial e status. Dia, semana de segunda a domingo e mês usam datas em America/Sao_Paulo; a visualização mensal consulta somente os dias do mês, sem exceder o limite com dias adjacentes. O resumo reflete o dia selecionado e os filtros, incluindo NAO_COMPARECEU.

O formulário usa opções paginadas de clientes (GET dashboard/administrador/agendamentos/clientes: somente ID/nome de clientes ativos), filiais e catálogo públicos reais. O cadastro envia origem ADMINISTRADOR e itens com quantidade/desconto. Horários livres são sugestões para uma unidade de cada serviço; a gravação sempre revalida duração, expediente, vínculos e conflitos. A edição mantém itens/preços históricos quando os serviços não foram alterados e permite trocar os vínculos apenas ao administrador. Itens ou vínculos com comissões não podem ser alterados; cancelar exige resolver comissões ainda não canceladas/estornadas.

POST/PATCH/GET/DELETE agendamentos são os contratos de gravação/detalhe. Exclusão é confirmada e apaga também histórico; comissões vinculadas impedem exclusão. Cancelamento exige motivo e mantém o histórico. Estados finais não permitem edição e as transições seguem a máquina de estados existente. Início/fim reais são registrados ao iniciar/concluir.

Mudanças de status e histórico são gravados na mesma transação serializável; o responsável vem da sessão. POST historico-status passa pela mesma regra de transição e não permite inventar histórico desacoplado do estado do atendimento. Status anterior informado e desatualizado resulta em conflito. Cadastro autenticado também grava o estado inicial por nested write. O histórico tem consulta paginada própria. Nenhuma tela faz duas mutações para sincronizar status e histórico.

Swagger distingue respostas administrativas de respostas de cliente/barbeiro e descreve IDs e descontos necessários à edição. A declaração de quantidade/desconto de entrada explicita tipo numérico, corrigindo o contrato gerado como objeto.

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Agenda, busca, filtros e resumo | GET dashboard/administrador/agendamentos; agregados dos itens | GERENCIAR_AGENDAMENTOS | Dias vazios, meses de até 31 dias e fuso; filtros aplicados no banco |
| Cadastro, detalhe, vínculos, itens, status/cancelamento/exclusão | POST/GET/PATCH/DELETE agendamentos | GERENCIAR_AGENDAMENTOS | Formulário e payload real; transação, conflitos e preços históricos |
| Clientes para seleção e histórico | GET dashboard/administrador/agendamentos/clientes; GET agendamentos/:id/historico-status | GERENCIAR_AGENDAMENTOS / acesso ao próprio recurso | Projeção sem dados privados; paginação e responsável da sessão |
