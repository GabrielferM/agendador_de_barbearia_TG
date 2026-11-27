# Plano do financeiro — 14/11/2026

Repositório: https://github.com/GabrielferM/agendador_de_barbearia_TG, base main.

## Decisões confirmadas
Percentual por barbeiro, sobre subtotal histórico após descontos. Comissão liberada na conclusão do atendimento. Administrador registra manualmente o repasse. Escopo: receita de atendimentos, comissões e repasses; sem despesas, caixa, cobrança online ou confirmação de pagamento do cliente.

## Diagnóstico
Já existem Comissao (única por item), CRUD administrativo, consulta /admin/financeiro e receita nos dashboards. Faltam percentual configurável, geração na conclusão, transições controladas, auditoria do repasse e consulta financeira própria do barbeiro. A atualização atual de comissão permite status e datas sem validar a transição. O DOCX apresenta a necessidade de comissão a receber, mas seus exemplos e instruções acadêmicas não são requisitos de implementação.

## PRs draft, destino main
1. `feat(financeiro): configurar percentual e gerar comissões na conclusão`: migration aditiva para percentual opcional; cálculo Decimal e arredondamento por item; integração atômica com conclusão e histórico; preservar comissão existente e valores históricos; testes. Percentual ausente exige configuração antes de concluir, sem inventar taxa. Nenhum recálculo retroativo automático.
2. `feat(financeiro): registrar repasses e consultar saldos`: endpoints administrativos e próprios, autorização pela sessão, paginação, totais agregados, configuração do percentual, repasse integral por comissão liberada, auditado por responsável/data. Operação atômica e repetição sem segundo pagamento. Bloquear bypass via PATCH legado. Testes de autorização, concorrência e estados.
3. `feat(financeiro): integrar admin e barbeiro`: resumo financeiro nos dois dashboards; configuração e repasses no financeiro administrativo; extrato próprio no painel do barbeiro; valores em reais, estados de carregamento/erro/vazio, cache segregado e invalidado após mutações; contratos gerados e testes de interface.

PRs cumulativos, todos com base main conforme solicitado. Dependências 1 → 2 → 3 explícitas nas descrições; não mesclar fora da ordem. Após merge anterior, atualizar a branch seguinte para remover o diff já integrado. Nenhum merge ou marcação como pronto nesta tarefa.

## Semântica e invariantes
- Receita de serviços concluídos não é recebimento nem lucro. Preservar essa identificação.
- A receber: somente LIBERADA. PREVISTA separada; PAGA separada; CANCELADA/ESTORNADA não são dívida ativa.
- Resumo de comissões por data de geração; saldo a receber identifica todos os períodos. Repasse usa data efetiva registrada pelo servidor.
- Valor = subtotal × percentual / 100, Decimal com duas casas, HALF_UP por item, antes de somar.
- Taxa 0 a 100%, no máximo duas casas; ausência diferente de 0%. Alteração vale para novas conclusões.
- Conclusão, comissões e histórico na mesma transação serializável. Falha desfaz tudo.
- Repasse integral por comissão; não executar transferência bancária. Impedir dupla baixa, pagamento de comissão prevista/cancelada/estornada e alteração arbitrária das datas.
- Barbeiro identificado pela sessão; não aceitar ID de outro profissional como escopo.
- Histórico antigo sem comissões não ganha valores calculados com uma taxa atual sem confirmação específica.

## Verificação
Backend: prisma generate, build, unitários, lint, format:check e e2e HTTP. Frontend: Orval, lint, build e testes. Cobrir centavos, descontos, taxa zero/ausente/limites, vários itens, repetição, rollback, permissão, dois barbeiros e saldos. Validar migration e concorrência em PostgreSQL isolado quando disponível; informar explicitamente se indisponível. Revisar interface desktop/celular e diff.

## Pendências externas identificadas (não implementar)
A documentação registra criação/reagendamento administrativo e jornada/disponibilidade individual pendentes; contato público demonstrativo; partes acadêmicas do Tg_v2.docx ainda como modelo. O guia de testes registra seis falhas preexistentes em mensagens de ativação/desativação de serviços, a confirmar na execução desta tarefa. Validações anteriores com HTTP simulado não garantem persistência/concorrência em PostgreSQL.
