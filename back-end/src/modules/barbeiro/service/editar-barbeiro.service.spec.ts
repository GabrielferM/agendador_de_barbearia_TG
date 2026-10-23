import { EditarBarbeiroService } from './editar-barbeiro.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarBarbeiroService } from './buscar-barbeiro.service';
import { ValidarFilialBarbeiroService } from '../validations/validar-filial-barbeiro.service';
import { SenhaService } from '../../../common/security/senha.service';

describe('Edição de barbeiro', () => {
  it('permite manter filial atual fora do catálogo sem validar uma transferência', async () => {
    const validar = jest.fn();
    const update = jest.fn().mockResolvedValue({ id: 1, usuario: { id: 1 }, filial: { id: 3 } });
    const servico = new EditarBarbeiroService(
      { barbeiro: { update } } as unknown as PrismaService,
      {
        execute: jest.fn().mockResolvedValue({ id: 1, idFilial: 3 }),
      } as unknown as BuscarBarbeiroService,
      { execute: validar } as unknown as ValidarFilialBarbeiroService,
      {} as SenhaService,
    );
    await servico.execute(1, { idFilial: 3, statusProfissional: 'AFASTADO' });
    expect(validar).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ statusProfissional: 'AFASTADO' }),
      }),
    );
    await servico.execute(1, { idFilial: 4 });
    expect(validar).toHaveBeenCalledWith(4);
    await servico.execute(1, { dataAdmissao: null });
    expect(update).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: { dataAdmissao: null } }),
    );
  });
});
