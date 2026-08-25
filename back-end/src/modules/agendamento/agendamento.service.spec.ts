import { BadRequestException } from '@nestjs/common';
import { BuscarServicosAgendamentoService } from './validations/buscar-servicos-agendamento.service';
import { ValidarDataHoraAgendamentoService } from './validations/validar-data-hora-agendamento.service';

describe('AgendamentoService', () => {
  it('rejeita serviços duplicados antes de consultar o banco', async () => {
    const service = new BuscarServicosAgendamentoService({} as never);

    await expect(service.execute([1, 1])).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita início sem fuso horário', () => {
    const service = new ValidarDataHoraAgendamentoService();

    expect(() => service.execute('2030-01-01T12:00:00')).toThrow(BadRequestException);
  });
});
