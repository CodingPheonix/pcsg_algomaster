/*
  Warnings:

  - You are about to alter the column `hints` on the `problem_table` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `problem_table` MODIFY `hints` JSON NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');
