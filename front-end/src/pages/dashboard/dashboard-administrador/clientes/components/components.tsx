import {
  BadgeStatus,
  BotaoIndisponivel,
  CampoVisual,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type { ClienteAdministrativo } from "../types";

export function IndicadoresClientes() {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples titulo="Clientes ativos" valor="342" icone="usuarios" />
      <IndicadorSimples titulo="Novos neste mês" valor="14" icone="usuarios" />
      <IndicadorSimples titulo="Retorno agendado" valor="27" icone="agenda" />
    </div>
  );
}

export function TabelaClientes({
  clientes,
}: {
  clientes: ClienteAdministrativo[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="font-serif text-xl font-bold">Lista de clientes</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              {[
                "Cliente",
                "Telefone",
                "E-mail",
                "Último atendimento",
                "Próximo horário",
                "Status",
                "Ações",
              ].map((item) => (
                <th
                  className="border-b border-border pb-3 font-medium"
                  key={item}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-border">
                <td className="py-4 font-semibold">{cliente.nome}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>{cliente.ultimoAtendimento}</td>
                <td>{cliente.proximoHorario ?? "—"}</td>
                <td>
                  <BadgeStatus negativo={!cliente.ativo}>
                    {cliente.ativo ? "Ativo" : "Inativo"}
                  </BadgeStatus>
                </td>
                <td>
                  <button
                    disabled
                    title="Disponível na integração real"
                    className="cursor-not-allowed text-primary opacity-60"
                  >
                    Visualizar · Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
        <p>Mostrando 1 a 5 de 87 clientes</p>
        <div className="flex gap-2">
          <BotaoIndisponivel>‹</BotaoIndisponivel>
          <BotaoIndisponivel destaque>1</BotaoIndisponivel>
          <BotaoIndisponivel>2</BotaoIndisponivel>
          <BotaoIndisponivel>3</BotaoIndisponivel>
        </div>
      </div>
    </section>
  );
}

export function ControlesClientes() {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row">
      <CampoVisual placeholder="Buscar por nome, telefone ou e-mail" />
      <BotaoIndisponivel>Filtros</BotaoIndisponivel>
      <BotaoIndisponivel destaque>+ Novo cliente</BotaoIndisponivel>
    </div>
  );
}
