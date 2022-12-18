CREATE TABLE IF NOT EXISTS `question_tags`
(
    `id`          int(11) NOT NULL AUTO_INCREMENT,
    `question_id` int(11) NOT NULL,
    `tag_id`      int(11) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`question_id`) REFERENCES questions (`id`),
    FOREIGN KEY (`tag_id`) REFERENCES tags (`id`)
) ENGINE = InnoDB;
