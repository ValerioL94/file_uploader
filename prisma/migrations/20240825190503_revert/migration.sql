/*
  Warnings:

  - You are about to drop the column `public_id` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_public_id_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "public_id";
