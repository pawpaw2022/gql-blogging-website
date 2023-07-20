/*
  Warnings:

  - You are about to drop the column `profileId` on the `Avatar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Avatar` DROP FOREIGN KEY `Avatar_profileId_fkey`;

-- AlterTable
ALTER TABLE `Avatar` DROP COLUMN `profileId`;

-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `avatarId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `Avatar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
