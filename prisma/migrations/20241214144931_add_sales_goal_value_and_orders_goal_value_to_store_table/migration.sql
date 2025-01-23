-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "ordersGoalValue" INTEGER DEFAULT 0,
ADD COLUMN     "salesGoalValue" DOUBLE PRECISION DEFAULT 0;
