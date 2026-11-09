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
- O e2e verifica 120 consultas permitidas na mesma rota/IP, bloqueio da 121ª, independência entre rotas e dez tentativas de login, com bloqueio da 11ª e header `Retry-After`. Usa o guard e o armazenamento de throttling reais, com aplicação nova por teste.
- Os testes unitários de agendamento verificam uso do mesmo cliente transacional, repetição de `P2034`, conflito após três tentativas, sobreposição e validação de acesso. A concorrência real ainda exige PostgreSQL isolado.

A suíte de disponibilidade cobre fuso, expediente, domingo, fechamento, soma dos serviços, horários adjacentes/sobrepostos e vínculos inativos. Os testes HTTP cobrem disponibilidade anônima, parâmetros, CSRF, criação, conflito e sanitização da resposta do cliente.

## Regra para novas alterações

Teste comportamento relevante: sucesso, entrada inválida, inexistência, conflito, permissão negada e falha inesperada. Para autenticação, cubra expiração/revogação, CSRF e ausência de segredos na resposta. Para datas, dinheiro e status, cubra limites e transições inválidas. Evite testes que apenas repitam a implementação.

Execute e2e quando alterar controllers, guards, autenticação, validação HTTP ou Swagger. Futuras suítes de integração com banco real precisam de banco isolado, migrations aplicadas e política explícita de preparação/limpeza; não use dados pessoais ou banco de produção.

## Conclusão de uma tarefa

Revise o diff, atualize os guias e informe os comandos executados com seus resultados. Registre falhas preexistentes ou impedimentos sem declarar sucesso. Para mudanças somente em Markdown, confira links, caminhos, exemplos e consistência; não regenere clientes nem rode migrations.

O teste `psql "$DATABASE_URL_TESTE" -v ON_ERROR_STOP=1 -f test/reparo-permissoes.sql`
usa somente tabelas temporárias com `search_path=pg_temp`, executa o reparo duas
vezes e verifica idempotência, isolamento do administrador e preservação de usuários.
O mesmo SQL foi exercitado com PostgreSQL embarcado (PGlite); isso não substitui
validação do banco de destino nem teste de concorrência em PostgreSQL servidor.

## Contas públicas

Os testes unitários/HTTP adicionais usam Prisma e Resend simulados e cobrem cadastro, recuperação, limites, tokens, revogação e login após a mudança. A suíte opt-in de [PostgreSQL real](../test/conta-postgres.e2e-spec.ts) requer DATABASE_URL_TESTE local descartável; consulte [preparo e limites](contas-publicas.md). Sem essa variável, três testes ficam ignorados.

## Aniversário e normalização

A suíte unitária valida DTOs de criação/edição, par ausente/nulo/incompleto, 29/02, 31/04, formato e dígitos de CPF/CNPJ, telefone pontuado, trim, UF, URL e admissão. A edição do cliente testa manter, substituir e remover aniversário. A suíte HTTP exercita rejeição de entradas inválidas antes de gravar e cadastro público com telefone normalizado/aniversário válido, preservando os limites reais de requisições.

`test/aniversario-postgres.e2e-spec.ts` é opt-in por `DATABASE_URL_TESTE`, somente em PostgreSQL local descartável com nome terminado em `_auth_test`. Cria e remove um schema próprio, aplica o histórico anterior, insere datas conhecidas e verifica conversão e restrições com os triggers ativos. Não utiliza o banco da aplicação como destino desse teste.

Nesta alteração, a conversão também foi validada em PostgreSQL embarcado (PGlite) com o histórico completo: reproduziu a falha de eventos de trigger pendentes e confirmou a correção. A migration foi aplicada ao banco local configurado, com comparação agregada de todos os IDs/dias/meses antes e depois, sem expor dados pessoais. Isso comprova a conversão local, não concorrência ou todos os fluxos da API em produção.

A verificação final executou geração Prisma, build, lint, format:check, 94 testes unitários e 41 testes HTTP/integração. A suíte HTTP foi executada com um banco PostgreSQL local exclusivo e descartável, incluindo os quatro testes opt-in de conta/migração, sem testes ignorados. O banco de teste foi removido ao concluir. O fixture de recuperação foi ajustado para criar Usuario e Cliente juntos, respeitando o trigger histórico de especialização.

## Formulários administrativos e conta de barbeiro

Os novos testes de edição de barbeiro cobrem alteração de status da conta independentemente do perfil, escrita conjunta de conta/perfil por nested write, senha omitida, validação de status inválido, inexistência, filial inválida, conflito e sanitização da resposta. O teste HTTP usa a aplicação Nest com guards reais e Prisma simulado para verificar 401, 403 por permissão/CSRF, 400, 404 e ambas as transições da conta, sem escrita em agendamentos.

A suíte HTTP passou com 38 testes; quatro testes opt-in de PostgreSQL ficaram ignorados por ausência de `DATABASE_URL_TESTE`. O sandbox bloqueou sockets locais (EPERM), e a execução HTTP bem-sucedida foi realizada fora dele. Geração Prisma e build foram executados, sem aplicar migrations. A inspeção da interface e os testes HTTP simulados não comprovam persistência em PostgreSQL real nesta entrega.

Também passaram os 104 testes unitários (27 suítes), `npm run lint` e `npm run format:check`. O lint terminou sem erros, mantendo 13 avisos preexistentes em testes fora do novo caso de edição de barbeiro. Nenhum banco real foi alterado para validar estes formulários.
