# Arquitetura e organização do backend

Este é o documento arquitetural canônico do backend. Ele consolida o domínio mapeado, a estrutura implementada e as regras para a evolução do projeto.

## Objetivo

O backend usa **NestJS**, **TypeScript**, **Prisma** e **PostgreSQL**. A organização é modular e orientada aos domínios reais, priorizando código explícito, coeso e simples de manter.

O arquivo prisma/schema.prisma é a fonte oficial de persistência. Antes de criar ou modificar um módulo, analise o schema, as migrations e os módulos existentes. Não invente entidades, relações ou regras não sustentadas pelo domínio.

## Estrutura do repositório

    agendador_de_barbearia_TG/
    ├── AGENT.md                       # referência resumida para esta arquitetura
    ├── back-end/
    │   ├── doc/arquitetura.md          # este documento
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── migrations/
    │   ├── src/
    │   │   ├── config/                 # ambiente e configuração transversal
    │   │   ├── prisma/                 # instância única do Prisma
    │   │   ├── modules/                # domínios do backend
    │   │   ├── app.module.ts
    │   │   └── main.ts
    │   └── test/                       # testes de integração/e2e
    ├── front-end/
    └── pasta/                          # DER, BPMN e demais artefatos

## Domínio mapeado

| Domínio | Modelo Prisma | Relações e restrições relevantes |
| --- | --- | --- |
| usuário | Usuario | e-mail único; perfil CLIENTE, BARBEIRO ou ADMIN; relação 1:1 opcional com cliente e barbeiro. |
| cliente | Cliente | compartilha o id de Usuario; CPF único; possui agendamentos. |
| barbeiro | Barbeiro | compartilha o id de Usuario; pertence a uma filial; possui status e agendamentos. |
| filial | Filial | CNPJ único; possui exatamente um endereço, pois idEndereco é único; agrega barbeiros e agendamentos. |
| endereço | Endereco | relaciona-se opcionalmente com uma filial, em 1:1. |
| serviço | Servico | nome único; preço decimal e duração em minutos; participa de agendamentos. |
| agendamento | Agendamento | referencia cliente, barbeiro e filial; possui início, fim, status e valor total. |
| itens do agendamento | AgendamentoServico | une agendamento e serviço; preserva preço e duração; combinação de agendamento e serviço é única. |

Os índices de agendamento por cliente, barbeiro, filial, início, status e pela combinação de barbeiro e início devem orientar consultas de agenda e conflito de horário. As chaves compartilhadas de Cliente e Barbeiro exigem operações coordenadas com Usuario; use transação quando mais de uma tabela for alterada.

## Estado atual e módulos futuros

| Módulo | Estado | Escopo atual ou inicial |
| --- | --- | --- |
| health | implementado | verificação simples de disponibilidade. |
| servico | implementado | criação e listagem; nome único tratado como conflito. |
| usuario | planejado | cadastro, consulta e suporte aos perfis. |
| cliente | planejado | cadastro ligado a usuário e busca por CPF. |
| barbeiro | planejado | associação a usuário e filial; status. |
| filial | planejado | gestão de filial e seu endereço. |
| endereco | planejado | suporte ao ciclo de vida da filial, sem duplicar sua regra. |
| agendamento | implementado | disponibilidade, serviços, valor total, estados e remoção. |

Não crie pastas ou módulos vazios para antecipar esse plano. Cada módulo deve surgir junto de um caso de uso concreto.

## Organização implementada

    src/
    ├── config/
    │   └── environment.ts
    ├── prisma/
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── modules/
    │   ├── health/
    │   │   ├── health.controller.ts
    │   │   ├── health.service.ts
    │   │   └── health.module.ts
    │   ├── servico/
    │       ├── dto/
    │       │   ├── criar-servico.dto.ts
    │       │   ├── atualizar-servico.dto.ts
    │       │   └── listar-servicos.dto.ts
    │       ├── service/
    │       │   ├── criar-servico.service.ts
    │       │   ├── listar-servicos.service.ts
    │       │   ├── buscar-servico.service.ts
    │       │   ├── editar-servico.service.ts
    │       │   └── remover-servico.service.ts
    │       ├── servico.controller.ts
    │       ├── servico.service.ts
    │       └── servico.module.ts
    │   └── agendamento/
    │       ├── constants/             # regras e configurações imutáveis do domínio
    │       │   ├── include-agendamento.ts
    │       │   └── transicoes-status-agendamento.ts
    │       ├── dto/                   # contratos de entrada do módulo
    │       │   └── agendamento.dto.ts
    │       ├── service/               # um arquivo por caso de uso
    │       │   ├── criar-agendamento.service.ts
    │       │   ├── listar-agendamentos.service.ts
    │       │   ├── buscar-agendamento.service.ts
    │       │   ├── editar-agendamento.service.ts
    │       │   └── remover-agendamento.service.ts
    │       ├── validations/           # validações e cálculos de negócio reutilizados
    │       │   ├── buscar-servicos-agendamento.service.ts
    │       │   ├── calcular-fim-agendamento.service.ts
    │       │   ├── calcular-valor-total-agendamento.service.ts
    │       │   ├── validar-data-hora-agendamento.service.ts
    │       │   ├── validar-vinculos-agendamento.service.ts
    │       │   └── verificar-conflito-agendamento.service.ts
    │       ├── agendamento.controller.ts
    │       ├── agendamento.service.ts  # fachada/orquestração do módulo
    │       └── agendamento.module.ts
    ├── app.module.ts
    └── main.ts

