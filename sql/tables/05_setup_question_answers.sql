CREATE TABLE IF NOT EXISTS `question_answers`
(
    `id`          int(11) NOT NULL AUTO_INCREMENT,
    `question_id` int(11) NOT NULL,
    `answer_id`   int(11) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`question_id`) REFERENCES questions (`id`),
    FOREIGN KEY (`answer_id`) REFERENCES answers (`id`)
) ENGINE = InnoDB;
