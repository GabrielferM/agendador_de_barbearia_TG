import { Barbeiro } from "./components/Barbeiros";
import { Cabecalho } from "./components/Cabecalho";
import { Diferenciais, type Diferencial } from "./components/Diferenciais";
import { Sobre } from "./components/sobre";
import { Contato } from "./components/contato";
import { useRascunhoAgendamento } from "../agendamento/rascunho-agendamento";
import { rascunhoInicial } from "../agendamento/estado-agendamento";
import { useNavigate } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Servicos } from "./components/Servicos";
import { useBarbeirosInicio } from "./hooks/use-barbeiros-inicio";
import { useServicosInicio } from "./hooks/use-servicos-inicio";

const diferenciais: Diferencial[] = [
  {
    icone: "▣",
    titulo: "Agendamento online",
    descricao: "Rápido e prático",
  },
  {
    icone: "♙",
    titulo: "Profissionais",
    descricao: "Conheça nossa equipe",
  },
  {
    icone: "✦",
    titulo: "Ambiente",
    descricao: "Um espaço para seu cuidado",
  },
];

export function Inicio() {
  const { alterar } = useRascunhoAgendamento();
  const navigate = useNavigate();
  const servicos = useServicosInicio();
  const barbeiros = useBarbeirosInicio();

  return (
    <main className="pagina-inicio min-h-screen bg-background text-foreground">
      <div className="mx-auto overflow-hidden bg-surface shadow-sm">
        <section className="bg-primary px-5 py-5 text-white sm:px-8 lg:px-12 lg:py-7">
          <div className="mx-auto inicio-container">
            <Cabecalho />
            <Hero />
            <Diferenciais itens={diferenciais} />
          </div>
        </section>
        <Servicos
          carregando={servicos.isLoading}
          comErro={servicos.comErro}
          itens={servicos.itens}
          tentar={() => void servicos.refetch()}
          agendar={(id) => {
            alterar({
              tipo: "atualizar",
              dados: {
                ...rascunhoInicial,
                idFilial: undefined,
                idBarbeiro: undefined,
                servicoIds: [id],
              },
            });
            navigate("/agendar");
          }}
        />
        <Barbeiro
          carregando={barbeiros.isLoading}
          comErro={barbeiros.comErro}
          itens={barbeiros.itens}
          tentar={() => void barbeiros.refetch()}
        />
        <Sobre />
        <Contato />
      </div>
    </main>
  );
}
