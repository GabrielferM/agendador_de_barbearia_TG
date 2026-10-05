import { HorariosDisponiveisDto } from './dto/horarios-disponiveis.dto';
import { ListarHorariosDisponiveisAgendamentoService } from './service/listar-horarios-disponiveis-agendamento.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrigemAgendamento, StatusAgendamento } from '@prisma/client';
import { UsuarioAutenticado } from '../../common/auth/auth.types';
import { CriarAgendamentoService } from './service/criar-agendamento.service';
import { ListarAgendamentosService } from './service/listar-agendamentos.service';
import { BuscarAgendamentoService } from './service/buscar-agendamento.service';
import { EditarAgendamentoService } from './service/editar-agendamento.service';
import { RemoverAgendamentoService } from './service/remover-agendamento.service';
import { HistoricoStatusAgendamentoService } from './service/historico-status-agendamento.service';
import {
  CriarAgendamentoDto,
  AtualizarAgendamentoDto,
  ListarAgendamentosDto,
  ListarHistoricoStatusDto,
  CriarHistoricoStatusDto,
} from './dto/agendamento.dto';
import { ValidarAcessoAgendamentoService } from './validations/validar-acesso-agendamento.service';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly horariosService: ListarHorariosDisponiveisAgendamentoService,
    private readonly criarService: CriarAgendamentoService,
    private readonly listarService: ListarAgendamentosService,
    private readonly buscarService: BuscarAgendamentoService,
    private readonly editarService: EditarAgendamentoService,
    private readonly removerService: RemoverAgendamentoService,
    private readonly historicoService: HistoricoStatusAgendamentoService,
    private readonly validarAcesso: ValidarAcessoAgendamentoService,
  ) {}

  horarios(query: HorariosDisponiveisDto) {
    return this.horariosService.execute(query);
  }

  async criar(dto: CriarAgendamentoDto, usuario?: UsuarioAutenticado) {
    if (!usuario || usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS'))
      return this.criarService.execute(dto);
    if (!usuario.clienteId || !usuario.permissoes.includes('CRIAR_AGENDAMENTO'))
      throw new ForbiddenException();
    if (
      dto.idCliente !== usuario.clienteId ||
      dto.origem !== undefined ||
      dto.observacaoInterna !== undefined ||
      dto.servicos?.some((item) => item.desconto > 0)
    ) {
      throw new ForbiddenException('Clientes não podem definir campos administrativos.');
    }
    const resultado = await this.criarService.execute({
      ...dto,
      idCliente: usuario.clienteId,
      origem: OrigemAgendamento.SITE,
    });
    return this.semCamposInternos(resultado);
  }

  async listar(query: ListarAgendamentosDto, usuario?: UsuarioAutenticado) {
    if (!usuario || usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS'))
      return this.listarService.execute(query);
    if (usuario.clienteId) {
      const resultado = await this.listarService.execute({
        ...query,
        idCliente: usuario.clienteId,
        idBarbeiro: undefined,
      });
      return this.semCamposInternos(resultado);
    }
    if (usuario.barbeiroId)
      return this.listarService.execute({
        ...query,
        idBarbeiro: usuario.barbeiroId,
        idCliente: undefined,
      });
    throw new ForbiddenException();
  }

  async buscar(id: number, usuario?: UsuarioAutenticado) {
    await this.validarAcesso.execute(id, usuario);
    const resultado = await this.buscarService.execute(id);
    return usuario?.clienteId ? this.semCamposInternos(resultado) : resultado;
  }

  async atualizar(id: number, dto: AtualizarAgendamentoDto, usuario?: UsuarioAutenticado) {
    await this.validarAcesso.execute(id, usuario);
    if (usuario?.clienteId) {
      const chaves = Object.entries(dto)
        .filter(([, valor]) => valor !== undefined)
        .map(([chave]) => chave);
      if (
        dto.status !== StatusAgendamento.CANCELADO ||
        chaves.some((chave) => !['status', 'motivoCancelamento'].includes(chave))
      ) {
        throw new ForbiddenException('Clientes só podem cancelar os próprios agendamentos.');
      }
    }
    if (
      usuario?.barbeiroId &&
      dto.observacaoInterna !== undefined &&
      !usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS')
    ) {
      throw new ForbiddenException('Campo reservado à administração.');
    }
    const resultado = await this.editarService.execute(id, dto);
    return usuario?.clienteId ? this.semCamposInternos(resultado) : resultado;
  }

  async remover(id: number, usuario?: UsuarioAutenticado) {
    if (usuario && !usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS'))
      throw new ForbiddenException();
    return this.removerService.execute(id);
  }
  async listarHistorico(id: number, query: ListarHistoricoStatusDto, usuario?: UsuarioAutenticado) {
    await this.validarAcesso.execute(id, usuario);
    const resultado = await this.historicoService.listar(id, query);
    return usuario?.clienteId ? this.semCamposInternos(resultado) : resultado;
  }
  async criarHistorico(id: number, dto: CriarHistoricoStatusDto, usuario?: UsuarioAutenticado) {
    await this.validarAcesso.execute(id, usuario);
    if (usuario?.clienteId) throw new ForbiddenException();
    return this.historicoService.criar(id, {
      ...dto,
      idUsuarioResponsavel: usuario?.id ?? dto.idUsuarioResponsavel,
    });
  }

  private semCamposInternos(valor: unknown): unknown {
    if (Array.isArray(valor)) return valor.map((item: unknown) => this.semCamposInternos(item));
    if (valor && typeof valor === 'object') {
      const registro = valor as Record<string, unknown>;
      if ('inicioPrevisto' in registro && 'servicos' in registro) {
        const item =
          registro as unknown as import('./dto/agendamento-resposta.dto').AgendamentoRespostaDto;
        return {
          id: item.id,
          inicioPrevisto: item.inicioPrevisto,
          fimPrevisto: item.fimPrevisto,
          status: item.status,
          observacaoCliente: item.observacaoCliente,
          motivoCancelamento: item.motivoCancelamento,
          filial: {
            id: item.filial.id,
            nome: item.filial.nome,
            telefone: item.filial.telefone,
            endereco: {
              cep: item.filial.endereco.cep,
              logradouro: item.filial.endereco.logradouro,
              numero: item.filial.endereco.numero,
              complemento: item.filial.endereco.complemento,
              bairro: item.filial.endereco.bairro,
              cidade: item.filial.endereco.cidade,
              estado: item.filial.endereco.estado,
            },
          },
          barbeiro: { id: item.barbeiro.id, nomeProfissional: item.barbeiro.nomeProfissional },
          servicos: item.servicos.map((servico) => ({
            idServico: servico.idServico,
            precoAplicado: servico.precoAplicado,
            duracaoAplicadaMinutos: servico.duracaoAplicadaMinutos,
            quantidade: servico.quantidade,
            subtotal: servico.subtotal,
            servico: { id: servico.servico.id, nome: servico.servico.nome },
          })),
        };
      }

      return Object.fromEntries(
        Object.entries(valor as Record<string, unknown>)
          .filter(
            ([chave]) =>
              ![
                'observacaoInterna',
                'comissao',
                'usuario',
                'cliente',
                'senhaHash',
                'percentualComissao',
                'cnpj',
              ].includes(chave),
          )
          .map(([chave, item]) => [chave, this.semCamposInternos(item)]),
      );
    }
    return valor;
  }
}
