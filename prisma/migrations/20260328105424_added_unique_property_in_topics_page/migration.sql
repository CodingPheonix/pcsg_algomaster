/*
  Warnings:

  - A unique constraint covering the columns `[subtopic_tableId]` on the table `topics_table` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');

-- CreateIndex
CREATE UNIQUE INDEX `topics_table_subtopic_tableId_key` ON `topics_table`(`subtopic_tableId`);
