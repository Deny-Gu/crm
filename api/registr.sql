ALTER TABLE users
  MODIFY login VARCHAR(64)
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_bin
  NOT NULL;

CREATE UNIQUE INDEX ux_users_login_cs ON users (login);