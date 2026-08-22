# AGENT.md

## 1. Objetivo do projeto

Esta base é um projeto backend leve e pragmático utilizando:

- NestJS
- Prisma
- PostgreSQL

O objetivo é fornecer uma fundação simples, legível e fácil de estender, evitando abstrações e padrões arquiteturais complexos neste momento.

## 2. Fluxo arquitetural

Controller
   ↓
Service
   ↓
PrismaService
   ↓
Prisma Client
   ↓
PostgreSQL

## 3. Responsabilidade de cada camada

- Controllers: camada HTTP. Recebem requests, validam/encaminham DTOs, chamam Services e retornam responses. Não devem conter regra de negócio ou executar queries Prisma.
- Services: lógica de negócio. Realizam validações e regras da aplicação. Utilizam `PrismaService` para acessar o banco. Não devem conter lógica específica de HTTP.
- PrismaService: centraliza a única instância do `PrismaClient`, gerencia ciclo de vida da conexão e exporta a instância para Services.
- PrismaModule: fornece e exporta o `PrismaService`. Importar explicitamente onde necessário.

## 4. Organização de diretórios

Estrutura oficial (exemplo):

```
src/
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/
│   └── health/
│       ├── health.controller.ts
│       ├── health.service.ts
│       └── health.module.ts
├── app.module.ts
└── main.ts
```

Cada domínio deve viver em `src/modules/<dominio>/` com seu `controller`, `service`, `module` e um subdiretório `dto/` para DTOs.

## 5. Regras para Prisma

- Acesso ao Prisma somente via `PrismaService`.
- Não criar múltiplas instâncias de `PrismaClient`.
- Para transações, use `this.prisma.$transaction([...])` diretamente nos Services.
- Para migrações e geração do client, use os scripts no `package.json`:
  - `prisma:generate`
  - `prisma:migrate`
  - `prisma:studio`
- Trate erros específicos do Prisma (ex.: P2002) nos Services quando necessário e re-lance exceções do Nest adequadas.

## 6. Regras para Controllers

- Lidam apenas com HTTP e DTOs.
- Chamam Services para executar lógica de negócio.
- Não executar queries Prisma diretamente.

## 7. Regras para Services

- Implementam regras de negócio.
- Podem usar `PrismaService` para operações de BD.
- Devem permanecer independentes da camada HTTP.

## 8. Regras para DTOs

- Localização: `src/modules/<modulo>/dto/`.
- Use `class-validator` e `class-transformer` para validação e transformação.
- Configure `ValidationPipe` globalmente em `main.ts` com `whitelist: true` e `transform: true`.

## 9. Regras de erros

- Use exceptions nativas do Nest (`BadRequestException`, `NotFoundException`, `ConflictException`, `UnauthorizedException`).
- Ao capturar erros do Prisma nos Services, mapeie para exceções HTTP quando apropriado.

## 10. Regras de transação

Use `this.prisma.$transaction(...)` em Services para operações que precisam ser atômicas.

## 11. Regras para agentes de IA

Qualquer agente (ou desenvolvedor) que alterar o projeto deve:

- Respeitar a arquitetura existente.
- Não introduzir novos padrões arquiteturais (Clean, Hexagonal, CQRS, DDD) sem justificativa clara.
- Não criar repositories genéricos automaticamente.
- Não criar abstrações que escondam o Prisma sem motivo claro.
- Reutilizar estruturas existentes e manter módulos isolados.
- Verificar o `AGENT.md` antes de mudanças arquiteturais.
- Preservar tipagem do Prisma e não criar múltiplas instâncias do client.
- Não adicionar dependências sem necessidade.

## 12. Critérios para novas abstrações

Adicionar uma abstração somente quando:

1. Existe repetição real de código.
2. Houver benefício claro de manutenção.
3. A abstração não esconderá desnecessariamente o Prisma.
4. Permanece coerente com a arquitetura atual.

Regra geral: prefira código explícito e simples a abstrações prematuras.
