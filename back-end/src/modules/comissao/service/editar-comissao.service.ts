import { ConflictException, Injectable } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeComissao } from '../constants/include-comissao';
import { AtualizarComissaoDto } from '../dto/comissao.dto';
import { BuscarComissaoService } from './buscar-comissao.service';

@Injectable()
export class EditarComissaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarComissaoService,
  ) {}

  async execute(id: number, dto: AtualizarComissaoDto) {
    if (
      dto.status !== undefined ||
      dto.dataLiberacao !== undefined ||
      dto.dataPagamento !== undefined ||
      dto.dataEstorno !== undefined ||
      dto.motivoEstorno !== undefined
    )
      throw new ConflictException('Use o fluxo financeiro para alterar o estado da comissão.');
    await this.buscarService.execute(id);
    return serializarResposta(
      await this.prisma.comissao.update({
        where: { id },
        data: {
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        },
        include: includeComissao,
      }),
    );
  }
}
