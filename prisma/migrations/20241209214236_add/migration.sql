-- CreateEnum
CREATE TYPE "QuerySource" AS ENUM ('CACHE', 'API');

-- CreateTable
CREATE TABLE "QueryStatistics" (
    "id" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "queryValue" TEXT NOT NULL,
    "source" "QuerySource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueryStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QueryStatistics_queryType_queryValue_idx" ON "QueryStatistics"("queryType", "queryValue");
