# Administração integrada

## Implementado: clientes

`/admin/clientes` exige `GERENCIAR_USUARIOS`. Lista, indicadores e datas vêm de `GET /dashboard/administrador/clientes`; busca por nome/telefone/e-mail, status e paginação são executados no servidor. Indicadores são globais, independentemente da busca. Cadastro/detalhe/edição/exclusão usam `/clientes` e `/clientes/:id`. Senha e CPF são informados na criação; senha vazia na edição preserva a anterior. Data de nascimento vazia na edição envia null e remove o valor anterior. O PATCH aceita `StatusUsuario` (ATIVO, INATIVO, BLOQUEADO), alterando o usuário relacionado atomicamente com o cadastro.

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

Especialidades, jornada individual, disponibilidade percentual e comissão fixa foram retiradas da tela integrada porque não são persistidas. A descrição cadastral e as métricas reais de atendimento/receita/comissões permanecem. A foto é cadastrada por URL; não há upload. Admissão vazia na edição envia null e remove a data anterior.

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

## Implementado: financeiro e comissões

`/admin/financeiro` exige GERENCIAR_COMISSOES. GET dashboard/administrador/financeiro retorna receita dos itens de atendimentos CONCLUIDOS por início previsto no período, série semanal e até dez atendimentos recentes. Isso não comprova pagamento do cliente. Variação compara um período anterior de mesma duração, não necessariamente o mês anterior. Períodos são inclusivos no fuso da barbearia (máximo 366 dias).

Comissões e agrupamentos usam dataGeracao no período. O total de comissões válidas soma PREVISTA, LIBERADA e PAGA; CANCELADA e ESTORNADA permanecem discriminadas por status, excluídas desse total. A tela não reduz estados mistos por barbeiro a um booleano pago. As somas financeiras usam Decimal no backend. Filtros de busca, nome do barbeiro e status da lista não alteram os indicadores globais do período.

GET /comissoes tem busca por cliente/barbeiro/serviço, nomeBarbeiro específico, status, IDs de profissional/item, período de geração e paginação estável. GET /comissoes/:id abre detalhes e datas. POST /comissoes usa item real selecionado em GET /comissoes/itens-elegiveis, com busca por cliente/barbeiro, filtro opcional idBarbeiro e paginação. Opções elegíveis não têm comissão, possuem subtotal positivo e não pertencem a atendimentos CANCELADOS/NAO_COMPARECEU. O servidor revalida a seleção na transação, calcula valor com Decimal e arredondamento de duas casas. Percentual deve ser maior que zero e no máximo 100; não há percentual padrão nem criação de segunda comissão para o mesmo item.

PATCH /comissoes/:id permite observação e transições PREVISTA → LIBERADA/CANCELADA, LIBERADA → PAGA/CANCELADA e PAGA → ESTORNADA. Liberar ou registrar pagamento exige atendimento concluído. Datas são preenchidas pelo servidor; datas explícitas só são aceitas na transição correspondente, em ordem cronológica e sem futuro. Estorno exige motivo. CANCELADA/ESTORNADA são finais, mantendo a possibilidade de atualizar observação. Operações são serializáveis e conflitos concorrentes retornam 409. Não há DELETE físico nem execução de transferência bancária. As projeções de comissão expõem apenas resumo de profissional, serviço, cliente e atendimento; removem dados cadastrais completos e observações internas do atendimento.

Foram retirados: despesas, lucro líquido, formas de pagamento, lançamento genérico, coluna de forma e exportação fictícia. Não foram criadas entidades/migrations para esses campos. A tabela de até dez atendimentos é explicitamente um recorte recente, não um relatório integral. Mocks, tipos e componentes financeiros que sustentavam essas informações foram removidos.

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Financeiro: período, receita e série | GET dashboard/administrador/financeiro; AgendamentoServico.subtotal | GERENCIAR_COMISSOES | Valores reais de concluídos, dias vazios, precisão e comparação equivalente |
| Comissões: lista/buscas/filtros/detalhe | GET comissoes e comissoes/:id | GERENCIAR_COMISSOES | Filtros e paginação no banco, sem dados cadastrais completos |
| Criação e elegibilidade | GET comissoes/itens-elegiveis; POST comissoes | GERENCIAR_COMISSOES | Item real, percentual válido, unicidade e cálculo no servidor |
| Liberação, pagamento registrado, cancelamento e estorno | PATCH comissoes/:id | GERENCIAR_COMISSOES | Máquina de estados, datas coerentes, motivo de estorno e ausência de DELETE |

## Implementado: dashboard principal e revisão de integração

