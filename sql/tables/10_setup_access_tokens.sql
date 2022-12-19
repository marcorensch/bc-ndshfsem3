CREATE TABLE IF NOT EXISTS `access_tokens` (
    id int(11) PRIMARY KEY AUTO_INCREMENT,
    token text,
    refreshtoken text,
    created_at timestamp DEFAULT now(),
    expires_at timestamp
) ENGINE=InnoDB;