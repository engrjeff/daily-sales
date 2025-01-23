/*
  Warnings:

  - Added the required column `costPrice` to the `ProductSku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `ProductSku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "costPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lowStockThreshold" INTEGER DEFAULT 0,
ADD COLUMN     "stock" INTEGER NOT NULL;
