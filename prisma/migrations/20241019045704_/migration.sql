/*
  Warnings:

  - You are about to alter the column `permission_name` on the `permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(50)`.
  - You are about to alter the column `permission_code` on the `permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(50)`.
  - You are about to alter the column `role_name` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(50)`.
  - You are about to alter the column `role_code` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(50)`.
  - You are about to alter the column `user_name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(50)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(100)`.
  - You are about to alter the column `real_name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(100)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(100)`.
  - You are about to alter the column `phone_number` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(100)`.

*/
-- AlterTable
ALTER TABLE `permission` MODIFY `permission_name` CHAR(50) NOT NULL,
    MODIFY `permission_code` CHAR(50) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `role` MODIFY `role_name` CHAR(50) NOT NULL,
    MODIFY `role_code` CHAR(50) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `user_name` CHAR(50) NOT NULL,
    MODIFY `password` CHAR(100) NOT NULL,
    MODIFY `real_name` CHAR(100) NOT NULL,
    MODIFY `email` CHAR(100) NOT NULL,
    MODIFY `phone_number` CHAR(100) NOT NULL,
    MODIFY `head_pic` TEXT NULL;
