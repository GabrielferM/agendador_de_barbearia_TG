import { HttpException, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

@Injectable()
export class LimiteRecuperacaoService {
  private readonly registros = new Map<
    string,
    { inicio: number; ultimo: number; quantidade: number }
  >();
  verificar(email: string) {
    const agora = Date.now();
    // Chaves derivadas, janela finita e limpeza impedem retenção indefinida de e-mails.
    for (const [chave, item] of this.registros) {
      if (agora - item.inicio >= 900_000) this.registros.delete(chave);
    }
    const chave = createHash('sha256').update(email).digest('hex');
    const item = this.registros.get(chave);
    const espera = item
      ? Math.max(
          60_000 - (agora - item.ultimo),
          item.quantidade >= 3 ? 900_000 - (agora - item.inicio) : 0,
        )
      : 0;
    if (espera > 0 || (!item && this.registros.size >= 10_000)) {
      throw new HttpException(
        {
          statusCode: 429,
          message: 'Aguarde para tentar novamente.',
          retryAfter: Math.ceil(Math.max(espera, 60_000) / 1000),
        },
        429,
      );
    }
    this.registros.set(chave, {
      inicio: item?.inicio ?? agora,
      ultimo: agora,
      quantidade: (item?.quantidade ?? 0) + 1,
    });
  }
}
