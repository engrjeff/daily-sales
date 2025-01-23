-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "order" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "AttributeValue" ADD COLUMN     "order" INTEGER DEFAULT 1;
