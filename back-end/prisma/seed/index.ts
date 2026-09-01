import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import pg from 'pg';
import { CODIGOS_PAPEL } from '../../src/common/constants/papeis';
import { BCRYPT_SALT_ROUNDS } from '../../src/common/constants/seguranca';
import { obterSenhaSeed } from '../../src/common/utils/seed-password';

const senhaSeed = obterSenhaSeed(process.env.SEED_DEFAULT_PASSWORD);

const dadosPapeis = [
  {
    codigo: CODIGOS_PAPEL.ADMINISTRADOR,
    nome: 'Administrador',
    descricao: 'Gerencia as configuracoes e a operacao da barbearia.',
  },
  {
    codigo: CODIGOS_PAPEL.BARBEIRO,
    nome: 'Barbeiro',
    descricao: 'Realiza atendimentos e administra a propria agenda.',
  },
  {
    codigo: CODIGOS_PAPEL.CLIENTE,
    nome: 'Cliente',
    descricao: 'Agenda e acompanha os proprios atendimentos.',
  },
] as const;

const dadosPermissoes = [
  {
    codigo: 'GERENCIAR_USUARIOS',
    nome: 'Gerenciar usuarios',
    descricao: 'Cadastrar e administrar usuarios do sistema.',
  },
  {
    codigo: 'GERENCIAR_FILIAIS',
    nome: 'Gerenciar filiais',
    descricao: 'Cadastrar e administrar filiais e enderecos.',
  },
  {
    codigo: 'GERENCIAR_SERVICOS',
    nome: 'Gerenciar servicos',
    descricao: 'Cadastrar e administrar servicos oferecidos.',
  },
  {
    codigo: 'GERENCIAR_AGENDAMENTOS',
    nome: 'Gerenciar agendamentos',
    descricao: 'Visualizar e administrar todos os agendamentos.',
  },
  {
    codigo: 'GERENCIAR_PROPRIA_AGENDA',
    nome: 'Gerenciar propria agenda',
    descricao: 'Visualizar e atualizar os proprios atendimentos.',
  },
  {
    codigo: 'CRIAR_AGENDAMENTO',
    nome: 'Criar agendamento',
    descricao: 'Criar e acompanhar os proprios agendamentos.',
  },
] as const;

const urlBanco = process.env.DATABASE_URL;

if (!urlBanco) {
  throw new Error('DATABASE_URL deve estar definida para executar o seed.');
}

