# Implementação de Backend NestJS + Prisma baseado no Banco de Dados Existente

Você é um arquiteto e desenvolvedor backend especialista em **NestJS, TypeScript, Prisma, SQL e arquitetura modular orientada a domínio**.

Sua tarefa é analisar o projeto existente, principalmente o **banco de dados e o schema do Prisma**, e implementar uma arquitetura de backend em NestJS que seja organizada, escalável, testável e fácil de manter.

O projeto utiliza **Prisma como ORM e camada de acesso ao banco de dados**.

---

# 1. Antes de implementar: analisar o projeto

Antes de criar ou modificar qualquer código, analise cuidadosamente:

* estrutura atual do projeto;
* `prisma/schema.prisma`;
* banco de dados;
* tabelas/modelos;
* relacionamentos;
* chaves primárias;
* chaves estrangeiras;
* enums;
* índices;
* campos obrigatórios e opcionais;
* valores padrão;
* regras implícitas nos relacionamentos;
* migrations existentes;
* módulos existentes;
* controllers;
* services;
* repositories, caso existam;
* DTOs;
* regras de negócio já implementadas.

O `schema.prisma` deve ser considerado uma das principais fontes para entender a estrutura de persistência.

Não crie entidades ou relações fictícias.

Não altere o banco de dados ou o `schema.prisma` sem necessidade real.

Quando existir uma relação entre tabelas, preserve corretamente essa relação na arquitetura da aplicação.

---

# 2. Arquitetura principal

A pasta `src` deverá possuir uma estrutura organizada da seguinte maneira:

```text
src/
├── app.module.ts
│
└── modules/
    ├── agendamento/
    ├── cliente/
    ├── servico/
    ├── profissional/
    ├── pagamento/
    └── ...
```

A regra principal é:

> Cada pasta dentro de `modules` representa um domínio, funcionalidade ou contexto da aplicação.

Os nomes dos módulos devem ser definidos com base nas funcionalidades reais identificadas no banco e no sistema.

Os exemplos acima servem apenas como referência.

---

# 3. Estrutura de cada módulo

Cada módulo deverá possuir um arquivo principal de módulo, controller orquestrador e service orquestradora.

Exemplo:

```text
modules/
└── agendamento/
    ├── agendamento.controller.ts
    ├── agendamento.module.ts
    ├── agendamento.service.ts
    │
    ├── controller/
    │
    ├── service/
    │   ├── criar-agendamento/
    │   │   └── criar-agendamento.service.ts
    │   ├── buscar-agendamento/
    │   │   └── buscar-agendamento.service.ts
    │   ├── editar-agendamento/
    │   │   └── editar-agendamento.service.ts
    │   └── cancelar-agendamento/
    │       └── cancelar-agendamento.service.ts
    │
    ├── repository/
    │   └── agendamento.repository.ts
    │
    ├── dto/
    │   ├── criar-agendamento.dto.ts
    │   ├── editar-agendamento.dto.ts
    │   └── ...
    │
    ├── mapper/
    │   └── agendamento.mapper.ts
    │
    ├── utils/
    │   └── ...
    │
    ├── constants/
    │   └── ...
    │
    ├── types/
    │   └── ...
    │
    └── tests/
        └── ...
```

A estrutura deve ser adaptada conforme a necessidade do domínio.

Não crie uma pasta ou camada apenas por obrigação.

Se determinado módulo não precisar de `mapper`, `utils`, `constants` ou outra camada, não crie arquivos vazios ou artificiais.

---

# 4. Controller orquestrador

Cada módulo deverá possuir um controller principal.

Exemplo:

```text
agendamento.controller.ts
```

O controller deve ser responsável por:

* receber requisições HTTP;
* validar/receber DTOs;
* chamar a service orquestradora;
* retornar as respostas.

O controller **não deve conter regras complexas de negócio**.

Evite:

```typescript
@Post()
async criar(@Body() dto: CriarAgendamentoDto) {
  // regras de negócio
  // consultas no Prisma
  // validações complexas
  // cálculos
}
```

Prefira:

```typescript
@Post()
async criar(@Body() dto: CriarAgendamentoDto) {
  return this.agendamentoService.criar(dto);
}
```

---

# 5. Service orquestradora

Cada módulo deverá possuir uma service principal.

Exemplo:

```text
agendamento.service.ts
```

Ela funciona como uma camada de orquestração dos casos de uso.

Exemplo:

