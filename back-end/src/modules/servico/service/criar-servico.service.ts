import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarServicoDto } from '../dto/criar-servico.dto';

@Injectable()
export class CriarServicoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(dto: CriarServicoDto) {
    const nome = dto.nome.trim();
    if (await this.prisma.servico.findFirst({ where: { nome } }))
      throw new ConflictException('Já existe um serviço com esse nome.');
    try {
      return serializarResposta(
        await this.prisma.servico.create({
          data: {
            nome,
            descricao: dto.descricao?.trim() || null,
            precoBase: new Prisma.Decimal(dto.precoBase.toString()),
            duracaoMinutos: dto.duracaoMinutos,
          },
        }),
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('Já existe um serviço com esse nome.');
      throw error;
    }
  }
}
