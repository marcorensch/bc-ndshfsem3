CREATE TABLE IF NOT EXISTS users
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `username`   varchar(255) NOT NULL DEFAULT '',
    `firstname`  varchar(255) NOT NULL DEFAULT '',
    `lastname`   varchar(255) NOT NULL DEFAULT '',
    `password`   varchar(255) NOT NULL DEFAULT '',
    `email`      varchar(255) NOT NULL DEFAULT '',
    `status`     tinyint(1)   NOT NULL DEFAULT 0,
    `usergroup`  int(11)      NOT NULL DEFAULT 1,
    `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`),
    FOREIGN KEY (`usergroup`) REFERENCES usergroups (`id`)
)
    ENGINE = InnoDB;