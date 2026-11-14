import { Injectable } from '@nestjs/common';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { PaginacaoDto } from '../../common/dto/paginacao.dto';
import { ConsultarExtratoDto, ConfigurarPercentualDto } from './dto/financeiro.dto';
import { ConsultarFinanceiroService } from './service/consultar-financeiro.service';
import { RegistrarRepasseService } from './service/registrar-repasse.service';
import { ConfigurarPercentualService } from './service/configurar-percentual.service';
@Injectable()
export class FinanceiroService {
  constructor(
    private readonly consulta: ConsultarFinanceiroService,
    private readonly repasse: RegistrarRepasseService,
    private readonly percentual: ConfigurarPercentualService,
  ) {}
  extrato(query: ConsultarExtratoDto, usuario?: UsuarioAutenticado) {
    return this.consulta.execute(query, usuario);
  }
  pagar(id: number, usuario: UsuarioAutenticado) {
    return this.repasse.execute(id, usuario.id);
  }
  taxas(query: PaginacaoDto) {
    return this.percentual.listar(query);
  }
  configurar(id: number, dto: ConfigurarPercentualDto) {
    return this.percentual.execute(id, dto);
  }
}
