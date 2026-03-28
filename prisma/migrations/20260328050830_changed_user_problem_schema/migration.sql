/*
  Warnings:

  - You are about to alter the column `problem_ids` on the `user_problem` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `user_problem` MODIFY `problem_ids` JSON NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');
