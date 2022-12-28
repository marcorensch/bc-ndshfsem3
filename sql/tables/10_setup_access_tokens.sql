CREATE TABLE IF NOT EXISTS `access_tokens` (
    id int(11) PRIMARY KEY AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    token text,
    created_at timestamp DEFAULT now()
) ENGINE=InnoDB;