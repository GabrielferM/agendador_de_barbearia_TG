import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

const MAXIMO_TENTATIVAS_TRANSACAO = 3;

export async function executarTransacaoSerializavel<T>(
  prisma: PrismaService,
  operacao: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let tentativa = 1; tentativa <= MAXIMO_TENTATIVAS_TRANSACAO; tentativa += 1) {
    try {
      return await prisma.$transaction(operacao, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (erro) {
      const conflitoConcorrente =
        erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2034';
      if (!conflitoConcorrente || tentativa === MAXIMO_TENTATIVAS_TRANSACAO) throw erro;
    }
  }

  throw new Error('A transação não foi concluída.');
}