Os módulos `usuario`, `cliente`, `barbeiro`, `filial` e `endereco` seguem a mesma base: `dto/`, `service/`, controller, service orquestradora e module. `barbeiro` e `filial` também possuem `validations/` para regras reutilizadas do próprio domínio. `health` mantém somente os arquivos necessários ao seu único caso de uso.

AppModule registra apenas módulos e dependências transversais. ConfigModule é global; PrismaModule fornece a instância compartilhada de PrismaService; cada módulo de domínio importa explicitamente o que utiliza.

## Modelo para novos módulos

Use `agendamento` como padrão de organização. Crie somente as pastas justificadas pelo domínio:

    modules/<dominio>/
    ├── constants/                   # constantes, includes e transições do domínio
    ├── dto/                         # DTOs agrupados por recurso quando fizer sentido
    ├── service/                     # casos de uso; um arquivo por operação
    ├── validations/                 # validações, consultas de apoio e cálculos reutilizados
    ├── <dominio>.controller.ts
    ├── <dominio>.service.ts         # fachada que delega aos casos de uso
    └── <dominio>.module.ts

O nome do arquivo em `service/` descreve a operação, por exemplo `criar-<dominio>.service.ts`, `listar-<dominios>.service.ts`, `buscar-<dominio>.service.ts`, `editar-<dominio>.service.ts` e `remover-<dominio>.service.ts`. Não crie uma subpasta para cada caso de uso.

`constants/` e `validations/` são opcionais. Crie `mapper/`, `types/` ou `utils/` apenas quando houver uma necessidade concreta que não pertença a `common/`; `repository/` e services agregadoras de operações não fazem parte do padrão. Testes unitários ficam junto do serviço testado, em arquivos `.service.spec.ts`; testes e2e permanecem em `back-end/test/`.

## Fluxo e responsabilidades

    HTTP → Controller → Service orquestradora → Service de caso de uso
         → PrismaService → Prisma Client → PostgreSQL

- **Controller:** recebe HTTP, aplica DTOs e delega. Não contém regra de negócio nem acessa Prisma diretamente.
- **Service orquestradora:** expõe as operações públicas do módulo e delega aos casos de uso especializados.
- **Service de caso de uso:** concentra uma responsabilidade de negócio, valida pré-condições, executa as consultas necessárias via PrismaService e converte erros em exceções Nest adequadas.
- **PrismaService:** é a única instância de PrismaClient, gerencia a conexão e é fornecida por PrismaModule.
- **DTO:** representa a entrada HTTP e usa class-validator/class-transformer; não consulta banco nem decide regra de negócio.

## Regras de implementação

1. Não use TypeORM, entidades, decorators de entidade ou @InjectRepository.
2. Não instancie PrismaClient fora de PrismaService e não acesse Prisma em controllers.
3. Acesse a persistência a partir dos services de caso de uso por meio de PrismaService. Só introduza uma abstração adicional quando houver repetição real e benefício demonstrável; não crie repository genérico.
4. Use os tipos gerados pelo Prisma, incluindo Prisma.*Input e enums, em vez de duplicá-los sem motivo.
5. Use include e select apenas para os dados necessários. Não exponha automaticamente campos sensíveis, como Usuario.senha; crie mapper quando a resposta exigir controle.
6. Use exceptions nativas do Nest e converta erros conhecidos do Prisma quando necessário, como P2002 para conflito.
7. Use this.prisma.$transaction(...) em operações atômicas: usuário com cliente/barbeiro, filial com endereço e agendamento com itens.
8. Não altere schema ou migrations sem necessidade explícita. Migrações são históricas e não devem ser reescritas.
9. Prefira código simples; não introduza Clean Architecture, Hexagonal, CQRS, DDD ou abstrações genéricas sem repetição real e benefício demonstrável.

## Convenções de API e validação

- Pastas e arquivos usam kebab-case; classes usam PascalCase e métodos usam camelCase.
- Cada controller usa o plural do recurso na rota, como @Controller('servicos').
- DTOs ficam em dto/, recebem o sufixo Dto e são validados pelo ValidationPipe global, com whitelist e transform ativados.
- Serviços especializados expõem execute(...); a service orquestradora usa nomes de negócio, como criar, listar, buscar ou cancelar.
- Um novo endpoint deve manter compatibilidade com os existentes, salvo mudança aprovada explicitamente.

## Evolução recomendada

1. Completar o CRUD e as respostas seguras de servico conforme os casos de uso necessários.
2. Implementar usuario e cliente, preservando a relação 1:1 por chave compartilhada e a unicidade de e-mail/CPF.
3. Implementar filial, endereco e barbeiro, respeitando a relação 1:1 filial-endereço e a associação obrigatória do barbeiro a uma filial.
4. Implementar agendamento com validação de cliente, barbeiro e serviços, verificação de conflito de horário, cálculo de valor/duração e criação transacional de AgendamentoServico.
5. Cobrir cada caso de uso com testes de sucesso, ausência de registros, validações, conflitos e transações críticas.

## Checklist de alteração

1. Confirme modelos, relações, índices e restrições em prisma/schema.prisma.
2. Mantenha o fluxo Controller → Service orquestradora → Service de caso de uso → PrismaService.
3. Registre o novo módulo em AppModule e importe PrismaModule onde necessário.
4. Execute npm run prisma:generate, npm run build e npm test a partir de back-end/.
5. Revise imports circulares, chamadas diretas ao Prisma em controllers e exposição de dados sensíveis.
