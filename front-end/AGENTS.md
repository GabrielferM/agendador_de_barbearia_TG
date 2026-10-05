# Instruções do frontend

Leia a [arquitetura](docs/arquitetura.md) antes de alterar organização, estado ou fluxo de dados. Consulte o [índice](docs/README.md) para os demais guias.

- Preserve React, Vite, TypeScript, Tailwind CSS, HeroUI e TanStack Query.
- Organize por páginas e responsabilidades; mantenha componentes coesos e evite duplicar estado derivável.
- Para nomes novos, siga [nomenclatura](docs/nomenclatura.md), preservando exceções existentes e arquivos gerados.
- Para chamadas HTTP, leia [integração com a API](docs/integracao-api.md) e [tratamento de erros](docs/tratamento-de-erros.md). Inspecione o status: o cliente comum não lança exceções automaticamente para 4xx/5xx.
- Não edite manualmente arquivos gerados pelo Orval. `src/api/` também contém arquivos manuais; confira a origem antes de editar ou regenerar.
- Para autenticação e rotas protegidas, leia [segurança](docs/seguranca-autenticacao.md). O backend é a autoridade de autorização; não persista credenciais ou tokens no armazenamento do navegador.
- Antes de alterar cores, tokens, temas ou estilos, consulte a [padronização de cores](docs/padroes/cores-front-end.md). Use tokens semânticos; não introduza cores arbitrárias nos componentes. Atualize o guia ao mudar a paleta.
- Diferencie dados demonstrativos de dados reais; não use mocks para ocultar falhas da API.
- Ao alterar código, execute em `front-end/`: `npm run lint`, `npm run build` e `npm test`, conforme [testes](docs/testes.md).
- Atualize os guias afetados. Para mudanças somente documentais, confira links e diff sem regenerar o cliente.
