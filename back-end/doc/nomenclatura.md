# Nomenclatura do backend

## Regra para novas alterações

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Arquivos/pastas manuais | kebab-case, domínio em português sem acentos | `criar-servico.service.ts` |
| Classes e tipos | PascalCase | `CriarServicoService`, `CriarServicoDto` |
| Métodos e variáveis | camelCase | `buscarPorId`, `inicioPrevisto` |
| Constantes escalares de configuração | UPPER_SNAKE_CASE | `SESSAO_DURACAO_MS` |
| Hooks/frameworks/decorators | Nome técnico original | `Injectable`, `execute` |
| Rotas de recursos | Plural em português sem acentos | `/servicos`, `/agendamentos` |

Casos de uso simples expõem `execute`; fachadas usam verbos do domínio, como `criar` e `listar`. Preserve operações auxiliares nomeadas quando uma única entrada artificial não ajudar. Controllers, módulos e DTOs mantêm os sufixos Nest: `Controller`, `Module`, `Service`, `Dto`.

Prefira nomes específicos, como `validar-vinculos-agendamento.service.ts`, a arquivos genéricos como `helpers.ts`. DTOs ficam em `dto/`; podem ser separados por operação ou agrupados por recurso conforme a organização existente. Testes unitários ficam próximos da implementação com `.spec.ts`; testes HTTP usam `.e2e-spec.ts` em `test/`.

## Compatibilidade e exceções

O código já usa constantes-objeto em camelCase, como `includeAgendamento`, e rotas especiais como `/auth`, `/publico` e `/health`. Preserve-as. Não traduza métodos de bibliotecas nem renomeie rotas, campos JSON, modelos Prisma ou tabelas apenas por estilo.

O [schema](../prisma/schema.prisma) usa modelos PascalCase, campos camelCase, enums com valores maiúsculos e mapeamentos de tabela em snake_case. Esses nomes fazem parte da persistência; qualquer alteração precisa de justificativa funcional.

Documentação e comentários explicativos devem usar português. Não renomeie arquivos legados em massa. Consulte [arquitetura](arquitetura.md) para decidir onde uma responsabilidade pertence.
