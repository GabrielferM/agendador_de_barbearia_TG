import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VerificarHealthService {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    try {
      const result = await this.prisma.$queryRaw<{ result: number }[]>`SELECT 1 AS result`;
      return result.length === 1 && result[0].result === 1;
    } catch {
      return false;
    }
  }
}
