# Segurança da autenticação

Este é o guia compartilhado de sessão e autenticação. Distingue o que existe das regras para evolução. A navegação protegida no React melhora a experiência; a autorização efetiva pertence ao backend.

## Implementado: contrato de login

O frontend envia `POST /auth/login`, JSON e cookies:

```json
{"email":"pessoa@exemplo.com","senha":"senha informada sem alteração"}
```

A resposta esperada é 200:

```json
{"usuario":{"id":1,"nome":"Nome da pessoa","email":"pessoa@exemplo.com","papel":"CLIENTE","permissoes":["CRIAR_AGENDAMENTO"]}}
```

O frontend reconhece CLIENTE, BARBEIRO e ADMINISTRADOR. O modelo Papel no banco usa código textual. O [serviço de login do frontend](../src/pages/login/services/login-api.ts) remove espaços externos do e-mail, preserva a senha, traduz 401/403 para a mesma mensagem e interpreta Retry-After em 429. O backend normaliza o e-mail e exige JSON; o [controller](../../back-end/src/modules/autenticacao/autenticacao.controller.ts) verifica Origin no login e dispensa sua ausência somente fora de produção.

A sessão é restaurada por GET /auth/me e o logout solicitado pelo usuário chama POST /auth/logout. O [contexto](../src/auth/contexto-autenticacao.tsx) mantém usuário em memória e não armazena token em localStorage/sessionStorage. Logout, expiração e troca de usuário cancelam consultas em andamento e limpam QueryCache e MutationCache. Um logout remoto sem sucesso ainda encerra o estado local e produz um aviso na tela de login de que a revogação no servidor não foi confirmada.

## Implementado: sessão, cookies e CSRF

- [SessaoService](../../back-end/src/modules/autenticacao/service/sessao.service.ts) gera token aleatório, persiste apenas SHA-256 e verifica usuário/papel ativo, expiração e revogação.
- Duração absoluta de sete dias, inatividade máxima de oito horas e atualização de último uso a cada cinco minutos, conforme [constantes](../../back-end/src/common/constants/seguranca.ts).
- [CookieService](../../back-end/src/common/security/cookie.service.ts) usa `sessao` no desenvolvimento e `__Host-sessao` em produção; HttpOnly, SameSite=Lax, Path=/, sem Domain e Secure em produção. O cookie CSRF é legível por JavaScript.
- [CsrfService](../../back-end/src/common/security/csrf.service.ts) assina o token com HMAC vinculado à sessão. O guard compara cookie, X-CSRF-Token e assinatura nas operações POST/PUT/PATCH/DELETE, salvo isenção explícita.
- GET /auth/csrf emite token para a sessão atual. O mutator lê o cookie existente; não há renovação automática universal seguida de repetição de requisições.
- CORS permite credenciais; em produção usa a lista configurada, fora de produção aceita origens localhost conforme [environment.ts](../../back-end/src/config/environment.ts).

A verificação explícita de Origin está no login. O guard CSRF atual não valida Origin/Referer em todas as operações mutáveis. Cookies sem Domain e leitura do CSRF pelo frontend exigem atenção ao desenho de hospedagem; não assuma que qualquer combinação de domínios funciona apenas habilitando CORS.

## Implementado: senhas, permissões e transporte

Novos hashes usam Argon2id, 19 MiB, duas iterações e paralelismo 1. Bcrypt com prefixos `$2a$`/`$2b$` é aceito e migrado após login correto. DTOs de cliente, barbeiro e administrador usam mínimo de 15 e máximo de 128 caracteres para novas senhas. Não há lista de senhas comprometidas implementada nesse fluxo.

O [LoginService](../../back-end/src/modules/autenticacao/service/login.service.ts) usa hash fictício para usuário inexistente, mensagem genérica e limite por e-mail de cinco falhas na janela de quinze minutos, armazenado em memória do processo. O throttling Nest usa uma política padrão de 120 requisições por minuto, por rota (handler) e IP; somente `POST /auth/login` sobrescreve essa política para dez tentativas por minuto. Não há uma segunda política de login aplicada às consultas comuns. O bloqueio envia `Retry-After`, exposto pelo CORS para leitura no frontend. Isso não equivale a um controle distribuído entre várias instâncias.

Aumentar o teto exige medir requisições e respostas 429 por rota/IP em uso real. O ajuste atual corrige a incidência indevida do limite de dez em todas as rotas e preserva os 120 das consultas. A medição de capacidade e um eventual ajuste para usuários que compartilham IP permanecem pendentes.

Guards globais verificam sessão e permissões; a fachada de agendamentos aplica regras de propriedade. Dashboards exigem as permissões correspondentes; o painel do barbeiro obtém a identidade da sessão. Endpoints de autenticação e dashboards definem Cache-Control: no-store; não há aqui garantia universal para toda resposta privada.

[main.ts](../../back-end/src/main.ts) usa Helmet; a CSP é desabilitada fora de produção. Configuração de HTTPS, proxy e hospedagem do frontend não é comprovada pela presença desse middleware.

