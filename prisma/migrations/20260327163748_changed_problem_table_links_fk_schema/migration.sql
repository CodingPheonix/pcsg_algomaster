/*
  Warnings:

  - You are about to drop the `set_problem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `set_id` to the `problem_table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `set_problem` DROP FOREIGN KEY `set_problem_problem_id_problem_table_id_fk`;

-- DropForeignKey
ALTER TABLE `set_problem` DROP FOREIGN KEY `set_problem_set_id_set_table_id_fk`;

-- AlterTable
ALTER TABLE `problem_table` ADD COLUMN `set_id` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');

-- DropTable
DROP TABLE `set_problem`;

-- AddForeignKey
ALTER TABLE `problem_table` ADD CONSTRAINT `problem_table_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `set_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
