import { Injectable } from '@nestjs/common';
import { UsuarioAutenticado } from '../../common/auth/auth.types';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './service/login.service';
import { SessaoService } from './service/sessao.service';

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessoes: SessaoService,
  ) {}
  login(dto: LoginDto) {
    return this.loginService.execute(dto);
  }
  me(usuario: UsuarioAutenticado) {
    return { usuario: this.publico(usuario) };
  }
  logout(token: string) {
    return this.sessoes.revogar(token);
  }
  private publico(usuario: UsuarioAutenticado) {
    const {
      sessaoId: _sessaoId,
      clienteId: _clienteId,
      barbeiroId: _barbeiroId,
      ...publico
    } = usuario;
    return publico;
  }
}
