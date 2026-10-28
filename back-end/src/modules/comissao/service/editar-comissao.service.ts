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

const TRANSICOES: Record<StatusComissao, StatusComissao[]> = {
  PREVISTA: ['LIBERADA', 'CANCELADA'],
  LIBERADA: ['PAGA', 'CANCELADA'],
  PAGA: ['ESTORNADA'],
  CANCELADA: [],
  ESTORNADA: [],
};
@Injectable()
export class EditarComissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number, dto: AtualizarComissaoDto) {
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const atual = await tx.comissao.findUnique({ where: { id }, include: includeComissao });
        if (!atual) throw new NotFoundException('Comissão não encontrada.');
        const status = dto.status ?? atual.status;
        if (status !== atual.status && !TRANSICOES[atual.status].includes(status))
          throw new ConflictException('Transição de comissão inválida.');
        const mudando = status !== atual.status;
        if (
          (dto.dataLiberacao !== undefined && !(mudando && status === 'LIBERADA')) ||
          (dto.dataPagamento !== undefined && !(mudando && status === 'PAGA')) ||
          ((dto.dataEstorno !== undefined || dto.motivoEstorno !== undefined) &&
            !(mudando && status === 'ESTORNADA'))
        )
          throw new BadRequestException('Datas e motivo pertencem à transição correspondente.');
        const agora = new Date();
        const validarData = (valor: string | undefined, anterior: Date) => {
          const data = valor ? new Date(valor) : agora;
          if (!Number.isFinite(data.getTime()) || data < anterior || data > agora)
            throw new BadRequestException('Data fora da sequência da comissão ou no futuro.');
          return data;
        };
        const data: Prisma.ComissaoUpdateInput = {
          status,
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        };
        if (mudando && status === 'LIBERADA') {
          if (atual.agendamentoServico.agendamento.status !== 'CONCLUIDO')
            throw new ConflictException('Somente atendimento concluído permite liberar comissão.');
          data.dataLiberacao = validarData(dto.dataLiberacao, atual.dataGeracao);
        }
        if (mudando && status === 'PAGA') {
          if (!atual.dataLiberacao || atual.agendamentoServico.agendamento.status !== 'CONCLUIDO')
            throw new ConflictException('Comissão sem liberação válida.');
          data.dataPagamento = validarData(dto.dataPagamento, atual.dataLiberacao);
        }
        if (mudando && status === 'ESTORNADA') {
          if (!dto.motivoEstorno?.trim())
            throw new BadRequestException('Motivo do estorno é obrigatório.');
          if (!atual.dataPagamento)
            throw new ConflictException('Comissão sem pagamento registrado.');
          data.dataEstorno = validarData(dto.dataEstorno, atual.dataPagamento);
          data.motivoEstorno = dto.motivoEstorno.trim();
        }
        return tx.comissao.update({ where: { id }, data, include: includeComissao });
      });
      return serializarResposta(resultado);
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2034')
        throw new ConflictException('Comissão alterada simultaneamente. Atualize a consulta.');
      throw erro;
    }
  }
}
