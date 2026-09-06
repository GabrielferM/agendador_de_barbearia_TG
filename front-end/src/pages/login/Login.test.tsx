import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Login } from '.'

function respostaJson(dados: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function renderizarLogin() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<h1>Área do cliente</h1>} path="/cliente" />
          <Route element={<h1>Área do barbeiro</h1>} path="/barbeiro" />
          <Route element={<h1>Área administrativa</h1>} path="/admin" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

async function preencherFormulario(email = 'pessoa@exemplo.com', senha = 'senha segura') {
  const usuario = userEvent.setup()
  await usuario.type(screen.getByLabelText('E-mail'), email)
  await usuario.type(screen.getByLabelText('Senha'), senha)
  return usuario
}

describe('Login', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renderiza os campos acessíveis e os fluxos auxiliares', () => {
    renderizarLogin()

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('autocomplete', 'username')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('autocomplete', 'current-password')
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute('href', '/recuperar-senha')
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute('href', '/cadastro')
  })

  it('mostra mensagens associadas aos campos obrigatórios', async () => {
    renderizarLogin()
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByText('Informe seu e-mail.')).toHaveAttribute('id', 'email-erro')
    expect(screen.getByText('Informe sua senha.')).toHaveAttribute('id', 'senha-erro')
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('aria-invalid', 'true')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('valida o formato do e-mail e permite mostrar ou ocultar a senha', async () => {
    renderizarLogin()
    const usuario = await preencherFormulario('email-invalido', 'segredo')

    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    await usuario.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true')

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('envia cookies, normaliza somente o e-mail e impede envio duplicado', async () => {
    let concluir!: (resposta: Response) => void
    const requisicaoPendente = new Promise<Response>((resolve) => {
      concluir = resolve
    })
    vi.mocked(fetch).mockReturnValue(requisicaoPendente)
    renderizarLogin()
    const usuario = await preencherFormulario('  pessoa@exemplo.com  ', ' senha preservada ')

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))
    const botaoPendente = await screen.findByRole('button', { name: 'Entrando…' })
    expect(botaoPendente).toBeDisabled()
    await usuario.click(botaoPendente)
    expect(fetch).toHaveBeenCalledTimes(1)

    const [, opcoes] = vi.mocked(fetch).mock.calls[0]
    expect(opcoes).toMatchObject({ method: 'POST', credentials: 'include' })
    expect(JSON.parse(String(opcoes?.body))).toEqual({
      email: 'pessoa@exemplo.com',
      senha: ' senha preservada ',
    })

    concluir(
      respostaJson({
        usuario: { id: 1, nome: 'Pessoa', email: 'pessoa@exemplo.com', papel: 'CLIENTE' },
      }),
    )
  })

  it.each([
    ['CLIENTE', 'Área do cliente'],
    ['BARBEIRO', 'Área do barbeiro'],
    ['ADMINISTRADOR', 'Área administrativa'],
  ] as const)('redireciona o perfil %s para seu destino', async (papel, destino) => {
    vi.mocked(fetch).mockResolvedValue(
      respostaJson({ usuario: { id: 1, nome: 'Pessoa', email: 'pessoa@exemplo.com', papel } }),
    )
    const armazenamentoLocal = vi.spyOn(Storage.prototype, 'setItem')
    renderizarLogin()
    const usuario = await preencherFormulario()

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: destino })).toBeInTheDocument()
    expect(armazenamentoLocal).not.toHaveBeenCalled()
  })

  it('usa mensagem genérica para credenciais inválidas', async () => {
    vi.mocked(fetch).mockResolvedValue(respostaJson({ message: 'Usuário não existe' }, 401))
    renderizarLogin()
    const usuario = await preencherFormulario()
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível entrar. Verifique seus dados e tente novamente.',
    )
    expect(screen.queryByText('Usuário não existe')).not.toBeInTheDocument()
  })

  it('informa o tempo de espera quando a API limita as tentativas', async () => {
    vi.mocked(fetch).mockResolvedValue(respostaJson({}, 429, { 'Retry-After': '30' }))
    renderizarLogin()
    const usuario = await preencherFormulario()
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Muitas tentativas de acesso. Aguarde 30 segundos.')
  })

  it.each([
    ['falha de rede', () => vi.mocked(fetch).mockRejectedValue(new Error('offline'))],
    [
      'papel desconhecido',
      () =>
        vi.mocked(fetch).mockResolvedValue(
          respostaJson({ usuario: { id: 1, nome: 'Pessoa', email: 'pessoa@exemplo.com', papel: 'DESCONHECIDO' } }),
        ),
    ],
  ])('não expõe detalhes internos em caso de %s', async (_cenario, prepararFetch) => {
    prepararFetch()
    renderizarLogin()
    const usuario = await preencherFormulario()
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'O acesso está indisponível no momento. Tente novamente mais tarde.',
      ),
    )
  })
})
