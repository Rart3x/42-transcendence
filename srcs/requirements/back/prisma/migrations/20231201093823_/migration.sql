/*
  Warnings:

  - You are about to drop the `Notif` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notif" DROP CONSTRAINT "Notif_userId_fkey";

-- DropTable
DROP TABLE "Notif";
