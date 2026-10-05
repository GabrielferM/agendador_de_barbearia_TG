# Instruções do projeto

## Leitura por tarefa

- Comece pelo [README](README.md) para execução e mapa de documentação.
- Backend: leia [AGENTS do backend](back-end/AGENTS.md) e [arquitetura](back-end/doc/arquitetura.md) antes de alterar código.
- Frontend: leia [AGENTS do frontend](front-end/AGENTS.md) e [arquitetura](front-end/docs/arquitetura.md).
- Contratos entre aplicações: consulte os guias de erros e integração apontados nos índices de [backend](back-end/doc/README.md) e [frontend](front-end/docs/README.md).

## Regras comuns

- Preserve alterações existentes do usuário; revise o diff antes de concluir.
- Use português na documentação e nos termos do domínio; preserve nomes técnicos e contratos existentes.
- Mantenha a stack atual. Não introduza camadas, dependências ou pastas vazias sem necessidade concreta.
- Não altere schema, migrations ou contratos públicos sem necessidade explícita da tarefa.
- Não exponha senhas, hashes, cookies, tokens ou segredos em respostas, logs, exemplos ou commits.
- Ao mudar comportamento, atualize o guia canônico correspondente no mesmo trabalho. Distinga implementação, regra para novas alterações e melhoria pendente.
- Execute as verificações indicadas no AGENTS da aplicação alterada; informe falhas e verificações não executadas.
- Para alterações exclusivamente documentais, confira caminhos, links, exemplos e diff. Não regenere código ou execute migrations.

Os AGENTS contêm instruções curtas; os guias contêm detalhes e exemplos. Não duplique manuais aqui nem crie configuração em `.codex` para substituir documentação.
