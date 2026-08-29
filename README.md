# Agendador de Barbearia

Aplicação full-stack para organizar a operação de uma barbearia: cadastro de usuários, clientes, barbeiros, filiais, endereços e serviços, além do gerenciamento de agendamentos.

O backend disponibiliza uma API REST documentada com Swagger. O frontend em React está em desenvolvimento e concentra a interface da aplicação.

## Tecnologias

- **Backend:** NestJS, TypeScript, Prisma e PostgreSQL
- **Frontend:** React, Vite, TypeScript, Tailwind CSS e HeroUI
- **Documentação da API:** Swagger/OpenAPI

## Estrutura

```text
.
├── back-end/          # API NestJS e Prisma
├── front-end/         # Interface React/Vite
└── pasta/             # Diagramas de domínio e BPMN
```

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- PostgreSQL

## Configuração

Instale as dependências de cada aplicação:

```bash
cd back-end
npm install

cd ../front-end
npm install
```

Crie o arquivo `back-end/.env` com as variáveis abaixo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendador_barbearia?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
```

`PORT` e `NODE_ENV` possuem, respectivamente, os valores padrão `3000` e `development`. Em produção, `CORS_ORIGINS` é obrigatório e pode conter várias origens separadas por vírgula.

## Executar localmente

Em um terminal, prepare o banco e inicie a API:

```bash
cd back-end
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Em outro terminal, inicie o frontend:

```bash
cd front-end
npm run dev
```

Endereços padrão:

| Serviço | Endereço |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3000` |
| Swagger (desenvolvimento) | `http://localhost:3000/api` |
| Saúde da API | `http://localhost:3000/health` |

## Recursos da API

Os recursos abaixo possuem operações de criação, listagem, busca por ID, atualização e remoção:

| Recurso | Rota base |
| --- | --- |
| Usuários | `/usuarios` |
| Clientes | `/clientes` |
| Barbeiros | `/barbeiros` |
| Filiais | `/filiais` |
| Endereços | `/enderecos` |
| Serviços | `/servicos` |
| Agendamentos | `/agendamentos` |

Consulte contratos, exemplos de requisição e filtros disponíveis diretamente no Swagger. A rota `GET /health` confirma a disponibilidade do banco de dados.

## Comandos úteis

### Backend

```bash
cd back-end
npm run build
npm run lint
npm run test
npm run test:e2e
npm run prisma:studio
```

### Frontend

```bash
cd front-end
npm run build
npm run lint
npm run preview
```

## Banco de dados

O esquema e o histórico de migrações ficam em [`back-end/prisma`](back-end/prisma). Para alterar o modelo em desenvolvimento, atualize o esquema Prisma e execute `npm run prisma:migrate` dentro de `back-end/`.

## Materiais do projeto

Os diagramas entidade-relacionamento e BPMN estão em [`pasta/`](pasta/), e a referência da arquitetura do backend está em [`back-end/doc/arquitetura.md`](back-end/doc/arquitetura.md).
