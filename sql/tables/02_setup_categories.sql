CREATE TABLE IF NOT EXISTS `categories`
(
    `id`         int(11)             NOT NULL AUTO_INCREMENT,
    `title`      varchar(255) UNIQUE NOT NULL,
    `alias`      varchar(255) UNIQUE NOT NULL,
    `fav`        tinyint(1)          NOT NULL DEFAULT 0,
    `created_at` timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB;
