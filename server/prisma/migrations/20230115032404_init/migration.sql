-- CreateTable
CREATE TABLE `stat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL DEFAULT '',
    `province` VARCHAR(191) NULL DEFAULT '',
    `city` VARCHAR(191) NULL DEFAULT '',
    `isp` VARCHAR(191) NULL DEFAULT '',
    `userAgent` VARCHAR(191) NULL DEFAULT '',
    `channel` INTEGER NULL DEFAULT 0,
    `source` VARCHAR(191) NULL DEFAULT '',
    `createdAt` DATETIME NULL,
    `updatedAt` DATETIME NULL,
    `latestAt` DATETIME NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `introduce` VARCHAR(191) NULL DEFAULT '',
    `desc` VARCHAR(191) NULL DEFAULT '',
    `level` INTEGER NOT NULL,
    `template` VARCHAR(191) NOT NULL DEFAULT '',
    `test` VARCHAR(191) NOT NULL DEFAULT '',
    `answermd` VARCHAR(191) NULL DEFAULT '',
    `answer` VARCHAR(191) NULL DEFAULT '',
    `tag` INTEGER NULL,
    `createdAt` DATETIME NULL,
    `updatedAt` DATETIME NULL,

    UNIQUE INDEX `question_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
