import { Injectable } from '@nestjs/common';
import { VerificarHealthService } from './service/verificar-health.service';

@Injectable()
export class HealthService {
  constructor(private readonly verificarHealth: VerificarHealthService) {}

  async pingDatabase() {
    return this.verificarHealth.execute();
  }
}
