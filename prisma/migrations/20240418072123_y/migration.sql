-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `like` INTEGER NOT NULL,
    `status` TINYINT NOT NULL,
    `agent` VARCHAR(255) NOT NULL,
    `author` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `content` VARCHAR(2046) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
