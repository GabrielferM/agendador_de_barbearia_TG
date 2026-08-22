# Plano de arquitetura do backend

## 1. Domínio identificado

Com base no schema do Prisma, o backend trabalha com os seguintes contextos reais:

- Usuario
- Cliente
- Barbeiro
- Filial
- Endereco
- Servico
- Agendamento
- AgendamentoServico

A modelagem atual já define relações e restrições importantes, como:

- Usuario -> Cliente e Barbeiro em relacionamento 1:1 por `id`
- Cliente -> Agendamento em relacionamento 1:N
- Barbeiro -> Agendamento em relacionamento 1:N
- Filial -> Barbeiro e Agendamento em relacionamento 1:N
- Endereco -> Filial em relacionamento 1:1
- Agendamento -> AgendamentoServico em relacionamento 1:N
- Servico -> AgendamentoServico em relacionamento 1:N

## 2. Módulos que devem existir

A arquitetura deve seguir o padrão de módulos por domínio:

- `usuario`
- `cliente`
- `barbeiro`
- `filial`
- `endereco`
- `servico`
- `agendamento`
- `health`

Para esta entrega inicial, foi implementado o módulo de `servico` como base de referência, porque ele representa um domínio central e simples, com regras de negócio claramente definidas.

## 3. Padrão arquitetural adotado

Cada módulo deve seguir o fluxo:

1. Controller
2. Service orquestradora
3. Services especializados
4. Repository
5. PrismaService
6. Banco de Dados

Principais regras:

- Controllers não acessam Prisma diretamente
- Services cuidam da regra de negócio
- Repositories encapsulam consultas e persistência
- DTOs ficam na pasta `dto`
- A lógica do Prisma fica centralizada em `PrismaService`

## 4. Implementação atual

Foi criada a estrutura de módulo para o domínio de serviços com:

- `servico.module.ts`
- `servico.controller.ts`
- `servico.service.ts`
- `servico.repository.ts`
- `dto/criar-servico.dto.ts`
- `service/criar-servico/criar-servico.service.ts`
- `service/listar-servicos/listar-servicos.service.ts`

Além disso, o módulo foi registrado em `AppModule` e há um teste unitário cobrindo o caso de criação do serviço.

## 5. Próximos passos recomendados

1. Implementar `cliente` com cadastro, busca por CPF e relacionamento com `usuario`
2. Implementar `barbeiro` com associação a `usuario` e `filial`
3. Implementar `filial` e `endereco` como domínios complementares
4. Implementar `agendamento` com regras de conflito de horário e cálculo de valor
5. Adicionar testes para os demais módulos e casos de erro

## 6. Observações finais

A arquitetura foi montada em conformidade com o schema atual e com a orientação do projeto: sem TypeORM, sem entidades fictícias e mantendo o Prisma como fonte única de persistência.
