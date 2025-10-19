CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  jti CHAR(36) NOT NULL,                           -- UUID токена
  refresh_hash CHAR(64) NOT NULL,                  -- sha256 от токена
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  replaced_by_jti CHAR(36) NULL,                   -- для ротации
  user_agent VARCHAR(255) NULL,
  ip VARCHAR(45) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_jti (jti),
  KEY idx_user (user_id),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;