```typescript
@Injectable()
export class AgendamentoService {
  constructor(
    private readonly criarAgendamentoService: CriarAgendamentoService,
    private readonly buscarAgendamentoService: BuscarAgendamentoService,
    private readonly editarAgendamentoService: EditarAgendamentoService,
    private readonly cancelarAgendamentoService: CancelarAgendamentoService,
  ) {}

  async criar(dto: CriarAgendamentoDto) {
    return this.criarAgendamentoService.execute(dto);
  }

  async buscar(id: number) {
    return this.buscarAgendamentoService.execute(id);
  }

  async editar(id: number, dto: EditarAgendamentoDto) {
    return this.editarAgendamentoService.execute(id, dto);
  }

  async cancelar(id: number) {
    return this.cancelarAgendamentoService.execute(id);
  }
}
```

A service orquestradora não deve concentrar toda a lógica do domínio.

Ela deve delegar os casos de uso para services específicas.

---

# 6. Services especializadas

As regras de negócio devem ser separadas por responsabilidade.

Exemplo:

```text
service/
├── criar-agendamento/
│   └── criar-agendamento.service.ts
├── buscar-agendamento/
│   └── buscar-agendamento.service.ts
├── editar-agendamento/
│   └── editar-agendamento.service.ts
├── cancelar-agendamento/
│   └── cancelar-agendamento.service.ts
└── verificar-disponibilidade/
    └── verificar-disponibilidade.service.ts
```

Cada service deve representar uma responsabilidade clara.

Evite services gigantes com centenas ou milhares de linhas.

---

# 7. Repository utilizando Prisma

O acesso aos dados deve ser encapsulado na camada de repository.

Como o projeto utiliza Prisma, **não utilize TypeORM**.

Não utilize:

```typescript
@InjectRepository()
Repository<Entity>
@Entity()
@Column()
@ManyToOne()
@OneToMany()
```

Esses recursos não devem existir nessa arquitetura.

O repository deve utilizar o `PrismaService`.

Exemplo:

```typescript
@Injectable()
export class AgendamentoRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarPorId(id: number) {
    return this.prisma.agendamento.findUnique({
      where: {
        id,
      },
    });
  }

  async criar(data: Prisma.AgendamentoCreateInput) {
    return this.prisma.agendamento.create({
      data,
    });
  }
}
```

A aplicação deve utilizar o Prisma através de uma instância centralizada de `PrismaService`.

---

# 8. PrismaService

Crie ou utilize uma implementação centralizada de `PrismaService`.

Exemplo conceitual:

```text
src/
├── prisma/
│   └── prisma.service.ts
│
└── modules/
```

Caso o projeto já possua uma estrutura adequada para o Prisma, reutilize-a em vez de duplicar a implementação.

O `PrismaService` deve ser responsável pelo ciclo de vida da conexão do Prisma com o banco.

Os módulos não devem instanciar `PrismaClient` diretamente.

Evite:

```typescript
const prisma = new PrismaClient();
```

dentro de services ou repositories.

Prefira:

```typescript
constructor(
  private readonly prisma: PrismaService,
) {}
```

---

# 9. Repository como abstração de persistência

As services devem conhecer o repository, e não detalhes específicos de persistência espalhados pelo sistema.

Exemplo:

```text
Controller
   ↓
Service Orquestradora
   ↓
Service de Caso de Uso
   ↓
Repository
   ↓
PrismaService
   ↓
Banco de Dados
```

Evite colocar várias chamadas do Prisma diretamente em diferentes services quando elas representam operações de persistência.

Por exemplo, prefira:

```typescript
await this.agendamentoRepository.buscarPorCliente(clienteId);
```

em vez de espalhar:

```typescript
await this.prisma.agendamento.findMany(...)
```

por todas as services do módulo.

---

# 10. DTOs

Cada módulo deve possuir uma pasta:

```text
dto/
```

Exemplo:

```text
dto/
├── criar-agendamento.dto.ts
├── editar-agendamento.dto.ts
├── listar-agendamento.dto.ts
└── ...
```

Os DTOs representam os dados recebidos pela API.

Utilize validações apropriadas:

```typescript
export class CriarAgendamentoDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  servicoId: number;

  @IsDateString()
  data: string;
}
```

Não coloque consultas Prisma ou regras complexas dentro dos DTOs.

---

# 11. Mapper

Quando necessário, utilize mappers para separar:

* modelo do Prisma;
* modelo interno;
* resposta da API.

Exemplo:

```text
mapper/
└── agendamento.mapper.ts
```

Exemplo:

