/*
  Warnings:

  - You are about to drop the column `tutorial_id` on the `topics_table` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `topics_table` DROP FOREIGN KEY `topics_table_tutorial_id_tutorials_table_id_fk`;

-- DropIndex
DROP INDEX `topics_table_tutorial_id_tutorials_table_id_fk` ON `topics_table`;

-- AlterTable
ALTER TABLE `topics_table` DROP COLUMN `tutorial_id`,
    ADD COLUMN `subtopic_tableId` VARCHAR(40) NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');

-- CreateIndex
CREATE INDEX `subtopic_tableId_topics_table_id_fk` ON `topics_table`(`subtopic_tableId`);

-- AddForeignKey
ALTER TABLE `topics_table` ADD CONSTRAINT `subtopic_tableId_topics_table_id_fk` FOREIGN KEY (`subtopic_tableId`) REFERENCES `subtopic_table`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
