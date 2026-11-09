# Testes e validação do frontend

## Comandos

Com dependências instaladas, execute a partir de `front-end/` após alterar código:

```bash
npm run lint
npm run build
npm test
```

O build executa TypeScript e Vite. Vitest usa jsdom e [setup compartilhado](../src/test/setup.ts); os testes de componentes usam Testing Library. Os scripts estão no [package.json](../package.json). A suíte atual não exige backend ativo para os fluxos simulados nos testes.

## Implementado e limites

Há testes de login, contexto de autenticação, transporte HTTP e dashboards, próximos das implementações. Eles cobrem corpo JSON inválido, preservação de 4xx/5xx, evento de 401, limpeza de cache e aviso de logout remoto não confirmado. Usam respostas simuladas; não comprovam integração com um banco ou servidor real. Não há comando de testes de navegador e2e no package.json atual.

A suíte da jornada cobre filial única/múltiplas/ausentes, paginação do catálogo, escolhas dependentes, login com retomada e confirmação explícita, expiração de sessão, conflito na criação e cancelamento com motivo. Usa respostas HTTP simuladas e calendário HeroUI real em jsdom.

## Regra para novas alterações

- Teste o comportamento observável e interações pelo papel/nome acessível do elemento.
- Consultas: carregamento, vazio, sucesso, falha de rede e HTTP não exitoso retornado sem rejeição.
- Formulários: entrada inválida, envio pendente, prevenção de duplicação, mensagem e preservação dos campos.
- Autenticação: restauração pendente, sessão ausente, papel incompatível, login 401/403/429, corpo inválido e logout com falha.
- Contratos: diferencie mock de resposta gerada `{ data, status, headers }` de adapter que lança erro. Não simule um comportamento diferente do transporte real.
- Mocks demonstrativos: confira identificação visual e evite fallback silencioso quando a API falhar.
- Alterações visuais: confira teclado, foco, rótulos, contraste e telas estreitas no navegador quando disponível. Registre se essa verificação não foi feita.

Use QueryClient isolado por teste e controle retries para evitar interferência entre casos. Não adicione snapshots extensos que apenas reproduzam a árvore de componentes.

## Conclusão

Revise o diff e atualize guias e contratos afetados. Relate verificações executadas e limitações. Mudanças apenas em Markdown exigem links e exemplos coerentes; não exigem build, testes da aplicação ou regeneração Orval.

## Página inicial

Os testes em `pages/inicio/inicio.test.tsx` cobrem ordem das seções, destinos, contato demonstrativo sem links, seleção de serviço, avatar após falha de imagem, descrição ausente, carregamento, vazio, erro HTTP com nova tentativa, paginação completa e rejeição de dados inválidos/rede. A suíte de agendamento também percorre início → serviço → filial → barbeiro → serviços, verificando a seleção preservada. A cobertura existente de login continua verificando retomada e confirmação explícita.

Essas verificações usam jsdom e respostas simuladas: não substituem inspeção visual em navegador nem comprovam dados de uma API ativa.

A seção Sobre é verificada por região nomeada, três destaques, duas imagens com texto alternativo e dimensões reservadas, ausência do antigo selo demonstrativo e link para `/agendar`. Contato mantém seu aviso demonstrativo. A ação do Sobre preserva o rascunho existente.

## Agenda administrativa

`agendamentos.test.tsx` usa o transporte HTTP real com respostas simuladas para
verificar os seis status (um atendimento com vários serviços continua valendo um),
ordenação, seleção e retorno para Hoje, totais diários versus período, HTTP 403/503,
rede, resposta inválida, IDs duplicados e agrupamento no dia incorreto. A demonstração
habilitada não substitui a API. `calendario.test.ts` cobre a meia-noite de São Paulo,
semana atravessando o ano, fevereiro bissexto e alinhamento dos doze meses.

