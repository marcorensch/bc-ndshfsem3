CREATE TABLE IF NOT EXISTS `access_tokens` (
    id int(11) PRIMARY KEY AUTO_INCREMENT,
    token text,
    created_at timestamp DEFAULT now()
) ENGINE=InnoDB;