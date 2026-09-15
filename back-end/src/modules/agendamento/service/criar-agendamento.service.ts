import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { includeAgendamento } from '../constants/include-agendamento';
import { CriarAgendamentoDto } from '../dto/agendamento.dto';
import { PrepararItensAgendamentoService } from '../validations/preparar-itens-agendamento.service';
import { ValidarDataHoraAgendamentoService } from '../validations/validar-data-hora-agendamento.service';
import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';
import { VerificarConflitoAgendamentoService } from '../validations/verificar-conflito-agendamento.service';

@Injectable()
export class CriarAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarDataHora: ValidarDataHoraAgendamentoService,
    private readonly prepararItens: PrepararItensAgendamentoService,
    private readonly validarVinculos: ValidarVinculosAgendamentoService,
    private readonly verificarConflito: VerificarConflitoAgendamentoService,
  ) {}
  async execute(dto: CriarAgendamentoDto) {
    const inicioPrevisto = this.validarDataHora.execute(dto.inicio);
    if (inicioPrevisto <= new Date())
      throw new BadRequestException('O início deve estar no futuro.');

    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (transaction) => {
        const servicos = await this.prepararItens.execute(
          dto.servicos,
          dto.servicoIds,
          transaction,
        );
        const fimPrevisto = new Date(
          inicioPrevisto.getTime() +
            servicos.reduce(
              (total, item) => total + item.duracaoAplicadaMinutos * item.quantidade,
              0,
            ) *
              60000,
        );
        await this.validarVinculos.execute(
          dto.idCliente,
          dto.idBarbeiro,
          dto.idFilial,
          transaction,
        );
        await this.verificarConflito.execute(
          dto.idBarbeiro,
          inicioPrevisto,
          fimPrevisto,
          undefined,
          transaction,
        );
        return transaction.agendamento.create({
          data: {
            idCliente: dto.idCliente,
            idBarbeiro: dto.idBarbeiro,
            idFilial: dto.idFilial,
            inicioPrevisto,
            fimPrevisto,
            ...(dto.origem ? { origem: dto.origem } : {}),
            observacaoCliente: dto.observacaoCliente?.trim(),
            observacaoInterna: dto.observacaoInterna?.trim(),
            servicos: { create: servicos },
          },
          include: includeAgendamento,
        });
      });
      return serializarResposta(resultado);
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2034') {
        throw new ConflictException('A agenda foi alterada simultaneamente. Tente novamente.');
      }
      throw erro;
    }
  }
}
