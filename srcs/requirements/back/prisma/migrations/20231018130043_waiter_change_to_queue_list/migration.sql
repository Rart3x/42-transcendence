/*
  Warnings:

  - You are about to drop the `Waiter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Waiter";

-- CreateTable
CREATE TABLE "QueueList" (
    "clientSocket" TEXT NOT NULL,

    CONSTRAINT "QueueList_pkey" PRIMARY KEY ("clientSocket")
);
