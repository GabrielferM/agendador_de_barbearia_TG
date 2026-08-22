-- CreateEnum
CREATE TYPE "TipoPerfil" AS ENUM ('CLIENTE', 'BARBEIRO');

-- CreateEnum
CREATE TYPE "StatusBarbeiro" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoPerfil" "TipoPerfil" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbeiro" (
    "id" INTEGER NOT NULL,
    "descricao" TEXT,
    "dataAdmissao" TIMESTAMP(3),
    "status" "StatusBarbeiro" NOT NULL DEFAULT 'ATIVO',
    "idFilial" INTEGER NOT NULL,

    CONSTRAINT "barbeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filial" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "horarioAbertura" TEXT,
    "horarioFechamento" TEXT,
    "idEndereco" INTEGER NOT NULL,

    CONSTRAINT "filial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "id" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idBarbeiro" INTEGER NOT NULL,
    "idFilial" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',
    "observacao" TEXT,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_servico" (
    "id" SERIAL NOT NULL,
    "idAgendamento" INTEGER NOT NULL,
    "idServico" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,

    CONSTRAINT "agendamento_servico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");

-- CreateIndex
CREATE INDEX "barbeiro_idFilial_idx" ON "barbeiro"("idFilial");

-- CreateIndex
CREATE UNIQUE INDEX "filial_cnpj_key" ON "filial"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "filial_idEndereco_key" ON "filial"("idEndereco");

-- CreateIndex
CREATE INDEX "agendamento_idCliente_idx" ON "agendamento"("idCliente");

-- CreateIndex
CREATE INDEX "agendamento_idBarbeiro_idx" ON "agendamento"("idBarbeiro");

-- CreateIndex
CREATE INDEX "agendamento_idFilial_idx" ON "agendamento"("idFilial");

-- CreateIndex
CREATE INDEX "agendamento_inicio_idx" ON "agendamento"("inicio");

-- CreateIndex
CREATE INDEX "agendamento_idBarbeiro_inicio_idx" ON "agendamento"("idBarbeiro", "inicio");

-- CreateIndex
CREATE INDEX "agendamento_status_idx" ON "agendamento"("status");

-- CreateIndex
CREATE INDEX "agendamento_servico_idServico_idx" ON "agendamento_servico"("idServico");

-- CreateIndex
CREATE UNIQUE INDEX "agendamento_servico_idAgendamento_idServico_key" ON "agendamento_servico"("idAgendamento", "idServico");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barbeiro" ADD CONSTRAINT "barbeiro_idFilial_fkey" FOREIGN KEY ("idFilial") REFERENCES "filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barbeiro" ADD CONSTRAINT "barbeiro_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filial" ADD CONSTRAINT "filial_idEndereco_fkey" FOREIGN KEY ("idEndereco") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idBarbeiro_fkey" FOREIGN KEY ("idBarbeiro") REFERENCES "barbeiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idFilial_fkey" FOREIGN KEY ("idFilial") REFERENCES "filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_idAgendamento_fkey" FOREIGN KEY ("idAgendamento") REFERENCES "agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_idServico_fkey" FOREIGN KEY ("idServico") REFERENCES "servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
