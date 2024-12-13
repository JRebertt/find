/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `cached_data` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plate]` on the table `cached_data` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cached_data" ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "plate" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cached_data_cnpj_key" ON "cached_data"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cached_data_plate_key" ON "cached_data"("plate");
