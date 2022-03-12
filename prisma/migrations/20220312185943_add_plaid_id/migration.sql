/*
  Warnings:

  - A unique constraint covering the columns `[plaidId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "plaidId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "plaidId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_plaidId_key" ON "Account"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_plaidId_key" ON "Transaction"("plaidId");
