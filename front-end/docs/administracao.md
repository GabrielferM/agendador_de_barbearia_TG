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

Cards mostram filial, status, agendamentos do dia (exceto cancelados), receita concluída e comissões registradas. O total global a pagar inclui todos os períodos; o valor no card inclui apenas comissões geradas no mês. Especialidades, jornada e percentual padrão não existem no schema; a tela informa essa ausência. Edição e disponibilidade individual permanecem pendentes.

### Criação de conta de barbeiro

O botão “Novo barbeiro” abre um formulário na própria tela, sob `GERENCIAR_USUARIOS`. Nome, e-mail, senha de 15 a 128 caracteres e filial são obrigatórios. Nome profissional, descrição, URL da foto e data de admissão são opcionais. A seleção carrega todas as páginas de `GET /publico/filiais`, oferecendo filiais ativas sem exigir a permissão de gerenciamento de filiais. Uma filial única é pré-selecionada; ausência de filiais impede o envio e falhas permitem nova tentativa.

A gravação usa o cliente gerado para `POST /barbeiros`, com cookies e CSRF existentes. O backend cria atomicamente Usuario e Barbeiro com papel BARBEIRO e status ativo por padrão, permitindo login com o e-mail e a senha cadastrados. A senha é enviada sem remover espaços e não é persistida no navegador. O formulário impede envios duplicados enquanto pendente, preserva campos após falha e descarta os valores ao fechar ou concluir. O adapter confere HTTP 201 e não repete a gravação automaticamente.

Após sucesso, a tela limpa busca/status, retorna à primeira página e invalida consultas administrativas do usuário, catálogo inicial de barbeiros e seleção de barbeiros do agendamento. Testes HTTP simulados cobrem payload, atualização da lista, conflito com preservação dos campos, bloqueio de envio duplicado, paginação/seleção de filiais e ausência de filial; não comprovam login/persistência em banco real.

## Serviços integrados

`/admin/servicos` consulta `GET /dashboard/administrador/servicos` com busca, status ativo/inativo e paginação no servidor, exigindo `GERENCIAR_SERVICOS`. Indicadores globais vêm do servidor, inclusive o ticket médio por atendimento concluído. A tabela mostra preço, duração, status e realizações/receita do mês. Validação, cancelamento, cache por usuário, carregamento, vazio e nova tentativa seguem o padrão administrativo. Mocks não são usados. Categoria e comissão padrão não existem no schema e são sinalizadas como indisponíveis.

### Ativação e desativação

A coluna Ações oferece “Ativar” ou “Desativar” conforme o status atual. A gravação usa o cliente gerado para `PATCH /servicos/:id` com `{ ativo: boolean }`, sob `GERENCIAR_SERVICOS`, sessão e CSRF. O campo é opcional no DTO de edição, aceita somente booleano quando informado e é persistido também quando `false`. A coluna `servico.ativo` já existe no schema e na migration histórica; não foi criada nova migration.

A tela impede envios duplicados enquanto a operação está pendente, não repete a mutação automaticamente e só confirma sucesso após HTTP 200 com ID e status esperados. Falhas mantêm o status exibido e mostram uma mensagem. Após sucesso, preserva busca/filtro, retorna à primeira página e invalida a consulta administrativa de serviços, o catálogo inicial e as consultas de agendamento, atualizando lista e indicadores pelo servidor.

Serviços inativos deixam o catálogo público e são recusados na disponibilidade e na criação de novas reservas. A alteração de status não modifica nem cancela agendamentos existentes e não altera seus preços ou durações registrados. Reativar torna o serviço disponível novamente, respeitando as demais regras de agendamento. Cadastro de serviços continua pendente.

Os testes HTTP do backend cobrem booleanos válidos/inválidos, inexistência, sessão, permissão, CSRF, preservação dos demais campos e ausência de escrita em agendamentos, além do filtro do catálogo e da rejeição de novas reservas. Os testes da tela cobrem ambas as ações, payload, indicadores, invalidação de caches, filtros/paginação, duplicação e falhas HTTP/rede/resposta inválida. Usam Prisma e HTTP simulados; não comprovam gravação em PostgreSQL real. Nesta entrega, a coluna foi confirmada por consulta de metadados ao banco configurado, sem alterar registros; a inspeção visual em navegador não foi realizada.

