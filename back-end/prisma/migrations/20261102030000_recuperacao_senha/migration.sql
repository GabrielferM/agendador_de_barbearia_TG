CREATE TABLE "recuperacao_senha" (
 "id" TEXT NOT NULL,
 "idUsuario" INTEGER NOT NULL,
 "tokenHash" TEXT NOT NULL,
 "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "dataExpiracao" TIMESTAMP(3) NOT NULL,
 "dataConsumo" TIMESTAMP(3),
 CONSTRAINT "recuperacao_senha_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "recuperacao_senha_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "recuperacao_senha_tokenHash_key" ON "recuperacao_senha"("tokenHash");
CREATE INDEX "recuperacao_senha_idUsuario_dataConsumo_idx" ON "recuperacao_senha"("idUsuario", "dataConsumo");
CREATE INDEX "recuperacao_senha_dataExpiracao_idx" ON "recuperacao_senha"("dataExpiracao");
