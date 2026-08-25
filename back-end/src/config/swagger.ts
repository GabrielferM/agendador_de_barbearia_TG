import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentVariables } from './environment';

export function configurarSwagger(app: INestApplication, environment: EnvironmentVariables) {
  if (environment.NODE_ENV === 'production') return;
  const config = new DocumentBuilder()
    .setTitle('API Agendador de Barbearia')
    .setDescription('Contrato OpenAPI da API REST do Agendador de Barbearia.')
    .setVersion('1.0')
    .addTag('App')
    .addTag('Health')
    .addTag('Usuários')
    .addTag('Clientes')
    .addTag('Barbeiros')
    .addTag('Filiais')
    .addTag('Endereços')
    .addTag('Serviços')
    .addTag('Agendamentos')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
    raw: ['json', 'yaml'],
  });
}
