import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configurarValidacao(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      validationError: { target: false, value: false },
    }),
  );
}
