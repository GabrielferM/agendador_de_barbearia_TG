-- Reparo direcionado: executar com psql -v ON_ERROR_STOP=1 -f <este arquivo>.
-- Não altera usuários, sessões, papéis legados nem dados demonstrativos.
BEGIN;
SELECT pg_advisory_xact_lock(83270431);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM papel WHERE codigo = 'ADMINISTRADOR' AND ativo) THEN
    RAISE EXCEPTION 'Papel ADMINISTRADOR ativo não encontrado; audite o papel antes do reparo.';
  END IF;
END $$;
INSERT INTO permissao (codigo, nome, descricao, ativo) VALUES
 ('GERENCIAR_ACESSOS', 'Gerenciar acessos', 'Administrar papeis e permissoes.', true),
 ('GERENCIAR_COMISSOES', 'Gerenciar comissoes', 'Visualizar e administrar comissoes.', true)
ON CONFLICT (codigo) DO UPDATE SET nome = EXCLUDED.nome, descricao = EXCLUDED.descricao, ativo = true;
INSERT INTO papel_permissao ("idPapel", "idPermissao", "dataAtribuicao", ativo)
 SELECT p.id, pe.id, now(), true FROM papel p CROSS JOIN permissao pe
 WHERE p.codigo = 'ADMINISTRADOR' AND p.ativo
 AND pe.codigo IN ('GERENCIAR_ACESSOS', 'GERENCIAR_COMISSOES')
ON CONFLICT ("idPapel", "idPermissao") DO UPDATE SET ativo = true;
-- Somente contagens para revisão dos papéis incorretos. Não migra privilégios.
SELECT p.codigo, p.ativo,
 (SELECT count(*) FROM usuario u WHERE u."idPapel" = p.id) AS usuarios,
 (SELECT count(*) FROM papel_permissao pp WHERE pp."idPapel" = p.id) AS vinculos
 FROM papel p WHERE p.codigo IN ('GERENCIAR_ACESSOS', 'GERENCIAR_COMISSOES');
COMMIT;
