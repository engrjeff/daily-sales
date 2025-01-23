/*
  Warnings:

  - You are about to drop the column `attributeId` on the `ProductAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `ProductAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attributeValueId` to the `ProductAttributeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `ProductAttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_storeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttributeValue" DROP CONSTRAINT "ProductAttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_storeId_fkey";

-- DropForeignKey
ALTER TABLE "VariantAttribute" DROP CONSTRAINT "VariantAttribute_attributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "VariantAttribute" DROP CONSTRAINT "VariantAttribute_variantId_fkey";

-- DropIndex
DROP INDEX "ProductAttributeValue_attributeId_idx";

-- DropIndex
DROP INDEX "ProductAttributeValue_attributeId_value_key";

-- AlterTable
ALTER TABLE "ProductAttributeValue" DROP COLUMN "attributeId",
DROP COLUMN "value",
ADD COLUMN     "attributeValueId" TEXT NOT NULL,
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductAttribute";

-- DropTable
DROP TABLE "Variant";

-- DropTable
DROP TABLE "VariantAttribute";

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "stock" INTEGER NOT NULL,
    "lowStockThreshold" INTEGER DEFAULT 0,
    "order" INTEGER NOT NULL,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attribute_productId_idx" ON "Attribute"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_productId_name_key" ON "Attribute"("productId", "name");

-- CreateIndex
CREATE INDEX "AttributeValue_attributeId_idx" ON "AttributeValue"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_value_key" ON "AttributeValue"("attributeId", "value");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_storeId_idx" ON "ProductVariant"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_storeId_sku_key" ON "ProductVariant"("storeId", "sku");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_productVariantId_idx" ON "ProductAttributeValue"("productVariantId");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_attributeValueId_idx" ON "ProductAttributeValue"("attributeValueId");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
