import { useEffect, useId, useRef, useState } from 'react';
import { useDialogoAdministrativo } from './contexto-dialogo';
import type { ReactNode, FormEvent } from 'react';
import type { AnyObjectSchema } from 'yup';
import {
  errosSchema,
  focarPrimeiroErro,
  formatarCampo,
} from '../../../../forms/campos';
import { ErroCampo } from '../../../../forms/erro-campo';

export interface CampoCadastro {
  nome: string;
  rotulo: string;
  tipo?:
    | 'text'
    | 'email'
    | 'password'
    | 'date'
    | 'number'
    | 'url'
    | 'tel'
    | 'textarea';
  larguraCompleta?: boolean;
  obrigatorio?: boolean;
  minimo?: number;
  maximo?: number;
  passo?: string;
  tamanhoMinimo?: number;
  grupo?: string;
  opcoes?: { valor: string; rotulo: string }[];
  descricao?: string;
}
export const estiloCampo =
  'min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60';
export const estiloBotao =
  'rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';
export function FormularioCadastro({
  campos,
  valores,
  schema,
  pendente,
  erro,
  somenteLeitura = false,
  salvar,
  fechar,
  acoes,
}: {
  campos: CampoCadastro[];
  valores: Record<string, string>;
  schema: AnyObjectSchema;
  pendente: boolean;
  erro?: string;
  somenteLeitura?: boolean;
  salvar: (dados: Record<string, string>) => unknown;
  fechar: () => void;
  acoes?: ReactNode;
}) {
  const [dados, setDados] = useState(() =>
    Object.fromEntries(
      campos.map((c) => [c.nome, formatarCampo(c.nome, valores[c.nome] ?? '')]),
    ),
  );
  const [iniciais] = useState(() =>
    Object.fromEntries(
      campos.map((c) => [c.nome, formatarCampo(c.nome, valores[c.nome] ?? '')]),
    ),
  );
  const dialogo = useDialogoAdministrativo();
  const definirAlterado = dialogo?.definirAlterado;
  const refFormulario = useRef<HTMLFormElement>(null);
  useEffect(() => {
    refFormulario.current
      ?.querySelector<HTMLElement>(
        'input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button',
      )
      ?.focus();
  }, []);
  useEffect(() => {
    definirAlterado?.(
      !somenteLeitura &&
        Object.keys(iniciais).some((nome) => dados[nome] !== iniciais[nome]),
    );
    return () => definirAlterado?.(false);
  }, [dados, iniciais, somenteLeitura, definirAlterado]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const ocupado = useRef(false);
  const idFormulario = useId();
  function validarCampo(nome: string, valoresAtuais = dados) {
    const novos = errosSchema(schema, valoresAtuais);
    setErros((atuais) => ({
      ...atuais,
      [nome]: novos[nome] ?? '',
      ...(nome.endsWith('Aniversario')
        ? {
            diaAniversario: novos.diaAniversario ?? '',
            mesAniversario: novos.mesAniversario ?? '',
          }
        : {}),
    }));
  }
  function atualizar(nome: string, valor: string) {
    const novos = { ...dados, [nome]: formatarCampo(nome, valor) };
    setDados(novos);
    if (erros[nome]) validarCampo(nome, novos);
  }
  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (pendente || ocupado.current || somenteLeitura) return;
    const novos = errosSchema(schema, dados);
    setErros(novos);
    if (Object.keys(novos).length) {
      focarPrimeiroErro(evento.currentTarget, novos);
      return;
    }
    ocupado.current = true;
    try {
      await salvar(
        schema.cast(dados, { stripUnknown: true }) as Record<string, string>,
      );
    } catch {
      /* A mutação mantém o erro para exibição e preserva os valores. */
    } finally {
      ocupado.current = false;
    }
  }
  function renderizarCampo(c: CampoCadastro) {
    const id = `${idFormulario}-${c.nome}`;
    const props = {
      id,
      name: c.nome,
      'aria-labelledby': `${id}-rotulo`,
      'aria-invalid': Boolean(erros[c.nome]),
      'aria-describedby':
        [
          c.descricao ? `${id}-descricao` : '',
          erros[c.nome] ? `${id}-erro` : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      className: estiloCampo,
      disabled: pendente || somenteLeitura,
      required: c.obrigatorio,
      value: dados[c.nome] ?? '',
      onBlur: () => {
        if (!somenteLeitura) validarCampo(c.nome);
      },
    };
    return (
      <div
        key={c.nome}
        className={`flex min-w-0 flex-col gap-1.5 self-start text-sm ${c.larguraCompleta || c.tipo === 'textarea' ? 'sm:col-span-2' : ''}`}
      >
        <label id={`${id}-rotulo`} htmlFor={id}>
          {c.rotulo}
        </label>
        {c.opcoes ? (
          <select
            {...props}
            onChange={(e) => atualizar(c.nome, e.target.value)}
          >
            <option value="">Selecione</option>
            {c.opcoes.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        ) : c.tipo === 'textarea' ? (
          <textarea
            {...props}
            rows={3}
            onChange={(e) => atualizar(c.nome, e.target.value)}
          />
        ) : (
          <input
            {...props}
            type={c.nome === 'telefone' ? 'tel' : (c.tipo ?? 'text')}
            inputMode={
              ['cpf', 'cnpj', 'cep'].includes(c.nome) ? 'numeric' : undefined
            }
            min={c.minimo}
            max={c.maximo}
            step={c.passo}
            minLength={c.tamanhoMinimo}
            autoComplete={c.tipo === 'password' ? 'new-password' : undefined}
            onChange={(e) => atualizar(c.nome, e.target.value)}
          />
        )}
        {c.descricao && (
          <span id={`${id}-descricao`} className="text-xs text-muted">
            {c.descricao}
          </span>
        )}
        <ErroCampo id={`${id}-erro`} mensagem={erros[c.nome]} />
      </div>
    );
  }
  return (
    <form
      ref={refFormulario}
      noValidate
      onSubmit={(evento) => void enviar(evento)}
      aria-busy={pendente}
      className="grid min-w-0 items-start gap-4 sm:grid-cols-2"
      aria-label={
        somenteLeitura ? 'Detalhes do cadastro' : 'Formulário de cadastro'
      }
    >
      {campos.map((c, indice) => {
        if (!c.grupo) return renderizarCampo(c);
        if (
          campos.slice(0, indice).some((anterior) => anterior.grupo === c.grupo)
        )
          return null;
        return (
          <fieldset
            key={c.grupo}
            className="grid min-w-0 items-start gap-4 sm:col-span-2 sm:grid-cols-2"
          >
            <legend className="mb-1 text-sm font-semibold">{c.grupo}</legend>
            {campos
              .filter((campo) => campo.grupo === c.grupo)
              .map(renderizarCampo)}
          </fieldset>
        );
      })}
      {erro && (
        <p role="alert" className="sm:col-span-2">
          {erro}
        </p>
      )}
      <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-border bg-surface py-3 sm:col-span-2">
        {acoes}
        {!somenteLeitura && (
          <button className={estiloBotao} disabled={pendente} type="submit">
            {pendente ? 'Salvando…' : 'Salvar'}
          </button>
        )}
        <button
          className={estiloBotao}
          disabled={pendente}
          type="button"
          onClick={dialogo?.solicitarFechamento ?? fechar}
        >
          {somenteLeitura ? 'Fechar' : 'Cancelar'}
        </button>
      </div>
    </form>
  );
}
