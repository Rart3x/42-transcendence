/*
  Warnings:

  - Made the column `message_text` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "message_text" SET NOT NULL;
