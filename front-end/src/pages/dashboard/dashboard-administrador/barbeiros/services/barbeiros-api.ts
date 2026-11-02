import { barbeiroDashboardControllerObter } from "../../../../../api/dashboard-administrativo-barbeiros/dashboard-administrativo-barbeiros";
import { barbeiroControllerCriar } from "../../../../../api/barbeiros/barbeiros";
import { catalogoPublicoControllerFiliais } from "../../../../../api/catálogo-público/catálogo-público";
import {
  executarHttp,
  lista,
  registro,
  numero,
  texto,
} from "../../services/administracao-api";

export async function consultarFiliaisCadastro(signal?: AbortSignal) {
  const filiais: { id: number; nome: string }[] = [];
  let pagina = 1;
  let totalPaginas: number;
  do {
    const resposta = lista(
      await executarHttp(() => catalogoPublicoControllerFiliais({ pagina, limite: 100 }, { signal })),
      item => { const filial = registro(item); return { id: numero(filial.id), nome: texto(filial.nome) }; },
    );
    filiais.push(...resposta.data);
    totalPaginas = resposta.meta.totalPaginas;
    pagina++;
  } while (pagina <= totalPaginas);
  return filiais;
}

export function criarBarbeiro(dados: Record<string, string>) {
  const idFilial = Number(dados.idFilial);
  if (!Number.isInteger(idFilial) || idFilial <= 0) throw new Error("Selecione uma filial.");
  return executarHttp(() => barbeiroControllerCriar({
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    idFilial,
    nomeProfissional: dados.nomeProfissional || undefined,
    descricao: dados.descricao || undefined,
    fotoUrl: dados.fotoUrl || undefined,
    dataAdmissao: dados.dataAdmissao || undefined,
  }), 201);
}

export async function consultarBarbeiros(
  busca: string,
  status: string,
  pagina: number,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      barbeiroDashboardControllerObter(
        {
          busca,
          status: status
            ? (status as "ATIVO" | "INATIVO" | "AFASTADO")
            : undefined,
          pagina,
          limite: 12,
        },
        { signal },
      ),
    ),
  );
  const indicadores = registro(obj.indicadores);
  const geradoEm = texto(obj.geradoEm);
  if (!Number.isFinite(Date.parse(geradoEm)))
    throw new Error("Data de atualização inválida.");
  const dados = lista(obj, (item) => {
    const i = registro(item);
    if (!["ATIVO", "INATIVO", "AFASTADO"].includes(String(i.status)))
      throw new Error("Status profissional inválido.");
    return {
      id: numero(i.id),
      nome: texto(i.nome),
      filial: texto(i.filial),
      status: texto(i.status),
      atendimentosHoje: numero(i.atendimentosHoje),
      receitaMes: numero(i.receitaMes),
      comissoesRegistradasMes: numero(i.comissoesRegistradasMes),
      comissoesAPagar: numero(i.comissoesAPagar),
    };
  });
  return {
    ...dados,
    geradoEm,
    indicadores: {
      ativos: numero(indicadores.ativos),
      atendimentosMes: numero(indicadores.atendimentosMes),
      comissoesAPagar: numero(indicadores.comissoesAPagar),
    },
  };
}
