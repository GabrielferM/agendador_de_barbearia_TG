import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
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
  ) {}
  async execute(id: number, dto: AtualizarAgendamentoDto) {
    const atual = await this.prisma.agendamento.findUnique({
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
    const alterarItens = dto.servicos !== undefined || dto.servicoIds !== undefined;
    if (
      alterarItens &&
      (await this.prisma.agendamentoServico.count({
        where: { idAgendamento: id, comissao: { isNot: null } },
      }))
    )
      throw new ConflictException(
        'Agendamento possui comissões vinculadas e seus itens não podem ser alterados.',
      );
    const itens = alterarItens
      ? await this.prepararItens.execute(dto.servicos, dto.servicoIds)
      : atual.servicos.map((item) => ({
          idServico: item.idServico,
          precoAplicado: item.precoAplicado,
          duracaoAplicadaMinutos: item.duracaoAplicadaMinutos,
          quantidade: item.quantidade,
          desconto: item.desconto,
          subtotal: item.subtotal,
          ordemExecucao: item.ordemExecucao,
        }));
    const fimPrevisto = new Date(
      inicioPrevisto.getTime() +
        itens.reduce((total, item) => total + item.duracaoAplicadaMinutos * item.quantidade, 0) *
          60000,
    );
    if (dto.inicio || alterarItens)
      await this.verificarConflito.execute(atual.idBarbeiro, inicioPrevisto, fimPrevisto, id);
    const data: Prisma.AgendamentoUpdateInput = {
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
    return serializarResposta(
      await this.prisma.agendamento.update({ where: { id }, data, include: includeAgendamento }),
    );
  }
}
