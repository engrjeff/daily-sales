/*
  Warnings:

  - A unique constraint covering the columns `[storeId,sku]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Variant_storeId_idx" ON "Variant"("storeId");

-- CreateIndex
CREATE INDEX "Variant_productId_idx" ON "Variant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_storeId_sku_key" ON "Variant"("storeId", "sku");
