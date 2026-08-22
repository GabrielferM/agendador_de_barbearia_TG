# Agendador de Barbearia (TG)

Este repositório contém uma aplicação full-stack para gerenciar agendamentos de barbearia.

**Resumo rápido**: backend em NestJS + Prisma (Postgres) e frontend em React (Vite). O backend expõe APIs para gerenciar usuários, clientes, barbeiros, filiais, serviços e agendamentos; o frontend fornece a interface mínima para interação.

**Tecnologias principais**
- **Backend**: `NestJS`, `TypeScript`, `Prisma`, `pg`, `@prisma/adapter-pg`
- **Frontend**: `React`, `Vite`, `TypeScript`
- **DB**: `PostgreSQL` (via `DATABASE_URL`)

**Estrutura do repositório**
- **`back-end/`**: código do servidor (NestJS). Veja `back-end/package.json` para scripts e dependências.
- **`back-end/prisma/`**: esquema Prisma e migrações (ex.: `back-end/prisma/schema.prisma` and `back-end/prisma/migrations`).
- **`front-end/`**: app React com Vite; scripts em `front-end/package.json`.
- **`pasta/`**: diagramas e BPMN do fluxo de agendamento.

**Requisitos**
- Node.js >= 18
- PostgreSQL (ou acesso a um servidor Postgres)
- `npm` (ou `pnpm` / `yarn`) para instalar dependências

**Variáveis de ambiente necessárias**
- `DATABASE_URL` — string de conexão com o Postgres. Exemplo:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
```

Coloque essa variável em um arquivo `.env` dentro de `back-end/` para desenvolvimento.

**Configuração e execução (desenvolvimento)**

1. Backend

```bash
cd back-end
npm install
# crie .env com DATABASE_URL
npx prisma generate       # gera o client Prisma
npx prisma migrate dev    # aplica migrações (interativo)
npm run start:dev         # inicia NestJS em modo watch
```

2. Frontend

```bash
cd front-end
npm install
npm run dev
```

O frontend por padrão roda em `http://localhost:5173` (Vite) e o backend em `http://localhost:3000` (NestJS), salvo alterações de porta no código.

**Build & produção**

Backend:

```bash
cd back-end
npm run build
npm run start:prod
```

Frontend:

```bash
cd front-end
npm run build
# sirva os arquivos estáticos gerados pela pasta dist com um servidor web
```

**Prisma**
- Arquivo de esquema: [`back-end/prisma/schema.prisma`](back-end/prisma/schema.prisma#L1-L120)
- Migrações: [`back-end/prisma/migrations`](back-end/prisma/migrations)
- Comandos úteis (executar em `back-end/`):

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Observação: foi necessário ajustar o `PrismaService` para suportar o adaptador Postgres (`@prisma/adapter-pg`). O arquivo alterado é `back-end/src/prisma/prisma.service.ts`; o construtor injeta o `PrismaPg` e faz um cast para `any` ao chamar `super()` por conta de incompatibilidade de tipos gerados pelo client. Veja a implementação atual em [back-end/src/prisma/prisma.service.ts](back-end/src/prisma/prisma.service.ts#L1-L120).

**Testes**
- Backend: rode em `back-end/`

```bash
npm run test         # unit tests
npm run test:e2e     # end-to-end tests
```

Frontend: não há suíte de testes configurada por padrão neste repositório.

**Lint e formatação**

```bash
cd back-end
npm run lint
npm run format

cd front-end
npm run lint
```

**Observações e dicas**
- Garanta que `DATABASE_URL` esteja disponível antes de iniciar o backend. Sem essa variável o serviço lança erro na inicialização.
- Ao usar `prisma migrate dev`, certifique-se de que o banco de dados apontado por `DATABASE_URL` é um ambiente de desenvolvimento (não rode migrations de destruição em produção sem revisão).
- Se preferir usar containers, crie um `docker-compose` com Postgres e ajuste `DATABASE_URL` para apontar para o serviço Postgres do compose.

**Contribuição**
- Sinta-se livre para abrir issues e pull requests. Siga o padrão de código do projeto: TypeScript + ESLint + Prettier.

--
Se quiser, eu posso:
- Executar `npx prisma validate` / `npx prisma generate` para verificar localmente.
- Gerar um `docker-compose.yml` de exemplo com Postgres e instruções para rodar localmente.

Quer que eu gere o `docker-compose.yml` e um exemplo de `.env` agora?
