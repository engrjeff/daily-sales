/*
  Warnings:

  - You are about to drop the column `attributes` on the `OrderLineItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderLineItem" DROP COLUMN "attributes";

-- CreateTable
CREATE TABLE "LineItemAttribute" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "orderLineItemId" TEXT,

    CONSTRAINT "LineItemAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LineItemAttribute" ADD CONSTRAINT "LineItemAttribute_orderLineItemId_fkey" FOREIGN KEY ("orderLineItemId") REFERENCES "OrderLineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
