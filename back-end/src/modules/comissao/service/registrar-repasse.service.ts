import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';

@Injectable()
export class RegistrarRepasseService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(idComissao: number, idUsuarioResponsavel: number) {
    try {
      return await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const comissao = await tx.comissao.findUnique({
          where: { id: idComissao },
          include: { repasse: true },
        });
        if (!comissao) throw new NotFoundException('Comissão não encontrada.');
        if (comissao.status === 'PAGA' && comissao.repasse) {
          return {
            idComissao,
            valor: comissao.repasse.valor.toFixed(2),
            dataRegistro: comissao.repasse.dataRegistro.toISOString(),
          };
        }
        if (comissao.status !== 'LIBERADA')
          throw new ConflictException('Somente comissão liberada pode receber repasse.');
        const dataRegistro = new Date();
        const resultado = await tx.comissao.updateMany({
          where: { id: idComissao, status: 'LIBERADA' },
          data: { status: 'PAGA', dataPagamento: dataRegistro },
        });
        if (resultado.count !== 1)
          throw new ConflictException('Comissão alterada simultaneamente. Atualize o extrato.');
        await tx.repasseComissao.create({
          data: { idComissao, idUsuarioResponsavel, valor: comissao.valorComissao, dataRegistro },
        });
        return {
          idComissao,
          valor: comissao.valorComissao.toFixed(2),
          dataRegistro: dataRegistro.toISOString(),
        };
      });
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2034', 'P2002'].includes(erro.code)
      )
        throw new ConflictException('Repasse alterado simultaneamente. Atualize o extrato.');
      throw erro;
    }
  }
}
