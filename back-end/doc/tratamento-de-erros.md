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

No agendamento, filial inativa, profissional/usuário inativo, vínculo com outra filial, serviço inativo e horário fora do expediente retornam 400. Recursos inexistentes retornam 404; sobreposição e concorrência na gravação retornam 409. Isso substitui o antigo 409 para barbeiro inativo/vínculo inválido e o antigo 404 para serviço inativo. A política 403 de acesso a agendamento alheio é preservada.

## Validação e melhoria pendente

Um eventual formato único de erro continua exigindo decisão de contrato e atualização coordenada do consumidor. Ao alterar uma falha, teste status, corpo seguro, documento OpenAPI e comportamento do cliente, incluindo erro desconhecido. Veja [testes](testes.md).

Referência consultada: [exceções do NestJS](https://docs.nestjs.com/exception-filters). As escolhas de organização acima são convenções deste projeto.

## Aniversário e normalização de cadastros

Cliente armazena `diaAniversario` e `mesAniversario` inteiros opcionais. O contrato antigo `dataNascimento` deixa de ser aceito. Criação pública/administrativa aceita o par válido ou ambos ausentes/nulos; PATCH omitindo ambos mantém o aniversário e dois `null` removem. Valores fracionários, strings numéricas, par incompleto e combinações impossíveis retornam 400. O calendário aceita 29/02 e não calcula idade. A restrição CHECK do banco reforça o mesmo par.

A migration `20261103193000_aniversario_cliente` converte as datas existentes por EXTRACT, descarta o ano e remove a coluna antiga. Ela executa `SET CONSTRAINTS ALL IMMEDIATE` dentro da transação: os triggers históricos da especialização do usuário precisam ser executados antes dos ALTER TABLE seguintes. Não desabilite esses triggers. Aplique as migrations em ordem e disponibilize frontend/backend atualizados juntos, pois há substituição do contrato.

DTOs de cadastro validam CPF/CNPJ antes da persistência. CPF e telefone aceitam formatos brutos ou pontuados válidos; telefone é normalizado para dígitos antes da validação de comprimento. Não se removem letras de uma entrada inválida para torná-la válida. Nome/e-mail são aparados antes da validação; senha permanece intacta. Filiais validam UF brasileira; barbeiros validam URL HTTP/HTTPS e admissão com data real. Cancelamento mantém regra de motivo obrigatório no caso de uso e limita o campo a 1000 caracteres no DTO.

Yup pertence ao frontend. O servidor mantém class-validator, normalizadores e regras de negócio, sem mudar o formato global de exceções. Interface e payload: [formulários](../../front-end/docs/formularios.md).

Campos opcionais não anuláveis de cliente/barbeiro distinguem ausência de `null`: omissão preserva o valor; `null` é rejeitado pela validação em vez de alcançar operações de string. O aniversário e os campos de filial explicitamente anuláveis mantêm suas regras próprias.

## Status da conta do barbeiro

`AtualizarBarbeiroDto.statusConta` é opcional e aceita somente ATIVO/INATIVO. `null`, booleanos, números, BLOQUEADO e status profissionais retornam 400 antes da escrita. O status profissional continua no campo `statusProfissional`. A edição conserva 401/403 para sessão/permissão/CSRF, 404 para barbeiro ou filial inexistentes e 409 para e-mail duplicado. A resposta segue sanitizada, sem senha/hash. Não há mudança no envelope de erro. Consulte [administração](../../front-end/docs/administracao.md#edição-e-status-da-conta-de-barbeiro).
