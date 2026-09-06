import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { SenhaService } from '../../../common/security/senha.service';
import { normalizarEmail } from '../../../common/utils/documentos';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';
import { SessaoService } from './sessao.service';

const mensagemInvalida = 'E-mail ou senha inválidos.';
const JANELA_TENTATIVAS_MS = 15 * 60 * 1000;
const LIMITE_TENTATIVAS = 5;

@Injectable()
export class LoginService {
  private readonly tentativas = new Map<string, { quantidade: number; inicio: number }>();
  private readonly hashFicticio: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly senhas: SenhaService,
    private readonly sessoes: SessaoService,
  ) {
    this.hashFicticio = senhas.gerarHash('senha-ficticia-segura-e-inutilizavel');
  }

  async execute(dto: LoginDto) {
    const email = normalizarEmail(dto.email);
    this.verificarLimite(email);
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { papel: { include: { permissoes: { include: { permissao: true } } } } },
    });
    const hash = usuario?.senhaHash ?? (await this.hashFicticio);
    const verificacao = await this.senhas.verificar(dto.senha, hash);
    if (!usuario || !verificacao.valida || usuario.status !== 'ATIVO' || !usuario.papel.ativo) {
      this.registrarFalha(email);
      throw new UnauthorizedException(mensagemInvalida);
    }
    this.tentativas.delete(this.chave(email));
    const token = this.sessoes.novoToken();
    const agora = new Date();
    const novoHash = verificacao.precisaMigrar ? await this.senhas.gerarHash(dto.senha) : undefined;
    const sessao = await this.prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: usuario.id },
        data: { ultimoAcesso: agora, ...(novoHash ? { senhaHash: novoHash } : {}) },
      });
      return tx.sessao.create({
        data: {
          idUsuario: usuario.id,
          tokenHash: this.sessoes.hashToken(token),
          dataExpiracao: this.sessoes.dataExpiracao(agora),
        },
      });
    });
    return {
      token,
      sessaoId: sessao.id,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel.codigo,
        permissoes: usuario.papel.permissoes
          .filter((item) => item.ativo && item.permissao.ativo)
          .map((item) => item.permissao.codigo),
      },
    };
  }

  private chave(email: string): string {
    return createHash('sha256').update(email).digest('hex');
  }

  private verificarLimite(email: string) {
    const registro = this.tentativas.get(this.chave(email));
    if (!registro) return;
    const restante = JANELA_TENTATIVAS_MS - (Date.now() - registro.inicio);
    if (restante <= 0) return void this.tentativas.delete(this.chave(email));
    if (registro.quantidade >= LIMITE_TENTATIVAS) {
      throw new HttpException(
        {
          statusCode: 429,
          message: 'Muitas tentativas. Tente novamente mais tarde.',
          retryAfter: Math.ceil(restante / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private registrarFalha(email: string) {
    const chave = this.chave(email);
    const atual = this.tentativas.get(chave);
    this.tentativas.set(
      chave,
      atual
        ? { ...atual, quantidade: atual.quantidade + 1 }
        : { quantidade: 1, inicio: Date.now() },
    );
  }
}
