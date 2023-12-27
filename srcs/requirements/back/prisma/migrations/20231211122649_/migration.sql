-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_scorerId_fkey";

-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "player1Afk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "player1Reconnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "player1UserId" INTEGER,
ADD COLUMN     "player2Afk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "player2Reconnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "player2UserId" INTEGER;

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "winByAfk" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserScore" ALTER COLUMN "scorerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
