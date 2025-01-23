-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerName" DROP NOT NULL,
ALTER COLUMN "customerName" SET DEFAULT 'Unknown';
