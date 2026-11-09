import { expect, it } from 'vitest';
import { executarHttp } from './operacao-http';
it('traduz somente mensagens conhecidas e mantém o status', async () => {
  const resposta =
    (message: unknown, status = 400) =>
    async () => ({ status, data: { message }, headers: new Headers() });
  await expect(executarHttp(resposta(['CPF inválido.']))).rejects.toMatchObject({
    message: 'CPF inválido.',
    status: 400,
  });
  await expect(executarHttp(resposta('CPF ou e-mail já cadastrado.', 409))).rejects.toMatchObject({
    message: 'CPF ou e-mail já cadastrado.',
    status: 409,
  });
  await expect(
    executarHttp(resposta('Detalhe interno que não pode ser exibido')),
  ).rejects.toMatchObject({ message: 'Revise os campos e as regras desta operação.', status: 400 });
  await expect(executarHttp(resposta('CPF inválido.', 500))).rejects.toMatchObject({
    message:
      'Não foi possível concluir a operação. Consulte os dados antes de repetir uma gravação.',
    status: 500,
  });
});
