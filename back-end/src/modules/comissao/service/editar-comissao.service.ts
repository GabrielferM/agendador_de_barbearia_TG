import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusComissao } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { includeComissao } from '../constants/include-comissao';
import { AtualizarComissaoDto } from '../dto/comissao.dto';
import { TRANSICOES_COMISSAO } from '../constants/transicoes-comissao';
@Injectable()
export class EditarComissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number, dto: AtualizarComissaoDto) {
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const atual = await tx.comissao.findUnique({ where: { id }, include: includeComissao });
        if (!atual) throw new NotFoundException('Comissão não encontrada.');
        const novo = dto.status;
        if (novo && !TRANSICOES_COMISSAO[atual.status].includes(novo))
          throw new ConflictException('Transição de comissão inválida.');
        if (
          (novo === StatusComissao.LIBERADA || novo === StatusComissao.PAGA) &&
          atual.agendamentoServico.agendamento.status !== 'CONCLUIDO'
        )
          throw new ConflictException(
            'Conclua o atendimento antes de liberar ou registrar o pagamento.',
          );
        if (novo === StatusComissao.ESTORNADA && !dto.motivoEstorno?.trim())
          throw new BadRequestException('Motivo do estorno é obrigatório.');
        const data: Prisma.ComissaoUpdateInput = {
          ...(novo ? { status: novo } : {}),
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        };
        const datas = [
          ['dataLiberacao', StatusComissao.LIBERADA, atual.dataGeracao],
          ['dataPagamento', StatusComissao.PAGA, atual.dataLiberacao],
          ['dataEstorno', StatusComissao.ESTORNADA, atual.dataPagamento],
        ] as const;
        for (const [campo, estado, anterior] of datas) {
          if (dto[campo] !== undefined && novo !== estado)
            throw new BadRequestException(
              'Datas só podem ser informadas na transição correspondente.',
            );
          if (novo === estado) {
            const instante = dto[campo] ? new Date(dto[campo]) : new Date();
            if (
              !anterior ||
              !Number.isFinite(instante.getTime()) ||
              instante < anterior ||
              instante.getTime() > Date.now()
            )
              throw new BadRequestException('Data incompatível com a sequência da comissão.');
            data[campo] = instante;
          }
        }
        if (dto.motivoEstorno !== undefined && novo !== StatusComissao.ESTORNADA)
          throw new BadRequestException('Motivo de estorno exige a transição de estorno.');
        if (novo === StatusComissao.ESTORNADA) data.motivoEstorno = dto.motivoEstorno!.trim();
        return tx.comissao.update({ where: { id }, data, include: includeComissao });
      });
      return serializarResposta(resultado);
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2034')
        throw new ConflictException(
          'A comissão foi alterada simultaneamente. Atualize a consulta.',
        );
      throw erro;
    }
  }
}
