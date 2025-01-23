/*
  Warnings:

  - A unique constraint covering the columns `[storeId,discountCode]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Discount_storeId_discountCode_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Discount_storeId_discountCode_key" ON "Discount"("storeId", "discountCode");
