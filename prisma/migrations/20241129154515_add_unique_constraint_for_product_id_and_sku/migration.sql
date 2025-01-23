/*
  Warnings:

  - A unique constraint covering the columns `[productId,sku]` on the table `ProductSku` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductSku_sku_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductSku_productId_sku_key" ON "ProductSku"("productId", "sku");
