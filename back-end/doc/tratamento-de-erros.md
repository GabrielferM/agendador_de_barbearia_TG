# Validação e tratamento de erros do backend

## Implementado

O [configurador de validação](../src/config/validacao.ts), usado pelo bootstrap e pelo e2e, aplica `ValidationPipe` com `whitelist`, `forbidNonWhitelisted`, `transform` e `stopAtFirstError`; `validationError` oculta `target` e `value`. Isso não significa um único erro para a requisição inteira. DTOs validam formato; casos de uso validam existência, vínculos e regras de negócio.

Não há filtro global próprio padronizando todos os corpos. Exceções nativas do Nest são tratadas pela camada padrão. [CriarServicoService](../src/modules/servico/service/criar-servico.service.ts) verifica nome existente e também traduz `P2002` em conflito; erros desconhecidos são relançados.

Exemplo real de conflito de serviço:

```json
{"statusCode":409,"message":"Já existe um serviço com esse nome.","error":"Conflict"}
```

O [ErroRespostaDto](../src/common/swagger/respostas.dto.ts) descreve `statusCode`, `message: string | string[]` e `error` opcional. `LimiteRequisicoesRespostaDto` acrescenta `retryAfter` aos retornos 429. Os decorators comuns registram 401, 403 e 429 nas rotas privadas e os erros CRUD aplicáveis. Isso descreve as variantes atuais sem impor um filtro global ou alterar o corpo produzido em execução.

## Regra para novas alterações

| Situação | Tratamento esperado |
| --- | --- |
| Entrada inválida | 400; DTO ou BadRequestException para regra de entrada. |
| Sessão ausente/inválida | 401, sem revelar dados internos. |
| Permissão/CSRF inválido | 403, preservando a distinção de autenticação. |
| Recurso não encontrado | 404 conforme o contrato e a política de acesso. |
| Duplicidade ou estado incompatível | 409 quando representa conflito de negócio. |
| Tipo de conteúdo não aceito | 415, como no login JSON. |
| Limite de tentativas | 429; preservar Retry-After quando fornecido. |
| Falha inesperada | Relançar para o tratamento padrão; não transformar toda falha em 400. |

Capture erros somente quando for possível traduzi-los ou acrescentar contexto útil. Para `PrismaClientKnownRequestError`, compare `code`, não o texto da mensagem. `P2002` indica unicidade; `P2003` e `P2025` precisam ser interpretados no contexto da operação, sem um mapeamento universal para todas as rotas. Nunca exponha mensagem bruta do banco, SQL, stack, senha, hash ou token.

Novos logs devem conter apenas contexto operacional necessário e sanitizado. Não há garantia atual de auditoria centralizada de todas as falhas. O frontend deve usar mensagens próprias para falhas internas e de autenticação; detalhes estão no [guia de erros do frontend](../../front-end/docs/tratamento-de-erros.md).

## Validação e melhoria pendente

Um eventual formato único de erro continua exigindo decisão de contrato e atualização coordenada do consumidor. Ao alterar uma falha, teste status, corpo seguro, documento OpenAPI e comportamento do cliente, incluindo erro desconhecido. Veja [testes](testes.md).

Referência consultada: [exceções do NestJS](https://docs.nestjs.com/exception-filters). As escolhas de organização acima são convenções deste projeto.
