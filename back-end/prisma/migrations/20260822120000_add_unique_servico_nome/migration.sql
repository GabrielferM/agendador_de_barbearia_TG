-- This unique index intentionally fails if historical duplicate service names exist.
CREATE UNIQUE INDEX "servico_nome_key" ON "servico"("nome");
