# Formulários, máscaras e serialização

## Implementado

Yup valida os formulários de clientes, barbeiros, serviços e filiais administrativos, login, contas públicas, períodos de consulta, agendamento do cliente e cancelamentos. Serviços possuem criação/edição e barbeiros possuem edição de conta/perfil, conforme [administração](administracao.md).

[Regras e máscaras compartilhadas](../src/forms/campos.ts) concentram CPF/CNPJ com dígitos verificadores, telefone com DDD (10/11 dígitos), CEP, UF, datas e aniversário. Os schemas específicos ficam próximos das funcionalidades; períodos, filtros, seleção de agendamento e cancelamento reutilizam [schemas de operações](../src/forms/schemas-operacoes.ts).

O formulário administrativo compartilhado recebe um schema Yup obrigatório, aplica máscaras na abertura e durante a edição, valida ao sair do campo e no envio e revalida campos com erro durante a correção. `ErroCampo` associa mensagens a `aria-describedby`; campos inválidos possuem `aria-invalid`. Envio inválido foca o primeiro campo na ordem do formulário. Valores são preservados em falhas. Gravações impedem repetição enquanto pendentes, sem retry automático.

Contas públicas e login preservam sua apresentação e os fluxos de recuperação/sessão. Os filtros de datas utilizam o hook compartilhado `useValidacaoFormulario`, sem aplicar filtros inválidos à URL ou consultar a API. URLs inválidas do barbeiro continuam impedindo consultas. Períodos aceitam até 366 dias inclusivos e exigem datas reais e ordem válida.

| Entrada | Interface | Payload |
| --- | --- | --- |
| CPF | `000.000.000-00` | 11 dígitos |
| Telefone | `(00) 0000-0000` ou `(00) 00000-0000` | 10/11 dígitos |
| CNPJ | Formato numérico `00.000.000/0000-00` | 14 dígitos; preserva suporte atual |
| CEP | `00000-000` | 8 dígitos |
| UF | Maiúsculas; somente UFs brasileiras | Duas letras |
| Nome/e-mail | Validação após remover espaços externos | Nome aparado; e-mail normalizado pela API |
| Senha | Conteúdo e espaços preservados | Sem trim; novas senhas com 15–128 caracteres |

Senha vazia na edição do cliente é omitida do PATCH. Login exige senha preenchida e não aplica a exigência de 15 caracteres às credenciais existentes. Data de admissão é opcional e deve existir no calendário. Foto opcional exige URL HTTP/HTTPS. Motivo de cancelamento exige conteúdo após trim e aceita até 1000 caracteres.

## Aniversário do cliente

Cadastro público e administração apresentam “Aniversário (opcional)” com dia e mês, sem ano ou regra de idade. O par usa `diaAniversario` e `mesAniversario` numéricos na API e aceita 29/02. Um único campo ou uma combinação como 31/04 impede o envio. Na edição, limpar ambos envia dois `null`; no PATCH direto, omitir ambos preserva o valor.

O contrato `dataNascimento` foi substituído. Banco, seed, DTOs, serviços e modelos Orval acompanham a mudança. Migração e compatibilidade estão em [validação do backend](../../back-end/doc/tratamento-de-erros.md#aniversário-e-normalização-de-cadastros).

## Regra para novas alterações

Reutilize máscaras e regras existentes; mantenha a validação de domínio no servidor. Máscara é apresentação, não prova de validade. Projete explicitamente o payload no adapter, excluindo confirmação de senha, campos de interface e propriedades desconhecidas. Campos opcionais seguem o contrato de cada endpoint: não converta vazio, ausência e `null` indistintamente.

Preserve consultas de disponibilidade e revalidação transacional do agendamento. Erros HTTP seguem o [guia de erros](tratamento-de-erros.md); nenhuma mensagem desconhecida do servidor deve ser apresentada diretamente.

## Validação e limites

Testes cobrem máscaras, dígitos verificadores, aniversário incompleto/impossível, 29/02, senha, filtros, payloads normalizados, foco, preservação após erro e prevenção de duplicação. Veja [testes](testes.md#padronização-de-formulários-e-aniversário).

O cadastro público foi inspecionado no navegador em desktop e viewport móvel de 390 × 844: erros por campo, foco inicial, máscaras, rejeição de 31/04, correção para 29/02 e ausência de overflow horizontal. Nenhuma conta foi criada nessa inspeção. As telas protegidas de administrador e barbeiro foram verificadas por testes de interação em jsdom com sessão/HTTP simulados; a inspeção visual autenticada dessas telas permanece pendente.

## Apresentação administrativa e proteção de alterações

`DialogoAdministrativo` compõe Modal.Backdrop/Container/Dialog do HeroUI 3 em portal. O corpo tem rolagem vertical interna, cabeçalho contextual e largura máxima de 640 px. Ações do formulário ficam aderentes ao rodapé visível do corpo. Campos e filtros compartilham altura mínima de 44 px, borda/foco/desabilitado/erro com tokens semânticos. Textareas e campos extensos ocupam toda a largura. Uma coluna no celular e até duas a partir de `sm`; grupos usam alinhamento pelo topo e espaçamento próprio entre label, campo, descrição e erro, evitando esticar campos vizinhos quando uma mensagem cresce.

Criações montam valores/erros limpos; edições carregam detalhes atuais. A comparação de alterações usa os valores iniciais formatados, incluindo máscaras. Cancelar, Escape e clique no fundo confirmam descarte quando necessário, com foco inicial em Continuar editando. Falhas preservam valores; gravação bloqueia envio e fechamento até concluir. O foco inicial vai para o primeiro campo e volta à origem ao fechar, com fallback no botão de criação se a origem sair da listagem.

Serviços validam nome, duração inteira positiva e preço positivo com duas casas, serializado como `precoBase`. A senha opcional da edição de barbeiro usa a mesma regra de novas senhas e é omitida quando vazia. Foto/admissão vazias preservam os valores existentes; descrição e nome profissional aceitam atualização conforme o contrato. Máscaras, aniversário e regras das demais jornadas permanecem compartilhados.
