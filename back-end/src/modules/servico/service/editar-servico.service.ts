import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarServicoDto } from '../dto/atualizar-servico.dto';
import { BuscarServicoService } from './buscar-servico.service';

@Injectable()
export class EditarServicoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarServicoService,
  ) {}
  async execute(id: number, dto: AtualizarServicoDto) {
    await this.buscar.execute(id);
    const data: Prisma.ServicoUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome.trim();
    if (dto.descricao !== undefined) data.descricao = dto.descricao.trim();
    if (dto.preco !== undefined) data.preco = new Prisma.Decimal(dto.preco.toString());
    if (dto.duracaoMinutos !== undefined) data.duracaoMinutos = dto.duracaoMinutos;
    try {
      return serializarResposta(await this.prisma.servico.update({ where: { id }, data }));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('Já existe um serviço com esse nome.');
      throw error;
    }
  }
}
