import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CriarClienteService } from '../../cliente/service/criar-cliente.service';
import { CadastroClienteDto } from '../dto/conta-publica.dto';

@Injectable()
export class CadastrarClienteService {
  constructor(private readonly criarCliente: CriarClienteService) {}
  async execute(dto: CadastroClienteDto) {
    try {
      // Projeção explícita: nenhum campo administrativo atravessa a fronteira pública.
      await this.criarCliente.execute({
        nome: dto.nome,
        email: dto.email,
        cpf: dto.cpf,
        senha: dto.senha,
        telefone: dto.telefone,
      });
    } catch (erro) {
      if (
        erro instanceof ConflictException ||
        (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2002')
      ) {
        throw new ConflictException(
          'Não foi possível criar a conta com os dados informados. Se já possui conta, entre ou recupere sua senha.',
        );
      }
      throw erro;
    }
    return { mensagem: 'Conta criada. Entre para continuar.' };
  }
}
