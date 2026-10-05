# Guia do backend

## Escolha a leitura

| Tarefa | Documento |
| --- | --- |
| Jornada do cliente e disponibilidade | [Agendamento do cliente](agendamento-cliente.md) |
| Entender domínio, camadas e persistência | [Arquitetura](arquitetura.md) |
| Nomear arquivos, classes e contratos | [Nomenclatura](nomenclatura.md) |
| Validar entradas e tratar falhas | [Tratamento de erros](tratamento-de-erros.md) |
| Validar uma alteração | [Testes](testes.md) |
| Alterar sessão, cookies ou permissões | [Segurança compartilhada](../../front-end/docs/seguranca-autenticacao.md) |
| Executar a aplicação | [README do backend](../README.md) |

## Como manter estes documentos

**Implementado** descreve comportamento confirmado no código. **Regra para novas alterações** orienta próximas contribuições, sem afirmar que todo legado já a segue. **Melhoria pendente** exige trabalho separado; não é uma funcionalidade disponível.

Ao mudar um comportamento, atualize seu guia e exemplos no mesmo trabalho. Use links relativos para a implementação e fontes externas para recomendações; registre limitações conhecidas. O schema define persistência, e o código/configuração confirma o comportamento em execução. Se divergirem da documentação, registre a diferença antes de resolvê-la; não invente garantias.

## AGENTS, docs e Codex

`AGENTS.md` reúne regras e leituras por tarefa. Há instruções gerais na raiz e específicas em cada aplicação; as instruções mais próximas especializam o trabalho naquela pasta. Guias linkados devem ser consultados conforme a tarefa, não são carregados integralmente apenas por existirem.

Os diretórios de documentação guardam arquitetura, exemplos e decisões explicadas para pessoas e agentes. `.codex/config.toml` serve para configurações da ferramenta, não é necessário para esta documentação. Skills são procedimentos reutilizáveis e também não são necessárias nesta entrega. Mantemos os caminhos atuais, sem criar configurações extras.

Fontes: [instruções AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) e [configuração do Codex](https://learn.chatgpt.com/docs/config-file/config-basic), consultadas na pesquisa de 15/09/2026.