A jornada `/agendar` pode ser explorada sem sessão; confirmar exige cliente autenticado. O login aceita retorno somente para a rota interna `/agendar`, mantendo as escolhas em memória. Expiração preserva o rascunho, enquanto logout explícito o apaga. A listagem e o cancelamento continuam autorizados pela propriedade no backend. Veja [agendamento do cliente](../../back-end/doc/agendamento-cliente.md).

## Regra para novas alterações

- Nunca retornar ou registrar senha, hash, token de sessão, cookie ou segredo. Não persistir credenciais no navegador.
- Manter autenticação e autorização no servidor para cada operação; verificar propriedade quando necessário, além da permissão geral.
- Preservar senha exatamente como digitada e permitir gerenciadores de senha; impedir envios duplicados.
- Manter mensagens de login genéricas, inclusive para conta inexistente, inativa ou bloqueada.
- Não introduzir operações de negócio mutáveis em GET/HEAD/OPTIONS; isso não exclui atualização interna do último uso de sessão.
- Validar HTTPS, cookies, CORS, CSP e fallback da SPA ao preparar publicação. SameSite é defesa adicional, não substitui CSRF.

## Melhorias pendentes

MFA/passkeys, lista de senhas comprometidas, auditoria centralizada, limites distribuídos, rotação/revogação coordenada após mudanças de privilégios e validação adicional de Origin/Referer são trabalhos separados. Não são controles garantidos por esta documentação.

## Referências

Fontes para orientar evolução, sem substituir a evidência de implementação acima: [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) e [HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

A lista e o detalhe da agenda do barbeiro também exigem explicitamente `GERENCIAR_PROPRIA_AGENDA`. A fachada impõe o ID profissional da sessão e projeta apenas o nome/ID do cliente junto ao resumo do atendimento, sem dados cadastrais privados, observações internas ou comissões. A permissão administrativa conserva seu contrato próprio.

## Reparo direcionado do administrador

O seed passa a cadastrar GERENCIAR_ACESSOS e GERENCIAR_COMISSOES em Permissao,
com vínculo ao papel ADMINISTRADOR. Não use o seed completo em bancos existentes:
ele também modifica dados de demonstração.

Após backup e revisão do banco de destino, um operador pode executar
`psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f back-end/scripts/reparar-permissoes-administrador.sql`.
O reparo transacional usa chave única e upsert; repeti-lo preserva o mesmo estado.
Exige ADMINISTRADOR ativo, sem reativar silenciosamente um papel desabilitado.
Nenhum banco remoto é alterado como parte da implementação.

O resultado contém apenas contagens de usuários e vínculos dos papéis incorretos.
Audite esses vínculos antes de qualquer destinação: mantenha os papéis até que seus
usuários sejam classificados individualmente; não lhes atribua privilégios nem
exclua dependências automaticamente. Confirme o código do papel real do usuário,
status da conta, papel, permissão e vínculo. O nome exibido não concede acesso.

SessaoService resolve permissões no banco a cada requisição. Recarregar a página
restaura a sessão por `/auth/me` e carrega as permissões atuais no contexto.
O painel não oferece uma ação de atualização manual das permissões. Respostas 401
usam o fluxo de expiração existente. Guards e decorators permanecem obrigatórios.

## Transições do atendimento do barbeiro

O PATCH de agendamento aceita do barbeiro somente `status` e `motivoCancelamento`.
A operação serializável relê propriedade e estado, grava a mudança e o histórico
na mesma transação e deriva o responsável da sessão. Início/fim reais são preenchidos
nas transições correspondentes quando ausentes. A resposta usa a mesma projeção
restrita do GET. O barbeiro não pode criar ou consultar a auditoria administrativa
independente (`historico-status`); o histórico de atendimentos é outra consulta.
Não há geração de comissões nessa operação. Conflitos P2034 repetem a transação e
revalidam o estado. Testes simulados não comprovam concorrência no PostgreSQL.

## Contas públicas implementadas

`/cadastro`, `/recuperar-senha` e `/redefinir-senha` usam os três endpoints de
[contas públicas](../../back-end/doc/contas-publicas.md). Somente contas ativas
com papel ativo recuperam senha; o cadastro fixa CLIENTE e não verifica posse do
endereço. CPF/e-mail duplicados têm conflito público genérico. Novas rotas usam
JSON e Origin com isenções específicas de CSRF, sem emitir sessão. O token tem
32 bytes aleatórios, hash persistido e validade de 15 minutos; é consumido apenas
na troca e invalida outros links/sessões na mesma transação. A página remove o
fragmento da URL, guarda token só em memória e usa no-referrer definido no HTML
antes dos scripts. Senhas mantêm espaços. Não há persistência em storage.

A tela exige confirmação local da senha e trata falha de rede, conflito e 429 com
Retry-After. A recuperação aceita reenvio após 60s; o backend também limita três
solicitações por e-mail em 15 minutos, por processo. Cadastro e login preservam
somente retorno `/agendar` em state, com rascunho em memória. Cadastro não autentica;
a pessoa confirma e segue para o login. Credenciais Resend ficam no backend.
