# Financeiro e comissões

Percentual por barbeiro entre 0 e 100%, com duas casas. Ausência exige configuração administrativa antes de concluir atendimentos com itens sem comissão. Zero é uma taxa válida. A taxa é fotografada na conclusão, sobre o subtotal histórico já descontado; arredondamento HALF_UP por item e soma decimal.

Concluir atendimento gera LIBERADA na mesma transação de status/histórico. Comissões PREVISTA existentes são liberadas preservando valores. Estados incompatíveis bloqueiam a conclusão para revisão; cancelar/não comparecer cancela previstas. Não há recálculo ou backfill automático de atendimentos antigos.

A migration aditiva preserva comissões e deixa taxas existentes sem configuração. Aplicar a migration antes do backend e configurar taxas antes de utilizar a conclusão. Receita de serviços concluídos não comprova recebimento do cliente. Despesas, lucro, caixa e meios de pagamento estão fora deste escopo.

## Consultas e repasses

`GET /financeiro/comissoes` requer GERENCIAR_COMISSOES. `GET /financeiro/minhas-comissoes` requer GERENCIAR_PROPRIA_AGENDA e perfil BARBEIRO; usa exclusivamente o ID da sessão. Filtros: inicioDe/inicioAte (datas civis em São Paulo), pagina/limite. Extrato por dataGeracao; geradasNoPeriodo soma LIBERADA/PAGA. aReceber e previstas incluem todos os períodos; pagasNoPeriodo usa dataPagamento. Dinheiro em strings decimais com duas casas, agregado no banco; leitura em snapshot RepeatableRead. Sem informações pessoais de clientes.

`GET /financeiro/barbeiros` lista taxas paginadas; `PATCH /financeiro/barbeiros/:id/percentual` configura percentual numérico 0–100. Ambos exigem GERENCIAR_COMISSOES. Alteração não recalcula comissões existentes.

`POST /financeiro/comissoes/:id/repasse` registra repasse integral de LIBERADA, com valor, responsável da sessão e data do servidor na tabela repasse_comissao. Não transfere dinheiro. Repetir a mesma operação devolve o registro existente; unique e transação serializável protegem a baixa. Comissões antigas PAGA sem registro não recebem repasse novo. O PATCH legado permite somente observação, não status/datas; criação manual permite apenas previsão para atendimento aberto com percentual do cadastro. O campo legado `percentualAplicado` é opcional e, quando enviado, deve coincidir com a taxa cadastrada. Previsões existentes mantêm os valores originais. Estorno financeiro e repasses parciais não são oferecidos nesta versão.

O saldo a pagar considera somente comissões LIBERADA no Financeiro e no catálogo administrativo de Barbeiros. O extrato e os dashboards apresentam PREVISTA em um indicador separado.
