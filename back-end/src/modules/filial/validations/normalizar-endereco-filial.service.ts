import { Injectable } from '@nestjs/common';

@Injectable()
export class NormalizarEnderecoFilialService {
  execute<T extends { cep?: string; estado?: string }>(endereco: T): T {
    return {
      ...endereco,
      ...(endereco.cep ? { cep: endereco.cep.replace(/\D/g, '') } : {}),
      ...(endereco.estado ? { estado: endereco.estado.toUpperCase() } : {}),
    };
  }
}