```typescript
export class AgendamentoMapper {
  static toResponse(agendamento: Agendamento) {
    return {
      id: agendamento.id,
      data: agendamento.data,
      clienteId: agendamento.clienteId,
    };
  }
}
```

Não exponha automaticamente todos os campos retornados pelo Prisma caso isso não seja apropriado para a API.

---

# 12. Utils

Utilize:

```text
utils/
```

somente para funções auxiliares reutilizáveis dentro daquele domínio.

Exemplo:

```text
utils/
├── calcular-duracao.ts
├── validar-horario.ts
└── ...
```

Evite transformar `utils` em uma pasta genérica contendo código sem responsabilidade definida.

---

# 13. Constants

Utilize:

```text
constants/
```

para constantes específicas do domínio.

Exemplo:

```text
constants/
└── status-agendamento.constants.ts
```

Quando houver estados bem definidos e que também aparecem no Prisma, avalie se deve ser utilizado o enum gerado pelo Prisma em vez de duplicar constantes.

Não duplique enums sem necessidade.

---

# 14. Types

Utilize:

```text
types/
```

para tipos específicos do domínio que não sejam DTOs nem tipos gerados pelo Prisma.

Não recrie tipos que já estejam disponíveis no Prisma.

Por exemplo, aproveite os tipos gerados:

```typescript
Prisma.AgendamentoCreateInput
Prisma.AgendamentoWhereInput
Prisma.AgendamentoUpdateInput
```

quando forem apropriados.

---

# 15. Prisma Schema

O arquivo:

```text
prisma/schema.prisma
```

deve continuar sendo a representação oficial da estrutura de persistência.

Analise:

```prisma
model Cliente {
  id          Int           @id @default(autoincrement())
  nome        String
  agendamentos Agendamento[]
}
```

e utilize essas relações corretamente na aplicação.

Não crie classes `Entity` do TypeORM.

Os modelos do Prisma serão utilizados como referência para persistência.

---

# 16. Relacionamentos

Sempre respeite os relacionamentos definidos no Prisma.

Por exemplo:

```prisma
model Agendamento {
  id        Int @id @default(autoincrement())
  clienteId Int

  cliente Cliente @relation(
    fields: [clienteId],
    references: [id]
  )
}
```

O backend deve compreender que:

```text
Agendamento
    ↓
Cliente
```

é uma relação real.

Quando necessário, use `include` e `select` do Prisma de forma controlada.

Evite:

```typescript
include: {
  tudo: true
}
```

sem necessidade.

Busque apenas os dados necessários para cada caso de uso.

---

# 17. Transações

Quando uma operação exigir múltiplas alterações relacionadas no banco, utilize transações do Prisma.

Exemplo:

```typescript
await this.prisma.$transaction(async (tx) => {
  // operações relacionadas
});
```

Use transações quando houver risco de deixar o banco em estado inconsistente caso uma das operações falhe.

---

# 18. Regras de negócio

As regras de negócio pertencem às services.

Exemplo:

```text
CriarAgendamentoService
    ↓
Verificar disponibilidade
    ↓
Validar cliente
    ↓
Validar serviço
    ↓
Criar agendamento
```

O repository deve ficar responsável pela persistência.

O Prisma deve ficar responsável pelo acesso ao banco.

O controller deve ficar responsável pela camada HTTP.

---

# 19. AppModule

O:

```text
app.module.ts
```

deve ser simples.

Exemplo:

```typescript
@Module({
  imports: [
    PrismaModule,
    AgendamentoModule,
    ClienteModule,
    ServicoModule,
  ],
})
export class AppModule {}
```

Evite colocar regras de negócio ou implementações de domínio diretamente no `AppModule`.

---

# 20. Organização final esperada

A estrutura final poderá ser semelhante a:

```text
src/
├── app.module.ts
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
└── modules/
    │
    ├── agendamento/
    │   ├── agendamento.controller.ts
    │   ├── agendamento.module.ts
    │   ├── agendamento.service.ts
    │   │
    │   ├── controller/
    │   │
    │   ├── service/
    │   │   ├── criar-agendamento/
    │   │   ├── buscar-agendamento/
    │   │   ├── editar-agendamento/
    │   │   └── cancelar-agendamento/
    │   │
    │   ├── repository/
    │   │   └── agendamento.repository.ts
    │   │
    │   ├── dto/
    │   │   ├── criar-agendamento.dto.ts
    │   │   └── editar-agendamento.dto.ts
    │   │
    │   ├── mapper/
    │   │   └── agendamento.mapper.ts
    │   │
    │   ├── utils/
    │   │
    │   ├── constants/
    │   │
    │   ├── types/
    │   │
    │   └── tests/
    │
    ├── cliente/
    │   └── ...
    │
    ├── servico/
    │   └── ...
    │
    ├── profissional/
    │   └── ...
    │
    └── pagamento/
        └── ...
```

