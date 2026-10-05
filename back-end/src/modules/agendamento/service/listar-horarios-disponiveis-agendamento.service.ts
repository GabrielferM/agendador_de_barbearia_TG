import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  HorariosDisponiveisDto,
  HorariosDisponiveisRespostaDto,
} from '../dto/horarios-disponiveis.dto';
import { PrepararItensAgendamentoService } from '../validations/preparar-itens-agendamento.service';
import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';
import {
  estadosQueOcupamHorario,
  intervalosSobrepostos,
} from '../validations/verificar-conflito-agendamento.service';
import {
  dataLocal,
  diaAberto,
  duracaoItens,
  expediente,
  instanteLocal,
  validarDia,
} from '../constants/expediente';

@Injectable()
export class ListarHorariosDisponiveisAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly itens: PrepararItensAgendamentoService,
    private readonly vinculos: ValidarVinculosAgendamentoService,
  ) {}

  async execute(query: HorariosDisponiveisDto): Promise<HorariosDisponiveisRespostaDto> {
    validarDia(query.data);
    const agora = new Date();
    if (query.data < dataLocal(agora))
      throw new BadRequestException('A data não pode estar no passado.');
    await this.vinculos.validarProfissional(query.idBarbeiro, query.idFilial);
    const itens = await this.itens.execute(undefined, query.servicoIds);
    const duracaoTotalMinutos = duracaoItens(itens);
    const resposta: HorariosDisponiveisRespostaDto = {
      fuso: expediente.fuso,
      duracaoTotalMinutos,
      valorTotal: itens
        .reduce((total, item) => total.plus(item.subtotal), new Prisma.Decimal(0))
        .toFixed(2),
      horarios: [],
    };
    if (!diaAberto(query.data)) return resposta;
    const abertura = instanteLocal(query.data, expediente.aberturaMinutos);
    const fechamento = instanteLocal(query.data, expediente.fechamentoMinutos);
    const ocupados = await this.prisma.agendamento.findMany({
      where: {
        idBarbeiro: query.idBarbeiro,
        status: { in: estadosQueOcupamHorario },
        inicioPrevisto: { lt: fechamento },
        fimPrevisto: { gt: abertura },
      },
      select: { inicioPrevisto: true, fimPrevisto: true },
    });
    for (
      let minuto = expediente.aberturaMinutos;
      minuto + duracaoTotalMinutos <= expediente.fechamentoMinutos;
      minuto += expediente.intervaloMinutos
    ) {
      const inicio = instanteLocal(query.data, minuto);
      const fim = new Date(inicio.getTime() + duracaoTotalMinutos * 60000);
      if (
        inicio > agora &&
        !ocupados.some((item) =>
          intervalosSobrepostos(inicio, fim, item.inicioPrevisto, item.fimPrevisto),
        )
      )
        resposta.horarios.push({ inicio: inicio.toISOString(), fim: fim.toISOString() });
    }
    return resposta;
  }
}
