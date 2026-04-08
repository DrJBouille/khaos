-- Keycloak DB
CREATE DATABASE keycloak;

-- khaos DB
CREATE DATABASE khaos;

-- Create backend user
CREATE USER admin_user WITH ENCRYPTED PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE khaos TO admin_user;
GRANT ALL ON SCHEMA public TO admin_user;
ALTER SCHEMA public OWNER TO admin_user;
ALTER DATABASE khaos OWNER TO admin_user;


