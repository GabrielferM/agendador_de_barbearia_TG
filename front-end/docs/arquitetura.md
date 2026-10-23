# Arquitetura do frontend

## Implementado

React e TypeScript compõem a SPA, executada pelo Vite. React Router organiza a navegação, TanStack Query coordena consultas, Tailwind CSS e HeroUI compõem a interface. [main.tsx](../src/main.tsx) configura o QueryClient e [App](../src/App.tsx) compõe a aplicação.

| Local | Responsabilidade |
| --- | --- |
| `src/pages/` | Páginas e seus componentes, hooks, serviços, tipos e mocks locais. |
| `src/routers/` | Rotas e controle de navegação por sessão/papel. |
| `src/auth/` | Contexto de autenticação e restauração da sessão. |
| `src/api/` | Clientes e tipos gerados, transporte e adapters manuais. |
| `src/index.css` | Tokens, estilos globais e integração HeroUI/Tailwind. |
| `src/test/` | Configuração compartilhada dos testes. |

A página inicial consome catálogo público; login usa um serviço que valida e traduz respostas. Os dashboards principais de administrador e barbeiro possuem adapters HTTP manuais. Clientes, barbeiros, serviços, agendamentos e financeiro possuem [integração administrativa](administracao.md). As subpáginas administrativas usam dados reais e não recorrem a mocks em falhas. A existência da tela ou de um botão não comprova integração de leitura ou gravação. A jornada pública de agendamento e a listagem/cancelamento do cliente estão integradas à API. O rascunho transitório fica em um provider acima das rotas para permitir retomada após login. Cadastro público e recuperação de senha continuam em construção nas [rotas](../src/routers/index.tsx). Veja [agendamento do cliente](../../back-end/doc/agendamento-cliente.md).

## Regra para novas alterações

Mantenha componentes de apresentação focados em renderização e interação. Hooks coordenam estado e consultas; serviços/adapters traduzem contratos quando necessário. Reutilize componentes quando houver responsabilidade comum, sem criar uma hierarquia de abstrações antecipadamente.

Mantenha estado de interface perto de quem o usa; derive listas filtradas, contagens e rótulos de dados existentes. Use TanStack Query para consultas compatíveis com os adapters atuais e o contexto existente para autenticação. Não duplique os mesmos dados em vários estados sem uma razão explícita. Referência: [Thinking in React](https://react.dev/learn/thinking-in-react).

O fluxo recomendado é página → hook/serviço → cliente da API → backend. Preserve exceções simples existentes; não extraia hooks que apenas renomeiam uma expressão. A [integração HTTP](integracao-api.md) explica diferenças entre código manual e gerado.

## Estados visuais e dados

Para consultas, diferencie carregamento, erro, resultado vazio e sucesso. Para formulários, preserve valores úteis, indique erros próximos aos campos e impeça envios duplicados enquanto pendentes. Use rótulos acessíveis, foco visível e mensagens que não dependam somente de cor.

`VITE_USAR_DADOS_MOCKADOS=true` ativa dados demonstrativos onde implementado, conforme [mocks do dashboard](../src/pages/dashboard/mocks/dados-dashboard.ts). Não use mocks como fallback silencioso de falha real. Ao implementar uma tela, confira seus handlers e chamadas para distinguir ações locais de persistência no backend.

Cores seguem exclusivamente o [guia de tokens](padroes/cores-front-end.md). Nomes seguem [nomenclatura](nomenclatura.md); erros e sessão seguem [tratamento de erros](tratamento-de-erros.md) e [segurança](seguranca-autenticacao.md).

## Melhorias pendentes

Concluir as páginas em construção e integrações administrativas requer tarefas próprias. Não declarar o frontend inteiramente integrado com base na presença de tipos gerados ou mocks. A documentação não altera esses fluxos.

## Agenda integrada do barbeiro

`pages/dashboard/dashboard-barbeiro/agenda/` consulta a API existente por adapter que valida status e campos essenciais. As rotas `/barbeiro/agenda` e `/barbeiro/agenda/:id` exigem sessão BARBEIRO e permissão de própria agenda na interface e no servidor. Lista mantém filtros na URL e detalhe retorna à lista filtrada; queries incluem usuário, filtros ou ID. Carregamento, vazio e erro são distintos e não usam fallback demonstrativo.

## Página inicial com navegação por rolagem

A rota `/` reúne apresentação, serviços, barbeiros, Sobre e Contato, nessa ordem, com largura de conteúdo compartilhada. O cabeçalho mantém marca e Login; “Ver serviços” usa âncora com rolagem suave somente quando não há preferência por movimento reduzido. Serviços e barbeiros carregam todo o catálogo público, com carregamento, vazio, erro e nova tentativa independentes.

“Agendar este serviço” inicia um novo rascunho em memória com apenas o serviço escolhido e abre `/agendar`. O acesso genérico ao agendamento preserva o rascunho existente. Fotos indisponíveis usam avatar; descrições ausentes são omitidas.

Contato permanece explicitamente demonstrativo. Os exemplos de contato ficam no componente local, sem links acionáveis ou gravação na API. Não são fallback de falhas do catálogo nem representam dados reais. Substituir telefone, confirmar WhatsApp e preencher e-mail, endereço e funcionamento reais permanece pendente; o expediente ilustrativo não controla a agenda.

### Adaptação a telas grandes

A classe local `inicio-container` compartilha largura fluida entre as seções: `width: 100%` e máximo `clamp(72rem, 88vw, 112rem)`. O conteúdo acompanha desktops largos até 1792 px, mantendo margens e limite de leitura em ultrawide. Título e ilustração da apresentação crescem com `clamp`; textos, botões, espaçamentos e cards recebem ajustes em `xl`/`2xl`. Os layouts móveis e as grades de uma, duas e três colunas permanecem responsivos, sem altura fixa ou escala por `transform`.

### Seção Sobre

A seção Sobre apresenta dois parágrafos institucionais, três destaques de atendimento e o link “Agendar meu atendimento”, que abre `/agendar` sem alterar o rascunho. Não há selo demonstrativo nessa seção. O texto vem antes das imagens no DOM e no celular; no desktop a composição visual ocupa a coluna esquerda e o conteúdo ocupa a direita.

As imagens locais [sobre-ambiente.png](../src/assets/sobre-ambiente.png) e [sobre-detalhes.png](../src/assets/sobre-detalhes.png) foram geradas com IA pela skill imagegen para esta interface. Representam um ambiente fictício e uma composição de instrumentos, sem pessoas, marcas ou alegação de fotografar instalações reais. Ambas têm 1536 × 1024 pixels, proporção reservada de 3:2, texto alternativo e carregamento tardio. Não dependem de URLs externas nem substituem fotos de profissionais cadastrados.
