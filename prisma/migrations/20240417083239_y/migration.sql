/*
  Warnings:

  - Added the required column `agent` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `like` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Prompt` ADD COLUMN `agent` VARCHAR(255) NOT NULL,
    ADD COLUMN `author` VARCHAR(255) NOT NULL,
    ADD COLUMN `like` INTEGER NOT NULL,
    ADD COLUMN `status` TINYINT NOT NULL;
