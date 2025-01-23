/*
  Warnings:

  - Made the column `order` on table `ProductAttributeValue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductAttributeValue" ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;
