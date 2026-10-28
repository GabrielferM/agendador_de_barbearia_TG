-- Teste SQL isolado em tabelas temporárias; não usa tabelas da aplicação.
\set ON_ERROR_STOP on
SET search_path TO pg_temp;
CREATE TEMP TABLE papel (id serial PRIMARY KEY, codigo text UNIQUE, ativo boolean);
CREATE TEMP TABLE permissao (id serial PRIMARY KEY, codigo text UNIQUE, nome text, descricao text, ativo boolean);
CREATE TEMP TABLE papel_permissao (id serial PRIMARY KEY, "idPapel" int REFERENCES papel, "idPermissao" int REFERENCES permissao, "dataAtribuicao" timestamp, ativo boolean, UNIQUE("idPapel", "idPermissao"));
CREATE TEMP TABLE usuario (id serial PRIMARY KEY, "idPapel" int REFERENCES papel);
INSERT INTO papel (codigo, ativo) VALUES ('ADMINISTRADOR', true), ('GERENCIAR_COMISSOES', true), ('CLIENTE', true);
INSERT INTO usuario ("idPapel") VALUES (2);
\ir ../scripts/reparar-permissoes-administrador.sql
CREATE TEMP TABLE resultado AS SELECT * FROM papel_permissao;
\ir ../scripts/reparar-permissoes-administrador.sql
DO $$ BEGIN
 IF (SELECT count(*) FROM permissao) <> 2 OR (SELECT count(*) FROM papel_permissao) <> 2
 OR EXISTS (SELECT * FROM papel_permissao EXCEPT SELECT * FROM resultado)
 OR EXISTS (SELECT 1 FROM papel_permissao WHERE "idPapel" <> 1)
 OR NOT EXISTS (SELECT 1 FROM usuario WHERE "idPapel" = 2)
 THEN RAISE EXCEPTION 'Falha de idempotência ou isolamento do reparo'; END IF;
END $$;
