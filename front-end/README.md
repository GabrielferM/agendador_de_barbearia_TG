# Frontend — Agendador de Barbearia

SPA em React, TypeScript e Vite, com Tailwind CSS, HeroUI e TanStack Query. Consulte o [índice de documentação](docs/README.md) e o [AGENTS](AGENTS.md) antes de alterar código.

## Execução local

Com os [pré-requisitos do projeto](../README.md), execute a partir de `front-end/`:

```bash
npm ci
npm run dev
```

A URL padrão é `http://localhost:5173`. Para consumir dados reais, inicie também o backend. Configuração opcional em `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_USAR_DADOS_MOCKADOS=false
```

Variáveis `VITE_` são públicas no bundle: não coloque segredos nelas. O modo de mocks precisa ser habilitado explicitamente com `true` nas telas que o suportam; ele não comprova integração real.

## Fluxos e validação

A página inicial consome catálogo; login restaura sessão por cookies. Dashboards possuem dados reais e modo demonstrativo; algumas áreas ainda estão em construção. Veja [arquitetura](docs/arquitetura.md).

Para verificar alterações, siga [testes](docs/testes.md). `npm run build` gera o bundle; `npm run preview` permite inspecioná-lo localmente, sem configurar um servidor de produção. A hospedagem precisa servir `index.html` para rotas da SPA.

A geração Orval, suas variáveis e os arquivos manuais estão documentados em [integração com a API](docs/integracao-api.md). Não regenere clientes durante alterações exclusivamente documentais.
