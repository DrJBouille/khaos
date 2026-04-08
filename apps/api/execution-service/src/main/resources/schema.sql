CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'task_status'
    ) THEN
CREATE TYPE task_status AS ENUM (
  'NOT_STARTED',
  'PENDING',
  'RUNNING',
  'FINISHED',
  'FAILED',
  'CANCELLED'
);
END IF;
END
$$;

CREATE TABLE IF NOT EXISTS khaos_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keycloak_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(24) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL DEFAULT '',
  user_id UUID NOT NULL,
  CONSTRAINT fk_khaos_users FOREIGN KEY(user_id) REFERENCES khaos_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  docker_process_id TEXT NOT NULL,
  status task_status DEFAULT 'NOT_STARTED',
  duration int,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
