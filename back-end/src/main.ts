import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { corsOriginFor, EnvironmentVariables } from './config/environment';
import { configurarSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      validationError: { target: false, value: false },
    }),
  );

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const environment: EnvironmentVariables = {
    DATABASE_URL: configService.getOrThrow('DATABASE_URL'),
    PORT: configService.getOrThrow('PORT'),
    NODE_ENV: configService.getOrThrow('NODE_ENV'),
    CORS_ORIGINS: configService.getOrThrow('CORS_ORIGINS'),
    CSRF_SECRET: configService.getOrThrow('CSRF_SECRET'),
  };

  app.enableCors({ origin: corsOriginFor(environment), credentials: true });
  app.enableShutdownHooks();
  configurarSwagger(app, environment);
  await app.listen(environment.PORT);
}

void bootstrap();
