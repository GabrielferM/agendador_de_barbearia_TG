import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';
import { duracaoItens, validarExpediente } from '../constants/expediente';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { UsuarioAutenticado } from '../../../common/auth/auth.types';
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
  async execute(id: number, dto: AtualizarAgendamentoDto, usuario?: UsuarioAutenticado) {
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (transaction) => {
        const atual = await transaction.agendamento.findUnique({
          where: { id },
          include: includeAgendamento,
        });
        if (!atual) throw new NotFoundException('Agendamento não encontrado.');
        if (usuario && !usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS')) {
          const clienteProprio = usuario.clienteId === atual.idCliente;
          const barbeiroProprio =
            usuario.barbeiroId === atual.idBarbeiro &&
            usuario.permissoes.includes('GERENCIAR_PROPRIA_AGENDA');
          if (!clienteProprio && !barbeiroProprio)
            throw new ForbiddenException('Você não pode alterar este agendamento.');
          const chaves = Object.entries(dto)
            .filter(([, valor]) => valor !== undefined)
            .map(([chave]) => chave);
          if (
            chaves.some((chave) => !['status', 'motivoCancelamento'].includes(chave)) ||
            (clienteProprio && dto.status !== StatusAgendamento.CANCELADO)
          ) {
            throw new ForbiddenException('Campos não permitidos para este perfil.');
          }
        }
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
        if (dto.inicio || alterarItens) {
          validarExpediente(inicioPrevisto, fimPrevisto);
          await this.validarVinculos.execute(
            atual.idCliente,
            atual.idBarbeiro,
            atual.idFilial,
            transaction,
          );
          await this.prepararItens.execute(
            undefined,
            itens.map((item) => item.idServico),
            transaction,
          );
        }
        if (dto.inicio || alterarItens)
          await this.verificarConflito.execute(
            atual.idBarbeiro,
            inicioPrevisto,
            fimPrevisto,
            id,
            transaction,
          );
        const agora = new Date();
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
          ...(dto.status === StatusAgendamento.EM_ATENDIMENTO ? { inicioReal: agora } : {}),
          ...(dto.status === StatusAgendamento.CONCLUIDO ? { fimReal: agora } : {}),
          ...(dto.status === StatusAgendamento.CANCELADO
            ? { dataCancelamento: agora, motivoCancelamento: dto.motivoCancelamento?.trim() }
            : {}),
        };
        if (dto.status && usuario) {
          data.historicoDeStatus = {
            create: {
              idUsuarioResponsavel: usuario.id,
              statusAnterior: atual.status,
              statusNovo: dto.status,
              dataAlteracao: agora,
              motivo:
                dto.status === StatusAgendamento.CANCELADO
                  ? dto.motivoCancelamento?.trim()
                  : undefined,
            },
          };
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
