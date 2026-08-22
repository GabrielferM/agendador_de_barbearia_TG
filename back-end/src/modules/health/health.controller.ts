import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    const ok = await this.healthService.pingDatabase();
    return {
      status: ok ? 'ok' : 'error',
      database: ok ? 'connected' : 'unreachable',
      httpStatus: ok ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
    };
  }
}
