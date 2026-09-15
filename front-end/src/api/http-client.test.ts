import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ErroRespostaHttpInvalida,
  EVENTO_SESSAO_EXPIRADA,
  httpClient,
} from './http-client'

describe('httpClient', () => {
  afterEach(() => { vi.unstubAllGlobals(); document.cookie = 'csrf=; Max-Age=0; Path=/' })

  it('inclui cookies e envia CSRF somente em operações mutáveis autenticadas', async () => {
    document.cookie = 'csrf=token-assinado; Path=/'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))
    await httpClient('/agendamentos/1', { method: 'PATCH' })
    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options?.credentials).toBe('include')
    expect(new Headers(options?.headers).get('X-CSRF-Token')).toBe('token-assinado')
  })

  it('não envia CSRF no login', async () => {
    document.cookie = 'csrf=token-assinado; Path=/'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))
    await httpClient('/auth/login', { method: 'POST' })
    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(new Headers(options?.headers).has('X-CSRF-Token')).toBe(false)
  })

  it('rejeita resposta de sucesso com corpo não JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('html inesperado', { status: 200 })))

    await expect(httpClient('/publico/servicos', { method: 'GET' })).rejects.toBeInstanceOf(
      ErroRespostaHttpInvalida,
    )
  })

  it('preserva status e headers de erro mesmo quando o corpo não é JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('indisponível', { status: 503, headers: { 'Retry-After': '10' } }),
        ),
    )

    const resposta = await httpClient<{ data: unknown; status: number; headers: Headers }>(
      '/health',
      { method: 'GET' },
    )

    expect(resposta.data).toEqual({})
    expect(resposta.status).toBe(503)
    expect(resposta.headers.get('Retry-After')).toBe('10')
  })

  it('emite expiração de sessão em 401 fora do login', async () => {
    const listener = vi.fn()
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, listener)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'expirada' }), { status: 401 })),
    )

    await httpClient('/dashboard/administrador', { method: 'GET' })

    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener(EVENTO_SESSAO_EXPIRADA, listener)
  })
})
