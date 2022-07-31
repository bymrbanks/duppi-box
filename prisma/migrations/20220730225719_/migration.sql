-- DropIndex
DROP INDEX "Player_matchId_key";

-- DropIndex
DROP INDEX "Player_userId_key";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "rounds" BOOLEAN[],
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "action" DROP NOT NULL,
ALTER COLUMN "score" DROP NOT NULL;
