/*
  Warnings:

  - You are about to drop the column `cookie` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cookie_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cookie";
