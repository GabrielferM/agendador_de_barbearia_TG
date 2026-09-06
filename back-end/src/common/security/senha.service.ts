import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { ARGON2_CONFIG } from '../constants/seguranca';

export interface ResultadoVerificacaoSenha {
  valida: boolean;
  precisaMigrar: boolean;
}

export function gerarHashSenha(senha: string): Promise<string> {
  return argon2.hash(senha, { type: argon2.argon2id, ...ARGON2_CONFIG });
}

@Injectable()
export class SenhaService {
  gerarHash(senha: string): Promise<string> {
    return gerarHashSenha(senha);
  }

  async verificar(senha: string, hash: string): Promise<ResultadoVerificacaoSenha> {
    try {
      if (/^\$2[ab]\$/.test(hash)) {
        return { valida: await bcrypt.compare(senha, hash), precisaMigrar: true };
      }
      if (hash.startsWith('$argon2id$')) {
        return { valida: await argon2.verify(hash, senha), precisaMigrar: false };
      }
    } catch {
      return { valida: false, precisaMigrar: false };
    }
    return { valida: false, precisaMigrar: false };
  }
}
