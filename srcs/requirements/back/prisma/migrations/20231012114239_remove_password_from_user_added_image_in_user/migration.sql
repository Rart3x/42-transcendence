/*
  Warnings:

  - You are about to drop the column `userPass` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPass",
ADD COLUMN     "image" BYTEA;
