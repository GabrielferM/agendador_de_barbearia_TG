import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns success when the database is reachable', async () => {
    const controller = new HealthController({
      pingDatabase: jest.fn().mockResolvedValue(true),
    } as unknown as HealthService);

    await expect(controller.getHealth()).resolves.toEqual({
      status: 'ok',
      database: 'connected',
    });
  });

  it('returns HTTP 503 when the database is unreachable', async () => {
    const controller = new HealthController({
      pingDatabase: jest.fn().mockResolvedValue(false),
    } as unknown as HealthService);

    await expect(controller.getHealth()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
