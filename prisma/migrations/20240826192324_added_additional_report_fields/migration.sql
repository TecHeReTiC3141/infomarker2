-- AlterTable
ALTER TABLE "agent_occurances" ADD COLUMN     "foundVariants" TEXT[];

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "name" TEXT,
ADD COLUMN     "order" INTEGER DEFAULT 0;
