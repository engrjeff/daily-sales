/*
  Warnings:

  - Made the column `orderLineItemId` on table `LineItemAttribute` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LineItemAttribute" ALTER COLUMN "orderLineItemId" SET NOT NULL;
