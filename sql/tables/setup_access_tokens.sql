CREATE TABLE IF NOT EXISTS babylon.access_tokens (
    id int(11) PRIMARY KEY,
    token text,
    refreshtoken text,
    created_at timestamp DEFAULT now(),
    expires_at timestamp
);