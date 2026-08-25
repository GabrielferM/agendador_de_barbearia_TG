# AGENT.md

## Referência obrigatória

Antes de criar ou modificar código do backend, leia a arquitetura canônica em [back-end/doc/arquitetura.md](back-end/doc/arquitetura.md). Ela define o domínio mapeado, a organização de pastas, as responsabilidades das camadas e o processo de validação.

## Regras inegociáveis

- Use NestJS, TypeScript, Prisma e PostgreSQL; não use TypeORM ou entidades TypeORM.
- Preserve prisma/schema.prisma como fonte oficial de persistência e não altere schema ou migrations sem necessidade explícita.
- Mantenha o fluxo Controller → Service → Repository → PrismaService e não acesse Prisma diretamente em controllers.
- Use apenas a instância centralizada de PrismaService; não crie novos PrismaClient.
- Organize o código por domínio em back-end/src/modules/ e não crie módulos, camadas ou pastas vazias.
- Evite abstrações prematuras, repositories genéricos e novos padrões arquiteturais sem justificativa clara.
- Ao alterar o backend, valide com npm run prisma:generate, npm run build e npm test em back-end/.
