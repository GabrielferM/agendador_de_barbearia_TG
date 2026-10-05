import type { FilialPublicaDto } from "../../api/models";
export const moeda = (valor: number | string) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const horario = (valor: string) =>
  new Date(valor).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
export const dataHorario = (valor: string) =>
  new Date(valor).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "long",
    timeStyle: "short",
  });
export const endereco = (filial: FilialPublicaDto) =>
  `${filial.endereco.logradouro}, ${filial.endereco.numero} — ${filial.endereco.bairro}, ${filial.endereco.cidade}/${filial.endereco.estado}`;
