import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';
import { duracaoItens, validarExpediente } from '../constants/expediente';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { includeAgendamento } from '../constants/include-agendamento';
import { transicoesStatusAgendamento } from '../constants/transicoes-status-agendamento';
import { AtualizarAgendamentoDto } from '../dto/agendamento.dto';
import { PrepararItensAgendamentoService } from '../validations/preparar-itens-agendamento.service';
import { ValidarDataHoraAgendamentoService } from '../validations/validar-data-hora-agendamento.service';
import { VerificarConflitoAgendamentoService } from '../validations/verificar-conflito-agendamento.service';

@Injectable()
export class EditarAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarDataHora: ValidarDataHoraAgendamentoService,
    private readonly prepararItens: PrepararItensAgendamentoService,
    private readonly verificarConflito: VerificarConflitoAgendamentoService,
    private readonly validarVinculos: ValidarVinculosAgendamentoService,
  ) {}
  async execute(id: number, dto: AtualizarAgendamentoDto, idUsuarioResponsavel?: number) {
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (transaction) => {
        const atual = await transaction.agendamento.findUnique({
          where: { id },
          include: includeAgendamento,
        });
        if (!atual) throw new NotFoundException('Agendamento não encontrado.');
        const estadosFinais: StatusAgendamento[] = [
          StatusAgendamento.CONCLUIDO,
          StatusAgendamento.CANCELADO,
          StatusAgendamento.NAO_COMPARECEU,
        ];
        if (estadosFinais.includes(atual.status))
          throw new ConflictException('Agendamento em estado final não pode ser alterado.');
        if (dto.status && !transicoesStatusAgendamento[atual.status].includes(dto.status))
          throw new ConflictException('Transição de status inválida.');
        if (dto.status === StatusAgendamento.CANCELADO && !dto.motivoCancelamento?.trim())
          throw new BadRequestException('Motivo do cancelamento é obrigatório.');

        let inicioPrevisto = atual.inicioPrevisto;
        if (dto.inicio) {
          inicioPrevisto = this.validarDataHora.execute(dto.inicio);
          if (inicioPrevisto <= new Date())
            throw new BadRequestException('O início deve estar no futuro.');
        }
        const trocarVinculos =
          dto.idCliente !== undefined || dto.idBarbeiro !== undefined || dto.idFilial !== undefined;
        if (
          (trocarVinculos || dto.inicio || dto.servicos || dto.servicoIds) &&
          atual.status === StatusAgendamento.EM_ATENDIMENTO
        )
          throw new ConflictException(
            'Não é possível reagendar ou trocar dados de um atendimento iniciado.',
          );
        if (
          trocarVinculos &&
          (await transaction.agendamentoServico.count({
            where: { idAgendamento: id, comissao: { isNot: null } },
          }))
        )
          throw new ConflictException(
            'Agendamento possui comissões e seus vínculos não podem ser alterados.',
          );
        const alterarItens = dto.servicos !== undefined || dto.servicoIds !== undefined;
        if (
          alterarItens &&
          (await transaction.agendamentoServico.count({
            where: { idAgendamento: id, comissao: { isNot: null } },
          }))
        )
          throw new ConflictException(
            'Agendamento possui comissões vinculadas e seus itens não podem ser alterados.',
          );
        const itens = alterarItens
          ? await this.prepararItens.execute(dto.servicos, dto.servicoIds, transaction)
          : atual.servicos.map((item) => ({
              idServico: item.idServico,
              precoAplicado: item.precoAplicado,
              duracaoAplicadaMinutos: item.duracaoAplicadaMinutos,
              quantidade: item.quantidade,
              desconto: item.desconto,
              subtotal: item.subtotal,
              ordemExecucao: item.ordemExecucao,
            }));
        const fimPrevisto = new Date(inicioPrevisto.getTime() + duracaoItens(itens) * 60000);
        if (dto.inicio || alterarItens || trocarVinculos) {
          validarExpediente(inicioPrevisto, fimPrevisto);
          await this.validarVinculos.execute(
            dto.idCliente ?? atual.idCliente,
            dto.idBarbeiro ?? atual.idBarbeiro,
            dto.idFilial ?? atual.idFilial,
            transaction,
          );
          await this.prepararItens.execute(
            undefined,
            itens.map((item) => item.idServico),
            transaction,
          );
        }
        if (dto.inicio || alterarItens || trocarVinculos)
          await this.verificarConflito.execute(
            dto.idBarbeiro ?? atual.idBarbeiro,
            inicioPrevisto,
            fimPrevisto,
            id,
            transaction,
          );
        const data: Prisma.AgendamentoUpdateInput = {
          ...(dto.idCliente !== undefined ? { cliente: { connect: { id: dto.idCliente } } } : {}),
          ...(dto.idBarbeiro !== undefined
            ? { barbeiro: { connect: { id: dto.idBarbeiro } } }
            : {}),
          ...(dto.idFilial !== undefined ? { filial: { connect: { id: dto.idFilial } } } : {}),
          ...(dto.status === StatusAgendamento.EM_ATENDIMENTO ? { inicioReal: new Date() } : {}),
          ...(dto.status === StatusAgendamento.CONCLUIDO ? { fimReal: new Date() } : {}),
          ...(dto.status && idUsuarioResponsavel
            ? {
                historicoDeStatus: {
                  create: {
                    idUsuarioResponsavel,
                    statusAnterior: atual.status,
                    statusNovo: dto.status,
                    motivo: dto.motivoCancelamento?.trim(),
                  },
                },
              }
            : {}),
          ...(dto.inicio || alterarItens ? { inicioPrevisto, fimPrevisto } : {}),
          ...(alterarItens ? { servicos: { deleteMany: {}, create: itens } } : {}),
          ...(dto.observacaoCliente !== undefined
            ? { observacaoCliente: dto.observacaoCliente.trim() }
            : {}),
          ...(dto.observacaoInterna !== undefined
            ? { observacaoInterna: dto.observacaoInterna.trim() }
            : {}),
          ...(dto.status ? { status: dto.status } : {}),
          ...(dto.status === StatusAgendamento.CANCELADO
            ? { dataCancelamento: new Date(), motivoCancelamento: dto.motivoCancelamento?.trim() }
            : {}),
        };
        if (
          dto.status === StatusAgendamento.CANCELADO ||
          dto.status === StatusAgendamento.NAO_COMPARECEU
        ) {
          if (
            await transaction.comissao.count({
              where: { agendamentoServico: { idAgendamento: id }, status: 'PAGA' },
            })
          )
            throw new ConflictException(
              'Atendimento possui comissão paga; revise a comissão antes de cancelar.',
            );
          await transaction.comissao.updateMany({
            where: {
              agendamentoServico: { idAgendamento: id },
              status: { in: ['PREVISTA', 'LIBERADA'] },
            },
            data: { status: 'CANCELADA' },
          });
        }
        return transaction.agendamento.update({
          where: { id },
          data,
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
