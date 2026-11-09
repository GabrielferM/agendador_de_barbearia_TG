import { useId, useState } from 'react';
import type { AnyObjectSchema } from 'yup';
import type { FormEvent } from 'react';
import { errosSchema, focarPrimeiroErro } from './campos';

export function useValidacaoFormulario(
  schema: AnyObjectSchema,
  valoresPadrao: Record<string, string> = {},
) {
  const [erros, definirErros] = useState<Record<string, string>>({});
  const id = useId();
  const ler = (form: HTMLFormElement) => ({
    ...valoresPadrao,
    ...Object.fromEntries(new FormData(form)),
  });
  function validar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novos = errosSchema(schema, ler(evento.currentTarget));
    definirErros(novos);
    if (Object.keys(novos).length) {
      focarPrimeiroErro(evento.currentTarget, novos);
      return false;
    }
    return true;
  }
  function campo(nome: string) {
    return {
      'aria-invalid': Boolean(erros[nome]),
      'aria-describedby': erros[nome] ? `${id}-${nome}-erro` : undefined,
    };
  }
  function aoSair(evento: FormEvent<HTMLFormElement>, revalidarErros = false) {
    const alvo = evento.target as HTMLInputElement;
    if (!alvo.name) return;
    const novos = errosSchema(schema, ler(evento.currentTarget));
    definirErros((atuais) => ({
      ...atuais,
      ...(revalidarErros
        ? Object.fromEntries(Object.keys(atuais).map((nome) => [nome, novos[nome] ?? '']))
        : {}),
      [alvo.name]: novos[alvo.name] ?? '',
    }));
  }
  return {
    erros,
    limpar: () => definirErros({}),
    idErro: (nome: string) => `${id}-${nome}-erro`,
    validar,
    campo,
    eventos: {
      noValidate: true,
      onBlur: (evento: FormEvent<HTMLFormElement>) => aoSair(evento),
      onChange: (evento: FormEvent<HTMLFormElement>) => {
        if (Object.values(erros).some(Boolean)) aoSair(evento, true);
      },
    },
  };
}
