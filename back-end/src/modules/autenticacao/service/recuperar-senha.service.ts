import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomInt } from 'node:crypto';
import { setTimeout as aguardar } from 'node:timers/promises';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { SenhaService } from '../../../common/security/senha.service';
import { normalizarEmail } from '../../../common/utils/documentos';
import { EmailContaService } from './email-conta.service';
import { LimiteRecuperacaoService } from './limite-recuperacao.service';
import { SessaoService } from './sessao.service';
import { RedefinirSenhaDto } from '../dto/conta-publica.dto';

export const MENSAGEM_RECUPERACAO =
  'Se houver uma conta elegível com esse e-mail, enviaremos as instruções para redefinir sua senha.';
const mensagemToken = 'Link inválido, expirado ou já utilizado. Solicite outro link.';

@Injectable()
export class RecuperarSenhaService {
  private readonly logger = new Logger(RecuperarSenhaService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhas: SenhaService,
    private readonly sessoes: SessaoService,
    private readonly emails: EmailContaService,
    private readonly limites: LimiteRecuperacaoService,
  ) {}

  async solicitar(entrada: string) {
    const email = normalizarEmail(entrada);
    this.limites.verificar(email);
    // Todas as contas têm o mesmo piso de resposta, superior ao timeout do provedor.
    const piso = aguardar(3500 + randomInt(150));
    try {
      const token = this.sessoes.novoToken();
      const usuario = await this.prisma.usuario.findUnique({
        where: { email },
        include: { papel: true },
      });
      if (usuario?.status === 'ATIVO' && usuario.papel.ativo) {
        const registro = await this.prisma.recuperacaoSenha.create({
          data: {
            idUsuario: usuario.id,
            tokenHash: this.sessoes.hashToken(token),
            dataExpiracao: new Date(Date.now() + 900_000),
          },
        });
        try {
          await this.emails.recuperar(email, token);
        } catch {
          this.logger.warn('Falha no envio de recuperação de senha.');
          await this.prisma.recuperacaoSenha.updateMany({
            where: { id: registro.id, dataConsumo: null },
            data: { dataConsumo: new Date() },
          });
        }
      }
      return { mensagem: MENSAGEM_RECUPERACAO };
    } catch {
      // Falhas de persistência também não devem transformar a rota em um oráculo
      // de existência de conta. O aviso operacional não inclui dados da entrada.
      this.logger.warn('Falha ao processar solicitação de recuperação de senha.');
      return { mensagem: MENSAGEM_RECUPERACAO };
    } finally {
      await piso;
    }
  }

  async redefinir(dto: RedefinirSenhaDto) {
    const tokenHash = this.sessoes.hashToken(dto.token);
    const senhaHash = await this.senhas.gerarHash(dto.senha);
    let email: string;
    try {
      email = await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const agora = new Date();
        const registro = await tx.recuperacaoSenha.findUnique({
          where: { tokenHash },
          include: { usuario: { include: { papel: true } } },
        });
        if (
          !registro ||
          registro.dataConsumo ||
          registro.dataExpiracao <= agora ||
          registro.usuario.status !== 'ATIVO' ||
          !registro.usuario.papel.ativo
        )
          throw new BadRequestException(mensagemToken);
        const consumo = await tx.recuperacaoSenha.updateMany({
          where: { id: registro.id, dataConsumo: null, dataExpiracao: { gt: agora } },
          data: { dataConsumo: agora },
        });
        if (consumo.count !== 1) throw new BadRequestException(mensagemToken);
        await tx.usuario.update({ where: { id: registro.idUsuario }, data: { senhaHash } });
        await tx.recuperacaoSenha.updateMany({
          where: { idUsuario: registro.idUsuario, dataConsumo: null },
          data: { dataConsumo: agora },
        });
        await tx.sessao.updateMany({
          where: { idUsuario: registro.idUsuario, dataRevogacao: null },
          data: { dataRevogacao: agora },
        });
        return registro.usuario.email;
      });
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2034')
        throw new BadRequestException(mensagemToken);
      throw erro;
    }
    try {
      await this.emails.notificarAlteracao(email);
    } catch {
      this.logger.warn('Falha na notificação de alteração de senha.');
    }
    return { mensagem: 'Senha alterada. Entre com sua nova senha.' };
  }
}
