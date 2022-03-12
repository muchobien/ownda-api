/*
  Warnings:

  - A unique constraint covering the columns `[provider,userId]` on the table `Identity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Identity_provider_userId_key" ON "Identity"("provider", "userId");