const pool = new pg.Pool({ connectionString: urlBanco });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const papeis = await Promise.all(
    dadosPapeis.map((papel) =>
      prisma.papel.upsert({
        where: { codigo: papel.codigo },
        update: { ...papel, ativo: true },
        create: { ...papel, ativo: true },
      }),
    ),
  );

  const permissoes = await Promise.all(
    dadosPermissoes.map((permissao) =>
      prisma.permissao.upsert({
        where: { codigo: permissao.codigo },
        update: { ...permissao, ativo: true },
        create: { ...permissao, ativo: true },
      }),
    ),
  );

  const papelPorCodigo = new Map(papeis.map((papel) => [papel.codigo, papel]));
  const permissaoPorCodigo = new Map(permissoes.map((permissao) => [permissao.codigo, permissao]));

  const permissoesPorPapel = {
    [CODIGOS_PAPEL.ADMINISTRADOR]: dadosPermissoes.map((permissao) => permissao.codigo),
    [CODIGOS_PAPEL.BARBEIRO]: ['GERENCIAR_PROPRIA_AGENDA'],
    [CODIGOS_PAPEL.CLIENTE]: ['CRIAR_AGENDAMENTO'],
  } as const;

  await Promise.all(
    Object.entries(permissoesPorPapel).flatMap(([codigoPapel, codigosPermissao]) => {
      const papel = papelPorCodigo.get(codigoPapel);

      if (!papel) {
        throw new Error(`Papel ${codigoPapel} nao foi criado.`);
      }

      return codigosPermissao.map((codigoPermissao) => {
        const permissao = permissaoPorCodigo.get(codigoPermissao);

        if (!permissao) {
          throw new Error(`Permissao ${codigoPermissao} nao foi criada.`);
        }

        return prisma.papelPermissao.upsert({
          where: {
            idPapel_idPermissao: {
              idPapel: papel.id,
              idPermissao: permissao.id,
            },
          },
          update: { ativo: true },
          create: {
            idPapel: papel.id,
            idPermissao: permissao.id,
            ativo: true,
          },
        });
      });
    }),
  );

  const filial = await prisma.filial.upsert({
    where: { cnpj: '12345678000195' },
    update: {
      nome: 'Barbearia Exemplo',
      telefone: '(11) 99999-0000',
      email: 'contato@barbeariaexemplo.com',
      status: 'ATIVA',
    },
    create: {
      nome: 'Barbearia Exemplo',
      cnpj: '12345678000195',
      telefone: '(11) 99999-0000',
      email: 'contato@barbeariaexemplo.com',
      status: 'ATIVA',
      endereco: {
        create: {
          cep: '01001000',
          logradouro: 'Praca da Se',
          numero: '100',
          bairro: 'Se',
          cidade: 'Sao Paulo',
          estado: 'SP',
        },
      },
    },
  });

  const senhaHash = await bcrypt.hash(senhaSeed, BCRYPT_SALT_ROUNDS);
  const administrador = await prisma.usuario.upsert({
    where: { email: 'admin@barbeariaexemplo.com' },
    update: {},
    create: {
      idPapel: papelPorCodigo.get(CODIGOS_PAPEL.ADMINISTRADOR)!.id,
      nome: 'Administrador',
      email: 'admin@barbeariaexemplo.com',
      senhaHash,
      telefone: '(11) 99999-0001',
      administrador: {
        create: {
          dataInicioAdministracao: new Date('2024-01-15T00:00:00.000Z'),
          observacao: 'Usuario administrador criado pelo seed.',
        },
      },
    },
  });

  const barbeiro = await prisma.usuario.upsert({
    where: { email: 'barbeiro@barbeariaexemplo.com' },
    update: {},
    create: {
      idPapel: papelPorCodigo.get(CODIGOS_PAPEL.BARBEIRO)!.id,
      nome: 'Joao da Silva',
      email: 'barbeiro@barbeariaexemplo.com',
      senhaHash,
      telefone: '(11) 99999-0002',
      barbeiro: {
        create: {
          idFilial: filial.id,
          nomeProfissional: 'Joao',
          descricao: 'Barbeiro responsavel pelos atendimentos iniciais.',
          dataAdmissao: new Date('2024-01-15T00:00:00.000Z'),
          statusProfissional: 'ATIVO',
        },
      },
    },
  });

  const cliente = await prisma.usuario.upsert({
    where: { email: 'cliente@barbeariaexemplo.com' },
    update: {},
    create: {
      idPapel: papelPorCodigo.get(CODIGOS_PAPEL.CLIENTE)!.id,
      nome: 'Carlos Oliveira',
      email: 'cliente@barbeariaexemplo.com',
      senhaHash,
      telefone: '(11) 99999-0003',
      cliente: {
        create: {
          cpf: '52998224725',
          dataNascimento: new Date('1990-05-15T00:00:00.000Z'),
        },
      },
    },
  });

  await Promise.all([
    prisma.servico.upsert({
      where: { nome: 'Corte de cabelo' },
      update: {
        descricao: 'Corte masculino tradicional.',
        precoBase: '50.00',
        duracaoMinutos: 45,
        ativo: true,
      },
      create: {
        nome: 'Corte de cabelo',
        descricao: 'Corte masculino tradicional.',
        precoBase: '50.00',
        duracaoMinutos: 45,
      },
    }),
    prisma.servico.upsert({
      where: { nome: 'Barba' },
      update: {
        descricao: 'Modelagem e acabamento de barba.',
        precoBase: '35.00',
        duracaoMinutos: 30,
        ativo: true,
      },
      create: {
        nome: 'Barba',
        descricao: 'Modelagem e acabamento de barba.',
        precoBase: '35.00',
        duracaoMinutos: 30,
      },
    }),
  ]);

  console.info('Seed concluido com sucesso.');
  console.info(`Administrador: ${administrador.email}`);
  console.info(`Barbeiro: ${barbeiro.email}`);
  console.info(`Cliente: ${cliente.email}`);
}

main()
  .catch((erro: unknown) => {
    console.error('Falha ao executar o seed:', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
