# Cadastro público e recuperação de senha

## Implementado

Inspeção inicial da `main`: `481a3cb65b5c47b11f863875b005f5715171cbdc`.
A autenticação continua usando sessão em cookie, PrismaService e SenhaService.
As páginas antes em construção passam a consumir três operações públicas de autenticação.

| Endpoint POST | Entrada JSON | Sucesso 200 |
| --- | --- | --- |
| `/auth/cadastro-cliente` | nome, email, cpf, telefone opcional, senha | mensagem de criação; sem sessão |
| `/auth/recuperar-senha` | email | mensagem genérica, independentemente da elegibilidade/envio |
| `/auth/redefinir-senha` | token, senha | confirmação; login normal necessário |

Swagger documenta DTOs e respostas; campos extras são rejeitados pelo ValidationPipe.
Não envie confirmação da senha: ela é validada na tela. Senhas mantêm espaços e
aceitam de 15 a 128 caracteres. CPF é normalizado/validado pelas regras existentes.
Cadastro reutiliza CriarClienteService e seu nested write Usuario+Cliente; o papel
CLIENTE precisa existir e estar ativo. Nenhum dado administrativo vem do cliente.
Unicidade no banco cobre CPF/e-mail concorrentes, com conflito público genérico
409. Cadastro não verifica posse do e-mail e não vincula contas existentes.

O interceptor específico exige JSON e verifica Origin antes do DTO; Origin ausente
só é tolerado fora de produção, conforme a política local do login. Em produção,
use a origem exata em CORS_ORIGINS. As três rotas têm isenção pontual de CSRF porque
não exigem sessão; não emitem cookies nem modificam a conta autenticada implícita.
A redefinição exige a capacidade secreta contida no link. Guards/CSRF privados
continuam ativos. Respostas processadas pelo interceptor usam `no-store`, inclusive
erros de validação. O throttling global pode rejeitar antes do interceptor.

## Tokens, transações e limites

A migration aditiva `20261102030000_recuperacao_senha` cria `recuperacao_senha`,
com FK para usuário, SHA-256 único, criação, expiração, consumo e índices por
usuário/consumo e expiração. Tokens têm 32 bytes criptográficos aleatórios (base64url),
validade fixa de 15 minutos e nunca são persistidos em claro. A solicitação não
altera senha/status/sessões; links anteriormente emitidos ainda podem ser usados
até a primeira redefinição ou sua expiração. Falha de envio invalida o novo link. Falhas internas de persistência também preservam a resposta pública genérica, com aviso operacional sanitizado.

A redefinição relê usuário/papel ativo em transação Serializable, reivindica o token
com updateMany condicional, grava hash Argon2id, consome todos os demais links e
revoga todas as sessões. O helper existente repete P2034 até três vezes, revalidando
a elegibilidade e o consumo. A troca não reativa conta nem altera papel. A notificação
é posterior ao commit; sua falha não desfaz a senha. O login também confere o hash
com updateMany condicional dentro da transação antes de criar a sessão: uma
verificação da senha antiga feita antes da troca não pode emitir sessão depois dela.

| Operação | Limite por IP/handler | Limite por e-mail normalizado |
| --- | --- | --- |
| Recuperar | 5/minuto | 3/15 minutos; intervalo mínimo de 60s |
| Redefinir | 10/minuto | capacidade limitada por token de uso único |
| Cadastro | 5/minuto | unicidade de conta no banco |

Esses limites são em memória por processo; múltiplas instâncias multiplicam os tetos.
Não são bloqueios de conta. O mapa por e-mail guarda hash, limpa janelas vencidas e
limita a 10 mil chaves; saturação retorna 429 também para endereços novos. Retry-After
é enviado nos limites. Consultas comuns preservam 120/minuto. Operação aceita de
recuperação aguarda um piso de 3,5–3,65s, maior que o timeout de 3s do provedor, também
para conta inexistente/inativa/bloqueada. Isso reduz diferenças evidentes; não é prova
de tempo constante sob latência excepcional do banco. Não há fila durável nesta entrega.

## Configuração externa e envio real

