export function validarCpf(entrada: string) {
  const cpf = entrada.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    const soma = [...cpf.slice(0, tamanho)].reduce(
      (total, digito, indice) =>
        total + Number(digito) * (tamanho + 1 - indice),
      0,
    );
    const resto = soma % 11;
    if (Number(cpf[tamanho]) !== (resto < 2 ? 0 : 11 - resto)) return false;
  }
  return true;
}
export function mascararCpf(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}
export function mascararTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
}
