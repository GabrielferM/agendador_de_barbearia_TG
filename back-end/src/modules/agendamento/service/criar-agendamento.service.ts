import { BadRequestException, Injectable } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarAgendamentoDto } from '../dto/agendamento.dto';
import { BuscarServicosAgendamentoService } from '../validations/buscar-servicos-agendamento.service';
import { CalcularFimAgendamentoService } from '../validations/calcular-fim-agendamento.service';
import { CalcularValorTotalAgendamentoService } from '../validations/calcular-valor-total-agendamento.service';
import { includeAgendamento } from '../constants/include-agendamento';
import { ValidarDataHoraAgendamentoService } from '../validations/validar-data-hora-agendamento.service';
import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';
import { VerificarConflitoAgendamentoService } from '../validations/verificar-conflito-agendamento.service';

@Injectable()
export class CriarAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarDataHora: ValidarDataHoraAgendamentoService,
    private readonly buscarServicos: BuscarServicosAgendamentoService,
    private readonly calcularFim: CalcularFimAgendamentoService,
    private readonly validarVinculos: ValidarVinculosAgendamentoService,
    private readonly verificarConflito: VerificarConflitoAgendamentoService,
    private readonly calcularValorTotal: CalcularValorTotalAgendamentoService,
  ) {}
  async execute(dto: CriarAgendamentoDto) {
    const inicio = this.validarDataHora.execute(dto.inicio);
    if (inicio <= new Date()) throw new BadRequestException('O início deve estar no futuro.');
    const servicos = await this.buscarServicos.execute(dto.servicoIds);
    const fim = this.calcularFim.execute(inicio, servicos);
    await this.validarVinculos.execute(dto.idCliente, dto.idBarbeiro, dto.idFilial);
    await this.verificarConflito.execute(dto.idBarbeiro, inicio, fim);
    const agendamento = await this.prisma.$transaction((tx) =>
      tx.agendamento.create({
        data: {
          idCliente: dto.idCliente,
          idBarbeiro: dto.idBarbeiro,
          idFilial: dto.idFilial,
          inicio,
          fim,
          observacao: dto.observacao?.trim(),
          valorTotal: this.calcularValorTotal.execute(servicos),
          servicos: {
            create: servicos.map((item) => ({
              idServico: item.id,
              preco: item.preco,
              duracaoMinutos: item.duracaoMinutos,
            })),
          },
        },
        include: includeAgendamento,
      }),
    );
    return serializarResposta(agendamento);
  }
}
