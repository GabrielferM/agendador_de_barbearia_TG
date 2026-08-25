function somenteDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

function validaDigitos(documento: string, tamanho: number, pesos: number[][]) {
  if (documento.length !== tamanho || /^(\d)\1+$/.test(documento)) return false;
  const base = documento.slice(0, -2);
  const digitos = pesos.map((pesosAtuais, indice) => {
    const soma = [...base, ...documento.slice(base.length, base.length + indice)].reduce(
      (total, digito, posicao) => total + Number(digito) * pesosAtuais[posicao],
      0,
    );
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  });
  return documento.endsWith(digitos.join(''));
}

export function normalizarCpf(cpf: string) {
  const valor = somenteDigitos(cpf);
  if (
    !validaDigitos(valor, 11, [
      [10, 9, 8, 7, 6, 5, 4, 3, 2],
      [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
    ])
  ) {
    throw new Error('CPF inválido.');
  }
  return valor;
}

export function normalizarCnpj(cnpj: string) {
  const valor = somenteDigitos(cnpj);
  if (
    !validaDigitos(valor, 14, [
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    ])
  ) {
    throw new Error('CNPJ inválido.');
  }
  return valor;
}

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}
