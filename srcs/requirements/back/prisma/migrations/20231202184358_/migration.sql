/*
  Warnings:

  - You are about to drop the column `messageHistory` on the `PrivateMessage` table. All the data in the column will be lost.
  - Added the required column `messageContent` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrivateMessage" DROP COLUMN "messageHistory",
ADD COLUMN     "messageContent" TEXT NOT NULL;
