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

O [LoginService](../../back-end/src/modules/autenticacao/service/login.service.ts) usa hash fictício para usuário inexistente, mensagem genérica e limite por e-mail de cinco falhas na janela de quinze minutos, armazenado em memória do processo. Há também throttling Nest global e de login. Isso não equivale a um controle distribuído entre várias instâncias.

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

Recuperação de senha e cadastro público ainda são telas em construção. MFA/passkeys, lista de senhas comprometidas, auditoria centralizada, limites distribuídos, rotação/revogação coordenada após mudanças de privilégios e validação adicional de Origin/Referer são trabalhos separados. Não são controles garantidos por esta documentação.

## Referências

Fontes para orientar evolução, sem substituir a evidência de implementação acima: [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) e [HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).
