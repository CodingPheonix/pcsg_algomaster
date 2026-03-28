-- AlterTable
ALTER TABLE `algovisuals_table` MODIFY `code_text` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');
