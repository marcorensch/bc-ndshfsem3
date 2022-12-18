CREATE TABLE IF NOT EXISTS `categories`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `title`      varchar(255) NOT NULL,
    `alias`      text         NOT NULL,
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB;
