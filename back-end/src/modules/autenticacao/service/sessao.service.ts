import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import {
  SESSAO_ATUALIZAR_USO_MS,
  SESSAO_DURACAO_MS,
  SESSAO_INATIVIDADE_MS,
} from '../../../common/constants/seguranca';
import { UsuarioAutenticado } from '../../../common/auth/auth.types';
import { PrismaService } from '../../../prisma/prisma.service';

const mensagemNaoAutenticado = 'Não foi possível autenticar a sessão.';

@Injectable()
export class SessaoService {
  constructor(private readonly prisma: PrismaService) {}

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  novoToken(): string {
    return randomBytes(32).toString('base64url');
  }

  async buscar(token: string): Promise<UsuarioAutenticado> {
    const agora = new Date();
    const sessao = await this.prisma.sessao.findUnique({
      where: { tokenHash: this.hashToken(token) },
      include: {
        usuario: {
          include: {
            papel: { include: { permissoes: { include: { permissao: true } } } },
            cliente: { select: { id: true } },
            barbeiro: { select: { id: true } },
          },
        },
      },
    });
    const inativa = sessao
      ? agora.getTime() - sessao.ultimoUso.getTime() > SESSAO_INATIVIDADE_MS
      : true;
    if (
      !sessao ||
      sessao.dataRevogacao ||
      sessao.dataExpiracao <= agora ||
      inativa ||
      sessao.usuario.status !== 'ATIVO' ||
      !sessao.usuario.papel.ativo
    ) {
      if (sessao && !sessao.dataRevogacao) {
        await this.prisma.sessao.update({
          where: { id: sessao.id },
          data: { dataRevogacao: agora },
        });
      }
      throw new UnauthorizedException(mensagemNaoAutenticado);
    }
    if (agora.getTime() - sessao.ultimoUso.getTime() >= SESSAO_ATUALIZAR_USO_MS) {
      await this.prisma.sessao.update({ where: { id: sessao.id }, data: { ultimoUso: agora } });
    }
    const permissoes = sessao.usuario.papel.permissoes
      .filter((vinculo) => vinculo.ativo && vinculo.permissao.ativo)
      .map((vinculo) => vinculo.permissao.codigo);
    return {
      id: sessao.usuario.id,
      nome: sessao.usuario.nome,
      email: sessao.usuario.email,
      papel: sessao.usuario.papel.codigo,
      permissoes,
      sessaoId: sessao.id,
      clienteId: sessao.usuario.cliente?.id,
      barbeiroId: sessao.usuario.barbeiro?.id,
    };
  }

  async revogar(token: string): Promise<void> {
    await this.prisma.sessao.updateMany({
      where: { tokenHash: this.hashToken(token), dataRevogacao: null },
      data: { dataRevogacao: new Date() },
    });
  }

  dataExpiracao(agora = new Date()): Date {
    return new Date(agora.getTime() + SESSAO_DURACAO_MS);
  }
}
