-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_discountId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "discountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
