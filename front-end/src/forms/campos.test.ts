import { describe, expect, it } from 'vitest';
import {
  aniversarioValido,
  documentoValido,
  mascararCpf,
  mascararCnpj,
  mascararTelefone,
  mascararCep,
  senhaSchema,
  errosSchema,
} from './campos';
import {
  schemaCliente,
  schemaFilial,
  schemaBarbeiro,
} from '../pages/dashboard/dashboard-administrador/components/schemas-cadastro';
import {
  schemaAgendamento,
  schemaPeriodo,
  schemaFiltrosBarbeiro,
  schemaCancelamento,
} from './schemas-operacoes';
import { schemaLogin } from '../pages/login/validation';

const cliente = {
  nome: 'Ana',
  email: 'ana@example.com',
  cpf: '529.982.247-25',
  senha: ' senha longa segura ',
};
describe('Regras compartilhadas dos formulários', () => {
  it.each(['52998224725', '529.982.247-25'])('aceita CPF %s', (cpf) =>
    expect(documentoValido(cpf, 'cpf')).toBe(true),
  );
  it.each(['00000000000', '11111111111', '52998224724', 'abc52998224725', '529982247250'])(
    'rejeita CPF %s',
    (cpf) => expect(documentoValido(cpf, 'cpf')).toBe(false),
  );
  it('formata documentos, CEP e telefones sem duplicar pontuação', () => {
    expect(mascararCpf('52998224725')).toBe('529.982.247-25');
    expect(mascararCpf('529.982.247-25')).toBe('529.982.247-25');
    expect(mascararCnpj('11222333000181')).toBe('11.222.333/0001-81');
    expect(documentoValido('11.222.333/0001-81', 'cnpj')).toBe(true);
    expect(documentoValido('11.222.333/0001-82', 'cnpj')).toBe(false);
    expect(mascararTelefone('1133334444')).toBe('(11) 3333-4444');
    expect(mascararTelefone('(11) 99999-4444')).toBe('(11) 99999-4444');
    expect(mascararCep('12345678')).toBe('12345-678');
    expect(mascararTelefone('')).toBe('');
  });
  it.each([
    ['', '', true],
    ['29', '2', true],
    ['31', '4', false],
    ['0', '1', false],
    ['1', '13', false],
    ['1', '', false],
    ['', '2', false],
    ['1.5', '2', false],
  ])('aniversário %s/%s: %s', (d, m, esperado) =>
    expect(aniversarioValido(String(d), String(m))).toBe(esperado),
  );
  it('valida o par do aniversário e senhas de criação/edição', () => {
    expect(schemaCliente(false).isValidSync(cliente)).toBe(true);
    expect(schemaCliente(false).isValidSync({ ...cliente, nome: '  ' })).toBe(false);
    expect(schemaCliente(false).isValidSync({ ...cliente, telefone: '12345' })).toBe(false);
    expect(schemaCliente(false).isValidSync({ ...cliente, telefone: '(11) 3333-4444' })).toBe(true);
    expect(
      schemaCliente(false).isValidSync({ ...cliente, diaAniversario: '29', mesAniversario: '2' }),
    ).toBe(true);
    expect(
      errosSchema(schemaCliente(false), { ...cliente, diaAniversario: '31', mesAniversario: '4' }),
    ).toHaveProperty('diaAniversario');
    expect(schemaCliente(true).isValidSync({ ...cliente, senha: '', status: 'ATIVO' })).toBe(true);
    expect(schemaCliente(true).isValidSync({ ...cliente, senha: 'curta', status: 'ATIVO' })).toBe(
      false,
    );
    expect(senhaSchema.cast(cliente.senha)).toBe(cliente.senha);
    expect(senhaSchema.isValidSync('😀'.repeat(15))).toBe(true);
    expect(senhaSchema.isValidSync('a'.repeat(129))).toBe(false);
    expect(schemaLogin.isValidSync({ email: 'ana@example.com', senha: 'antiga' })).toBe(true);
  });
  it('valida filial, UF, URL e admissão', () => {
    const filial = {
      nome: 'Centro',
      cnpj: '11222333000181',
      cep: '12345-678',
      logradouro: 'Rua',
      numero: 's/n',
      bairro: 'Centro',
      cidade: 'Cidade',
      estado: 'sp',
    };
    expect(schemaFilial(false).isValidSync(filial)).toBe(true);
    expect(schemaFilial(false).isValidSync({ ...filial, estado: 'XX' })).toBe(false);
    expect(
      schemaBarbeiro(['1']).isValidSync({
        nome: 'Ana',
        email: 'ana@example.com',
        senha: cliente.senha,
        idFilial: '1',
        fotoUrl: '',
        dataAdmissao: '',
      }),
    ).toBe(true);
    expect(schemaBarbeiro(['1']).isValidSync({ ...cliente, idFilial: '2' })).toBe(false);
    expect(
      schemaBarbeiro(['1']).isValidSync({
        ...cliente,
        idFilial: '1',
        fotoUrl: 'javascript:alert(1)',
      }),
    ).toBe(false);
    expect(
      schemaBarbeiro(['1']).isValidSync({ ...cliente, idFilial: '1', dataAdmissao: '2026-02-30' }),
    ).toBe(false);
  });
  it('valida datas, intervalo inclusivo, filtros e motivo após trim', () => {
    expect(schemaPeriodo.isValidSync({ de: '2024-01-01', ate: '2024-12-31' })).toBe(true);
    expect(schemaPeriodo.isValidSync({ de: '2024-01-01', ate: '2025-01-01' })).toBe(false);
    expect(schemaPeriodo.isValidSync({ de: '2026-02-30', ate: '2026-03-01' })).toBe(false);
    expect(schemaPeriodo.isValidSync({ de: '2026-03-02', ate: '2026-03-01' })).toBe(false);
    expect(
      schemaFiltrosBarbeiro(['CONCLUIDO']).isValidSync({
        de: '2026-03-01',
        ate: '2026-03-01',
        pagina: '0',
        status: '',
      }),
    ).toBe(false);
    expect(
      schemaFiltrosBarbeiro(['CONCLUIDO']).isValidSync({
        de: '2026-03-01',
        ate: '2026-03-01',
        pagina: '1',
        status: 'PENDENTE',
      }),
    ).toBe(false);
    expect(schemaCancelamento.isValidSync({ motivo: '   ' })).toBe(false);
    expect(schemaCancelamento.isValidSync({ motivo: 'a'.repeat(1001) })).toBe(false);
    expect(schemaCancelamento.cast({ motivo: ' imprevisto ' })).toEqual({ motivo: 'imprevisto' });
    expect(
      schemaAgendamento.isValidSync({
        idFilial: 1,
        idBarbeiro: 2,
        servicoIds: [],
        inicio: '2099-01-01T12:00:00Z',
      }),
    ).toBe(false);
  });
});
