ALTER TABLE "barbeiro" ADD COLUMN "percentualComissao" DECIMAL(5,2);
ALTER TABLE "barbeiro" ADD CONSTRAINT "barbeiro_percentual_comissao_check"
CHECK ("percentualComissao" >= 0 AND "percentualComissao" <= 100);
