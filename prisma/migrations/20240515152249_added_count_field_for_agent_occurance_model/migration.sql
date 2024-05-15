/*
  Warnings:

  - Added the required column `count` to the `agent_occurances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agent_occurances" ADD COLUMN     "count" INTEGER NOT NULL;
