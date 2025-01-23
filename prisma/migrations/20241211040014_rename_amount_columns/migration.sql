/*
  Warnings:

  - You are about to drop the column `regularPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - Added the required column `regularAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "regularPrice",
DROP COLUMN "totalPrice",
ADD COLUMN     "regularAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
