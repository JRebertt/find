-- AlterTable
ALTER TABLE "cached_data" ADD COLUMN     "abertura" TEXT,
ADD COLUMN     "atividade_principal" TEXT[],
ADD COLUMN     "atividades_secundarias" TEXT[],
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "capital_social" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "data_situacao" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "logradouro" TEXT,
ADD COLUMN     "municipio" TEXT,
ADD COLUMN     "natureza_juridica" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "situacao" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "uf" TEXT;
