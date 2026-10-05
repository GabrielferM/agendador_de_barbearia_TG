import { Link } from "react-router-dom";
export function Disponibilidade() {
  return (
    <section className="flex flex-col items-center justify-between gap-5 bg-primary px-5 py-6 text-center text-white sm:flex-row sm:px-8 sm:text-left lg:px-12">
      <div>
        <p className="font-semibold">Encontre um horário para você</p>
        <p className="mt-1 text-sm">
          Escolha seus serviços e consulte a disponibilidade da equipe.
        </p>
      </div>
      <Link
        className="rounded-lg border border-secondary px-5 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-white"
        to="/agendar"
      >
        Ver disponibilidade
      </Link>
    </section>
  );
}