## Gerenciamento de filiais

`/admin/filiais` está disponível no menu para administradores com `GERENCIAR_FILIAIS`. A tela usa `GET /filiais` com filtro Todos/Ativa/Inativa/Em manutenção e paginação de 12 registros no servidor. Mostra nome, CNPJ, telefone/e-mail, endereço e status. Não possui busca textual, indicadores globais ou exclusão.

“Nova filial” abre o formulário na própria página. Nome, CNPJ, CEP, logradouro, número, bairro, cidade e UF são obrigatórios; telefone, e-mail e complemento são opcionais. A criação usa `POST /filiais` e o status inicial ATIVA do banco. “Editar” consulta `GET /filiais/:id` novamente antes de abrir o formulário, mesmo quando há detalhe em cache, e permite alterar os dados e escolher os três status por `PATCH /filiais/:id`. A atualização por foco/reconexão fica desabilitada no detalhe para não substituir um formulário em andamento. Fechar descarta o formulário e retorna o foco para Nova filial.

O adapter usa os clientes gerados, cookies e CSRF existentes; confere status HTTP, campos consumidos, paginação, ID e status da resposta de gravação. As respostas administrativas de filiais possuem DTOs Swagger explícitos, preservando o formato JSON existente. O backend rejeita obrigatórios vazios após remover espaços e mantém normalização/validação de CNPJ, e-mail, CEP e UF. Na edição, telefone, e-mail e complemento vazios são enviados como `null` para limpar os valores; omitir esses campos no PATCH preserva os valores anteriores. Não houve alteração de schema ou migration.

Durante a gravação, o formulário impede duplicações e fechamento; não há repetição automática. Falhas preservam os campos e mostram uma mensagem, inclusive para CNPJ duplicado. Após sucesso, fecha o formulário, mostra confirmação, preserva o filtro e volta à página 1. Invalida lista/detalhes de filiais, consulta administrativa de barbeiros, opções de filial do cadastro de barbeiros, catálogo inicial de barbeiros e consultas de agendamento.

INATIVA e EM_MANUTENCAO deixam de aparecer na seleção pública de filiais, e a disponibilidade/criação de reservas rejeita essas unidades. Alterar o status não cancela nem modifica agendamentos registrados e não altera os cadastros dos barbeiros vinculados. Reativar libera novas reservas segundo as demais regras da agenda. Não há consulta automática de CEP.

Os testes da tela verificam navegação, permissão, paginação/filtro, carregamento/vazio/erro, cadastro, edição e três status, limpeza de opcionais, duplicação, mensagens, invalidações e foco/teclado, com HTTP simulado. Os testes HTTP do backend usam Prisma simulado para verificar autorização/CSRF, entradas, criação com endereço, edição, conflitos, inexistência, status, bloqueio de novas reservas e contrato OpenAPI. Essas verificações não comprovam persistência no PostgreSQL real nem substituem inspeção visual em navegador.

A inspeção em Firefox headless conferiu lista e edição em áreas de conteúdo de 1440 × 914 e 500 × 758, com sessão e HTTP simulados. Não houve transbordamento horizontal da página; a tabela mantém rolagem interna em telas estreitas. Foram conferidos foco inicial no nome e sucesso da mudança de status pelo formulário. A navegação por teclado e o retorno de foco também são cobertos em jsdom. Nenhuma dessas verificações gravou dados no banco real.

## Financeiro integrado

`/admin/financeiro` exige `GERENCIAR_COMISSOES` e consulta `GET /dashboard/administrador/financeiro`. Abre do início do mês até hoje em America/Sao_Paulo; formulário aplica um período válido. Cache inclui usuário e período, com cancelamento, validação da resposta, erro/nova tentativa e vazios independentes para atendimentos e comissões.

Exibe receita de serviços concluídos, variação contra o intervalo anterior de mesma duração, série em intervalos de sete dias, dez últimos atendimentos concluídos e comissões por barbeiro separadas nos cinco status reais. Total registrado inclui canceladas/estornadas, sem rotulá-lo como valor devido. Receita não comprova recebimento. O banco não registra despesas nem formas de pagamento: não há números inventados de despesas/lucro, gráfico de pagamentos ou botões fictícios para lançamento/exportação. Persistência desses conceitos e respectivas ações exige evolução própria do domínio.


### Painel compacto da agenda administrativa

O seletor Dia/Semana/Mês fica à direita da barra de controles, inclusive quando a barra quebra em mais de uma linha. Os botões usam borda sólida e aparência uniforme; a visualização ativa tem fundo marrom e texto branco, mantendo indicação acessível por `aria-pressed`.

Controles, calendário, resumo e total do período compartilham um painel. Semana e dia
preenchem a altura disponível; o mês usa segunda-feira como primeira coluna e espaços
antes/depois das datas do mês. A rolagem horizontal em telas estreitas fica contida na
grade, e o resumo passa para baixo. Dias, cards e lista lateral preservam áreas de
leitura; no desktop, listas extensas rolam dentro do painel.

O período consultado permanece o dia, a semana completa ou o mês civil. Trocar a
visualização conserva o dia selecionado; anterior/próximo deslocam um dia, sete dias
ou o primeiro dia do mês adjacente. Hoje usa America/Sao_Paulo. O resumo deriva apenas
do dia selecionado em `dados.dias`; `totaisPorStatus` do servidor é do período e não
é usado como resumo diário. O rodapé soma os agendamentos de todos os dias carregados.
Cada ID aparece uma única vez, independentemente dos serviços. O adapter rejeita IDs
duplicados e início agrupado no dia incorreto em São Paulo, e ordena por início/ID.

A consulta administrativa tem `staleTime: 0` para revalidar ao montar/voltar ao foco.
Criação e cancelamento existentes invalidam também as consultas administrativas de
agenda. Alterações feitas por outras sessões aparecem na próxima consulta; não há
atualização em tempo real. Não existem filtros de filial/status nessa tela: calendário,
resumo e total usam a mesma resposta. O endpoint mantém o escopo administrativo global
sob `GERENCIAR_AGENDAMENTOS`; nenhum escopo ou contrato público foi ampliado.

Não foi constatado uso indevido dos totais do período no resumo anterior. As correções
tratam apresentação, alinhamento mensal, cache e validação defensiva. Validações com
HTTP simulado não confirmam dados de produção ou persistência em PostgreSQL.

## Painéis compactos de clientes, barbeiros e serviços

As três consultas usam um painel com faixa de três indicadores globais, filtros,
conteúdo e paginação no rodapé. Controles têm 36–40 px; filtros e indicadores
empilham no celular. Estilos ficam limitados a `PainelCatalogo`, sem alterar o menu
ou os tokens globais. As tabelas possuem rolagem horizontal interna acessível pelo
teclado e os nomes longos podem aumentar a altura das linhas.

Clientes agrupa telefone/e-mail e usa ações curtas com o nome completo no rótulo
acessível. A exclusão abre um diálogo modal nativo com foco inicial em Cancelar,
Escape e retorno de foco; nenhum DELETE ocorre antes da confirmação. Em conflito,
o diálogo permanece aberto com a mensagem e a orientação para editar o status.
Cadastro, detalhes e edição mantêm os campos e erros existentes, com ações no
rodapé do formulário. Barbeiros exibe filial no cabeçalho e quatro métricas por
profissional, em até duas colunas; o total global a pagar informa “Todos os
períodos”, enquanto o card identifica os valores gerados no mês. Serviços alinha
preços, quantidades e receitas à direita e preserva “Sem atendimentos”.

Contratos, permissões, busca/paginação no servidor, retorno à primeira página e
invalidações após gravações permanecem existentes. O cadastro de barbeiros está descrito acima e reutiliza o endpoint existente; não foram acrescentados endpoints, indicadores ou campos persistidos. Cadastro de serviços, especialidades, jornada e comissão padrão permanecem pendentes.

Ao abrir detalhes de Clientes, o ID vem do argumento da mutação concluída, evitando
uma corrida com a atualização de `mutation.variables` quando a resposta é imediata.
Isso conserva o ID no editor e permite editar status e enviar PATCH ao registro
correto. O teste de edição com resposta imediata cobre essa correção funcional.
