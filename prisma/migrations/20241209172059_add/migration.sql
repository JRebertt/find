/*
  Warnings:

  - You are about to drop the `query_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "query_logs" DROP CONSTRAINT "query_logs_cachedDataId_fkey";

-- DropForeignKey
ALTER TABLE "query_logs" DROP CONSTRAINT "query_logs_userId_fkey";

-- DropTable
DROP TABLE "query_logs";

-- CreateTable
CREATE TABLE "QueryLog" (
    "id" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "queryValue" TEXT NOT NULL,
    "isCacheHit" BOOLEAN NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "cachedDataId" TEXT,

    CONSTRAINT "QueryLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueryLog" ADD CONSTRAINT "QueryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueryLog" ADD CONSTRAINT "QueryLog_cachedDataId_fkey" FOREIGN KEY ("cachedDataId") REFERENCES "cached_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
