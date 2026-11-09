import * as yup from 'yup';
import { dataSchema, idSchema, motivoSchema } from './campos';
export const schemaPeriodo = yup.object({
  de: dataSchema.required('Informe a data inicial.'),
  ate: dataSchema
    .required('Informe a data final.')
    .test('periodo', 'Selecione um período válido de até 366 dias.', function (v) {
      const dias = (Date.parse(v) - Date.parse(this.parent.de)) / 86400000 + 1;
      return Number.isFinite(dias) && dias >= 1 && dias <= 366;
    }),
});
export const schemaCancelamento = yup.object({ motivo: motivoSchema });
export const schemaAgendamento = yup.object({
  idFilial: yup.number().integer().positive().required('Selecione uma filial.'),
  idBarbeiro: yup.number().integer().positive().required('Selecione um barbeiro.'),
  servicoIds: yup
    .array()
    .of(yup.number().integer().positive().required())
    .min(1, 'Selecione um serviço.')
    .required()
    .test('unicos', 'Selecione serviços distintos.', (v) => new Set(v).size === v.length),
  inicio: yup
    .string()
    .required('Selecione um horário.')
    .test(
      'futuro',
      'Selecione um horário futuro.',
      (v) => Number.isFinite(Date.parse(v)) && Date.parse(v) > Date.now(),
    ),
});
export const schemaFiltrosBarbeiro = (status: readonly string[]) =>
  schemaPeriodo.shape({
    pagina: idSchema,
    status: yup.string().oneOf(['', ...status], 'Selecione uma situação válida.'),
    cliente: yup
      .string()
      .test('cliente', 'Cliente inválido.', (v) => !v || idSchema.isValidSync(v)),
  });
