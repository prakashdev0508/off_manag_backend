/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `external_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('employee', 'manager', 'admin');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'manager', 'employee', 'sales_manager', 'super_admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "external_token" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "manager_id" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "roles" "Role"[],
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'employee';

-- CreateIndex
CREATE INDEX "User_is_active_email_external_id_idx" ON "User"("is_active", "email", "external_id");
