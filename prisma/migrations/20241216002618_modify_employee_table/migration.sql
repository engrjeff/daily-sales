/*
  Warnings:

  - You are about to drop the column `isActive` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId,email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,username]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('INVITED', 'ACTIVE', 'INACIVE');

-- DropIndex
DROP INDEX "Employee_isActive_idx";

-- DropIndex
DROP INDEX "Employee_storeId_name_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "isActive",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'INVITED',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_storeId_email_key" ON "Employee"("storeId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_storeId_username_key" ON "Employee"("storeId", "username");
