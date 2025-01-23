/*
  Warnings:

  - Made the column `order` on table `Attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `AttributeValue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attribute" ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AttributeValue" ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;
