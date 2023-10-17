/*
  Warnings:

  - You are about to drop the column `userSocket` on the `Waiter` table. All the data in the column will be lost.
  - Added the required column `waiterSocket` to the `Waiter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waiter" DROP COLUMN "userSocket",
ADD COLUMN     "waiterSocket" TEXT NOT NULL;
