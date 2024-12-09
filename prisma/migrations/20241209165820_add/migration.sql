-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('DEVICE', 'ACCESS');

-- CreateEnum
CREATE TYPE "QueryType" AS ENUM ('CPF', 'CNPJ', 'CEP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT 'DEVICE',
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_data" (
    "id" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "queryValue" TEXT NOT NULL,
    "name" TEXT,
    "birthdate" TIMESTAMP(3),
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipcode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cached_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "query_logs" (
    "id" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "queryValue" TEXT NOT NULL,
    "isCacheHit" BOOLEAN NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "cachedDataId" TEXT,

    CONSTRAINT "query_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_value_key" ON "DeviceToken"("value");

-- CreateIndex
CREATE INDEX "cached_data_queryType_queryValue_idx" ON "cached_data"("queryType", "queryValue");

-- CreateIndex
CREATE UNIQUE INDEX "cached_data_queryType_queryValue_key" ON "cached_data"("queryType", "queryValue");

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "query_logs" ADD CONSTRAINT "query_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "query_logs" ADD CONSTRAINT "query_logs_cachedDataId_fkey" FOREIGN KEY ("cachedDataId") REFERENCES "cached_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
