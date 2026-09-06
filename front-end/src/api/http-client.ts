function lerCookie(nome: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${nome}=`))
    ?.slice(nome.length + 1)
}

export async function httpClient<T>(url: string, options: RequestInit): Promise<T> {
  const headers = new Headers(options.headers)
  const metodo = (options.method ?? 'GET').toUpperCase()
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo) && !url.endsWith('/auth/login')) {
    const csrf = lerCookie('__Host-csrf') ?? lerCookie('csrf')
    if (csrf) headers.set('X-CSRF-Token', csrf)
  }
  const response = await fetch(url, { ...options, headers, credentials: 'include' })
  const texto = [204, 205, 304].includes(response.status) ? '' : await response.text()
  let data: unknown = {}
  if (texto) {
    try { data = JSON.parse(texto) } catch { data = {} }
  }
  return { data, status: response.status, headers: response.headers } as T
}
