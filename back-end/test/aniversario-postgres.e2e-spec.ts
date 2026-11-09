import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

// Opt-in: usa somente um schema próprio em PostgreSQL local descartável *_auth_test.
const databaseUrl = process.env.DATABASE_URL_TESTE;
const suite = databaseUrl ? describe : describe.skip;
suite('Migration de aniversário com histórico e triggers reais', () => {
  let db: Client;
  let criado = false;
  const schema = `aniversario_teste_${process.pid}_${Date.now()}`;
  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
      !url.pathname.endsWith('_auth_test')
    ) {
      throw new Error('Use somente PostgreSQL local descartável *_auth_test.');
    }
    db = new Client({ connectionString: databaseUrl });
    await db.connect();
    await db.query(`CREATE SCHEMA "${schema}"`);
    criado = true;
    await db.query(`SET search_path TO "${schema}"`);
  });
  afterAll(async () => {
    if (!db) return;
    await db.query('ROLLBACK');
    if (criado) await db.query(`DROP SCHEMA "${schema}" CASCADE`);
    await db.end();
  });
  it('preserva dia/mês e ausência, aceita 29/02 e mantém restrições com triggers ativos', async () => {
    const raiz = join(__dirname, '../prisma/migrations');
    const migrations = readdirSync(raiz)
      .filter((nome) => /^\d/.test(nome))
      .sort();
    const aniversario = '20261103193000_aniversario_cliente';
    for (const nome of migrations.filter((nome) => nome < aniversario)) {
      await db.query(readFileSync(join(raiz, nome, 'migration.sql'), 'utf8'));
    }
    await db.query(`BEGIN;
      INSERT INTO papel (id,codigo,nome) VALUES (999,'CLIENTE','Cliente');
      INSERT INTO usuario (id,"idPapel",nome,email,"senhaHash","dataAtualizacao") VALUES
        (901,999,'Teste','migration1@example.com','nao-usado',NOW()),
        (902,999,'Teste','migration2@example.com','nao-usado',NOW()),
        (903,999,'Teste','migration3@example.com','nao-usado',NOW());
      INSERT INTO cliente (id,cpf,"dataNascimento") VALUES
        (901,'teste1','1990-05-15'),(902,'teste2',NULL),(903,'teste3','2000-02-29'); COMMIT;`);
    await db.query(readFileSync(join(raiz, aniversario, 'migration.sql'), 'utf8'));
    expect(
      (await db.query('SELECT id,"diaAniversario","mesAniversario" FROM cliente ORDER BY id')).rows,
    ).toEqual([
      { id: 901, diaAniversario: 15, mesAniversario: 5 },
      { id: 902, diaAniversario: null, mesAniversario: null },
      { id: 903, diaAniversario: 29, mesAniversario: 2 },
    ]);
    for (const sql of [
      'UPDATE cliente SET "diaAniversario"=31,"mesAniversario"=4 WHERE id=901',
      'UPDATE cliente SET "diaAniversario"=NULL WHERE id=901',
    ])
      await expect(db.query(sql)).rejects.toMatchObject({ code: '23514' });
    const colunas = await db.query<{ column_name: string }>(
      'SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2',
      [schema, 'cliente'],
    );
    expect(colunas.rows.map((linha) => linha.column_name)).not.toContain('dataNascimento');
  });
});
