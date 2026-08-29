# Padronização de cores do front-end

Este documento é a fonte canônica para decisões de paleta, tokens e uso de cores no front-end.

## Objetivo e identidade visual

O produto usa uma identidade inspirada em café e barbearia: marrom escuro como cor de ação, bege como cor de apoio, creme como base e neutros quentes para texto e contornos. A paleta deve manter uma experiência elegante, sóbria, legível e consistente.

## Paleta oficial

| Token | Valor | Uso semântico |
| --- | --- | --- |
| `background` | `#F7F3EE` | Fundo principal da aplicação. |
| `surface` | `#FFFFFF` | Superfícies elevadas, como cards, campos e painéis. |
| `primary` | `#5C3A21` | Ação principal, links e destaque de marca. |
| `primary-hover` | `#472C19` | Estado hover da ação primária. |
| `secondary` | `#C89B6D` | Apoio visual e ações secundárias. |
| `foreground` | `#2B2118` | Texto e ícones de maior contraste. |
| `muted` | `#8B7B6B` | Texto auxiliar, descrições e placeholders. |
| `border` | `#E7DDD3` | Contornos e separadores. |
| `success` | `#4F7A55` | Estados e mensagens de sucesso. |
| `danger` | `#B84A4A` | Estados destrutivos, erros e alertas críticos. |

`background` é o fundo da página; `surface`, o fundo de um bloco de conteúdo. `primary` representa a ação principal e `secondary` é um apoio, não um substituto para todas as ações. `foreground` é o texto principal, enquanto `muted` reduz a ênfase. `border` estrutura a interface; `success` e `danger` comunicam estados, não decoração.

## Uso com Tailwind CSS

O projeto usa Tailwind CSS v4. Os tokens vivem em `src/index.css` como CSS variables e são expostos como utilitários Tailwind. Use-os diretamente nas classes:

```tsx
// Fundo da aplicação
<main className="min-h-screen bg-background text-foreground" />

// Button
<Button className="bg-primary text-white hover:bg-primary-hover">
  Salvar
</Button>

// Card
<Card className="bg-surface border border-border text-foreground" />

// Input
<Input className="border-border bg-surface text-foreground placeholder:text-muted" />
```

Evite valores arbitrários ou hexadecimais em componentes:

```tsx
// Evitar
<Button className="bg-[#5C3A21] text-white">Salvar</Button>
```

Uma nova cor não deve ser criada para atender um componente isolado. Primeiro verifique se um token existente resolve a necessidade. Se não resolver, valide que se trata de uma necessidade reutilizável do Design System, escolha um nome semântico, adicione a variável e o mapeamento Tailwind em `src/index.css`, integre-a ao HeroUI quando aplicável e atualize esta tabela e seus exemplos no mesmo PR.

## Integração com HeroUI

HeroUI é importado em `src/index.css` e seus tokens de tema são conectados aos tokens oficiais: `--accent` usa `--primary`, campos usam `surface`, `foreground`, `muted` e `border`, e os estados de sucesso e perigo usam `success` e `danger`. Assim, componentes HeroUI e classes Tailwind compartilham a mesma paleta, sem uma segunda definição de cores.

Para botões ou variantes nativas do HeroUI, prefira a variante que use o acento do tema; para ajustes de layout, continue usando os tokens Tailwind acima.

## Novos componentes, contraste e dark mode

Ao criar um componente, escolha a intenção visual antes da cor: página (`background`), conteúdo (`surface`), ação (`primary`), texto (`foreground` ou `muted`), estrutura (`border`) ou estado (`success`/`danger`). Garanta contraste suficiente entre texto e fundo; em especial, use texto branco sobre `primary`, `success` e `danger`, e `foreground` sobre `background` e `surface`.

O modo escuro deve sobrescrever esses mesmos tokens em `.dark` ou `[data-theme="dark"]` dentro de `src/index.css`; os componentes não devem mudar suas classes. Ao implementá-lo, mantenha os mapeamentos HeroUI (`accent`, campos e estados) alinhados aos tokens semânticos e atualize este documento.
