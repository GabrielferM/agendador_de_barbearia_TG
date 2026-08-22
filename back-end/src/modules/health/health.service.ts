import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async pingDatabase(): Promise<boolean> {
    try {
      // simple lightweight query to verify connection
      // Prisma returns result for raw queries; `SELECT 1` is portable
      // use a type assertion to avoid TypeScript issues with generated client
      const result = await (this.prisma as any).$queryRaw`SELECT 1 as result`;
      return !!result;
    } catch (error) {
      return false;
    }
  }
}
