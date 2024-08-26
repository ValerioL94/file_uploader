/*
  Warnings:

  - Added the required column `format` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT NOT NULL;
