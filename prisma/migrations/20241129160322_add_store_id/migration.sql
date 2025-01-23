/*
  Warnings:

  - A unique constraint covering the columns `[storeId,sku]` on the table `ProductSku` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeId` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `ProductSku` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductSku_productId_sku_key";

-- AlterTable
ALTER TABLE "ProductAttribute" ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ProductAttribute_storeId_idx" ON "ProductAttribute"("storeId");

-- CreateIndex
CREATE INDEX "ProductSku_storeId_idx" ON "ProductSku"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSku_storeId_sku_key" ON "ProductSku"("storeId", "sku");

-- AddForeignKey
ALTER TABLE "ProductSku" ADD CONSTRAINT "ProductSku_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
