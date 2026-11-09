import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationArguments } from 'class-validator';

export function aniversarioValido(dia: unknown, mes: unknown): boolean {
  if (dia === undefined && mes === undefined) return true;
  if (dia === null && mes === null) return true;
  if (
    typeof dia !== 'number' ||
    typeof mes !== 'number' ||
    !Number.isInteger(dia) ||
    !Number.isInteger(mes)
  )
    return false;
  return (
    mes >= 1 &&
    mes <= 12 &&
    dia >= 1 &&
    dia <= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1]
  );
}

// Executa inclusive quando apenas um dos dois campos foi informado.
export function AniversarioValido() {
  return (alvo: object, propriedade: string) =>
    registerDecorator({
      name: 'aniversarioValido',
      target: alvo.constructor,
      propertyName: propriedade,
      options: { message: 'Informe dia e mês de aniversário válidos, ou deixe ambos vazios.' },
      validator: {
        validate: (_valor: unknown, args: ValidationArguments) => {
          const dados = args.object as {
            diaAniversario?: number | null;
            mesAniversario?: number | null;
          };
          return aniversarioValido(dados.diaAniversario, dados.mesAniversario);
        },
      },
    });
}

export function validarAniversario(dados: {
  diaAniversario?: number | null;
  mesAniversario?: number | null;
}) {
  if (!aniversarioValido(dados.diaAniversario, dados.mesAniversario))
    throw new BadRequestException('Aniversário inválido.');
}
