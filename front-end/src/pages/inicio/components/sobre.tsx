import { Link } from "react-router-dom";
import ambiente from "../../../assets/sobre-ambiente.png";
import detalhes from "../../../assets/sobre-detalhes.png";

const DESTAQUES = [
  {
    titulo: "Seu estilo em primeiro lugar",
    descricao: "Espaço para conversar sobre suas preferências.",
  },
  {
    titulo: "Escolhas com clareza",
    descricao: "Serviços, duração e preços disponíveis antes de agendar.",
  },
  {
    titulo: "Praticidade na rotina",
    descricao: "Escolha o profissional e consulte os horários online.",
  },
];

export function Sobre() {
  return (
    <section
      id="sobre"
      aria-labelledby="titulo-sobre"
      className="px-5 py-12 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="inicio-container mx-auto grid items-center gap-10 lg:grid-cols-2 xl:gap-16 2xl:gap-20">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Cuidado em cada detalhe
          </p>
          <h2
            id="titulo-sobre"
            className="mt-3 font-serif text-3xl font-bold sm:text-4xl 2xl:text-5xl"
          >
            Sobre a Corte Certo
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 2xl:text-lg 2xl:leading-8">
            <p>
              Na Corte Certo, cuidar do visual começa por entender o que combina
              com você. Cada atendimento é uma oportunidade de conversar sobre
              suas preferências e dar atenção aos detalhes do corte e da barba.
            </p>
            <p>
              Queremos tornar esse cuidado mais simples na sua rotina. Aqui,
              você pode conhecer os serviços, escolher seu profissional e
              consultar os horários disponíveis antes de agendar.
            </p>
          </div>
          <ul className="mt-8 space-y-5 border-t border-border pt-6">
            {DESTAQUES.map(({ titulo, descricao }) => (
              <li key={titulo} className="border-l-2 border-secondary pl-4">
                <h3 className="font-semibold text-primary 2xl:text-lg">{titulo}</h3>
                <p className="mt-1 text-sm leading-6 2xl:text-base">{descricao}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/agendar"
            className="mt-8 inline-flex max-w-full items-center justify-center rounded-lg border border-primary bg-primary px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-primary-hover xl:text-base 2xl:px-8 2xl:py-4"
          >
            Agendar meu atendimento
          </Link>
        </div>
        <div className="grid min-w-0 grid-cols-6 gap-4 lg:col-start-1 lg:row-start-1 xl:gap-6">
          <img
            src={ambiente}
            alt="Interior de barbearia com cadeira de couro marrom, espelho e detalhes dourados"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="col-span-6 aspect-[3/2] w-full rounded-2xl border border-border object-cover"
          />
          <img
            src={detalhes}
            alt="Tesoura, pente e toalha sobre uma bancada de madeira"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="col-span-4 col-start-3 aspect-[3/2] w-full rounded-2xl border border-border object-cover"
          />
        </div>
      </div>
    </section>
  );
}
