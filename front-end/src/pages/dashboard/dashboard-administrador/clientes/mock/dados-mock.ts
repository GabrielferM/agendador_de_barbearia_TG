import type { ClienteAdministrativo } from "../types";

export const clientesMock: ClienteAdministrativo[] = [
  {
    id: 1,
    nome: "Matheus Lima",
    telefone: "(11) 98765-4321",
    email: "matheus.lima@email.com",
    ultimoAtendimento: "05/09/2026",
    proximoHorario: "12/09/2026 - 14:00",
    ativo: true,
  },
  {
    id: 2,
    nome: "Fernanda Alves",
    telefone: "(11) 91234-5678",
    email: "fernanda.alves@email.com",
    ultimoAtendimento: "07/09/2026",
    proximoHorario: "10/09/2026 - 15:30",
    ativo: true,
  },
  {
    id: 3,
    nome: "Ricardo Souza",
    telefone: "(21) 99876-5432",
    email: "ricardo.souza@email.com",
    ultimoAtendimento: "03/09/2026",
    ativo: false,
  },
  {
    id: 4,
    nome: "Thiago Martins",
    telefone: "(31) 98765-6789",
    email: "thiago.martins@email.com",
    ultimoAtendimento: "06/09/2026",
    proximoHorario: "09/09/2026 - 18:30",
    ativo: true,
  },
  {
    id: 5,
    nome: "Amanda Rocha",
    telefone: "(11) 93456-7890",
    email: "amanda.rocha@email.com",
    ultimoAtendimento: "07/09/2026",
    proximoHorario: "14/09/2026 - 20:00",
    ativo: true,
  },
];
