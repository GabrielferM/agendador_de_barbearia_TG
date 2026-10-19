import { Link } from "react-router-dom";


export function Cabecalho() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white">
        <span
          aria-hidden="true"
          className="grid size-11 2xl:size-14 place-items-center rounded-full border border-secondary text-2xl text-secondary"
        >
          ✂
        </span>
        <span className="leading-none">
          <strong className="block font-serif text-lg tracking-wide sm:text-xl 2xl:text-2xl">
            CORTE CERTO
          </strong>
          <span className="block pt-1 text-[0.65rem] font-semibold tracking-[0.28em] text-white">
            BARBEARIA
          </span>
        </span>
      </div>

      <Link
        className="cursor-pointer rounded-lg border border-secondary bg-secondary px-4 py-3 text-xs font-bold xl:text-sm 2xl:text-base text-foreground transition-colors hover:bg-surface sm:px-5 2xl:px-7 2xl:py-4"
        to="/login"
      >
        Login
      </Link>
    </header>
  );
}
