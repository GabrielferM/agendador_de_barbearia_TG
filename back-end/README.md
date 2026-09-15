# Backend — Agendador de Barbearia

API REST em NestJS, TypeScript, Prisma e PostgreSQL. Veja [arquitetura](doc/arquitetura.md) para domínio e módulos ativos, e [índice de documentação](doc/README.md) para as regras de desenvolvimento.

## Execução local

Siga os [pré-requisitos e ambiente](../README.md) do projeto. A partir de `back-end/`:

```bash
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Configure `.env` antes dos comandos Prisma. `prisma:migrate` aplica/cria migrations no banco de desenvolvimento; não é um comando de teste. O seed é opcional (`npm run prisma:seed`); revise [o seed](prisma/seed/index.ts) antes de usá-lo, pois grava dados.

API padrão: `http://localhost:3000`. Swagger fora de produção: `/api`; OpenAPI: `/api-json`. `/health` verifica conexão com o banco. A raiz ainda retorna a mensagem básica do aplicativo.

## Contratos e autenticação

Login, sessão, CSRF e logout ficam em `/auth`; o catálogo anônimo fica em `/publico`. Recursos privados exigem sessão e permissões. Consulte Swagger para rotas atuais, sem inferi-las a partir de modelos Prisma ou clientes gerados antigos.

A sessão usa cookie HttpOnly e CSRF assinado. Os detalhes e limites estão no [guia compartilhado de segurança](../front-end/docs/seguranca-autenticacao.md).

## Desenvolvimento

Leia [AGENTS](AGENTS.md) antes de alterar código. Os comandos e pré-requisitos de testes estão em [testes](doc/testes.md). Para build use `npm run build`; para execução do build use `npm run start:prod`, com ambiente e banco preparados.
