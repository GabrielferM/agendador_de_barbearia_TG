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

A página inicial consome catálogo público; login usa um serviço que valida e traduz respostas. Os dashboards principais de administrador e barbeiro possuem adapters HTTP manuais. As áreas administrativas de agendamentos, clientes, barbeiros, serviços, filiais e financeiro possuem integração real. As áreas com modo demonstrativo preservam exemplos explicitamente identificados, sem usá-los como fallback de erros. A existência da tela ou de um botão não comprova integração de leitura ou gravação. A jornada pública de agendamento e a listagem/cancelamento do cliente estão integradas à API. O rascunho transitório fica em um provider acima das rotas para permitir retomada após login. Cadastro público e recuperação de senha continuam em construção nas [rotas](../src/routers/index.tsx). Veja [agendamento do cliente](../../back-end/doc/agendamento-cliente.md).

## Regra para novas alterações

Mantenha componentes de apresentação focados em renderização e interação. Hooks coordenam estado e consultas; serviços/adapters traduzem contratos quando necessário. Reutilize componentes quando houver responsabilidade comum, sem criar uma hierarquia de abstrações antecipadamente.

Mantenha estado de interface perto de quem o usa; derive listas filtradas, contagens e rótulos de dados existentes. Use TanStack Query para consultas compatíveis com os adapters atuais e o contexto existente para autenticação. Não duplique os mesmos dados em vários estados sem uma razão explícita. Referência: [Thinking in React](https://react.dev/learn/thinking-in-react).

O fluxo recomendado é página → hook/serviço → cliente da API → backend. Preserve exceções simples existentes; não extraia hooks que apenas renomeiam uma expressão. A [integração HTTP](integracao-api.md) explica diferenças entre código manual e gerado.

## Estados visuais e dados

Para consultas, diferencie carregamento, erro, resultado vazio e sucesso. Para formulários, preserve valores úteis, indique erros próximos aos campos e impeça envios duplicados enquanto pendentes. Use rótulos acessíveis, foco visível e mensagens que não dependam somente de cor.

`VITE_USAR_DADOS_MOCKADOS=true` ativa dados demonstrativos onde implementado, conforme [mocks do dashboard](../src/pages/dashboard/mocks/dados-dashboard.ts). Não use mocks como fallback silencioso de falha real. Ao implementar uma tela, confira seus handlers e chamadas para distinguir ações locais de persistência no backend.

Cores seguem exclusivamente o [guia de tokens](padroes/cores-front-end.md). Nomes seguem [nomenclatura](nomenclatura.md); erros e sessão seguem [tratamento de erros](tratamento-de-erros.md) e [segurança](seguranca-autenticacao.md).

## Melhorias pendentes

Clientes vinculados do barbeiro, transferência com agenda futura, edição operacional por status, reagendamento do cliente e operação de comissões continuam condicionados às decisões de negócio do roadmap. Cadastro público e recuperação de senha permanecem em construção. Não declarar o frontend inteiramente integrado com base na presença de tipos gerados ou mocks. A documentação não altera esses fluxos.

## Agenda integrada do barbeiro

`pages/dashboard/dashboard-barbeiro/agenda/` consulta a API existente por adapter que valida status e campos essenciais. As rotas `/barbeiro/agenda` e `/barbeiro/agenda/:id` exigem sessão BARBEIRO e permissão de própria agenda na interface e no servidor. Lista mantém filtros na URL e detalhe retorna à lista filtrada; queries incluem usuário, filtros ou ID. Carregamento, vazio e erro são distintos e não usam fallback demonstrativo.

A rota `/barbeiro/historico` reutiliza a lista da agenda com recorte temporal estável ao abrir a página. Detalhes apresentam histórico de status paginado, sem reconstruir eventos ausentes. A classificação temporal não transforma uma pendência antiga em atendimento concluído.

`/barbeiro/servicos` integra as ocorrências de serviços no mês atual do dashboard e a lista paginada de atendimentos concluídos do mesmo mês. Não existe filtro de período no dashboard do barbeiro; a tela não promete estatísticas por período arbitrário. Quantidades dos itens e ocorrências agregadas são conceitos separados. Esta consulta não cadastra habilitações, especialidades ou comissão fixa.

A gestão de serviços usa dados reais em `/admin/servicos`: busca, situação, paginação, indicadores do mês e detalhe consultado por ID. Categoria e comissão fixa demonstrativas não pertencem ao contrato e não são exibidas. Adapters administrativos validam status/corpo, preservam sessão/CSRF e respeitam Retry-After sem repetir escritas. Dialogs compartilhados controlam foco, Escape e descarte de formulários alterados.

Serviços também oferecem criação, edição, situação e exclusão confirmada. O formulário usa nome, descrição, preço base e duração; criação conserva ativação padrão do servidor e edição aceita boolean `ativo`. Exclusão com vínculos retorna conflito, mantendo o formulário. Inativação afeta novas reservas e não apaga atendimentos anteriores. Preço/duração atuais do catálogo não substituem valores aplicados em registros antigos.

`/admin/filiais` e `/admin/filiais/:id` oferecem lista por situação, criação, edição de endereço e situação com confirmação. Consulta de equipe é paginada por filial e exige também GERENCIAR_USUARIOS; não é solicitada sem essa permissão. Filiais não recebem busca textual não suportada nem exclusão como fluxo principal.

Gestão integrada de barbeiros consulta indicadores, busca/situação/paginação e detalhe, cria/edita/exclui cadastros autorizados e distingue statusUsuario (leitura) de statusProfissional (edição). Cadastro exige seletor de filial administrativa autorizado. Senha não é carregada e só é enviada se digitada. A troca de filial está indisponível enquanto D03 não definir a política de atendimentos futuros; demais campos permanecem editáveis. Especialidades/jornada/percentuais demonstrativos não aparecem no modo integrado.

Gestão integrada de clientes consulta indicadores, busca nome/telefone/e-mail, status/paginação e detalhe; permite criar/editar/excluir segundo os contratos existentes. Status do usuário é somente leitura. A seção de agendamentos é paginada e só consulta com GERENCIAR_AGENDAMENTOS. Senhas nunca são preenchidas a partir da resposta; edição só envia senha explicitamente digitada. Exclusão vinculada apresenta conflito e mantém o cadastro.

A agenda administrativa integra filtros de período/filial/barbeiro/cliente/situação, detalhe, histórico e ações de atendimento. Lista é paginada no servidor; grade carrega explicitamente todas as páginas e exige reduzir o período acima de 5.000 registros, sem truncar resultados silenciosamente. Resumo identifica se representa a página ou o período completo. Seletores de cadastros só consultam quando suas permissões auxiliares estão presentes.

Financeiro integrado consulta receita calculada, variação, fluxo semanal, atendimentos e comissões agregadas por profissional/status. Não oferece despesas, formas de pagamento ou marcação de recebimento. A tabela de comissões é paginada por profissional/status em todos os períodos, distinguindo seu recorte do painel por data de geração. Detalhe é somente leitura; gestão de comissão espera D07. Links de atendimento e seletores respeitam suas permissões auxiliares.
