-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "StatusBarbeiro" AS ENUM ('ATIVO', 'INATIVO', 'AFASTADO');

-- CreateEnum
CREATE TYPE "StatusFilial" AS ENUM ('ATIVA', 'INATIVA', 'EM_MANUTENCAO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU');

-- CreateEnum
CREATE TYPE "OrigemAgendamento" AS ENUM ('SITE', 'BARBEIRO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "StatusComissao" AS ENUM ('PREVISTA', 'LIBERADA', 'PAGA', 'CANCELADA', 'ESTORNADA');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "idPapel" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT,
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "ultimoAcesso" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papel" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "papel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissao" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papel_permissao" (
    "id" SERIAL NOT NULL,
    "idPapel" INTEGER NOT NULL,
    "idPermissao" INTEGER NOT NULL,
    "dataAtribuicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "papel_permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" DATE,
    "observacao" TEXT,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbeiro" (
    "id" INTEGER NOT NULL,
    "idFilial" INTEGER NOT NULL,
    "nomeProfissional" TEXT NOT NULL,
    "descricao" TEXT,
    "fotoUrl" TEXT,
    "dataAdmissao" DATE,
    "statusProfissional" "StatusBarbeiro" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "barbeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrador" (
    "id" INTEGER NOT NULL,
    "dataInicioAdministracao" DATE,
    "observacao" TEXT,

    CONSTRAINT "administrador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filial" (
    "id" SERIAL NOT NULL,
    "idEndereco" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "status" "StatusFilial" NOT NULL DEFAULT 'ATIVA',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
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
    "precoBase" DECIMAL(10,2) NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "id" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idBarbeiro" INTEGER NOT NULL,
    "idFilial" INTEGER NOT NULL,
    "inicioPrevisto" TIMESTAMP(3) NOT NULL,
    "fimPrevisto" TIMESTAMP(3) NOT NULL,
    "inicioReal" TIMESTAMP(3),
    "fimReal" TIMESTAMP(3),
    "status" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
    "origem" "OrigemAgendamento" NOT NULL DEFAULT 'SITE',
    "observacaoCliente" TEXT,
    "observacaoInterna" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "dataCancelamento" TIMESTAMP(3),
    "motivoCancelamento" TEXT,

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_servico" (
    "id" SERIAL NOT NULL,
    "idAgendamento" INTEGER NOT NULL,
    "idServico" INTEGER NOT NULL,
    "precoAplicado" DECIMAL(10,2) NOT NULL,
    "duracaoAplicadaMinutos" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "ordemExecucao" INTEGER NOT NULL,

    CONSTRAINT "agendamento_servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comissao" (
    "id" SERIAL NOT NULL,
    "idAgendamentoServico" INTEGER NOT NULL,
    "idBarbeiro" INTEGER NOT NULL,
    "baseCalculo" DECIMAL(10,2) NOT NULL,
    "percentualAplicado" DECIMAL(5,2) NOT NULL,
    "valorComissao" DECIMAL(10,2) NOT NULL,
    "status" "StatusComissao" NOT NULL DEFAULT 'PREVISTA',
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataLiberacao" TIMESTAMP(3),
    "dataPagamento" TIMESTAMP(3),
    "dataEstorno" TIMESTAMP(3),
    "motivoEstorno" TEXT,
    "observacao" TEXT,

    CONSTRAINT "comissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_status_agendamento" (
    "id" SERIAL NOT NULL,
    "idAgendamento" INTEGER NOT NULL,
    "idUsuarioResponsavel" INTEGER NOT NULL,
    "statusAnterior" "StatusAgendamento",
    "statusNovo" "StatusAgendamento" NOT NULL,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "observacao" TEXT,

    CONSTRAINT "historico_status_agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
CREATE INDEX "usuario_idPapel_idx" ON "usuario"("idPapel");
CREATE INDEX "usuario_status_idx" ON "usuario"("status");
CREATE UNIQUE INDEX "papel_codigo_key" ON "papel"("codigo");
CREATE INDEX "papel_ativo_idx" ON "papel"("ativo");
CREATE UNIQUE INDEX "permissao_codigo_key" ON "permissao"("codigo");
CREATE INDEX "permissao_ativo_idx" ON "permissao"("ativo");
CREATE INDEX "papel_permissao_idPermissao_idx" ON "papel_permissao"("idPermissao");
CREATE INDEX "papel_permissao_ativo_idx" ON "papel_permissao"("ativo");
CREATE UNIQUE INDEX "papel_permissao_idPapel_idPermissao_key" ON "papel_permissao"("idPapel", "idPermissao");
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");
CREATE INDEX "barbeiro_idFilial_idx" ON "barbeiro"("idFilial");
CREATE INDEX "barbeiro_statusProfissional_idx" ON "barbeiro"("statusProfissional");
CREATE UNIQUE INDEX "filial_idEndereco_key" ON "filial"("idEndereco");
CREATE UNIQUE INDEX "filial_cnpj_key" ON "filial"("cnpj");
CREATE INDEX "filial_status_idx" ON "filial"("status");
CREATE UNIQUE INDEX "servico_nome_key" ON "servico"("nome");
CREATE INDEX "servico_ativo_idx" ON "servico"("ativo");
CREATE INDEX "agendamento_idCliente_idx" ON "agendamento"("idCliente");
CREATE INDEX "agendamento_idBarbeiro_idx" ON "agendamento"("idBarbeiro");
CREATE INDEX "agendamento_idFilial_idx" ON "agendamento"("idFilial");
CREATE INDEX "agendamento_inicioPrevisto_idx" ON "agendamento"("inicioPrevisto");
CREATE INDEX "agendamento_idBarbeiro_inicioPrevisto_idx" ON "agendamento"("idBarbeiro", "inicioPrevisto");
CREATE INDEX "agendamento_status_idx" ON "agendamento"("status");
CREATE INDEX "agendamento_servico_idServico_idx" ON "agendamento_servico"("idServico");
CREATE UNIQUE INDEX "agendamento_servico_idAgendamento_idServico_key" ON "agendamento_servico"("idAgendamento", "idServico");
CREATE UNIQUE INDEX "agendamento_servico_idAgendamento_ordemExecucao_key" ON "agendamento_servico"("idAgendamento", "ordemExecucao");
CREATE UNIQUE INDEX "comissao_idAgendamentoServico_key" ON "comissao"("idAgendamentoServico");
CREATE INDEX "comissao_idBarbeiro_idx" ON "comissao"("idBarbeiro");
CREATE INDEX "comissao_status_idx" ON "comissao"("status");
CREATE INDEX "historico_status_agendamento_idAgendamento_idx" ON "historico_status_agendamento"("idAgendamento");
CREATE INDEX "historico_status_agendamento_idUsuarioResponsavel_idx" ON "historico_status_agendamento"("idUsuarioResponsavel");
CREATE INDEX "historico_status_agendamento_dataAlteracao_idx" ON "historico_status_agendamento"("dataAlteracao");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_idPapel_fkey" FOREIGN KEY ("idPapel") REFERENCES "papel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "papel_permissao" ADD CONSTRAINT "papel_permissao_idPapel_fkey" FOREIGN KEY ("idPapel") REFERENCES "papel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "papel_permissao" ADD CONSTRAINT "papel_permissao_idPermissao_fkey" FOREIGN KEY ("idPermissao") REFERENCES "permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "barbeiro" ADD CONSTRAINT "barbeiro_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "barbeiro" ADD CONSTRAINT "barbeiro_idFilial_fkey" FOREIGN KEY ("idFilial") REFERENCES "filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "administrador" ADD CONSTRAINT "administrador_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "filial" ADD CONSTRAINT "filial_idEndereco_fkey" FOREIGN KEY ("idEndereco") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idBarbeiro_fkey" FOREIGN KEY ("idBarbeiro") REFERENCES "barbeiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_idFilial_fkey" FOREIGN KEY ("idFilial") REFERENCES "filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_idAgendamento_fkey" FOREIGN KEY ("idAgendamento") REFERENCES "agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_idServico_fkey" FOREIGN KEY ("idServico") REFERENCES "servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "comissao" ADD CONSTRAINT "comissao_idAgendamentoServico_fkey" FOREIGN KEY ("idAgendamentoServico") REFERENCES "agendamento_servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "comissao" ADD CONSTRAINT "comissao_idBarbeiro_fkey" FOREIGN KEY ("idBarbeiro") REFERENCES "barbeiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historico_status_agendamento" ADD CONSTRAINT "historico_status_agendamento_idAgendamento_fkey" FOREIGN KEY ("idAgendamento") REFERENCES "agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "historico_status_agendamento" ADD CONSTRAINT "historico_status_agendamento_idUsuarioResponsavel_fkey" FOREIGN KEY ("idUsuarioResponsavel") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enforce total and exclusive Usuario specialization at transaction commit.
CREATE OR REPLACE FUNCTION validar_especializacao_usuario()
RETURNS TRIGGER AS $$
DECLARE
    usuario_id INTEGER;
    total_subtipos INTEGER;
    codigo_papel TEXT;
    codigo_subtipo TEXT;
BEGIN
    usuario_id := COALESCE(NEW.id, OLD.id);

    IF NOT EXISTS (SELECT 1 FROM "usuario" WHERE "id" = usuario_id) THEN
        RETURN NULL;
    END IF;

    SELECT
        (SELECT COUNT(*) FROM "cliente" WHERE "id" = usuario_id) +
        (SELECT COUNT(*) FROM "barbeiro" WHERE "id" = usuario_id) +
        (SELECT COUNT(*) FROM "administrador" WHERE "id" = usuario_id)
    INTO total_subtipos;

    IF total_subtipos <> 1 THEN
        RAISE EXCEPTION 'Usuario % deve possuir exatamente uma especializacao', usuario_id;
    END IF;

    SELECT p."codigo"
      INTO codigo_papel
      FROM "usuario" u
      JOIN "papel" p ON p."id" = u."idPapel"
     WHERE u."id" = usuario_id;

    codigo_subtipo := CASE
        WHEN EXISTS (SELECT 1 FROM "cliente" WHERE "id" = usuario_id) THEN 'CLIENTE'
        WHEN EXISTS (SELECT 1 FROM "barbeiro" WHERE "id" = usuario_id) THEN 'BARBEIRO'
        ELSE 'ADMINISTRADOR'
    END;

    IF codigo_papel <> codigo_subtipo THEN
        RAISE EXCEPTION 'Papel % incompativel com a especializacao % do usuario %', codigo_papel, codigo_subtipo, usuario_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER usuario_especializacao_total_exclusiva
AFTER INSERT OR UPDATE ON "usuario"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_especializacao_usuario();

CREATE CONSTRAINT TRIGGER cliente_especializacao_total_exclusiva
AFTER INSERT OR UPDATE OR DELETE ON "cliente"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_especializacao_usuario();

CREATE CONSTRAINT TRIGGER barbeiro_especializacao_total_exclusiva
AFTER INSERT OR UPDATE OR DELETE ON "barbeiro"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_especializacao_usuario();

CREATE CONSTRAINT TRIGGER administrador_especializacao_total_exclusiva
AFTER INSERT OR UPDATE OR DELETE ON "administrador"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_especializacao_usuario();

-- Keep role codes stable while users reference them so specialization remains valid.
CREATE OR REPLACE FUNCTION impedir_alteracao_codigo_papel_em_uso()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."codigo" IS DISTINCT FROM OLD."codigo"
       AND EXISTS (SELECT 1 FROM "usuario" WHERE "idPapel" = OLD."id") THEN
        RAISE EXCEPTION 'Nao e permitido alterar o codigo de um papel atribuido a usuarios';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER papel_codigo_imutavel_em_uso
BEFORE UPDATE OF "codigo" ON "papel"
FOR EACH ROW EXECUTE FUNCTION impedir_alteracao_codigo_papel_em_uso();

-- Enforce the (1,n) cardinality between Agendamento and AgendamentoServico.
CREATE OR REPLACE FUNCTION verificar_agendamento_possui_servico(agendamento_id INTEGER)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "agendamento" WHERE "id" = agendamento_id)
       AND NOT EXISTS (
           SELECT 1
             FROM "agendamento_servico"
            WHERE "idAgendamento" = agendamento_id
       ) THEN
        RAISE EXCEPTION 'Agendamento % deve possuir ao menos um servico', agendamento_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validar_servicos_agendamento()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'agendamento' THEN
        PERFORM verificar_agendamento_possui_servico(COALESCE(NEW.id, OLD.id));
    ELSE
        IF TG_OP <> 'DELETE' THEN
            PERFORM verificar_agendamento_possui_servico(NEW."idAgendamento");
        END IF;

        IF TG_OP <> 'INSERT'
           AND (TG_OP = 'DELETE' OR OLD."idAgendamento" IS DISTINCT FROM NEW."idAgendamento") THEN
            PERFORM verificar_agendamento_possui_servico(OLD."idAgendamento");
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER agendamento_minimo_um_servico
AFTER INSERT ON "agendamento"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_servicos_agendamento();

CREATE CONSTRAINT TRIGGER item_agendamento_minimo_um_servico
AFTER INSERT OR UPDATE OR DELETE ON "agendamento_servico"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION validar_servicos_agendamento();
