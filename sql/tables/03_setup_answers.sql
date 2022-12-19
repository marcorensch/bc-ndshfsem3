CREATE TABLE IF NOT EXISTS `answers`
(
    `id`          int(11)   NOT NULL AUTO_INCREMENT,
    `content`     text      NOT NULL,
    `created_by`  int(11)   NOT NULL,
    `created_at`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`created_by`) REFERENCES users (`id`)
) ENGINE = InnoDB;
