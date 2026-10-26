# Prompt para concluir a área administrativa

## Diagnóstico que fundamenta o prompt

Análise estática do workspace em 22/10/2026. Não houve execução da aplicação nem validação contra um banco real. O estado deve ser revalidado na branch usada na implementação.
ro
- O [menu administrativo](front-end/src/pages/dashboard/dashboard-administrador/constants/menu-administrador.ts) contém seis telas: Dashboard, Agendamentos, Clientes, Barbeiros, Serviços e Financeiro.
- O [Dashboard principal](front-end/src/pages/dashboard/dashboard-administrador/index.tsx) já usa TanStack Query e o [adapter HTTP manual](front-end/src/api/dashboard/dashboard.ts), com modo demonstrativo opcional.
- As outras cinco páginas só exibem mocks quando habilitados; fora desse modo, mostram integração indisponível. Seus componentes têm indicadores, datas e paginação fixos, campos visuais e ações desabilitadas.
- O [backend administrativo](back-end/src/modules/dashboard-administrador/) já contém seis endpoints GET com consultas Prisma. Clientes e barbeiros já têm busca, status e paginação; serviços têm busca, ativação e paginação; agenda e financeiro aceitam período.
- Os módulos de [clientes](back-end/src/modules/cliente/cliente.controller.ts), [barbeiros](back-end/src/modules/barbeiro/barbeiro.controller.ts), [serviços](back-end/src/modules/servico/servico.controller.ts) e [agendamentos](back-end/src/modules/agendamento/agendamento.controller.ts) já têm criação, listagem, detalhe, edição e exclusão. [Comissões](back-end/src/modules/comissao/comissao.controller.ts) têm criação, listagem, detalhe e edição, sem DELETE.
- Os DTOs atuais de edição de cliente e serviço não permitem alterar, respectivamente, `Usuario.status` e `Servico.ativo`. Não basta colocar um botão de ativação na interface.
- A edição de agendamento valida transições, mas não grava o histórico junto da alteração; a criação de histórico é uma operação separada. A edição também não aceita troca de cliente, barbeiro ou filial.
- Pelo [schema Prisma](back-end/prisma/schema.prisma), não existem despesas, lançamentos financeiros genéricos, pagamentos ou formas de pagamento. Também não existem categoria de serviço, especialidades, jornada individual nem percentual padrão de comissão por barbeiro/serviço. O percentual pertence a cada registro de `Comissao`.

## Prompt para copiar e executar

