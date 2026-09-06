import { afterEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './http-client'

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
})
