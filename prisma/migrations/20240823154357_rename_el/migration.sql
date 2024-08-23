/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `title` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'New Folder';
