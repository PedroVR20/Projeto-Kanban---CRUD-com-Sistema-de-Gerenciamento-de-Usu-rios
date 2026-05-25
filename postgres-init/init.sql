-- Bancos de dados do servidor principal (database-postgres)
-- pedidos_db e logs_db pertencem às instâncias postgres-pedidos e postgres-logs
-- e são criados automaticamente via POSTGRES_DB no docker-compose.
CREATE DATABASE usuarios_db;
CREATE DATABASE vistos_db;
CREATE DATABASE agencias_db;

\c usuarios_db;

CREATE TABLE IF NOT EXISTS tb_usuarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    perfil VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

-- Usuário MASTER padrão (senha: Master@123)
INSERT INTO tb_usuarios(id, nome, email, senha, perfil, status)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Usuário Master', 'master@kanban.com', '$2a$10$3T3x26fS/VDeb95sFy.5fOSKpOj9i5zr3Z6YV3.qR0iYBr7VweVee', 'MASTER', 'APROVADO')
ON CONFLICT (id) DO NOTHING;
