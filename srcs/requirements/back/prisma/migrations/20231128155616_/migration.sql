-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "winnerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
