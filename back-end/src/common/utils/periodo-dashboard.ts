const formatadorData = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Início do dia comercial da barbearia. O Brasil não adota horário de verão desde 2019. */
export function inicioDiaBarbearia(data: Date) {
  const partes = Object.fromEntries(
    formatadorData
      .formatToParts(data)
      .filter((parte) => parte.type !== 'literal')
      .map((parte) => [parte.type, parte.value]),
  );
  return new Date(`${partes.year}-${partes.month}-${partes.day}T00:00:00-03:00`);
}

export function adicionarDias(data: Date, dias: number) {
  const copia = new Date(data);
  copia.setUTCDate(copia.getUTCDate() + dias);
  return copia;
}

export function inicioMesBarbearia(data: Date) {
  const inicio = inicioDiaBarbearia(data);
  return new Date(`${inicio.toISOString().slice(0, 7)}-01T00:00:00-03:00`);
}

export function chaveDiaBarbearia(data: Date) {
  return inicioDiaBarbearia(data).toISOString().slice(0, 10);
}

/** Converte datas de filtros sem deixar uma data ISO sem horário recuar um dia no fuso local. */
export function dataConsultaBarbearia(valor: string) {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(valor) ? `${valor}T12:00:00-03:00` : valor);
}
