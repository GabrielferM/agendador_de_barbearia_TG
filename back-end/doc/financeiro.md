# Financeiro e comissões

Percentual por barbeiro entre 0 e 100%, com duas casas. Ausência exige configuração administrativa antes de concluir atendimentos com itens sem comissão. Zero é uma taxa válida. A taxa é fotografada na conclusão, sobre o subtotal histórico já descontado; arredondamento HALF_UP por item e soma decimal.

Concluir atendimento gera LIBERADA na mesma transação de status/histórico. Comissões PREVISTA existentes são liberadas preservando valores. Estados incompatíveis bloqueiam a conclusão para revisão; cancelar/não comparecer cancela previstas. Não há recálculo ou backfill automático de atendimentos antigos.

A migration aditiva preserva comissões e deixa taxas existentes sem configuração. Aplicar a migration antes do backend e configurar taxas antes de utilizar a conclusão. Receita de serviços concluídos não comprova recebimento do cliente. Despesas, lucro, caixa e meios de pagamento estão fora deste escopo.
