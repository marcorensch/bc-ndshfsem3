CREATE TABLE IF NOT EXISTS `answer_votes`
(
    `id`        int(11)    NOT NULL AUTO_INCREMENT,
    `answer_id` int(11)    NOT NULL,
    `user_id`   int(11)    NOT NULL,
    `voting`    tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`answer_id`) REFERENCES answers (`id`),
    FOREIGN KEY (`user_id`) REFERENCES users (`id`)
) ENGINE = InnoDB;