import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import type { TaxaBarbeiroDto } from "../../../api/models";
import {
  Cartao,
  EstadoCarregamento,
  EstadoErro,
} from "../components/dashboard-compartilhado";
import {
  estiloBotao,
  estiloCampo,
} from "../dashboard-administrador/components/formulario-cadastro";
import { PaginacaoFinanceira } from "./comissoes-painel";
import { configurarTaxa, consultarTaxas } from "./financeiro-api";

function EdicaoTaxa({
  barbeiro,
  atualizar,
}: {
  barbeiro: TaxaBarbeiroDto;
  atualizar: () => Promise<void>;
}) {
  const [percentual, definirPercentual] = useState(barbeiro.percentual ?? "");
  const salvar = useMutation({
    mutationFn: (taxa: number) => configurarTaxa(barbeiro.id, taxa),
    onSuccess: atualizar,
  });
  return (
    <form
      className="flex flex-wrap items-end gap-2 border-b border-border py-3"
      onSubmit={(evento) => {
        evento.preventDefault();
        const taxa = Number(percentual);
        if (!salvar.isPending && percentual !== "" && taxa >= 0 && taxa <= 100)
          salvar.mutate(taxa);
      }}
    >
      <label className="grid flex-1 gap-1 text-sm">
        {barbeiro.nome} ·{" "}
        {barbeiro.percentual === null
          ? "Sem taxa definida"
          : `${Number(barbeiro.percentual).toLocaleString("pt-BR")}% configurado`}
        <input
          type="number"
          inputMode="decimal"
          required
          min="0"
          max="100"
          step="0.01"
          className={estiloCampo}
          value={percentual}
          disabled={salvar.isPending}
          onChange={(evento) => {
            definirPercentual(evento.target.value);
            salvar.reset();
          }}
        />
      </label>
      <button
        type="submit"
        className={estiloBotao}
        disabled={
          salvar.isPending ||
          percentual === "" ||
          Number(percentual) === Number(barbeiro.percentual ?? NaN)
        }
      >
        {salvar.isPending ? "Salvando…" : "Salvar percentual"}
      </button>
      {salvar.isError && (
        <p className="w-full text-sm text-danger" role="alert">
          {salvar.error.message}
        </p>
      )}
      {salvar.isSuccess && (
        <p className="w-full text-sm text-success" role="status">
          Percentual salvo.
        </p>
      )}
    </form>
  );
}

export function TaxasComissao() {
  const [pagina, definirPagina] = useState(1);
  const { usuario } = useAutenticacao();
  const cache = useQueryClient();
  const chave = ["financeiro-taxas", usuario?.id];
  const consulta = useQuery({
    queryKey: [...chave, pagina],
    queryFn: ({ signal }) => consultarTaxas(pagina, signal),
    retry: false,
  });
  return (
    <Cartao titulo="Percentual por barbeiro">
      <p className="mb-2 text-sm">
        A taxa vale para as próximas conclusões. Configure 0% quando não houver
        comissão.
      </p>
      {consulta.isPending ? (
        <EstadoCarregamento />
      ) : consulta.isError ? (
        <EstadoErro
          mensagem={consulta.error.message}
          tentarNovamente={() => void consulta.refetch()}
        />
      ) : (
        <>
          {!consulta.data.itens.length && <p>Nenhum barbeiro cadastrado.</p>}
          {consulta.data.itens.map((barbeiro) => (
            <EdicaoTaxa
              key={barbeiro.id}
              barbeiro={barbeiro}
              atualizar={() => cache.invalidateQueries({ queryKey: chave })}
            />
          ))}
          <PaginacaoFinanceira
            pagina={pagina}
            total={consulta.data.totalPaginas}
            alterar={definirPagina}
          />
        </>
      )}
    </Cartao>
  );
}
