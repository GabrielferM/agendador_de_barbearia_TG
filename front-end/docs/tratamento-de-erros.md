# Tratamento de erros do frontend

## Implementado

O transporte retorna status mesmo em 4xx/5xx. Portanto, `query.isError` sozinho não identifica toda falha HTTP. [useServicosInicio](../src/pages/inicio/hooks/use-servicos-inicio.ts) combina rejeição e status:

```ts
const comErro = query.isError ||
  (query.data !== undefined && query.data.status !== 200);
```

Esse exemplo é para o catálogo, cujo sucesso esperado é 200; outros endpoints podem ter códigos de sucesso diferentes. Confira o contrato antes de copiar.

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
