import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOriginFor, EnvironmentVariables } from './config/environment';
import { configurarSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const environment: EnvironmentVariables = {
    DATABASE_URL: configService.getOrThrow('DATABASE_URL'),
    PORT: configService.getOrThrow('PORT'),
    NODE_ENV: configService.getOrThrow('NODE_ENV'),
    CORS_ORIGINS: configService.getOrThrow('CORS_ORIGINS'),
  };

  app.enableCors({ origin: corsOriginFor(environment) });
  app.enableShutdownHooks();
  configurarSwagger(app, environment);
  await app.listen(environment.PORT);
}

void bootstrap();
