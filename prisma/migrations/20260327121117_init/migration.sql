-- CreateTable
CREATE TABLE `algovisuals_table` (
    `id` VARCHAR(40) NOT NULL,
    `subtopic_id` VARCHAR(40) NULL,
    `code_text` VARCHAR(500) NOT NULL,
    `code_steps` LONGTEXT NOT NULL,
    `input_array` VARCHAR(30) NOT NULL,

    INDEX `algovisuals_table_subtopic_id_subtopic_table_id_fk`(`subtopic_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments_table` (
    `id` VARCHAR(40) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `time` DATE NULL,
    `topic_id` VARCHAR(40) NOT NULL,

    INDEX `comments_table_topic_id_topics_table_id_fk`(`topic_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_description` (
    `id` VARCHAR(40) NOT NULL,
    `title` VARCHAR(255) NULL,
    `content` LONGTEXT NULL,
    `problem_id` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `problem_description_problem_id_unique`(`problem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_table` (
    `id` VARCHAR(40) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `link` VARCHAR(1000) NOT NULL,
    `difficulty` VARCHAR(10) NOT NULL DEFAULT 'Easy',
    `video_link` VARCHAR(1000) NULL,
    `author_id` VARCHAR(40) NOT NULL,
    `hints` LONGTEXT NULL,

    INDEX `problem_table_author_id_users_table_id_fk`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_visuals` (
    `id` VARCHAR(40) NOT NULL,
    `problem_id` VARCHAR(40) NOT NULL,
    `code_text` VARCHAR(500) NOT NULL,
    `code_steps` LONGTEXT NOT NULL,
    `input_array` VARCHAR(500) NOT NULL,

    UNIQUE INDEX `problem_visuals_problem_id_unique`(`problem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `set_problem` (
    `id` VARCHAR(40) NOT NULL,
    `set_id` VARCHAR(40) NOT NULL,
    `problem_id` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `set_problem_problem_id_unique`(`problem_id`),
    INDEX `set_problem_set_id_set_table_id_fk`(`set_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `set_table` (
    `id` VARCHAR(40) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `author_id` VARCHAR(40) NOT NULL,

    INDEX `set_table_author_id_users_table_id_fk`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subtopic_table` (
    `id` VARCHAR(40) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `difficulty` VARCHAR(255) NOT NULL DEFAULT 'Easy',
    `external_video` VARCHAR(1000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics_table` (
    `id` VARCHAR(40) NOT NULL,
    `title` VARCHAR(255) NULL,
    `content` LONGTEXT NULL,
    `tutorial_id` VARCHAR(40) NOT NULL,

    INDEX `topics_table_tutorial_id_tutorials_table_id_fk`(`tutorial_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutorial_subtopics` (
    `id` VARCHAR(191) NOT NULL,
    `tutorialId` VARCHAR(40) NOT NULL,
    `subtopicId` VARCHAR(40) NOT NULL,

    INDEX `tutorial_subtopics_subtopicId_subtopic_table_id_fk`(`subtopicId`),
    INDEX `tutorial_subtopics_tutorialId_tutorials_table_id_fk`(`tutorialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutorials_table` (
    `id` VARCHAR(40) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `authorId` VARCHAR(255) NOT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'algorithm',

    INDEX `tutorials_table_authorId_users_table_id_fk`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_problem` (
    `id` VARCHAR(40) NOT NULL,
    `user_id` VARCHAR(40) NOT NULL,
    `problem_ids` LONGTEXT NULL,

    UNIQUE INDEX `user_problem_user_id_unique`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_table` (
    `id` VARCHAR(40) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `dateJoined` DATETIME(0) NOT NULL DEFAULT ('2026-03-22 05:25:50'),

    UNIQUE INDEX `users_table_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `algovisuals_table` ADD CONSTRAINT `algovisuals_table_subtopic_id_subtopic_table_id_fk` FOREIGN KEY (`subtopic_id`) REFERENCES `subtopic_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments_table` ADD CONSTRAINT `comments_table_topic_id_topics_table_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `problem_description` ADD CONSTRAINT `problem_description_problem_id_problem_table_id_fk` FOREIGN KEY (`problem_id`) REFERENCES `problem_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `problem_table` ADD CONSTRAINT `problem_table_author_id_users_table_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `problem_visuals` ADD CONSTRAINT `problem_visuals_problem_id_problem_table_id_fk` FOREIGN KEY (`problem_id`) REFERENCES `problem_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `set_problem` ADD CONSTRAINT `set_problem_problem_id_problem_table_id_fk` FOREIGN KEY (`problem_id`) REFERENCES `problem_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `set_problem` ADD CONSTRAINT `set_problem_set_id_set_table_id_fk` FOREIGN KEY (`set_id`) REFERENCES `set_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `set_table` ADD CONSTRAINT `set_table_author_id_users_table_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `topics_table` ADD CONSTRAINT `topics_table_tutorial_id_tutorials_table_id_fk` FOREIGN KEY (`tutorial_id`) REFERENCES `tutorials_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tutorial_subtopics` ADD CONSTRAINT `tutorial_subtopics_subtopicId_subtopic_table_id_fk` FOREIGN KEY (`subtopicId`) REFERENCES `subtopic_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tutorial_subtopics` ADD CONSTRAINT `tutorial_subtopics_tutorialId_tutorials_table_id_fk` FOREIGN KEY (`tutorialId`) REFERENCES `tutorials_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tutorials_table` ADD CONSTRAINT `tutorials_table_authorId_users_table_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_problem` ADD CONSTRAINT `user_problem_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
