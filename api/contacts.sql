ALTER TABLE `users`
  MODIFY COLUMN `contacts` VARCHAR(255) NULL DEFAULT NULL;

UPDATE `users`
SET `contacts` = NULL
WHERE `contacts` IS NOT NULL AND TRIM(`contacts`) = '';