/*
  Warnings:

  - You are about to drop the `_OrderLineItemToProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productName` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OrderLineItemToProductVariant" DROP CONSTRAINT "_OrderLineItemToProductVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderLineItemToProductVariant" DROP CONSTRAINT "_OrderLineItemToProductVariant_B_fkey";

-- AlterTable
ALTER TABLE "OrderLineItem" ADD COLUMN     "attributes" TEXT[],
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productVariantId" TEXT NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "_OrderLineItemToProductVariant";

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
