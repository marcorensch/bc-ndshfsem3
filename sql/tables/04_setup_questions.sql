CREATE TABLE IF NOT EXISTS `questions`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `content`     text         NOT NULL,
    `category_id` varchar(255) NOT NULL,
    `created_by`  int(11)      NOT NULL,
    `anonymous`   tinyint(1)   NOT NULL DEFAULT 0,
    `accepted_id` int(11)      NOT NULL DEFAULT 0,
    `created_at`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`created_by`) REFERENCES users (`id`),
    FOREIGN KEY (`accepted_id`) REFERENCES answers (`id`)
) ENGINE = InnoDB;
