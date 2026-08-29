import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarAgendamentoDto } from '../dto/agendamento.dto';
import { BuscarServicosAgendamentoService } from '../validations/buscar-servicos-agendamento.service';
import { CalcularFimAgendamentoService } from '../validations/calcular-fim-agendamento.service';
import { CalcularValorTotalAgendamentoService } from '../validations/calcular-valor-total-agendamento.service';
import { includeAgendamento } from '../constants/include-agendamento';
import { transicoesStatusAgendamento } from '../constants/transicoes-status-agendamento';
import { ValidarDataHoraAgendamentoService } from '../validations/validar-data-hora-agendamento.service';
import { VerificarConflitoAgendamentoService } from '../validations/verificar-conflito-agendamento.service';
import { BuscarAgendamentoService } from './buscar-agendamento.service';

@Injectable()
export class EditarAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarDataHora: ValidarDataHoraAgendamentoService,
    private readonly buscarServicos: BuscarServicosAgendamentoService,
    private readonly calcularFim: CalcularFimAgendamentoService,
    private readonly verificarConflito: VerificarConflitoAgendamentoService,
    private readonly calcularValorTotal: CalcularValorTotalAgendamentoService,
    private readonly buscar: BuscarAgendamentoService,
  ) {}
  async execute(id: number, dto: AtualizarAgendamentoDto) {
    const atual = await this.prisma.agendamento.findUnique({
      where: { id },
      include: includeAgendamento,
    });

    if (!atual) throw new ConflictException('Agendamento não encontrado.');

    const estadosFinais: StatusAgendamento[] = [
      StatusAgendamento.CONCLUIDO,
      StatusAgendamento.CANCELADO,
      StatusAgendamento.NAO_COMPARECEU,
    ];

    if (estadosFinais.includes(atual.status))
      throw new ConflictException('Agendamento em estado final não pode ser alterado.');

    if (dto.status && !transicoesStatusAgendamento[atual.status].includes(dto.status))
      throw new ConflictException('Transição de status inválida.');

    let inicio = atual.inicio;
    let servicos = atual.servicos.map((item) => item.servico);

    if (dto.inicio) {
      inicio = this.validarDataHora.execute(dto.inicio);
      if (inicio <= new Date()) throw new BadRequestException('O início deve estar no futuro.');
    }

    if (dto.servicoIds) servicos = await this.buscarServicos.execute(dto.servicoIds);

    const fim = this.calcularFim.execute(inicio, servicos);

    if (dto.inicio || dto.servicoIds)
      await this.verificarConflito.execute(atual.idBarbeiro, inicio, fim, id);

    const data: Prisma.AgendamentoUpdateInput = {
      ...(dto.inicio || dto.servicoIds
        ? {
            inicio,
            fim,
            valorTotal: this.calcularValorTotal.execute(servicos),
            servicos: {
              deleteMany: {},
              create: servicos.map((item) => ({
                idServico: item.id,
                preco: item.preco,
                duracaoMinutos: item.duracaoMinutos,
              })),
            },
          }
        : {}),
      ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
      ...(dto.status ? { status: dto.status } : {}),
    };

    return serializarResposta(
      await this.prisma.agendamento.update({
        where: { id },
        data,
        include: includeAgendamento,
      }),
    );
  }
}
