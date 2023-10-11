/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "MonCul" (
    "messageId" SERIAL NOT NULL,
    "channelId" INTEGER,
    "message_text" TEXT,
    "message_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonCul_pkey" PRIMARY KEY ("messageId")
);

-- AddForeignKey
ALTER TABLE "MonCul" ADD CONSTRAINT "MonCul_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION;
