/*
  Warnings:

  - You are about to drop the `MonCul` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MonCul" DROP CONSTRAINT "MonCul_channelId_fkey";

-- DropTable
DROP TABLE "MonCul";

-- CreateTable
CREATE TABLE "Message" (
    "messageId" SERIAL NOT NULL,
    "channelId" INTEGER,
    "message_text" TEXT,
    "message_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageId")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE NO ACTION ON UPDATE NO ACTION;
