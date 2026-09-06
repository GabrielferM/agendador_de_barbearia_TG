INSERT INTO "permissao" ("codigo", "nome", "descricao", "ativo")
VALUES
  ('GERENCIAR_ACESSOS', 'Gerenciar acessos', 'Administrar papeis e permissoes.', true),
  ('GERENCIAR_COMISSOES', 'Gerenciar comissoes', 'Visualizar e administrar comissoes.', true)
ON CONFLICT ("codigo") DO UPDATE SET
  "nome" = EXCLUDED."nome",
  "descricao" = EXCLUDED."descricao",
  "ativo" = true;

INSERT INTO "papel_permissao" ("idPapel", "idPermissao", "ativo")
SELECT papel."id", permissao."id", true
FROM "papel"
CROSS JOIN "permissao"
WHERE papel."codigo" = 'ADMINISTRADOR'
  AND permissao."codigo" IN ('GERENCIAR_ACESSOS', 'GERENCIAR_COMISSOES')
ON CONFLICT ("idPapel", "idPermissao") DO UPDATE SET "ativo" = true;
