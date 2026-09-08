# Segurança da autenticação

Este documento descreve as proteções implementadas no React e no NestJS. A proteção de rota no React melhora a experiência; a autoridade final continua sendo o back-end.

## Contrato implementado

O formulário envia `POST /auth/login` com JSON no formato abaixo e inclui cookies com `credentials: "include"`:

```json
{
  "email": "pessoa@exemplo.com",
  "senha": "senha informada sem alteração"
}
```

Uma resposta de sucesso deve usar o status `200` e este formato:

```json
{
  "usuario": {
    "id": 1,
    "nome": "Nome da pessoa",
    "email": "pessoa@exemplo.com",
    "papel": "CLIENTE",
    "permissoes": ["CRIAR_AGENDAMENTO"]
  }
}
```

`papel` aceita `CLIENTE`, `BARBEIRO` ou `ADMINISTRADOR`. Respostas `401` e `403` geram a mesma mensagem genérica. A resposta `429` pode fornecer `Retry-After`. Outros erros e respostas fora do contrato são apresentados como indisponibilidade, sem repassar detalhes internos.

O front-end:

- não persiste senha, identificador de sessão, JWT ou refresh token em `localStorage` ou `sessionStorage`;
- não registra credenciais no console;
- altera somente os espaços externos do e-mail e preserva a senha exatamente como digitada;
- impede envios duplicados enquanto a requisição está pendente;
- usa `autocomplete="username"` e `autocomplete="current-password"` para permitir gerenciadores de senha;
- não usa as rotas provisórias como mecanismo de autorização.

O cliente HTTP é gerado pelo Orval. O mutator comum envia cookies em todas as chamadas e lê somente o cookie CSRF para operações mutáveis. A sessão é restaurada por `GET /auth/me`, mantida apenas em memória e encerrada por `POST /auth/logout`.

## Sessão e transporte

- Servir toda a aplicação por HTTPS e ativar HSTS em produção.
- A sessão opaca é persistida no PostgreSQL somente como SHA-256 do token. Em produção usa `__Host-sessao`; em desenvolvimento, `sessao`.
- O cookie possui `HttpOnly`, `Secure` em produção, `SameSite=Lax`, `Path=/`, sem `Domain` e duração máxima de sete dias.
- Nunca retornar o identificador da sessão no corpo nem disponibilizá-lo ao JavaScript.
- Gerar um novo identificador após o login e qualquer mudança de privilégio, evitando fixação de sessão.
- A sessão expira após oito horas sem uso ou sete dias desde sua criação. `ultimoUso` é atualizado no máximo uma vez a cada cinco minutos; logout revoga a sessão.
- Retornar `Cache-Control: no-store` em respostas de autenticação e conteúdo privado.

Referência: [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## CORS e CSRF

O NestJS habilita credenciais apenas para origens configuradas. O CSRF usa double-submit assinado por HMAC e vinculado à sessão: o cookie legível precisa coincidir com `X-CSRF-Token` e ter assinatura válida.

- Validar `Origin` e, como defesa adicional, `Referer` nas operações mutáveis.
- Adotar token CSRF sincronizado ou double-submit assinado para requisições que alteram estado.
- Tratar `SameSite` como defesa adicional, não como substituto universal do controle CSRF.
- Não permitir que rotas `GET`, `HEAD` ou `OPTIONS` modifiquem dados.

Referência: [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Senhas e proteção contra abuso

Novas senhas usam Argon2id com 19 MiB, duas iterações e paralelismo 1. Hashes bcrypt `$2a$` e `$2b$` continuam válidos temporariamente e são migrados para Argon2id após um login correto.

- Para senha usada como fator único, adotar no cadastro um mínimo de 15 caracteres e aceitar ao menos 64 caracteres, inclusive espaços e Unicode.
- Não exigir combinações arbitrárias de maiúsculas, números e símbolos, nem trocas periódicas sem indício de comprometimento.
- Comparar novas senhas com uma lista de valores comuns e comprometidos.
- Aplicar limites independentes por conta e por origem/IP, com atraso progressivo. Controles de bot devem ser acionados por risco para não bloquear indiscriminadamente pessoas legítimas.
- Manter a mesma mensagem, código HTTP e comportamento observável para e-mail inexistente, senha incorreta, conta inativa ou bloqueada, reduzindo enumeração de usuários.
- Oferecer MFA e, preferencialmente, passkeys/WebAuthn para administradores e equipe.

Referências: [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) e [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

## Recuperação, autorização e auditoria

- A recuperação de senha deve sempre responder de forma genérica e em tempo semelhante, exista ou não uma conta para o e-mail.
- Tokens de recuperação devem ser criptograficamente aleatórios, armazenados de forma segura, ter expiração curta e aceitar um único uso.
- Todas as permissões devem ser verificadas no servidor em cada operação. O padrão deve ser negar acesso quando papel ou permissão não forem reconhecidos.
- Registrar sucessos, falhas, bloqueios, recuperações e mudanças de privilégio sem gravar senhas, cookies ou tokens. Alertar sobre padrões anormais.

### Dashboards protegidos

- `GET /dashboard/administrador` exige `GERENCIAR_AGENDAMENTOS` e retorna somente métricas agregadas e resumos operacionais.
- `GET /dashboard/barbeiro` exige `GERENCIAR_PROPRIA_AGENDA`; o barbeiro é identificado exclusivamente pela sessão e nunca por um identificador enviado pelo navegador.
- As duas respostas usam `Cache-Control: no-store` e não incluem e-mail, telefone, observações internas, cookies ou tokens.
- `/admin` e `/barbeiro` também verificam o papel no React para evitar a renderização indevida durante a navegação, mantendo o servidor como autoridade final.

Referência: [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

## Cabeçalhos e publicação

Configurar no proxy ou no NestJS:

- `Content-Security-Policy`, começando restritiva e liberando somente origens necessárias;
- `frame-ancestors 'none'` ou política equivalente contra clickjacking;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin` ou mais restritiva;
- `Strict-Transport-Security` somente depois que HTTPS estiver correto em todos os subdomínios afetados.

O servidor que hospedar o front-end também precisa reescrever rotas da SPA, como `/login`, para `index.html`.

Referência: [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).
