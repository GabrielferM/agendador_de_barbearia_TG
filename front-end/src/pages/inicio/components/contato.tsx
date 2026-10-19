const CONTATOS_DEMONSTRATIVOS = [
  { titulo: "Telefone e WhatsApp", valor: "(00) 00000-0000" },
  { titulo: "E-mail", valor: "contato@example.com" },
  { titulo: "Endereço", valor: "Rua Exemplo, 123 — Cidade Exemplo" },
  { titulo: "Horário de funcionamento", valor: "Terça a sábado, das 9h às 18h" },
];

export function Contato() {
  return (
    <section id="contato" className="bg-primary px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto inicio-container">
        <p className="text-xs font-bold uppercase tracking-widest text-white">Contatos demonstrativos</p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl 2xl:text-5xl">Contato</h2>
        <p className="mt-4 max-w-2xl 2xl:max-w-3xl text-sm leading-6 xl:text-base 2xl:text-lg 2xl:leading-7">
          Os dados abaixo são exemplos ilustrativos. Os canais de atendimento,
          o endereço e o horário reais ainda precisam ser informados.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTATOS_DEMONSTRATIVOS.map(({ titulo, valor }) => (
            <div key={titulo} className="border-t border-secondary pt-4">
              <dt className="font-semibold">{titulo}</dt>
              <dd className="mt-2 break-words text-sm leading-6 xl:text-base 2xl:text-lg 2xl:leading-7">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
