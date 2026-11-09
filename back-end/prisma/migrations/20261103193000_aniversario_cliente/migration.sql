BEGIN;
-- Executa os triggers diferidos da especialização antes do próximo ALTER TABLE.
SET CONSTRAINTS ALL IMMEDIATE;
ALTER TABLE "cliente" ADD COLUMN "diaAniversario" INTEGER, ADD COLUMN "mesAniversario" INTEGER;
UPDATE "cliente" SET "diaAniversario" = EXTRACT(DAY FROM "dataNascimento")::INTEGER,
  "mesAniversario" = EXTRACT(MONTH FROM "dataNascimento")::INTEGER WHERE "dataNascimento" IS NOT NULL;
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_aniversario_valido" CHECK (
  ("diaAniversario" IS NULL AND "mesAniversario" IS NULL) OR
  ("diaAniversario" IS NOT NULL AND "mesAniversario" IS NOT NULL AND "mesAniversario" BETWEEN 1 AND 12
    AND "diaAniversario" BETWEEN 1 AND CASE "mesAniversario"
      WHEN 2 THEN 29 WHEN 4 THEN 30 WHEN 6 THEN 30 WHEN 9 THEN 30 WHEN 11 THEN 30 ELSE 31 END)
);
ALTER TABLE "cliente" DROP COLUMN "dataNascimento";
COMMIT;
