/*
  Warnings:

  - You are about to drop the column `status` on the `Player` table. All the data in the column will be lost.
  - The `action` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "status",
DROP COLUMN "action",
ADD COLUMN     "action" TEXT[];