`/admin` exige GERENCIAR_AGENDAMENTOS também na interface; a API mantém sua autorização. A consulta inclui identidade na chave e AbortSignal. O adapter valida as estruturas consumidas (indicadores, datas, séries, serviços, desempenho e agendamentos), sem aceitar corpo parcial como sucesso. Erros HTTP passam pelo tratamento compartilhado, incluindo espera de Retry-After em 429. Não há repetição automática para 401/403/429. Modo demonstrativo, quando explicitamente habilitado, continua identificado e não realiza mutações.

O botão Atualizar painel refaz a consulta e a tela informa quando os dados foram gerados. O subtítulo não promete tempo real. Barbeiro ativo significa profissional e conta ativos, sem afirmar disponibilidade de agenda. Receita significa itens concluídos, sem comprovação de recebimento. Agendamentos recentes são os cinco cadastrados mais recentemente, com ordenação estável por criação/ID. Serviços realizados no mês somam `quantidade` de cada item, em vez de contar linhas; somas monetárias usam Decimal. As mutações administrativas invalidam os caches de consulta, incluindo os painéis.

Na revisão integrada também foram corrigidos o ID obtido após carregar detalhes de clientes/barbeiros/serviços (usa a variável da própria mutação) e a limpeza das datas opcionais de nascimento/admissão. Campos vazios na edição enviam null; os DTOs, os casos de uso e o OpenAPI aceitam a remoção sem converter null para uma data em 1970. Senhas vazias continuam preservando a senha existente.

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Dashboard: indicadores, séries e atualização | GET dashboard/administrador; agregações de Usuario, Barbeiro e AgendamentoServico | GERENCIAR_AGENDAMENTOS | Validação de corpo, falha/permissão/nova tentativa, quantidade e precisão decimal |
| Navegação e atualização após gravações | Rotas administrativas e invalidação TanStack Query | Permissão de cada tela | Abrir agenda e recarregar dados sem números fixos no modo real |

## Resultado da validação da sequência

Verificações finais: frontend lint/build e 65 testes em 13 arquivos; backend geração Prisma/build, 80 testes unitários em 24 suítes, 11 testes HTTP, lint e format:check. A suíte frontend foi executada com `npm test -- --maxWorkers=2` para limitar a concorrência de ambientes jsdom. Lint do backend conclui com quatro avisos de tipos em testes, sem erros. Vite informa aviso de tamanho do bundle.

Também foi executado um roteiro HTTP com Prisma/PostgreSQL reais, em instância temporária local isolada, com banco novo e dados sintéticos: 62 requisições e 144 verificações aprovadas. Somente nesse banco temporário foram aplicadas as migrations históricas existentes; não houve alteração de schema/migrations do projeto ou acesso ao banco configurado pelo usuário. A instância temporária foi encerrada ao final.

O roteiro real verificou criação, edição, releitura, filtros, status/inativação e exclusão com e sem vínculos de clientes/barbeiros/serviços; conflitos de agenda; reagendamento; transições e responsável do histórico; elegibilidade, cálculo, duplicidade, liberação/pagamento/estorno de comissão; totais financeiros e métricas do painel; autorização e CSRF. Métricas do dia foram verificadas também com fixture sintética de atendimento concluído. O driver pg emitiu aviso de depreciação de consulta concorrente, sem reprovar o roteiro.

A revisão foi feita pelo próprio implementador. Inspeção visual responsiva e de foco em navegador não foi executada: não havia navegador de teste disponível. Os testes de interface usam jsdom. A validação real não comprova todas as condições possíveis de concorrência em produção.

## PRs e ordem de integração

As PRs são empilhadas; cada uma deve ser integrada antes de atualizar a base da próxima para main, resolvendo conflitos e conferindo novamente os checks quando necessário. Não houve merge automático.

| Tela | Branch | PR | Dependência |
| --- | --- | --- | --- |
| Clientes | feat/admin-clientes-crud-20261022 | [#16](https://github.com/GabrielferM/agendador_de_barbearia_TG/pull/16) | main |
| Barbeiros | feat/admin-barbeiros-crud-20261022 | [#17](https://github.com/GabrielferM/agendador_de_barbearia_TG/pull/17) | #16 |
| Serviços | feat/admin-servicos-crud-20261022 | [#18](https://github.com/GabrielferM/agendador_de_barbearia_TG/pull/18) | #17 |
| Agendamentos | feat/admin-agendamentos-crud-20261022 | [#19](https://github.com/GabrielferM/agendador_de_barbearia_TG/pull/19) | #18 |
| Financeiro | feat/admin-financeiro-crud-20261022 | [#20](https://github.com/GabrielferM/agendador_de_barbearia_TG/pull/20) | #19 |
| Dashboard principal e revisão | feat/admin-dashboard-crud-20261022 | PR que contém esta versão do guia | #20 |
