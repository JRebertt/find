/*
  Warnings:

  - You are about to drop the column `city` on the `cached_data` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `cached_data` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `cached_data` table. All the data in the column will be lost.
  - You are about to drop the column `zipcode` on the `cached_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `cached_data` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cached_data" DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zipcode",
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "nomeMae" TEXT,
ADD COLUMN     "nomePai" TEXT,
ADD COLUMN     "renda" DOUBLE PRECISION,
ADD COLUMN     "telefones" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "cached_data_cpf_key" ON "cached_data"("cpf");