Você deve implementar e concluir a área administrativa do repositório [GabrielferM/agendador_de_barbearia_TG](https://github.com/GabrielferM/agendador_de_barbearia_TG), integrando frontend, backend, buscas e persistência. Crie **seis Pull Requests no GitHub, uma por tela do menu**, contendo a implementação, a documentação afetada e a revisão do respectivo fluxo. Execute o trabalho; não entregue apenas um plano.

### 1. Leia o projeto e confirme o estado atual

Comece por `README.md`, `AGENTS.md`, `front-end/AGENTS.md`, `back-end/AGENTS.md` e pelas arquiteturas das duas aplicações. Consulte os índices de documentação e os guias de integração HTTP, erros, segurança, nomenclatura e testes. Para mudanças visuais, siga o guia de cores do frontend.

Inspecione especialmente:

- `front-end/src/pages/dashboard/dashboard-administrador/`;
- `back-end/src/modules/dashboard-administrador/`;
- os módulos de domínio `cliente`, `barbeiro`, `servico`, `agendamento`, `comissao`, `filial` e o catálogo público;
- `back-end/prisma/schema.prisma`;
- `front-end/src/api/`, `front-end/orval.config.ts`, autenticação, rotas e testes existentes.

Não assuma que o backend está ausente: já existem endpoints administrativos de leitura e CRUDs nos módulos de domínio. Confirme suas regras e contratos no código e no OpenAPI atual. Reutilize-os e complete apenas o necessário, evitando CRUD duplicado dentro do dashboard.

Antes de editar, registre a branch e o status do Git. Preserve alterações locais preexistentes, inclusive arquivos modificados e testes removidos pelo usuário. Não reverta, restaure, publique ou inclua essas alterações em commits sem autorização. Use checkouts/worktrees isolados quando necessário.

Produza uma matriz por tela com: componente/ação, origem dos dados, endpoint e método, campos persistidos ou derivados, permissões, lacuna, teste e critério de aceite. Atualize essa matriz conforme implementar. Um botão existente não comprova que a operação funciona.

### 2. Regras comuns de implementação

- Preserve NestJS, Prisma/PostgreSQL, React/Vite/TypeScript, Tailwind/HeroUI, TanStack Query e Orval. Siga a organização atual e use o `PrismaService` centralizado. Não introduza dependências ou camadas sem necessidade concreta.
- O schema é a fonte de persistência. Esta tarefa não autoriza criar entidades ou migrations para sustentar campos demonstrativos. Adapte a interface aos dados existentes e documente campos removidos e a razão. Quando houver um dado derivável, explicite a fórmula e sua fonte.
- Mantenha CRUD nos domínios; dashboards concentram consultas e agregações. Corrija contratos de entrada/resposta e Swagger quando a integração exigir, preservando compatibilidade com cliente, barbeiro e catálogo público.
- Use DTOs e validações no servidor; valide existência, unicidade, vínculos, estados, datas e valores monetários. Traduza conflitos para respostas seguras. Mantenha gravações dependentes atômicas.
- Faça buscas, filtros e paginação no servidor. Não filtre apenas a página carregada como se fosse a coleção completa. Use ordenação estável, limite validado e total real. Zere a página ao mudar filtros e trate a última página após exclusão.
- Defina se cada indicador considera todos os registros ou os filtros selecionados. Não calcule totais globais a partir de uma página. Mantenha essa semântica explícita no contrato e na documentação.
- Use TanStack Query para consultas/mutações, chaves que incluam identidade e parâmetros relevantes, e invalidação das listas, detalhes e agregados afetados. Evite que respostas antigas substituam o resultado de uma busca mais recente.
- Preserve o transporte comum: cookies e CSRF nas mutações. Ele retorna `{ data, status, headers }` e não rejeita automaticamente 4xx/5xx. Os adapters precisam conferir status e campos essenciais e lançar erros seguros. Trate o status real de sucesso de cada operação, inclusive respostas sem corpo.
- Preserve os adapters manuais de dashboard. Use clientes gerados onde aplicável e regenere-os a partir do OpenAPI atualizado, sem edição manual de arquivos gerados nem sobrescrita dos arquivos manuais em `src/api/`.
- Cada tela deve diferenciar carregamento, erro, vazio e sucesso. Formulários devem validar campos, preservar entradas após falha, bloquear envio duplicado e apresentar retorno acessível. Confirme exclusões/cancelamentos e exiba conflitos sem simular sucesso.
- Nenhum dado demonstrativo pode mascarar falhas da API. O modo normal deve usar dados reais; se mantiver demonstração explícita, isole-a e não permita mutações reais com IDs de mocks.
- Remova datas, contagens, percentuais e paginação fixos do fluxo real. Use `America/Sao_Paulo` e os helpers do projeto para agenda/períodos. Preserve as diferenças documentadas entre dinheiro serializado como string nos CRUDs e números em dashboards; calcule valores de negócio no backend com precisão decimal.
- Exija sessão e permissões no backend em cada operação. A interface também deve respeitar as permissões, sem tratá-la como barreira de segurança. Preserve 401, 403, CSRF, limpeza de cache e proteção de dados sensíveis, inclusive relações aninhadas.
- CRUD completo respeita as restrições do domínio: exclusão física pode retornar conflito; inativação, cancelamento ou estorno devem ter semântica explícita. Não apague histórico ou vínculos para fazer uma exclusão passar.

### 3. PR — Clientes (`/admin/clientes`)

Base: frontend `clientes/`, backend administrativo `cliente/` e módulo de domínio `cliente`.

- Integre `GET /dashboard/administrador/clientes` com `busca`, `status`, `pagina` e `limite`, exibindo indicadores reais, último atendimento e próximo horário, com tratamento de valores ausentes.
- Implemente busca por nome, telefone e e-mail, filtro pelos estados reais de `StatusUsuario` e paginação a partir de `meta`.
- Implemente cadastro, detalhe, edição e exclusão usando `/clientes` e `/clientes/:id`. O cadastro deve contemplar nome, e-mail, senha, CPF, telefone, nascimento e observação conforme obrigatoriedade dos DTOs. Não preencha CPF ou senha com valores artificiais para satisfazer a API.
- Complete a alteração de status no backend e na interface usando o campo existente `Usuario.status`, com autorização administrativa e documentação do contrato. Diferencie ATIVO, INATIVO e BLOQUEADO na apresentação.
- Preserve a regra de conflito para exclusão de cliente com agendamentos. Disponibilize a inativação como operação própria da edição, sem transformar silenciosamente DELETE em inativação.
- Teste duplicidade de e-mail/CPF, inexistência, validação, ausência de dados sensíveis, persistência da edição/status e invalidação dos indicadores.

Aceite: cadastrar, localizar, abrir, editar, alterar status e excluir um cliente sem vínculos funciona pela interface e persiste após recarregar; excluir cliente com vínculos informa o conflito.

### 4. PR — Barbeiros (`/admin/barbeiros`)

Base: frontend `barbeiros/`, backend administrativo `barbeiro/` e módulo `barbeiro`.

- Integre `GET /dashboard/administrador/barbeiros` com busca, `StatusBarbeiro` e paginação. Apresente filial, status profissional, foto quando existente e métricas reais de atendimentos, receita e comissões.
- Implemente cadastro, detalhe, edição e exclusão pelos endpoints `/barbeiros` e `/barbeiros/:id`, contemplando os campos aceitos: nome, e-mail, senha na criação, filial, nome profissional, descrição, foto por URL, admissão e status profissional.
- Carregue opções reais de filial, respeitando as permissões do endpoint usado. Não adicione um CRUD de filiais ao menu nesta tarefa. Exiba estado útil quando não existir filial disponível; não use um ID fixo.
- Diferencie `statusProfissional` de `Usuario.status`. Não apresente um como se alterasse o outro.
- Remova ou adapte especialidades, jornada individual e comissão percentual fixa, pois não existem nesses modelos. Use descrição e comissões registradas quando apropriado, sem afirmar equivalência entre esses conceitos.
- A seção de disponibilidade só pode permanecer se vier de cálculo real pelas regras de expediente, serviços e conflitos existentes. Caso não seja possível representá-la corretamente, substitua por resumo verificável da agenda ou remova-a, registrando a limitação; não invente escalas nem percentuais de disponibilidade.
- Preserve conflitos de exclusão quando houver agendamentos/comissões e permita inativação pelo status profissional existente.

Aceite: CRUD e busca funcionam com vínculo real de filial, status corretos, métricas verificáveis e nenhum campo demonstrativo apresentado como cadastro persistido.

### 5. PR — Serviços (`/admin/servicos`)

Base: frontend `servicos/`, backend administrativo `servicos/` e módulo `servico`.

- Integre `GET /dashboard/administrador/servicos` com `busca`, `ativo`, `pagina` e `limite`. Use indicadores reais de ativos, mais realizado e ticket médio.
- Implemente cadastro, detalhe, edição, exclusão e ativação/inativação usando `/servicos` e `/servicos/:id`. Complete DTO/caso de uso para atualizar `ativo`, hoje ausente na edição.
- Formulários devem usar nome, descrição, preço base e duração em minutos, com validação compatível com o backend. Faça o mapeamento explícito entre `preco` do dashboard e `precoBase` do CRUD.
- Remova categoria, filtro de categoria e percentual de comissão por serviço, ausentes no schema. Substitua o filtro de categoria por situação ativo/inativo.
- Preserve preço/duração aplicados nos itens históricos de agendamentos; editar o catálogo não pode recalcular atendimentos anteriores.
- Mantenha conflito ao excluir serviço com vínculos e ofereça inativação. Confira que inativar impede novas seleções no catálogo/agendamento sem apagar referências históricas.

Aceite: CRUD, busca, filtro e paginação persistem corretamente; catálogo público e validações de agendamento refletem a ativação sem alterar preços históricos.

### 6. PR — Agendamentos (`/admin/agendamentos`)

Base: frontend `agendamentos/`, backend administrativo `agendamento/` e módulo `agendamento`.

- Integre `GET /dashboard/administrador/agendamentos` para calendário e resumo. Implemente navegação por datas e visualizações Dia/Semana/Mês, sem setembro/2026 fixo ou contagens fictícias.
- O resumo deve refletir o dia selecionado e os seis status reais, incluindo NÃO COMPARECEU. Preserve dias vazios e limites de período; a consulta atual da agenda admite até 31 dias. Uma grade mensal com dias adjacentes deve dividir consultas ou usar estratégia compatível, sem truncar resultados silenciosamente.
- Implemente busca e filtros úteis por cliente, barbeiro, filial, status e período. Acrescente os parâmetros necessários ao endpoint administrativo, alinhando DTO, consulta, Swagger e frontend; não filtre uma listagem parcial no cliente. Carregue seletores reais com busca/paginação quando necessário.
- Implemente criação, detalhe, edição/reagendamento, cancelamento com motivo e exclusão administrativa usando `/agendamentos`. Na criação, selecione cliente, filial, barbeiro, serviços, data/horário e campos administrativos permitidos, com origem ADMINISTRADOR.
- Reutilize a disponibilidade e as validações de expediente, vínculos ativos, duração, itens, descontos e conflitos. Consultar disponibilidade não reserva horário: a gravação deve revalidar dentro da transação e tratar 409.
- A edição atual não permite trocar cliente, barbeiro ou filial. Complete a troca administrativa quando exposta no formulário, com validação contextual e proteção dos demais perfis. Não envie campos ignorados nem apresente controles que fingem salvar.
- Preserve a máquina de estados e restrições dos estados finais. Faça mudanças de status e gravação do histórico ocorrerem atomicamente, usando o responsável da sessão. O frontend não deve tentar garantir atomicidade chamando PATCH e POST de histórico separadamente. Revise o endpoint de histórico para não permitir registros incompatíveis com o estado real.
- Considere comissões vinculadas ao editar itens, cancelar, trocar profissional e excluir. Preserve conflitos existentes e impeça inconsistência entre o profissional do atendimento e das comissões; não elimine comissões automaticamente para liberar uma edição.
- Mantenha cancelamento e exclusão como ações distintas e confirme operações destrutivas. Revise as respostas administrativas no Swagger: elas precisam descrever os dados efetivamente consumidos sem expor segredos nem ampliar a resposta dos demais perfis.

Aceite: criação, consulta, filtros, reagendamento, status, histórico, cancelamento e exclusão funcionam ponta a ponta; conflitos e restrições são informados; não há regressão na jornada do cliente ou agenda do barbeiro.

### 7. PR — Financeiro (`/admin/financeiro`)

Base: frontend `financeiro/`, backend administrativo `financeiro/` e módulo `comissao`.

- Integre `GET /dashboard/administrador/financeiro`, período real, receita dos atendimentos concluídos, comparação com período anterior, série semanal e comissões por barbeiro/status.
- Remova despesas, lucro líquido, gráfico/formas de pagamento, coluna de forma de pagamento e registro de movimentação genérica. Remova também mocks/tipos/controles que só sustentam essas informações. Não crie tabelas financeiras nem preencha dados ausentes com zero como se fossem reais.
- Identifique os valores de atendimentos concluídos como receita apurada por essa regra, sem afirmar recebimento em caixa: não há comprovação de pagamento do cliente no banco. Se alterar o rótulo de movimentações, use algo como “Atendimentos concluídos no período”.
- Preserve a regra atual de comparação por período anterior de mesma duração; não rotule essa comparação como “mês anterior” para qualquer intervalo. Trate divisor zero, períodos vazios e gráfico sem valores.
- Revise a agregação de comissões: valores PREVISTA, LIBERADA, PAGA, CANCELADA e ESTORNADA devem ser distinguíveis. Não some canceladas/estornadas como “a pagar” nem reduza um barbeiro com comissões em estados diferentes a um único booleano “pago”. Documente fórmula, status e data de referência de cada total.
- Implemente gestão de comissões em lista e detalhe: criação por item real de agendamento, consulta, filtros por barbeiro/status/período e atualização de situação/observação. Use `POST/GET /comissoes`, `GET/PATCH /comissoes/:id`, completando filtros e contratos necessários. Disponibilize seleção de itens elegíveis com IDs reais e relações sanitizadas; não exija que o usuário adivinhe IDs internos.
- Não invente percentual padrão: o percentual é informado por comissão. Valide seu limite, vínculo do item ao barbeiro, unicidade por item, base de cálculo, arredondamento, transições permitidas, datas coerentes e motivo de estorno. O servidor calcula valores e impede operações incompatíveis; registrar PAGA representa o registro administrativo, sem executar transferência financeira.
- Não acrescente DELETE físico de comissão por simetria de CRUD. Use cancelamento/estorno pelos estados existentes, com regras explícitas e preservação do histórico financeiro disponível no modelo.
- A consulta atual retorna apenas dez movimentações recentes. Identifique claramente esse recorte; uma listagem completa exige consulta/paginação própria. Se mantiver “Exportar relatório”, implemente exportação real com os filtros aplicados e escopo declarado, sem exportar só a página como se fosse tudo. Caso contrário, retire o botão e documente a remoção.

Aceite: a tela apresenta apenas dados rastreáveis no schema, permite gerenciar comissões com regras consistentes e não sugere funcionalidades de caixa, despesas ou pagamentos inexistentes.

### 8. PR — Dashboard principal (`/admin`)

Base: `dashboard-administrador/index.tsx`, `src/api/dashboard/` e submódulo backend `dashboard/`.

- Revise e complete a integração já existente de `GET /dashboard/administrador`. Não reescreva o painel nem crie CRUD artificial para indicadores agregados.
- Confira agendamentos do dia, receita, clientes/barbeiros ativos, serviços realizados, receita dos últimos sete dias, agendamentos recentes e desempenho dos barbeiros contra as regras e dados reais.
- Garanta coerência de fuso, período, quantidade, status de conclusão e valores dos itens com as demais telas. Evite chamar usuário/profissional ativo de “disponível” quando não houver cálculo de disponibilidade.
- Valide o corpo recebido no adapter, inclusive estruturas usadas pela interface; cubra carregamento, vazio, erro, falta de permissão e nova tentativa.
- Confira que as mutações das demais telas invalidam os indicadores pertinentes. Torne a navegação para as telas relacionadas funcional onde houver ações.
- Revise “em tempo real”: só mantenha essa afirmação se existir atualização compatível; caso contrário, use descrição precisa e permita atualizar os dados.

Aceite: painel sem números fixos no modo real, agregações verificáveis e atualização coerente após operações administrativas.

### 9. Teste, revise e corrija antes de concluir cada PR

Teste comportamento observável, não apenas helpers ou renderização estática:

- Leitura, criação, edição, exclusão/inativação/cancelamento/estorno conforme a tela, inclusive persistência após nova consulta.
- Busca e filtros combinados, paginação real, ausência de resultados e alteração de filtros durante requisições.
- Entradas inválidas, duplicidade, inexistência, vínculos impeditivos e concorrência quando aplicável.
- Acesso anônimo e perfil/permissão incompatível, CSRF ausente/inválido e ausência de segredos inclusive em objetos aninhados.
- Erros HTTP retornados sem rejeição pelo transporte, falha de rede, corpo inválido, envio duplicado e invalidação de cache.
- Datas nos limites de dia/mês/ano, período invertido, valores decimais, totais vazios e transições inválidas de agendamento/comissão.
- Fluxos públicos/de cliente/de barbeiro afetados pelo reaproveitamento dos módulos.

Execute os checks exigidos pelos AGENTS e guias:

```bash
# Em back-end/
npm run prisma:generate
npm run build
npm test
npm run lint
npm run format:check
npm run test:e2e

# Em front-end/
npm run lint
npm run build
npm test
```

Execute `npm run api:generate` no frontend quando os contratos gerados forem afetados, com OpenAPI atualizado e revisão do diff. Não execute migrations como rotina de teste. Testes HTTP existentes com Prisma simulado não comprovam persistência real: quando houver ambiente disponível, valide os fluxos também com PostgreSQL isolado, sem usar dados de produção; informe expressamente se isso não foi possível. Faça verificação de teclado, foco e layout responsivo em navegador quando disponível.

Faça uma revisão final do diff e de cada item da matriz. Verifique botões sem handler, campos ignorados, sucesso sem gravação, dados fixos, mocks acidentais, contratos divergentes, consultas parciais, totais inconsistentes e vazamento de dados. Corrija os problemas encontrados e repita as verificações afetadas. Registre falhas preexistentes e verificações impedidas; não declare aprovação de testes não executados.

Atualize os guias canônicos de comportamento, API, arquitetura e segurança que forem afetados, distinguindo implementação, regra para novas alterações e pendência. A matriz de trabalho deve apontar para esses guias, sem duplicar manuais.

### 10. Entrega no GitHub

- Use a integração GitHub disponível para o repositório indicado. Confirme a branch padrão no início; na análise ela era `main`.
- Crie uma branch e uma PR por tela: Clientes, Barbeiros, Serviços, Agendamentos, Financeiro e Dashboard. Cada PR deve conter frontend, backend necessário, testes e documentação de sua própria tela. Não altere o backend artificialmente se a API existente já satisfizer o contrato, nem concentre toda a API em uma PR e toda a interface em outra.
- Prefira essa ordem para aproveitar cadastros antes dos agendamentos e estes antes do financeiro. Compartilhe somente o necessário e explicite dependências. Se precisar empilhar branches, use a base da PR anterior, registre a cadeia e a ordem de integração; não duplique commits em seis PRs apontadas para `main`. Ao atualizar bases, revise novamente os diffs e checks.
- Não faça merge automático. Crie PRs prontas para revisão quando os critérios forem atendidos; use draft se houver impedimento concreto e descreva o que falta. Não crie PRs vazias para completar a contagem.
- Descreva em cada PR: problema e comportamento resultante, operações/rotas, mudanças de contrato, campos removidos, regras de negócio, dependências, testes executados/resultados e limitações. Inclua como validar o fluxo e o resultado da revisão com as correções realizadas.
- Após publicar, confira os checks disponíveis no GitHub e corrija falhas relacionadas às alterações. Não alegue revisão independente se apenas você revisou seu próprio trabalho.
- Ao terminar, entregue uma tabela com tela, branch, URL da PR, operações implementadas, validações e pendências. Declare o que foi removido do financeiro e quais dependências precisam ser integradas primeiro. Se não conseguir publicar por impedimento de acesso, informe o bloqueio exato e preserve a implementação revisável; não invente URLs nem afirme que criou PRs.
