/*
  Warnings:

  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- AlterTable
ALTER TABLE "foreign_agents" ADD COLUMN     "variants" TEXT[];

-- DropTable
DROP TABLE "documents";

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_occurances" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    "foreignAgentId" INTEGER NOT NULL,

    CONSTRAINT "agent_occurances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_occurances" ADD CONSTRAINT "agent_occurances_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_occurances" ADD CONSTRAINT "agent_occurances_foreignAgentId_fkey" FOREIGN KEY ("foreignAgentId") REFERENCES "foreign_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
