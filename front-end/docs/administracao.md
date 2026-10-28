# Administração integrada

## Implementado: clientes

`/admin/clientes` exige `GERENCIAR_USUARIOS`. Lista, indicadores e datas vêm de `GET /dashboard/administrador/clientes`; busca por nome/telefone/e-mail, status e paginação são executados no servidor. Indicadores são globais, independentemente da busca. Cadastro/detalhe/edição/exclusão usam `/clientes` e `/clientes/:id`. Senha e CPF são informados na criação; senha vazia na edição preserva a anterior. O PATCH aceita `StatusUsuario` (ATIVO, INATIVO, BLOQUEADO), alterando o usuário relacionado atomicamente com o cadastro.

Exclusão é física e bloqueada por agendamentos; inativação usa edição de status. A tela confirma a exclusão, preserva formulários em falhas, verifica status HTTP e invalida caches após gravações. Não usa demonstração como fallback. As permissões do servidor continuam sendo a autoridade.

## Matriz de implementação

| Tela/ação | Fonte/contrato | Permissão | Verificação/aceite |
| --- | --- | --- | --- |
| Clientes: lista, busca, status, indicadores | GET dashboard/administrador/clientes; métricas derivadas de Usuario e Agendamento | GERENCIAR_USUARIOS | Testes de busca, erro HTTP e cadastro; consulta paginada real |
| Clientes: cadastro, detalhe, edição, status, exclusão | POST/GET/PATCH/DELETE clientes; Usuario e Cliente | GERENCIAR_USUARIOS | DTO de status e sanitização; exclusão com vínculos deve retornar conflito |
| Agendamentos: consulta e resumo por dia, semana e mês | GET dashboard/administrador/agendamentos | GERENCIAR_AGENDAMENTOS | Testes de consulta real com HTTP simulado, navegação, vazio, erro e permissão |

## Regra para novas alterações

Não derive totais globais da página carregada. Alterações de catálogo e agenda precisam invalidar os respectivos indicadores. Preserve contratos de sessão/CSRF e os estados de carregamento, vazio e falha.

## Validação e limites

Testes com respostas HTTP/Prisma simuladas não comprovam persistência em PostgreSQL. Cada PR informa checks executados e limitações de banco e navegador. Consulte [testes](testes.md) e [integração HTTP](integracao-api.md).

## Implementado: consulta da agenda

`/admin/agendamentos` exige `GERENCIAR_AGENDAMENTOS` e consulta `GET /dashboard/administrador/agendamentos` com `inicioDe` e `inicioAte`. Usa o cliente gerado com adapter que confere status, sequência completa dos dias e campos consumidos. A tela sempre usa a API, inclusive quando `VITE_USAR_DADOS_MOCKADOS=true`; não há fallback demonstrativo.

A abertura mostra a semana atual, de segunda a domingo. Dia, semana e mês permitem navegar entre períodos e voltar para hoje. Datas e horários seguem America/Sao_Paulo. Selecionar um dia atualiza seu resumo; contagens e rótulos contemplam os seis status reais. Carregamento, falha com nova tentativa e períodos/dias vazios são distintos. Queries incluem usuário e período e recebem sinal de cancelamento.

Cadastro e alteração administrativos de agendamentos permanecem pendentes; os antigos controles demonstrativos de criação foram retirados. Essa integração cobre leitura, sem alterar contratos ou persistência. Testes usam HTTP simulado e não comprovam acesso a banco real.

## Dashboard integrado

`/admin` sempre consulta `GET /dashboard/administrador`, inclusive com mocks habilitados. Exige `GERENCIAR_AGENDAMENTOS`, usa cache por usuário e cancelamento da consulta, valida a resposta e distingue falha e vazio. Indicadores e gráficos vêm do servidor. Receita representa o valor dos serviços concluídos, não confirmação de pagamento.

## Barbeiros integrados

`/admin/barbeiros` sempre consulta `GET /dashboard/administrador/barbeiros` com busca, status e paginação no servidor e `GERENCIAR_USUARIOS`. Indicadores são globais; cards correspondem à página filtrada. Cache inclui usuário e filtros; consultas são canceláveis, verificam status e validam dados. Não há fallback de mocks.

Cards mostram filial, status, agendamentos do dia (exceto cancelados), receita concluída e comissões registradas. O total global a pagar inclui todos os períodos; o valor no card inclui apenas comissões geradas no mês. Especialidades, jornada e percentual padrão não existem no schema; a tela informa essa ausência. Cadastro/edição e disponibilidade individual ficam fora desta consulta, sem controles fictícios.

## Serviços integrados

`/admin/servicos` consulta `GET /dashboard/administrador/servicos` com busca, status ativo/inativo e paginação no servidor, exigindo `GERENCIAR_SERVICOS`. Indicadores globais vêm do servidor, inclusive o ticket médio por atendimento concluído. A tabela mostra preço, duração, status e realizações/receita do mês. Validação, cancelamento, cache por usuário, carregamento, vazio e nova tentativa seguem o padrão administrativo. Mocks não são usados. Categoria e comissão padrão não existem no schema e são sinalizadas como indisponíveis. Esta entrega cobre consulta; não apresenta botões de gravação fictícios.

## Financeiro integrado

