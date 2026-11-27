CREATE TABLE "repasse_comissao" (
 "id" SERIAL PRIMARY KEY,
 "idComissao" INTEGER NOT NULL UNIQUE REFERENCES "comissao"("id") ON DELETE RESTRICT,
 "idUsuarioResponsavel" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE RESTRICT,
 "valor" DECIMAL(10,2) NOT NULL CHECK ("valor" >= 0),
 "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "repasse_comissao_dataRegistro_idx" ON "repasse_comissao"("dataRegistro");
