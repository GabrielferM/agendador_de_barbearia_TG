# Tratamento de erros do frontend

## Implementado

O transporte retorna status mesmo em 4xx/5xx. Portanto, `query.isError` sozinho não identifica toda falha HTTP quando se usa diretamente um cliente gerado. Na página inicial, o [adapter do catálogo](../src/pages/inicio/services/catalogo-inicio.ts) verifica status 200, paginação e campos essenciais e lança erro quando a resposta é inválida. Assim, os hooks da página podem usar `query.isError` e oferecer nova tentativa. Outros consumidores diretos devem inspecionar o status esperado para seu endpoint.

[login-api.ts](../src/pages/login/services/login-api.ts) traduz 401/403 para mensagem genérica de credenciais, 429 para limite de tentativas e outras falhas para indisponibilidade. Lê `Retry-After` em segundos ou data e valida a resposta de sucesso. [O adapter de dashboard](../src/api/dashboard/dashboard.ts) lança `ErroDashboard` quando o status não é 200, ao contrário do mutator comum.

## Regra para novas alterações

| Situação | Comportamento da interface |
| --- | --- |
| Dados carregando | Mostrar estado pendente sem antecipar ausência de dados. |
| Sucesso sem itens | Mostrar estado vazio, sem tratar como falha. |
| Validação do formulário | Mensagem útil associada ao campo; preservar entrada. |
| 401 em área protegida | Usar o fluxo de sessão existente; não renderizar dados privados. |
| 403 | Informar falta de acesso; no login, manter mensagem genérica. |
| 429 | Respeitar tempo de espera disponível e impedir repetição imediata. |
| Rede, 5xx ou corpo inválido | Mensagem segura e possibilidade de nova tentativa quando adequada. |

Não mostre stack, mensagens brutas do banco ou corpo desconhecido ao usuário. Não transforme toda falha em lista vazia. Nunca repita automaticamente uma mutação para corrigir sessão/CSRF sem avaliar duplicação da operação. Teste o adapter efetivamente usado, pois clientes gerados e adapters manuais têm comportamentos diferentes.

## Sessão e corpo inválido

O mutator rejeita corpo não JSON em respostas de sucesso. Em 4xx/5xx com corpo não JSON, mantém o status e os headers e fornece um objeto vazio seguro para que o consumidor trate a falha HTTP. Em 401 fora do login, emite o evento interno de sessão expirada; o contexto limpa usuário e caches privados sem chamar logout remoto.

No logout solicitado pelo usuário, o contexto verifica o status da resposta e sempre encerra o estado local. Quando não recebe sucesso 2xx, a tela de login informa que a sessão local foi encerrada, mas a revogação no servidor não pôde ser confirmada.

Veja [segurança](seguranca-autenticacao.md) e [cenários de teste](testes.md). Mudanças no formato de erro exigem alinhamento com o [backend](../../back-end/doc/tratamento-de-erros.md).

Na agenda administrativa, o adapter preserva o status em `ErroAgenda`. HTTP 429 mostra uma mensagem própria e desabilita a tentativa manual até o prazo de `Retry-After` (segundos ou data HTTP); na ausência de um valor válido, aguarda 60 segundos. Não há repetição automática de 4xx. O componente compartilhado de erro aceita esse prazo opcional; outros consumidores continuam com seu tratamento atual.

## Erros de formulário

Schemas Yup produzem mensagens em português próximas aos campos. O adapter administrativo preserva mensagens exatas conhecidas de CPF/CNPJ/aniversário, motivo obrigatório e duplicidade de documento/e-mail, somente em 400/409. Mensagens desconhecidas mantêm o texto seguro por status; arrays ou corpos inesperados não são exibidos diretamente. Não há alteração global do envelope HTTP. Veja [formulários](formularios.md).

## Falhas na atualização de listagens

As listagens administrativas de Clientes, Barbeiros, Serviços e Filiais e as consultas de Clientes, Serviços e Histórico do barbeiro distinguem falha inicial de falha de atualização. Sem dados, exibem o erro e a tentativa manual existentes. Com resultado anterior da mesma tela e usuário, preservam esse resultado e avisam que a atualização falhou e que os dados exibidos são da última consulta concluída. A tentativa manual repete os filtros aplicados, sem submeter o rascunho dos campos. Erro não é convertido em resultado vazio.

HTTP 401/403 e ausência de permissão retiram os dados retidos. Mudanças de usuário ou de listagem não reutilizam a resposta anterior como placeholder. O fluxo de expiração de sessão e limpeza de caches permanece sob responsabilidade da autenticação.
