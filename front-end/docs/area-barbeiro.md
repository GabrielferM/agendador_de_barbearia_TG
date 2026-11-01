# Área do barbeiro

As seis rotas usam API real, mesmo com VITE_USAR_DADOS_MOCKADOS=true. O frontend
exige BARBEIRO. As consultas específicas exigem sessão, perfil e
GERENCIAR_PROPRIA_AGENDA no backend. A identidade vem da sessão, nunca dos filtros.

| Rota frontend | Contrato | Decisão |
| --- | --- | --- |
| /barbeiro | GET /dashboard/barbeiro | Corrigidas quantidades, próximos estados e variações |
| /barbeiro/agenda | GET /agendamentos | Reutilizado, filtros URL e paginação no servidor |
| /barbeiro/agenda/:id | GET e PATCH /agendamentos/:id | PATCH restrito, sanitizado e transacional |
| /barbeiro/servicos | GET /dashboard/barbeiro/servicos | Novo catálogo com métricas próprias |
| /barbeiro/clientes | GET /dashboard/barbeiro/clientes | Nova carteira agregada e paginada por cliente |
| /barbeiro/historico | GET /dashboard/barbeiro/historico | Novo histórico de atendimentos encerrados |

Não há migrations, alterações de schema, criação/reagendamento ou geração/pagamento
de comissões. Nenhum endpoint administrativo foi liberado ao barbeiro.
POST/GET `historico-status` não ficam disponíveis ao barbeiro; auditoria de mudanças
não é o histórico de atendimentos e não é usada para simular transições.

## Indicadores e períodos

- Agendamentos hoje exclui somente CANCELADO (inclui não comparecimento).
- Receita soma subtotais históricos de itens de agendamentos CONCLUIDO cuja data
  prevista está no dia. Não é pagamento, comissão ou ganho líquido.
- Clientes nos últimos sete dias são distintos em agendamentos não cancelados:
  hoje e seis dias anteriores, comparados aos sete dias imediatamente anteriores.
- Serviços no mês soma quantidade de itens de atendimentos concluídos, não linhas
  nem quantidade de agendamentos. A soma financeira mantém Decimal no backend.
- Período anterior zero e atual positivo produz variacaoPercentual=null e mensagem
  de ausência de base. Ambos zero produz 0%. Agenda e receita comparam com ontem.
- Próximos incluem apenas PENDENTE e CONFIRMADO com início previsto >= agora.
- Datas comerciais, horários e rótulos do dashboard usam America/Sao_Paulo.

Serviços e histórico usam início do mês até hoje por padrão, dias inclusivos e
limite de 366 dias. Datas impossíveis, período invertido, página e status são
validados. A agenda mantém timestamps ISO com fuso e limites inclusivos, com teto
de 366 dias quando ambos os limites são enviados.

## Consultas e navegação

Serviços não são exclusivos do profissional: essa relação não existe no schema.
O catálogo inclui ativos e inativos com qualquer histórico próprio. Métricas usam
somente CONCLUIDO do profissional no período. Preço-base atual e receita histórica
são separados. Busca por nome, paginação e agregações são no servidor.

Clientes são selecionados diretamente de Cliente por existência de agendamento
próprio, antes da paginação e do total. Último concluído, próximo pendente/confirmado
e contagem são restritos ao profissional. Só ID, nome e métricas são retornados,
sem contatos, CPF ou observações. Busca por nome e paginação usam o servidor.
Os filtros de período herdados do DTO não alteram a carteira.

Histórico limita estados a CONCLUIDO, CANCELADO e NAO_COMPARECEU, ordenando por
início previsto desc e ID desc. O filtro de cliente intersecta o profissional da
sessão; cliente alheio retorna lista vazia. A seleção usa a carteira (links
“Selecionar cliente da minha carteira” e “Ver histórico”), sem baixar cadastros
completos. Retornar do detalhe preserva filtros de agenda/histórico.

Transições: PENDENTE → CONFIRMADO/CANCELADO; CONFIRMADO →
EM_ATENDIMENTO/CANCELADO/NAO_COMPARECEU; EM_ATENDIMENTO → CONCLUIDO.
A UI confirma explicitamente e exige motivo no cancelamento. O backend deriva
responsável e estado anterior da sessão/banco, relê propriedade/estado dentro da
transação serializável, grava histórico e início/fim real quando ausentes.
Falha no histórico impede concluir a transação. P2034 repete a leitura e revalida
estado. Nenhuma comissão é criada. Sucesso invalida todos os caches afetados.

## Verificação e limites

Testes unitários e HTTP usam Prisma simulado; frontend usa jsdom e HTTP simulado.
Cobrem dois profissionais, permissões, propriedade, payload proibido, transições,
auditoria conjunta, repetição de conflito, paginação de clientes, quantidades,
centavos, virada do ano, datas inválidas, erros, carregamento e cache.
A simulação de P2034 não comprova concorrência no PostgreSQL.

OpenAPI foi extraído dos módulos Nest com Prisma substituído e consumidores foram
regenerados pelo Orval, sem edição manual dos arquivos gerados. Nenhum PostgreSQL
foi configurado e nenhuma migration foi executada. Validação com banco e API reais
permanece pendente antes de considerar o fluxo validado em produção.

Veja [capturas desktop/celular](capturas-barbeiro/README.md), com HTTP e sessão
simulados, e [resultados dos checks](validacao-barbeiro.md).
