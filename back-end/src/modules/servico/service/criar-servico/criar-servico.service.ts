import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CriarServicoDto } from '../../dto/criar-servico.dto';
import { ServicoRepository } from '../../servico.repository';

@Injectable()
export class CriarServicoService {
  constructor(private readonly servicoRepository: ServicoRepository) {}

  async execute(dto: CriarServicoDto) {
    const nome = dto.nome.trim();

    if (!nome) {
      throw new BadRequestException('Nome do serviço é obrigatório.');
    }

    const servicoExistente = await this.servicoRepository.buscarPorNome(nome);

    if (servicoExistente) {
      throw new ConflictException('Já existe um serviço com esse nome.');
    }

    return this.servicoRepository.criar({
      nome,
      descricao: dto.descricao?.trim() || null,
      preco: new Prisma.Decimal(dto.preco.toString()),
      duracaoMinutos: dto.duracaoMinutos,
    });
  }
}
