# Integração com a API

## Implementado: geração e transporte

```text
NestJS + Swagger → OpenAPI /api-json → Orval → clientes/hooks e modelos
Interface → hook/serviço → cliente → httpClient → API NestJS
```

[orval.config.ts](../orval.config.ts) usa React Query, fetch e `tags-split`. A entrada padrão é `http://localhost:3000/api-json`, sobrescrita por `ORVAL_SWAGGER_URL`. A base em execução vem de [client.ts](../src/api/client.ts): `VITE_API_URL`, com padrão `http://localhost:3000`.

| Arquivos | Origem |
| --- | --- |
| Clientes por tags e `src/api/models/` com cabeçalho de geração | Orval; não editar manualmente. |
| `src/api/client.ts` | Manual; resolve URL base. |
| `src/api/http-client.ts` | Manual; mutator de transporte. |
| `src/api/dashboard/` | Adapters e modelos manuais atuais. |

Antes de alterar qualquer arquivo nessa árvore, confira o cabeçalho e a configuração. Há tipos gerados de contratos antigos; sua presença não comprova uma rota ativa. Confirme no backend e no OpenAPI atual.

O [httpClient](../src/api/http-client.ts) envia cookies com `credentials: 'include'`, adiciona o token CSRF legível em POST/PUT/PATCH/DELETE (exceto login) e retorna `{ data, status, headers }`. Respostas 204/205/304 ficam com dados vazios. Corpo não JSON em resposta de sucesso rejeita com `ErroRespostaHttpInvalida`; em resposta HTTP de erro, preserva status e headers e usa um objeto vazio seguro. Falhas 4xx/5xx continuam sem rejeição automática; falhas de rede podem rejeitar a promise.

Ao receber 401 fora do login, o transporte emite o evento interno `agendador:sessao-expirada`. O contexto de autenticação encerra a sessão local e limpa os caches de queries e mutações, sem enviar uma segunda requisição de logout.

## Regra para novas alterações

- Prefira clientes gerados para contratos já cobertos. Mantenha tradução de apresentação ou erros nos hooks/serviços, sem duplicar fetch em componentes.
- Inspecione status e valide campos necessários antes de consumir dados. Um tipo TypeScript não valida JSON em execução.
- Preserve adapters manuais de dashboard; migrá-los para geração é uma tarefa separada.
- Ao mudar um contrato, atualize primeiro o backend/OpenAPI, regenere os consumidores afetados e revise o diff. Não corrija arquivos gerados à mão.
- Preserve serialização por endpoint: Decimal frequentemente chega como string; dashboards usam contratos próprios. Não padronize valores financeiros silenciosamente.

## Procedimento de regeneração

Com backend iniciado fora de produção e Swagger acessível, execute a partir de `front-end/`:

```bash
npm run api:generate
npm run lint
npm run build
npm test
```

Para outra origem OpenAPI, defina `ORVAL_SWAGGER_URL` antes de gerar. A geração altera arquivos; revise remoções, nomes por tag e possíveis colisões com adapters manuais. Não a execute em tarefas exclusivamente documentais.

O QueryClient global usa `staleTime` de cinco minutos e `retry: 1` para queries; páginas podem sobrescrever essas opções. Respostas HTTP resolvidas não acionam retry como uma promise rejeitada. Para erros veja [tratamento de erros](tratamento-de-erros.md).

Referência: [mutator personalizado do Orval](https://orval.dev/docs/guides/custom-client/).
