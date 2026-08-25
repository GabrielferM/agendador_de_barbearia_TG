import { normalizarCnpj, normalizarCpf } from './documentos';

describe('documentos', () => {
  it('normaliza documentos com dígitos verificadores válidos', () => {
    expect(normalizarCpf('529.982.247-25')).toBe('52998224725');
    expect(normalizarCnpj('04.252.011/0001-10')).toBe('04252011000110');
  });

  it('rejeita documentos inválidos', () => {
    expect(() => normalizarCpf('111.111.111-11')).toThrow('CPF inválido.');
    expect(() => normalizarCnpj('00.000.000/0000-00')).toThrow('CNPJ inválido.');
  });
});
