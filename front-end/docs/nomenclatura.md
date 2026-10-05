# Nomenclatura do frontend

## Regra para novas alterações

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Arquivos/pastas manuais novos | kebab-case sem acentos | `formulario-login.tsx` |
| Componentes, classes e tipos | PascalCase | `FormularioLogin`, `ErroLogin` |
| Funções, props e variáveis | camelCase | `autenticar`, `carregando` |
| Hooks | `use` seguido de PascalCase | `useServicosInicio` |
| Arquivo de hook | kebab-case com `use-` | `use-servicos-inicio.ts` |
| Constantes de configuração | UPPER_SNAKE_CASE | `CODIGOS_PAPEL` |
| Testes | `.test.ts` ou `.test.tsx` | `formulario-login.test.tsx` |

Use português para conceitos do domínio e preserve nomes técnicos como `QueryClient`, `props` e `useState`. Componentes recebem nomes que descrevem sua função, e booleanos devem indicar estado ou condição. Evite arquivos genéricos como `components.tsx` em código novo quando houver um nome de responsabilidade mais claro.

## Exceções existentes

Há componentes com arquivos PascalCase (`FormularioLogin.tsx`, `Hero.tsx`), páginas em `index.tsx`, arquivos agrupados e configurações como `App.tsx`. Preserve esses caminhos; não faça renomeação em massa como parte de uma alteração funcional. A convenção kebab-case vale para novos arquivos manuais, respeitando nomes exigidos pelas ferramentas.

O Orval gera nomes conforme contratos e tags, inclusive pastas com acentos e modelos camelCase. Não renomeie esses arquivos ou seus exports manualmente. `client.ts`, `http-client.ts` e os adapters de dashboard são manuais; a pasta `api` não é totalmente gerada. Veja [integração](integracao-api.md).

Não traduza campos da API ao acaso. Quando a interface precisar de um modelo de apresentação, faça a conversão explicitamente no hook/adapter, como em [useServicosInicio](../src/pages/inicio/hooks/use-servicos-inicio.ts).
