import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { mensagemErro } from "../../../agendamento/services/agendamento-api";
import { DialogoOperacao } from "./dialogo-operacao";
import type { Registro } from "../services/operacoes-api";
export interface CampoCadastro {
  nome: string;
  rotulo: string;
  tipo?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "boolean";
  obrigatorio?: boolean;
  minimo?: number;
  maximo?: number;
  passo?: string;
  opcoes?: { valor: string; rotulo: string }[];
  leitura?: boolean;
}
const classe =
  "mt-1 block w-full rounded-lg border border-border bg-surface p-2 focus-visible:outline-primary disabled:opacity-60";
export function FormularioCadastro({
  titulo,
  campos,
  inicial = {},
  salvar,
  salvo,
  fechar,
  confirmacao,
}: {
  confirmacao?: string;
  titulo: string;
  campos: CampoCadastro[];
  inicial?: Registro;
  salvar: (dados: Registro) => Promise<unknown>;
  salvo: () => Promise<void>;
  fechar: () => void;
}) {
  const [sujo, definirSujo] = useState(false);
  const mutacao = useMutation({
    mutationFn: salvar,
    retry: false,
    onSuccess: salvo,
  });
  return (
    <DialogoOperacao
      titulo={titulo}
      aberto
      fechar={fechar}
      pendente={mutacao.isPending}
      sujo={sujo}
    >
      <form
        onChange={() => definirSujo(true)}
        onSubmit={(e) => {
          e.preventDefault();
          if (
            mutacao.isPending ||
            (confirmacao && !window.confirm(confirmacao))
          )
            return;
          const form = new FormData(e.currentTarget);
          const dados: Registro = {};
          campos
            .filter((campo) => !campo.leitura)
            .forEach((campo) => {
              const valor = String(form.get(campo.nome) ?? "");
              if (
                (campo.tipo === "password" || campo.tipo === "date") &&
                !valor
              )
                return;
              dados[campo.nome] =
                campo.tipo === "number"
                  ? Number(valor)
                  : campo.tipo === "boolean"
                    ? valor === "true"
                    : valor;
            });
          mutacao.mutate(dados);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {campos.map((campo) => {
            const valor = inicial[campo.nome];
            const padrao =
              campo.tipo === "password"
                ? ""
                : campo.tipo === "date" && typeof valor === "string"
                  ? valor.slice(0, 10)
                  : String(valor ?? "");
            const props = {
              name: campo.nome,
              required: campo.obrigatorio,
              disabled: mutacao.isPending || campo.leitura,
              defaultValue: padrao,
              className: classe,
            };
            return (
              <label key={campo.nome} className="text-sm font-semibold">
                {campo.rotulo}
                {campo.obrigatorio && " *"}
                {campo.tipo === "textarea" ? (
                  <textarea {...props} rows={3} />
                ) : campo.tipo === "select" || campo.tipo === "boolean" ? (
                  <select {...props}>
                    <option value="">Selecione</option>
                    {campo.opcoes?.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...props}
                    type={campo.tipo ?? "text"}
                    min={campo.tipo === "number" ? campo.minimo : undefined}
                    max={campo.tipo === "number" ? campo.maximo : undefined}
                    minLength={campo.tipo === "password" ? 15 : campo.minimo}
                    maxLength={campo.tipo === "password" ? 128 : campo.maximo}
                    step={campo.passo}
                    autoComplete={
                      campo.tipo === "password" ? "new-password" : undefined
                    }
                  />
                )}
              </label>
            );
          })}
        </div>
        {mutacao.isError && (
          <p role="alert" className="mt-4 text-danger">
            {mensagemErro(mutacao.error)}
          </p>
        )}
        <Button type="submit" className="mt-5" isDisabled={mutacao.isPending}>
          {mutacao.isPending ? "Salvando…" : "Salvar"}
        </Button>
      </form>
    </DialogoOperacao>
  );
}
export function ConfirmarExclusao({
  nome,
  excluir,
  salvo,
  fechar,
}: {
  nome: string;
  excluir: () => Promise<unknown>;
  salvo: () => Promise<void>;
  fechar: () => void;
}) {
  const mutacao = useMutation({
    mutationFn: excluir,
    retry: false,
    onSuccess: salvo,
  });
  return (
    <DialogoOperacao
      titulo="Confirmar exclusão"
      aberto
      fechar={fechar}
      pendente={mutacao.isPending}
    >
      <p>
        Excluir {nome}? Registros vinculados permanecem protegidos pelo
        servidor.
      </p>
      {mutacao.isError && (
        <p role="alert" className="my-3 text-danger">
          {mensagemErro(mutacao.error)}
        </p>
      )}
      <Button
        className="mt-5"
        isDisabled={mutacao.isPending}
        onPress={() => mutacao.mutate()}
      >
        {mutacao.isPending ? "Excluindo…" : "Confirmar exclusão"}
      </Button>
    </DialogoOperacao>
  );
}
