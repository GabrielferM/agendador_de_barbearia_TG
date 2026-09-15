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
