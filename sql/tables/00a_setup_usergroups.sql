CREATE TABLE IF NOT EXISTS `usergroups`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `title`      varchar(255) NOT NULL DEFAULT '',
    `alias`      varchar(255) NOT NULL DEFAULT '',
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `alias` (`alias`),
    UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB;