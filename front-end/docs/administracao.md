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
