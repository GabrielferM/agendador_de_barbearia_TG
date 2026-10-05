import { BadRequestException } from '@nestjs/common';

export const expediente = {
  fuso: 'America/Sao_Paulo',
  aberturaMinutos: 9 * 60,
  fechamentoMinutos: 18 * 60,
  intervaloMinutos: 30,
  dias: [1, 2, 3, 4, 5, 6] as readonly number[],
};

export function dataLocal(data: Date): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: expediente.fuso,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data);
  const parte = (tipo: string) => partes.find((item) => item.type === tipo)!.value;
  return `${parte('year')}-${parte('month')}-${parte('day')}`;
}

/** Resolve o instante pela zona IANA, sem depender do fuso do processo. */
export function instanteLocal(data: string, minutos: number): Date {
  const referencia = new Date(`${data}T00:00:00Z`).getTime() + minutos * 60000;
  let instante = referencia;
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: expediente.fuso,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(instante));
    const parte = (tipo: string) => partes.find((item) => item.type === tipo)!.value;
    const representado = Date.parse(
      `${parte('year')}-${parte('month')}-${parte('day')}T${parte('hour')}:${parte('minute')}:${parte('second')}Z`,
    );
    instante += referencia - representado;
  }
  return new Date(instante);
}

export function validarDia(data: string): void {
  const dia = new Date(`${data}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
    Number.isNaN(dia.getTime()) ||
    dia.toISOString().slice(0, 10) !== data
  )
    throw new BadRequestException('Data inválida.');
}

export function diaAberto(data: string): boolean {
  return expediente.dias.includes(new Date(`${data}T12:00:00Z`).getUTCDay());
}

export function validarExpediente(inicio: Date, fim: Date, agora = new Date()): void {
  const dia = dataLocal(inicio);
  const abertura = instanteLocal(dia, expediente.aberturaMinutos);
  const fechamento = instanteLocal(dia, expediente.fechamentoMinutos);
  if (
    inicio <= agora ||
    fim <= inicio ||
    !diaAberto(dia) ||
    inicio < abertura ||
    fim > fechamento ||
    (inicio.getTime() - abertura.getTime()) % (expediente.intervaloMinutos * 60000) !== 0
  )
    throw new BadRequestException(
      'Escolha um horário futuro dentro do expediente, em intervalos de 30 minutos.',
    );
}

export function duracaoItens(
  itens: { duracaoAplicadaMinutos: number; quantidade: number }[],
): number {
  return itens.reduce((total, item) => total + item.duracaoAplicadaMinutos * item.quantidade, 0);
}
