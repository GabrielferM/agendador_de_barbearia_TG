import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Publico } from './common/auth/publico.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Publico()
  @ApiOperation({ summary: 'Verifica a rota raiz da aplicação' })
  @ApiOkResponse({ schema: { example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }
}
