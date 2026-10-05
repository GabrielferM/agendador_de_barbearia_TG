# Arquitetura do backend

## Implementado: stack e fluxo

NestJS e TypeScript expõem a API REST; Prisma acessa PostgreSQL. O [schema](../prisma/schema.prisma) define persistência; [AppModule](../src/app.module.ts) registra os módulos ativos.

```text
HTTP → guards → Controller → service de fachada → service de caso de uso
     → PrismaService → Prisma Client → PostgreSQL
```

Os pipes validam argumentos antes da execução do método do controller. Controllers lidam com HTTP, DTOs, cookies e delegação; não consultam Prisma. A fachada expõe operações do domínio e pode aplicar autorização contextual. O caso de uso executa regras, consultas e gravações. Serviços em `validations/` encapsulam validações e cálculos reutilizados. Health é um caso simples com controller e service, sem fachada adicional.

A fachada [AgendamentoService](../src/modules/agendamento/agendamento.service.ts) delega a validação de propriedade ao [ValidarAcessoAgendamentoService](../src/modules/agendamento/validations/validar-acesso-agendamento.service.ts) e mantém a sanitização da resposta. Os submódulos do dashboard administrativo separam arquivos em pastas como `controller/`; preserve essa organização ao trabalhar nesses módulos.

O [PrismaService](../src/prisma/prisma.service.ts) centraliza cliente, adapter PostgreSQL, pool e ciclo de conexão. Os módulos importam PrismaModule conforme necessário; não criam clientes independentes. ConfigModule é global. `common/` contém autenticação, segurança, DTOs e utilitários transversais; `config/` concentra ambiente e Swagger.

## Implementado: domínio

| Modelos | Responsabilidade e restrições |
| --- | --- |
| Usuario | E-mail único, `senhaHash`, status e vínculo obrigatório com Papel. |
| Sessao | Token armazenado como hash único; expiração, último uso e revogação. |
| Papel, Permissao, PapelPermissao | Códigos únicos, ativação e vínculo único entre papel e permissão. |
| Cliente, Barbeiro, Administrador | Compartilham o ID com Usuario. Cliente tem CPF único; barbeiro pertence a uma filial. |
| Filial, Endereco | CNPJ único; cada filial exige um endereço exclusivo; endereço pode não ter filial. |
| Servico | Nome único, preço decimal, duração em minutos e ativação. |
| Agendamento | Cliente, barbeiro, filial, horários previstos/reais, origem e status. |
| AgendamentoServico | Preço/duração aplicados, quantidade, desconto, subtotal e ordem. Serviço e ordem são únicos dentro do agendamento. |
| Comissao | Uma comissão por item de agendamento, vinculada ao barbeiro, com valores e status. |
| HistoricoStatusAgendamento | Transição, responsável, data e motivo vinculados ao agendamento. |

O papel do usuário é uma relação, não um enum de perfil. `Agendamento` não persiste um campo de valor total: os valores dos itens sustentam os cálculos. Índices de agenda ajudam consultas, mas não são uma restrição de exclusão de horários sobrepostos.

Módulos ativos: autenticação, catálogo público, health, serviço, administrador, cliente, barbeiro, filial, agendamento, papel, permissão, comissão e dashboards de administrador/barbeiro. O dashboard administrativo agrega submódulos de dashboard, agendamento, cliente, barbeiro, serviços e financeiro. Usuario e Endereco são modelos utilizados por casos de uso; não há módulos independentes ativos com esses nomes. Tipos antigos no frontend gerado não comprovam a existência de endpoints atuais.

A disponibilidade pública e as validações de expediente, vínculos e serviços são descritas no [guia de agendamento do cliente](agendamento-cliente.md). A consulta de horários não reserva a agenda; a gravação revalida tudo dentro da transação.

## Regra para novas alterações: organização

```text
src/modules/<dominio>/
  <dominio>.module.ts
  <dominio>.controller.ts
  <dominio>.service.ts
  dto/
  service/       # casos de uso
  constants/     # somente quando necessário
  validations/   # somente quando houver regras reutilizadas
```

Use como referência [criar serviço](../src/modules/servico/service/criar-servico.service.ts) e [criar agendamento](../src/modules/agendamento/service/criar-agendamento.service.ts). Não crie diretórios vazios, repository genérico, TypeORM ou camadas de Clean Architecture/CQRS sem necessidade demonstrada. Registre providers e imports no módulo responsável. Consulte [nomenclatura](nomenclatura.md).

## Persistência e contratos

**Implementado:** criação e edição de agendamento executam consultas de apoio, validação de vínculos, verificação de conflito e gravação na mesma transação interativa com isolamento `Serializable`. O helper [executarTransacaoSerializavel](../src/prisma/transacao.ts) repete até três vezes quando o Prisma retorna `P2034`; depois disso, o caso de uso responde 409 com mensagem segura. A criação grava os itens por nested write. O login usa transação para atualizar usuário e criar sessão.

**Regra para novas alterações:** use nested writes ou `$transaction` quando gravações precisam ser atômicas. Dentro de uma transação interativa, use o cliente `tx` recebido. Não altere schema ou histórico de migrations sem necessidade explícita. Reutilize tipos e enums do Prisma internamente, mas controle os DTOs de resposta HTTP.

[serializarResposta](../src/common/utils/resposta.ts) converte recursivamente Decimal em string com duas casas e Date em ISO. Seu tipo genérico mantém `T`, embora a representação em execução mude: não use esse tipo como prova do contrato JSON. `semSenha` remove `senhaHash` do objeto recebido, não sanitiza automaticamente qualquer objeto aninhado. Selecione os campos necessários e controle relações incluídas. Dashboards têm contratos próprios; confirme números e strings por endpoint.

## Segurança e validação

Guards globais executam throttling, autenticação, CSRF e permissões. Rotas públicas são explícitas; permissões e propriedade dos recursos devem ser verificadas no servidor. O [guia de segurança](../../front-end/docs/seguranca-autenticacao.md) detalha implementação e pendências.

O [configurador compartilhado do ValidationPipe](../src/config/validacao.ts), usado por `main.ts` e pelos testes e2e, transforma entradas, rejeita campos não permitidos e oculta valor/objeto nos erros de validação. Swagger descreve contratos fora de produção. Veja [erros](tratamento-de-erros.md) e [testes](testes.md).

## Melhorias pendentes

- Revisar a representação TypeScript das respostas serializadas.
- Ampliar testes com PostgreSQL isolado para comprovar transações, concorrência e restrições no banco real.

Esses itens não autorizam refatorações ou migrations durante uma tarefa documental.
