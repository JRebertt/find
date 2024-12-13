/*
  Warnings:

  - You are about to drop the `cached_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QueryLog" DROP CONSTRAINT "QueryLog_cachedDataId_fkey";

-- DropTable
DROP TABLE "cached_data";

-- CreateTable
CREATE TABLE "CachedData" (
    "id" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "queryValue" TEXT NOT NULL,
    "name" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "plate" TEXT,
    "birthdate" TIMESTAMP(3),
    "nomeMae" TEXT,
    "nomePai" TEXT,
    "renda" TEXT,
    "telefones" TEXT[],
    "abertura" TEXT,
    "natureza_juridica" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "situacao" TEXT,
    "data_situacao" TEXT,
    "capital_social" TEXT,
    "atividade_principal" JSONB NOT NULL,
    "atividades_secundarias" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CachedData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedData_cpf_key" ON "CachedData"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "CachedData_cnpj_key" ON "CachedData"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "CachedData_plate_key" ON "CachedData"("plate");

-- CreateIndex
CREATE INDEX "CachedData_queryType_queryValue_idx" ON "CachedData"("queryType", "queryValue");

-- CreateIndex
CREATE UNIQUE INDEX "CachedData_queryType_queryValue_key" ON "CachedData"("queryType", "queryValue");

-- AddForeignKey
ALTER TABLE "QueryLog" ADD CONSTRAINT "QueryLog_cachedDataId_fkey" FOREIGN KEY ("cachedDataId") REFERENCES "CachedData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