---

# 21. Fluxo arquitetural obrigatório

A comunicação deve seguir preferencialmente:

```text
HTTP
 ↓
Controller
 ↓
Service Orquestradora
 ↓
Service especializada / Caso de Uso
 ↓
Repository
 ↓
PrismaService
 ↓
Database
```

O fluxo inverso não deve acontecer.

Não permita que:

* Controller acesse Prisma diretamente;
* Controller acesse repository diretamente;
* Prisma seja instanciado dentro de cada service;
* Repository contenha regras de negócio;
* DTO contenha regras de negócio;
* Service dependa de Controller.

---

# 22. Testes

Implemente testes para os principais casos de uso.

Exemplo:

```text
tests/
├── criar-agendamento.service.spec.ts
├── buscar-agendamento.service.spec.ts
├── editar-agendamento.service.spec.ts
└── cancelar-agendamento.service.spec.ts
```

Priorize testes de:

* regras de negócio;
* validações;
* casos de sucesso;
* casos de erro;
* comportamento quando registros não existem;
* regras envolvendo relacionamentos;
* transações quando forem críticas.

Utilize mocks do Prisma/Repository quando apropriado.

---

# 23. Processo de implementação

Execute o trabalho nesta ordem:

## Etapa 1 — Analisar

Analise:

```text
prisma/schema.prisma
prisma/migrations/
src/
```

e todo o backend existente.

## Etapa 2 — Mapear o domínio

Identifique:

* módulos;
* tabelas;
* relacionamentos;
* funcionalidades;
* casos de uso.

## Etapa 3 — Definir a arquitetura

Para cada domínio, determine:

* controller;
* service orquestradora;
* services especializadas;
* repository;
* DTOs;
* mapper;
* utils;
* constants;
* types;
* testes.

Crie apenas aquilo que realmente for necessário.

## Etapa 4 — Implementar

Implemente progressivamente os módulos.

Preserve funcionalidades existentes sempre que possível.

Não quebre endpoints já utilizados sem necessidade.

## Etapa 5 — Validar

Execute:

```bash
npx prisma generate
```

e também:

```bash
npm run build
```

ou o comando equivalente utilizado pelo projeto.

Execute os testes e a validação de tipos.

Verifique também se:

* Prisma está funcionando;
* migrations continuam válidas;
* os módulos estão corretamente registrados;
* dependências estão corretas;
* não existem imports circulares;
* não existem chamadas diretas ao Prisma em controllers.

---

# 24. Regras fundamentais

Durante toda a implementação:

* Utilize **NestJS + Prisma + TypeScript**.
* Não utilize TypeORM.
* Não crie entidades TypeORM.
* Não utilize `@InjectRepository`.
* Não espalhe `PrismaClient` pelo projeto.
* Utilize um `PrismaService` centralizado.
* Encapsule persistência nos repositories.
* Mantenha regras de negócio nas services.
* Utilize uma service orquestradora por módulo.
* Utilize um controller orquestrador por módulo.
* Organize o sistema por domínio.
* Evite módulos gigantes.
* Evite services gigantes.
* Evite repositories gigantes.
* Evite duplicação de código.
* Evite abstrações desnecessárias.
* Respeite o banco de dados existente.
* Respeite o `schema.prisma`.
* Reutilize tipos gerados pelo Prisma quando apropriado.
* Utilize transações do Prisma quando uma operação exigir atomicidade.
* Não altere o banco sem necessidade.
* Não invente relações que não existem.
* Priorize coesão, baixo acoplamento, legibilidade e manutenção.

---

# Resultado esperado

Ao finalizar, o backend deverá possuir uma arquitetura modular, organizada por domínio, utilizando **NestJS + Prisma**, onde cada módulo possui seu próprio contexto e segue o fluxo:

```text
Controller
    ↓
Service Orquestradora
    ↓
Service de Caso de Uso
    ↓
Repository
    ↓
PrismaService
    ↓
Banco de Dados
```

A arquitetura deve ser definida com base na estrutura real do banco e no funcionamento atual da aplicação, e não apenas seguindo os exemplos deste prompt.

Primeiro compreenda o banco e o domínio.

Depois defina os módulos.

Somente então implemente o código.
