import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { aniversarioValido } from './aniversario';
import { CriarClienteDto, AtualizarClienteDto } from '../../modules/cliente/dto/cliente.dto';
import { CadastroClienteDto } from '../../modules/autenticacao/dto/conta-publica.dto';
import { CriarBarbeiroDto } from '../../modules/barbeiro/dto/barbeiro.dto';
import { CriarFilialDto } from '../../modules/filial/dto/filial.dto';

const cliente = {
  nome: 'Cliente',
  email: 'cliente@example.com',
  cpf: '529.982.247-25',
  senha: ' senha longa segura ',
};
describe('Validações de entradas dos formulários', () => {
  it.each([
    [undefined, undefined, true],
    [null, null, true],
    [29, 2, true],
    [31, 4, false],
    [29, undefined, false],
    [undefined, 2, false],
    [null, 2, false],
    [0, 2, false],
    [2, 13, false],
    ['29', 2, false],
  ])('par %s/%s', (dia, mes, esperado) => expect(aniversarioValido(dia, mes)).toBe(esperado));
  it('valida o par inclusive quando o campo está ausente ou nulo', async () => {
    for (const dto of [CriarClienteDto, CadastroClienteDto]) {
      expect(
        await validate(plainToInstance(dto, { ...cliente, diaAniversario: 29, mesAniversario: 2 })),
      ).toHaveLength(0);
      expect(
        await validate(plainToInstance(dto, { ...cliente, mesAniversario: 2 })),
      ).not.toHaveLength(0);
      expect(
        await validate(plainToInstance(dto, { ...cliente, diaAniversario: 31, mesAniversario: 4 })),
      ).not.toHaveLength(0);
    }
    expect(await validate(plainToInstance(AtualizarClienteDto, {}))).toHaveLength(0);
    expect(
      await validate(
        plainToInstance(AtualizarClienteDto, { diaAniversario: null, mesAniversario: null }),
      ),
    ).toHaveLength(0);
    expect(
      await validate(plainToInstance(AtualizarClienteDto, { diaAniversario: null })),
    ).not.toHaveLength(0);
  });
  it('normaliza e-mail, nome e telefone sem alterar senha', async () => {
    for (const telefone of ['11999994444', '(11) 99999-4444', '11 99999-4444', '(11) 3333-4444']) {
      const dto = plainToInstance(CriarClienteDto, {
        ...cliente,
        nome: ' Cliente ',
        email: ' CLIENTE@EXAMPLE.COM ',
        telefone,
      });
      expect(await validate(dto)).toHaveLength(0);
      expect(dto.telefone).toMatch(/^\d{10,11}$/);
      expect(dto.nome).toBe('Cliente');
      expect(dto.email).toBe('cliente@example.com');
      expect(dto.senha).toBe(cliente.senha);
    }
    for (const campos of [
      { nome: '  ' },
      { cpf: '00000000000' },
      { cpf: 'abc52998224725' },
      { telefone: 'abc11999994444' },
      { telefone: '123' },
    ]) {
      expect(
        await validate(plainToInstance(CriarClienteDto, { ...cliente, ...campos })),
      ).not.toHaveLength(0);
    }
  });
  it('valida URL, admissão, CNPJ e UF', async () => {
    expect(
      await validate(
        plainToInstance(CriarBarbeiroDto, {
          ...cliente,
          cpf: undefined,
          idFilial: 1,
          fotoUrl: 'javascript:alert(1)',
          dataAdmissao: '2026-02-30',
        }),
      ),
    ).not.toHaveLength(0);
    const filial = {
      nome: 'Centro',
      cnpj: '11.222.333/0001-81',
      telefone: '(11) 3333-4444',
      endereco: {
        cep: '12345-678',
        logradouro: 'Rua',
        numero: 's/n',
        bairro: 'Centro',
        cidade: 'Cidade',
        estado: 'sp',
      },
    };
    expect(await validate(plainToInstance(CriarFilialDto, filial))).toHaveLength(0);
    expect(
      await validate(
        plainToInstance(CriarFilialDto, {
          ...filial,
          endereco: { ...filial.endereco, estado: 'XX' },
        }),
      ),
    ).not.toHaveLength(0);
  });
  it('rejeita null nos campos de edição que não são anuláveis', async () => {
    for (const campo of ['nome', 'email', 'senha', 'cpf', 'telefone', 'status', 'observacao']) {
      expect(
        await validate(plainToInstance(AtualizarClienteDto, { [campo]: null })),
      ).not.toHaveLength(0);
    }
  });
});
