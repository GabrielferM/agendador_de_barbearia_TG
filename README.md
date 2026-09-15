# Agendador de Barbearia

Aplicação para gestão de clientes, barbeiros, filiais, serviços e agendamentos. O backend expõe uma API REST; o frontend inclui catálogo, login, dashboards e áreas ainda em desenvolvimento.

## Tecnologias e documentação

| Área | Stack | Entrada |
| --- | --- | --- |
| Backend | NestJS, TypeScript, Prisma, PostgreSQL, Swagger | [Execução](back-end/README.md) · [Guias](back-end/doc/README.md) |
| Frontend | React, Vite, TypeScript, Tailwind CSS, HeroUI, TanStack Query, Orval | [Execução](front-end/README.md) · [Guias](front-end/docs/README.md) |
| Trabalho com agentes | Regras gerais e específicas por aplicação | [AGENTS](AGENTS.md) |
| Artefatos do domínio | Diagramas e materiais do projeto | [pasta](pasta/) |

Os guias distinguem implementação, regras para novas alterações e melhorias pendentes. A explicação de [AGENTS, docs e Codex](back-end/doc/README.md) orienta onde manter cada informação.

## Pré-requisitos

- Node.js `^20.19.0`, `^22.12.0` ou `>=24.0.0`. O arquivo [.nvmrc](.nvmrc) seleciona a versão 22.12.0 como padrão com nvm.
- npm e dependências instaladas separadamente em cada aplicação.
- PostgreSQL acessível para executar a API com dados reais.

Os manifests e lockfiles de cada aplicação registram suas dependências; não há instalação única na raiz.

## Preparar o ambiente

Crie `back-end/.env` com valores locais:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendador_barbearia?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
CSRF_SECRET="substitua-por-um-segredo-local-de-pelo-menos-32-caracteres"
```

Não versione credenciais reais. A [validação de ambiente](back-end/src/config/environment.ts) define defaults e restrições: em produção, CORS_ORIGINS e CSRF_SECRET são obrigatórios. Fora de produção, a política CORS aceita localhost, em vez de usar a lista configurada.

Em um terminal:

```bash
cd back-end
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

`prisma:migrate` modifica o banco de desenvolvimento; não o execute como parte de uma simples revisão documental.

Em outro terminal:

```bash
cd front-end
npm ci
npm run dev
```

A base HTTP do frontend é `http://localhost:3000`, sobrescrita por `VITE_API_URL` em `.env.local`. Veja [configuração do frontend](front-end/README.md).

## Endereços locais

| Serviço | Endereço padrão |
| --- | --- |
| Interface | `http://localhost:5173` |
| API | `http://localhost:3000` |
| Swagger, fora de produção | `http://localhost:3000/api` |
| OpenAPI, fora de produção | `http://localhost:3000/api-json` |
| Saúde do banco pela API | `http://localhost:3000/health` |

## Desenvolvimento e qualidade

Antes de alterar código, siga os AGENTS e a arquitetura da aplicação. Para verificações, consulte [testes do backend](back-end/doc/testes.md) e [testes do frontend](front-end/docs/testes.md). Contratos atuais estão no Swagger; arquivos gerados antigos não garantem que uma rota continue disponível.

O [schema Prisma](back-end/prisma/schema.prisma) é a fonte oficial de persistência. A arquitetura adotada usa serviços de caso de uso e PrismaService centralizado, sem repositories adicionais. A [segurança compartilhada](front-end/docs/seguranca-autenticacao.md) explica sessão, autorização e controles ainda pendentes.
