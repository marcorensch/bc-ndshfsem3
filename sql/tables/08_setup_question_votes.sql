CREATE TABLE IF NOT EXISTS `question_votes`
(
    `id`          int(11)    NOT NULL AUTO_INCREMENT,
    `question_id` int(11)    NOT NULL,
    `user_id`     int(11)    NOT NULL,
    `voting`      tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`question_id`) REFERENCES questions (`id`),
    FOREIGN KEY (`user_id`) REFERENCES users (`id`)
) ENGINE = InnoDB;