A suíte também verifica reutilização do cache ao voltar ao período anterior e HTTP 429 sem repetição automática, com botão bloqueado durante `Retry-After` e recuperação por tentativa manual. Essas verificações usam HTTP simulado e não medem o volume de uma sessão real no navegador.

A inspeção visual desta alteração foi executada em Chromium headless a 1440 × 1000 e
390 × 844, com sessão e HTTP simulados, nos cenários vazio, preenchido, 18 atendimentos
por dia e Dia/Semana/Mês. Conferiu seleção, contagem diária, ausência de overflow da
página no celular, destaque marrom ativo e ausência de sobreposição do aviso mensal
com os cabeçalhos das datas. As capturas não representam uma API ou banco ativo.

## Catálogos administrativos compactos

A suíte de Clientes cobre também abertura/cancelamento da confirmação sem DELETE,
conflito HTTP 409 mantendo o diálogo e edição com erro preservando nome e status.
Os testes de Barbeiros/Serviços preservam cobertura de filtros/paginação, vazio,
erro com nova tentativa, resposta malformada e ausência de permissão.

A inspeção em Chromium headless usa HTTP e sessão simulados, em 1440 × 1000 e
390 × 844: zero, um e vinte registros (páginas de até doze itens), nomes longos e
telefone/datas ausentes. São 18 composições, com verificação de ausência de overflow
da página; a rolagem fica nas tabelas. Também foram percorridos busca, status com
retorno à página 1, paginação, cadastro, detalhes, edição, cancelamento e bloqueio
de exclusão de Clientes. O teste de conflito não exclui nenhum registro real.

Capturas finais estão em [capturas-catalogos](capturas-catalogos/README.md). São
respostas de teste, sem comprovação de sessão, autorização ou persistência em API
ou PostgreSQL reais. Nenhuma API/banco real estava configurado neste ambiente.

## Área do cliente compacta

A suíte de agendamento verifica contagens com múltiplas páginas HTTP, paginação
local, alternância das abas pelo teclado, atualização de status/contagens após
cancelar, motivo preservado em HTTP 409 e prevenção de envio duplicado. Também
confere vazio por aba, erro com nova tentativa, falha na segunda página sem resultado
parcial e confirmação final com status pendente explícito. Os testes puros de
`organizar-agendamentos.test.ts` cobrem os seis status, ordenação, atendimento atual,
instante de início exato, offsets equivalentes e mudança de dia em São Paulo.

As [capturas da área do cliente](capturas-cliente/README.md) documentam antes/depois
em desktop e celular, além de carregamento, erro, vazio, histórico, detalhes e
textos longos. A inspeção em navegador usa HTTP/sessão simulados e calendário real;
confere foco do diálogo, Escape, cancelamento com falha/sucesso, contagens,
paginação e ausência de overflow horizontal. Não comprova persistência real.

## Contas públicas

`conta-publica.test.tsx` cobre validação por campo/foco, máscaras e envio normalizado, preservação de espaços, mostrar senha, duplicação durante envio, conflitos, confirmação, recuperação genérica, intervalo/429, token ausente/expirado e remoção do fragmento antes do consumo. O adapter é exercitado com HTTP simulado, incluindo rede, 403, 5xx e corpo inválido. Esses testes não validam entrega de e-mail nem PostgreSQL.

As [21 capturas das contas públicas](capturas-conta/README.md) mostram desktop e celular (incluindo 320 px), formulários, erros com nome longo, envio pendente, conclusão genérica com cooldown, nova senha e token ausente. Houve inspeção visual e checagens automatizadas de overflow, foco e remoção do fragmento, com respostas HTTP simuladas.

## Padronização de formulários e aniversário

Os testes em `src/forms/campos.test.ts` verificam máscaras, CPF/CNPJ, telefone, UF, datas reais, aniversário, senha e períodos inclusivos de até 366 dias. Clientes verifica também erro ao sair do campo, correção, foco, payload sem máscara, preservação de senha, remoção de aniversário com null e prevenção de envio duplicado. Contas públicas inclui aniversário válido/inválido e envio numérico. O adapter administrativo testa mensagens conhecidas e rejeição de detalhes desconhecidos.

