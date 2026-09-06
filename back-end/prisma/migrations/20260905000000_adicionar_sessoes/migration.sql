CREATE TABLE "sessao" (
    "id" TEXT NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "dataRevogacao" TIMESTAMP(3),

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sessao_tokenHash_key" ON "sessao"("tokenHash");
CREATE INDEX "sessao_idUsuario_idx" ON "sessao"("idUsuario");
CREATE INDEX "sessao_dataExpiracao_idx" ON "sessao"("dataExpiracao");
CREATE INDEX "sessao_dataRevogacao_idx" ON "sessao"("dataRevogacao");

ALTER TABLE "sessao" ADD CONSTRAINT "sessao_idUsuario_fkey"
FOREIGN KEY ("idUsuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
