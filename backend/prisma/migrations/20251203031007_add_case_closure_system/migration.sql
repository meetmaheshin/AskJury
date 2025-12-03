-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('SIDE_A_WINS', 'SIDE_B_WINS', 'TIED');

-- CreateEnum
CREATE TYPE "ClosureType" AS ENUM ('AUTO_TIME_LIMIT', 'AUTO_VOTE_THRESHOLD', 'MANUAL_OWNER');

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "closure_type" "ClosureType",
ADD COLUMN     "owner_reward" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "verdict" "Verdict",
ADD COLUMN     "verdict_margin" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "case_earnings" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "total_earnings" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "cases_closed_at_idx" ON "cases"("closed_at");
