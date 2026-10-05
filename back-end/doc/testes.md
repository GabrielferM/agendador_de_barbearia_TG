# Testes e validação do backend

## Comandos para alterações de código

Execute a partir de `back-end/`, com dependências instaladas e `DATABASE_URL` definida no ambiente ou `.env` (a configuração Prisma lê essa variável também na geração):

```bash
npm run prisma:generate
npm run build
npm test
npm run lint
npm run format:check
```

Geração e build não substituem testes. Não execute `prisma:migrate` como validação automática: esse comando altera o banco. Os scripts completos estão no [package.json](../package.json).

## Implementado: tipos de teste

- Jest executa `.spec.ts` junto dos arquivos em `src/`.
- `npm run test:e2e` executa os testes HTTP em [test/app.e2e-spec.ts](../test/app.e2e-spec.ts), com Supertest e aplicação Nest inicializada.
- A suíte HTTP atual substitui PrismaService por mocks e define variáveis de teste. Não exige PostgreSQL ativo nem migrations; exige dependências e cliente Prisma gerado. Supertest pode precisar de permissão para abrir socket local.
- Esses testes verificam raiz, saúde simulada, acesso anônimo, fluxo de login/sessão/CSRF/logout, rejeição segura de campos extras e contratos OpenAPI. Não comprovam integridade ou concorrência no banco real.
- O e2e e `main.ts` usam o mesmo [configurador do ValidationPipe](../src/config/validacao.ts).
- Os testes unitários de agendamento verificam uso do mesmo cliente transacional, repetição de `P2034`, conflito após três tentativas, sobreposição e validação de acesso. A concorrência real ainda exige PostgreSQL isolado.

A suíte de disponibilidade cobre fuso, expediente, domingo, fechamento, soma dos serviços, horários adjacentes/sobrepostos e vínculos inativos. Os testes HTTP cobrem disponibilidade anônima, parâmetros, CSRF, criação, conflito e sanitização da resposta do cliente.

## Regra para novas alterações

Teste comportamento relevante: sucesso, entrada inválida, inexistência, conflito, permissão negada e falha inesperada. Para autenticação, cubra expiração/revogação, CSRF e ausência de segredos na resposta. Para datas, dinheiro e status, cubra limites e transições inválidas. Evite testes que apenas repitam a implementação.

Execute e2e quando alterar controllers, guards, autenticação, validação HTTP ou Swagger. Futuras suítes de integração com banco real precisam de banco isolado, migrations aplicadas e política explícita de preparação/limpeza; não use dados pessoais ou banco de produção.

## Conclusão de uma tarefa

Revise o diff, atualize os guias e informe os comandos executados com seus resultados. Registre falhas preexistentes ou impedimentos sem declarar sucesso. Para mudanças somente em Markdown, confira links, caminhos, exemplos e consistência; não regenere clientes nem rode migrations.
