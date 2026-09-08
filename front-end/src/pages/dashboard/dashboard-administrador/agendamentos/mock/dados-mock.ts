import type { DiaAgenda } from "../types";

const pessoas = [
  ["Matheus Lima", "Corte + barba", "João da Silva"],
  ["Fernanda Alves", "Corte de cabelo", "Carlos Almeida"],
  ["Ricardo Souza", "Barba", "Gabriel Santos"],
  ["Amanda Rocha", "Corte de cabelo", "João da Silva"],
  ["Lucas Ferreira", "Corte + sobrancelha", "Rafael Costa"],
];

export const agendaSemanalMock: DiaAgenda[] = [
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
].map((dia, indice) => ({
  data: `2026-09-${dia}T12:00:00-03:00`,
  rotulo: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][indice],
  agendamentos: pessoas
    .slice(0, indice % 2 ? 4 : 5)
    .map(([cliente, servico, barbeiro], item) => ({
      id: indice * 10 + item,
      inicio: `2026-09-${dia}T${String(9 + item * 2).padStart(2, "0")}:00:00-03:00`,
      cliente,
      servico,
      barbeiro,
      status:
        item === 2 ? "PENDENTE" : item === 3 ? "EM_ATENDIMENTO" : "CONFIRMADO",
    })),
}));