Backend apenas: `RESEND_API_KEY`, `EMAIL_FROM` (somente endereço, sem nome entre
ângulos) e `FRONTEND_URL` (origem sem caminho/query/credenciais). O trio é obrigatório
em produção; fora dela pode estar integralmente ausente, caso em que o envio falha
com aviso operacional sanitizado e resposta pública genérica. Configuração parcial
ou inválida é rejeitada ao iniciar. Produção exige FRONTEND_URL HTTPS.
Nunca use VITE_* para esses valores. Veja [placeholders](../.env.example).

1. No Resend, cadastre seu domínio e publique os registros DNS indicados pelo
   provedor. Aguarde sua verificação e configure um remetente desse domínio.
2. Crie chave de envio e configure o trio acima no ambiente do backend. Ajuste
   CORS_ORIGINS, HTTPS e cookies de acordo com a hospedagem existente.
3. Após revisão/backup, um operador aplica a migration no banco de destino usando
   o procedimento de deploy do projeto. Nenhum banco remoto foi migrado nesta tarefa.
4. Em teste local, use FRONTEND_URL=http://localhost:5173 e um destinatário permitido
   pela conta do Resend. O provedor deve estar configurado; a aplicação não imprime
   links nem substitui envio por sucesso fictício.
5. Solicite recuperação de uma conta ativa, confirme a chegada na caixa do destinatário
   e a identificação do envio no Resend. Abra o link, troque a senha, confirme que
   a sessão antiga não funciona e faça login com a nova senha. Guarde evidência
   sanitizada, sem senha/token/link completo. Verifique também a notificação da troca.

A integração usa [POST /emails do Resend](https://resend.com/docs/api-reference/emails/send-email),
fetch nativo, timeout e resposta de aceitação com id. Aceitação não comprova entrega
na caixa de entrada. HTML/texto incluem identidade Corte Certo, botão, prazo,
link alternativo e orientação para ignorar solicitação desconhecida. Logs incluem
somente aviso fixo; destinatário, token e corpo do provedor não são registrados.

O link usa `/redefinir-senha#token=...`: o fragmento não integra a requisição ao
servidor web nem Referer. A SPA remove o fragmento e mantém o token apenas em memória;
recarregar após a remoção exige reabrir o e-mail. A abertura não consome o token.
O HTML inicial define no-referrer antes dos scripts. Não acrescente analytics,
recursos externos ou captura de payload nas páginas sensíveis. A infraestrutura
externa também deve excluir corpos e segredos da observabilidade.

## Limpeza e verificações

Agende pelo procedimento operacional existente uma limpeza diária de registros
cuja dataExpiracao seja anterior a 30 dias. Exemplo para revisão por operador:

```sql
DELETE FROM recuperacao_senha
WHERE "dataExpiracao" < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

A consulta usa índice de expiração; em bases grandes, execute em lotes e monitore
volume. Nenhum job, cron remoto ou limpeza de dados foi executado nesta entrega.

Unitários e HTTP usam Prisma/provedor simulados; o piso temporal é substituído
apenas nos testes. Cobrem elegibilidade, falhas, expiração, reutilização, CAS,
revogação, login após cadastro/troca, políticas públicas e limites. Eles não provam
concorrência/rollback no banco real. A suíte `test/conta-postgres.e2e-spec.ts` é
opt-in e fica ignorada sem DATABASE_URL_TESTE; exige banco local vazio de dados,
com nome terminado em `_auth_test`, somente migrations aplicadas e sem seed:

```bash
# Somente PostgreSQL local descartável criado especificamente para testes.
DATABASE_URL="$DATABASE_URL_TESTE" npx prisma migrate deploy
DATABASE_URL="$DATABASE_URL_TESTE" npm run test:e2e -- --runInBand
```

Exporte DATABASE_URL_TESTE previamente para os dois comandos. A suíte valida mesmo
token e tokens diferentes concorrentes, CPF/e-mail duplicados e ausência de usuário
órfão. Cria e remove somente suas próprias fixtures; recusa hosts remotos. PostgreSQL
isolado e entrega real do Resend não foram validados neste ambiente.

Fora do escopo: verificação de e-mail, login automático/social, MFA, SMS/WhatsApp,
recuperação administrativa, filas/Redis, notificações de agendamento e marketing.
