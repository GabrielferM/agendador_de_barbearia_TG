import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Verifica a disponibilidade do banco de dados' })
  @ApiOkResponse({ schema: { example: { status: 'ok', database: 'connected' } } })
  @ApiServiceUnavailableResponse({
    schema: { example: { statusCode: 503, message: 'Database is unreachable.' } },
  })
  async getHealth() {
    const ok = await this.healthService.pingDatabase();

    if (!ok) {
      throw new ServiceUnavailableException('Database is unreachable.');
    }

    return {
      status: 'ok',
      database: 'connected',
    };
  }
}
