/*
  Warnings:

  - The primary key for the `Waiter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Waiter` table. All the data in the column will be lost.
  - You are about to drop the column `waiterId` on the `Waiter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Waiter" DROP CONSTRAINT "Waiter_userId_fkey";

-- AlterTable
ALTER TABLE "Waiter" DROP CONSTRAINT "Waiter_pkey",
DROP COLUMN "userId",
DROP COLUMN "waiterId",
ADD CONSTRAINT "Waiter_pkey" PRIMARY KEY ("waiterSocket");
