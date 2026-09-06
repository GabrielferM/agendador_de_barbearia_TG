import { useCatalogoPublicoControllerServicos } from '../../../api/catálogo-público/catálogo-público'

export interface ServicoInicio {
  id: number
  icone: string
  nome: string
  duracao: string
  preco: string
}

const formatarDuracao = (minutos: number) => `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`

const formatarPreco = (precoBase: string) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(precoBase))

export function useServicosInicio() {
  const query = useCatalogoPublicoControllerServicos({ pagina: 1, limite: 3 })
  const resposta = query.data?.status === 200 ? query.data.data : undefined
  const comErro = query.isError || (query.data !== undefined && query.data.status !== 200)

  return {
    ...query,
    comErro,
    itens: (resposta?.data ?? []).map<ServicoInicio>((servico) => ({
      id: servico.id,
      icone: '✂',
      nome: servico.nome,
      duracao: formatarDuracao(servico.duracaoMinutos),
      preco: formatarPreco(servico.precoBase),
    })),
  }
}