Lint, build e os 181 testes do frontend passaram. As interações automatizadas usam jsdom e HTTP simulado. O cadastro público também foi inspecionado no navegador em desktop e viewport de 390 × 844: foco no primeiro erro, máscaras, mensagens, aniversário inválido/correção para 29/02 e ausência de overflow horizontal. Nenhuma conta foi criada. A inspeção visual autenticada das áreas de administrador e barbeiro permanece pendente.

## Dialogs administrativos

As suítes de Clientes, Barbeiros, Serviços e Filiais exercitam criação/edição em modal, consulta atual de detalhes, erros por campo, preservação após erro HTTP, descarte confirmado, reabertura limpa e bloqueio de envios durante gravação. Barbeiros cobre filial atual fora do catálogo ativo, senha inicialmente vazia/omitida no PATCH e inativação/reativação da conta sem alterar o perfil. Serviços cobre payload `precoBase`, duração/preço inválidos, conflito e edição bem-sucedida com atualização das consultas. Filiais verifica preservação do filtro e da página válida após salvar. Os cenários usam HTTP/sessão simulados.

A inspeção em Chromium headless percorreu as quatro telas em 1440 × 1000, 390 × 844 e 320 × 844 (12 composições). Verificou foco inicial, contenção por Tab, retorno ao botão de origem, cancelamento/Escape com confirmação, continuar editando, campos preservados após conflito, alinhamento no desktop e ausência de overflow horizontal. A listagem conservou sua posição no documento ao abrir/fechar. O roteiro também criou um serviço e inativou/reativou uma conta com respostas HTTP simuladas, preservando o status profissional. Essas verificações não comprovam persistência em API ou PostgreSQL reais.

Nesta entrega passaram `npm run lint`, `npm run build` e os 189 testes do frontend (19 arquivos). O build mantém o aviso de chunk acima de 500 kB. As 12 composições do navegador não apresentaram overflow horizontal; no desktop o modal mediu 640 px, e nos viewports de 390/320 px mediu 358/288 px. A inspeção usou sessão e HTTP simulados, sem criar registros no banco real.

## Busca por botão e carregamento de listagens

Os testes de Clientes administrativos cobrem ausência de requisições durante digitação/seleção de status, submissão conjunta por Enter, repetição, texto vazio, preservação de foco/itens/indicadores durante resposta atrasada, erro de atualização, recuperação e paginação com rascunho não aplicado. Os testes existentes de Barbeiros, Serviços e Filiais usam Buscar para aplicar filtros. Clientes e Serviços do barbeiro cobrem busca explícita, bloqueio durante atualização, preservação da tabela e do rascunho na paginação e Limpar.

`use-consulta-listagem.test.tsx` verifica retenção durante consulta/falha/recuperação, retirada em 401/403, isolamento por usuário/tela/permissão e cancelamento por AbortSignal. `resultados-listagem.test.tsx` verifica preservação dos nós e reserva/liberação de altura usando geometria simulada. Esses testes usam jsdom/HTTP simulado e não comprovam estabilidade visual em navegador. A inspeção desktop/celular com rede lenta e página rolada não foi executada nesta alteração: o navegador integrado estava indisponível.

Verificações desta alteração: lint, build e `git diff --check` passaram; o build mantém o aviso de bundle acima de 500 kB. A suíte completa executou 200 testes: 194 passaram, incluindo os 11 novos, e seis falharam em ativação/desativação de Serviços porque esperam mensagens de sucesso ausentes no código anterior a esta tarefa. As mesmas seis falhas foram reproduzidas com a versão anterior da tela de Serviços, por configuração temporária de teste, sem restaurar ou sobrescrever as alterações existentes do usuário. Esse comportamento permanece pendente de alinhamento entre tela e testes.
