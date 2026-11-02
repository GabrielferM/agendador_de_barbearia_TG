import { RecuperarSenhaService } from './service/recuperar-senha.service';
import { CadastrarClienteService } from './service/cadastrar-cliente.service';
import { CadastroClienteDto, RedefinirSenhaDto } from './dto/conta-publica.dto';
import { Injectable } from '@nestjs/common';
import { UsuarioAutenticado } from '../../common/auth/auth.types';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './service/login.service';
import { SessaoService } from './service/sessao.service';

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly recuperacao: RecuperarSenhaService,
    private readonly cadastro: CadastrarClienteService,
    private readonly loginService: LoginService,
    private readonly sessoes: SessaoService,
  ) {}
  recuperarSenha(email: string) {
    return this.recuperacao.solicitar(email);
  }
  redefinirSenha(dto: RedefinirSenhaDto) {
    return this.recuperacao.redefinir(dto);
  }
  cadastrarCliente(dto: CadastroClienteDto) {
    return this.cadastro.execute(dto);
  }
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
