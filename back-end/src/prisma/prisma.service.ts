import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not defined. Set it in the environment before starting the application.',
      );
    }

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // `adapter` é fornecido pelo pacote `@prisma/adapter-pg`, porém
    // não consta no tipo gerado `PrismaClientOptions`.
    // Fazemos um cast para `any` para preservar o comportamento em tempo de
    // execução e satisfazer o TypeScript.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.warn('PrismaClient: failed to connect on init:', msg);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