`/admin/financeiro` exige `GERENCIAR_COMISSOES` e consulta `GET /dashboard/administrador/financeiro`. Abre do início do mês até hoje em America/Sao_Paulo; formulário aplica um período válido. Cache inclui usuário e período, com cancelamento, validação da resposta, erro/nova tentativa e vazios independentes para atendimentos e comissões.

Exibe receita de serviços concluídos, variação contra o intervalo anterior de mesma duração, série em intervalos de sete dias, dez últimos atendimentos concluídos e comissões por barbeiro separadas nos cinco status reais. Total registrado inclui canceladas/estornadas, sem rotulá-lo como valor devido. Receita não comprova recebimento. O banco não registra despesas nem formas de pagamento: não há números inventados de despesas/lucro, gráfico de pagamentos ou botões fictícios para lançamento/exportação. Persistência desses conceitos e respectivas ações exige evolução própria do domínio.

## Hierarquia visual administrativa

As seis telas compartilham a composição `.painel-administrador`, preservando sidebar
marrom, item ativo caramelo, fundo creme e toolbars em `support`. Clientes usa cards
para indicadores. Tabelas têm cabeçalho, separadores, hover e ações compactas com
nomes acessíveis. Formulários focam o primeiro campo e bloqueiam envio pendente.
Hoje recebe indicação textual independente da seleção no calendário. Gráficos sem
atividade usam estado vazio, sem barras mínimas sugerindo receita inexistente.

Validação nesta etapa: lint/build/testes de frontend e inspeção do CSS compilado.
Não houve inspeção visual em navegador: o download do Chromium falhou no ambiente.
Ajustes finos de responsividade e capturas antes/depois permanecem pendentes de QA.

### Auditoria de clientes

A edição pode ser aberta diretamente na linha ou após visualizar. Criação continua
exigindo CPF real e senha de 15–128 caracteres; edição omite senha vazia e detalhe
não contém hash. CPF é normalizado/validado pelo domínio. Conflitos de unicidade na
criação e de FK na exclusão são traduzidos mesmo quando surgem após a pré-consulta.
Mutações invalidam o prefixo privado do administrador atual e exclusão retorna à
primeira página. Busca/status/paginação continuam no servidor.

Testes de interface usam HTTP simulado. Não comprovam persistência após recarregar
em banco real; duplicidade/inexistência e vínculos devem ser verificados no ambiente
de homologação antes de retirar o Draft.

### Gestão de barbeiros

A interface usa POST/GET/PATCH/DELETE de `/barbeiros`, sem domínio duplicado.
Filiais vêm de `/filiais`, paginadas até o total, exigindo GERENCIAR_FILIAIS;
falha/ausência bloqueia o formulário com explicação. Não usa ID fixo. Foto usa URL,
nome profissional, descrição, admissão e status seguem o contrato. Telefone não é
editável porque os DTOs atuais de barbeiro não o aceitam. O status profissional é
independente da conta. Exclusão confirma e preserva conflitos de agenda/comissões.
A gestão invalida consultas administrativas, catálogo público e disponibilidade.
Validação de interface usa HTTP simulado; persistência e inspeção visual reais
permanecem pendentes em homologação.

### Gestão de serviços

Cadastro, detalhe, edição, situação e exclusão usam `/servicos`. O PATCH valida e
persiste `ativo` booleano, inclusive false. O catálogo administrativo expõe `preco`;
o formulário de domínio carrega `precoBase` do detalhe e envia esse campo explicitamente.
Inativação impede novas seleções; editar catálogo não reescreve AgendamentoServico.
Preço deve ser positivo com até duas casas e duração inteira positiva. Exclusão
preserva conflito com vínculos. Cliente Orval regenerado a partir do OpenAPI atual.
Testes cobrem false persistido e rejeição HTTP de string no lugar de booleano.

### Gestão administrativa da agenda

A gestão usa `/agendamentos`, com origem ADMINISTRADOR imposta pelo servidor na
criação administrativa. Seletores carregam cadastros reais e todas as páginas;
busca de cliente ajuda a seleção, e barbeiros são agrupados pela filial. A consulta
de disponibilidade não reserva horário. O servidor revalida expediente, vínculos,
serviços e sobreposição em transação serializável, com repetição de P2034.

PATCH permite trocar cliente/filial/profissional apenas com permissão administrativa;
comissões impedem troca de vínculos/itens. Na edição, serviços vazios preservam os
itens e valores históricos. A interface envia apenas campos efetivamente alterados.
Estados finais impedem alterações. Reagendamento de atendimento iniciado é bloqueado.
Status e histórico são gravados juntos, com responsável da sessão e horários reais
para início/conclusão. POST de histórico passa pela mesma máquina de estados, sem
aceitar um histórico fictício independente da transição.

Exclusão física é restrita a pendentes legados sem histórico nem comissões, validada
na mesma transação; registros com histórico são preservados via cancelamento com
motivo. O detalhe mostra histórico paginado. Filtros por cliente/profissional/status
são enviados ao calendário no servidor, não aplicados sobre uma página local.
A grade mensal inclui semanas completas, até 42 dias, em America/Sao_Paulo.

Checks usam HTTP/Prisma simulados; concorrência real e persistência com servidor
PostgreSQL ainda precisam de homologação. Nenhuma operação em banco remoto ocorreu.
