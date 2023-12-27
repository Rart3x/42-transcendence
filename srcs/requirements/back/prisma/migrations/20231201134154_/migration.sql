/*
  Warnings:

  - You are about to drop the column `queueId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `QueueList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_queueId_fkey";

-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "botGame" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "queueId";

-- DropTable
DROP TABLE "QueueList";
