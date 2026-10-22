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
