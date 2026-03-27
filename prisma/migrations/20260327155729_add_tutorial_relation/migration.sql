/*
  Warnings:

  - You are about to drop the `tutorial_subtopics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tutorial_id` to the `subtopic_table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tutorial_subtopics` DROP FOREIGN KEY `tutorial_subtopics_subtopicId_subtopic_table_id_fk`;

-- DropForeignKey
ALTER TABLE `tutorial_subtopics` DROP FOREIGN KEY `tutorial_subtopics_tutorialId_tutorials_table_id_fk`;

-- AlterTable
ALTER TABLE `subtopic_table` ADD COLUMN `tutorial_id` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `users_table` MODIFY `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50');

-- DropTable
DROP TABLE `tutorial_subtopics`;

-- CreateIndex
CREATE INDEX `subtopic_table_tutorial_id_idx` ON `subtopic_table`(`tutorial_id`);

-- AddForeignKey
ALTER TABLE `subtopic_table` ADD CONSTRAINT `subtopic_table_tutorial_id_fkey` FOREIGN KEY (`tutorial_id`) REFERENCES `tutorials_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
