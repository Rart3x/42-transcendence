/*
  Warnings:

  - You are about to drop the column `botGame` on the `GameRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameRoom" DROP COLUMN "botGame";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "queueId" INTEGER;

-- CreateTable
CREATE TABLE "QueueList" (
    "queueId" SERIAL NOT NULL,

    CONSTRAINT "QueueList_pkey" PRIMARY KEY ("queueId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "QueueList"("queueId") ON DELETE CASCADE ON UPDATE CASCADE;
