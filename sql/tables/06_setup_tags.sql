CREATE TABLE IF NOT EXISTS `tags`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `title`      varchar(100) NOT NULL,
    `alias`      varchar(100) NOT NULL,
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `title` (`title`)
) ENGINE = InnoDB;
