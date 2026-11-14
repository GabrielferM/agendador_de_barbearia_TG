import { STATUS_COMISSAO_A_PAGAR } from '../constants/status-comissao';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { UsuarioAutenticado } from '../../../common/auth/auth.types';
import { chaveDiaBarbearia } from '../../../common/utils/periodo-dashboard';
import { PrismaService } from '../../../prisma/prisma.service';
import { validarPeriodoFinanceiro } from '../../dashboard-administrador/financeiro/validator/periodo-financeiro.validator';
import { ConsultarExtratoDto, ExtratoFinanceiroDto } from '../dto/financeiro.dto';

@Injectable()
export class ConsultarFinanceiroService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(
    query: ConsultarExtratoDto,
    usuario?: UsuarioAutenticado,
  ): Promise<ExtratoFinanceiroDto> {
    if (
      usuario &&
      (usuario.papel !== 'BARBEIRO' ||
        !usuario.barbeiroId ||
        !usuario.permissoes.includes('GERENCIAR_PROPRIA_AGENDA'))
    )
      throw new ForbiddenException('Acesso restrito ao próprio barbeiro.');
    const hoje = chaveDiaBarbearia(new Date());
    const inicioDe = query.inicioDe ?? `${hoje.slice(0, 7)}-01`;
    const inicioAte = query.inicioAte ?? hoje;
    const periodo = validarPeriodoFinanceiro({ inicioDe, inicioAte });
    const escopo: Prisma.ComissaoWhereInput = usuario ? { idBarbeiro: usuario.barbeiroId } : {};
    const datas = { gte: periodo.inicio, lt: periodo.fimExclusivo };
    const where = { ...escopo, dataGeracao: datas };
    return this.prisma.$transaction(
      async (tx) => {
        const [itens, total, aReceber, previstas, pagas, geradas] = await Promise.all([
          tx.comissao.findMany({
            where,
            skip: (query.pagina - 1) * query.limite,
            take: query.limite,
            orderBy: [{ dataGeracao: 'desc' }, { id: 'desc' }],
            select: {
              id: true,
              baseCalculo: true,
              percentualAplicado: true,
              valorComissao: true,
              status: true,
              dataGeracao: true,
              dataPagamento: true,
              barbeiro: { select: { nomeProfissional: true } },
              agendamentoServico: { select: { servico: { select: { nome: true } } } },
            },
          }),
          tx.comissao.count({ where }),
          tx.comissao.aggregate({
            where: { ...escopo, status: STATUS_COMISSAO_A_PAGAR },
            _sum: { valorComissao: true },
          }),
          tx.comissao.aggregate({
            where: { ...escopo, status: 'PREVISTA' },
            _sum: { valorComissao: true },
          }),
          tx.comissao.aggregate({
            where: { ...escopo, status: 'PAGA', dataPagamento: datas },
            _sum: { valorComissao: true },
          }),
          tx.comissao.aggregate({
            where: { ...where, status: { in: ['LIBERADA', 'PAGA'] } },
            _sum: { valorComissao: true },
          }),
        ]);
        const valor = (v: { _sum: { valorComissao: Prisma.Decimal | null } }) =>
          (v._sum.valorComissao ?? new Prisma.Decimal(0)).toFixed(2);
        return {
          aReceber: valor(aReceber),
          previstas: valor(previstas),
          pagasNoPeriodo: valor(pagas),
          geradasNoPeriodo: valor(geradas),
          inicioDe,
          inicioAte,
          pagina: query.pagina,
          total,
          totalPaginas: Math.ceil(total / query.limite),
          itens: itens.map((c) => ({
            id: c.id,
            barbeiro: c.barbeiro.nomeProfissional,
            servico: c.agendamentoServico.servico.nome,
            baseCalculo: c.baseCalculo.toFixed(2),
            percentualAplicado: c.percentualAplicado.toFixed(2),
            valorComissao: c.valorComissao.toFixed(2),
            status: c.status,
            dataGeracao: c.dataGeracao.toISOString(),
            dataPagamento: c.dataPagamento?.toISOString() ?? null,
          })),
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
}
