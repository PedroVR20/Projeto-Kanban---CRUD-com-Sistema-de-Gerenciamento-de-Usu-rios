-- Cria os bancos de dados necessários
CREATE DATABASE usuarios_db;
CREATE DATABASE vistos_db;
CREATE DATABASE agencias_db;
CREATE DATABASE pedidos_db;
CREATE DATABASE logs_db;


\c usuarios_db;



CREATE TABLE IF NOT EXISTS tb_usuarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    perfil VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);


INSERT INTO tb_usuarios(id, nome, email, senha, perfil, status)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Usuário Master', 'master@kanban.com', '$2a$10$3T3x26fS/VDeb95sFy.5fOSKpOj9i5zr3Z6YV3.qR0iYBr7VweVee', 'MASTER', 'APROVADO')
ON CONFLICT (id) DO NOTHING;



\c pedidos_db;

CREATE TABLE IF NOT EXISTS tb_pedidos (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255),
    visa_application_type VARCHAR(255),
    client_id VARCHAR(255),
    file VARCHAR(255),
    agency VARCHAR(255),
    agency_contact VARCHAR(255),
    hiring_date VARCHAR(255),
    state VARCHAR(255),
    casv_date_time VARCHAR(255),
    consulate_date_time VARCHAR(255),
    visa_country VARCHAR(255),
    status VARCHAR(255),
    process_status VARCHAR(255),
    owner_id VARCHAR(255)
);

