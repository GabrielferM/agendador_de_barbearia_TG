# Instruções do backend

Leia a [arquitetura canônica](doc/arquitetura.md) antes de criar ou modificar código. O [índice](doc/README.md) direciona para nomenclatura, erros e testes.

- Use NestJS, TypeScript, Prisma e PostgreSQL; não use TypeORM.
- Preserve o fluxo Controller → service de fachada → service de caso de uso → PrismaService. Casos simples existentes, como health, não precisam ganhar uma fachada artificial.
- Use somente o PrismaService centralizado. Não instancie PrismaClient em outros locais nem acesse Prisma em controllers.
- Organize por domínio em `src/modules/`; não introduza repositories genéricos ou novas camadas por antecipação.
- O [schema](prisma/schema.prisma) é a fonte oficial de persistência. Preserve migrations históricas; alterações exigem necessidade explícita.
- Para entradas, respostas ou exceções, leia [tratamento de erros](doc/tratamento-de-erros.md). Preserve DTOs, permissões, proteção CSRF e respostas sem dados sensíveis.
- Para arquivos e símbolos novos, siga [nomenclatura](doc/nomenclatura.md); não renomeie código existente sem necessidade.
- Ao alterar código, execute em `back-end/`: `npm run prisma:generate`, `npm run build` e `npm test`. Use também lint e testes e2e conforme [testes](doc/testes.md).
- Atualize a documentação afetada. Alterações somente em Markdown exigem revisão de links e diff, sem geração de código ou migrations.
