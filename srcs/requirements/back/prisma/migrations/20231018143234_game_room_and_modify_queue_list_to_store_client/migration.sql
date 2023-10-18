/*
  Warnings:

  - The primary key for the `QueueList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientSocket` on the `QueueList` table. All the data in the column will be lost.
  - Added the required column `socketId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueueList" DROP CONSTRAINT "QueueList_pkey",
DROP COLUMN "clientSocket",
ADD COLUMN     "queueId" SERIAL NOT NULL,
ADD CONSTRAINT "QueueList_pkey" PRIMARY KEY ("queueId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "queueId" INTEGER,
ADD COLUMN     "roomId" INTEGER,
ADD COLUMN     "socketId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GameRoom" (
    "roomId" SERIAL NOT NULL,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("roomId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "GameRoom"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "QueueList"("queueId") ON DELETE SET NULL ON UPDATE CASCADE;
