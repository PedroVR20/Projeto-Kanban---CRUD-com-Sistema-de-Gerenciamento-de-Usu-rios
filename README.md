# Kanban CRUD — Sistema de Gerenciamento de Usuários

Sistema completo de gestão de vistos e pedidos em formato Kanban, com autenticação JWT, controle de perfis e arquitetura de microsserviços.

---

## Arquitetura

```
Frontend (Angular 19)
        │
        ▼
┌───────────────────────────────────────────────┐
│              Docker Network                   │
│                                               │
│  api-usuarios :8083  ──► PostgreSQL (main)    │
│  api-vistos   :8082  ──► PostgreSQL (main)    │
│  api-agencias :8084  ──► PostgreSQL (main)    │
│  api-pedidos  :8081  ──► PostgreSQL (pedidos) │
│                      ──► PostgreSQL (logs)    │
│                                               │
│  api-usuarios ──► RabbitMQ                    │
└───────────────────────────────────────────────┘
```

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 19, Angular Material, CDK Drag & Drop |
| Backend | Spring Boot 3.5, Java 21 |
| Banco de dados | PostgreSQL 15/16 |
| Mensageria | RabbitMQ 3 |
| Autenticação | JWT (HMAC-SHA256) |
| Containerização | Docker + Docker Compose |

---

## Pré-requisitos

- Docker Desktop
- Java 21 (apenas para desenvolvimento local sem Docker)
- Node.js 20+ / Angular CLI 19 (apenas para desenvolvimento local sem Docker)

---

## Como executar

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com credenciais fortes. **Nunca commite o `.env` com valores reais.**

Para gerar o `JWT_SECRET_KEY_BASE64`:
```bash
echo -n "sua-chave-secreta-aqui" | base64
```

### 2. Suba todos os serviços com Docker

```bash
docker-compose up --build
```

Aguarde todos os serviços ficarem saudáveis (health checks configurados para Postgres e RabbitMQ).

### 3. Acesse a aplicação

| Serviço | URL |
|---------|-----|
| Frontend Kanban | http://localhost:4200 |
| API Usuários | http://localhost:8083 |
| API Pedidos | http://localhost:8081 |
| API Vistos | http://localhost:8082 |
| API Agências | http://localhost:8084 |
| RabbitMQ Management | http://localhost:15672 |

---

## APIs

### api-usuarios (`:8083`)
Gerenciamento de usuários com autenticação JWT e controle de perfis.

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/api/v1/usuarios/criar` | Público | Cadastra novo usuário |
| POST | `/api/v1/usuarios/autenticar` | Público | Login — retorna JWT |
| GET | `/api/v1/usuarios/pendentes` | MASTER | Lista usuários aguardando aprovação |
| PUT | `/api/v1/usuarios/{id}/aprovar` | MASTER | Aprova usuário |
| PUT | `/api/v1/usuarios/{id}/rejeitar` | MASTER | Rejeita usuário |
| PUT | `/api/v1/usuarios/{id}/perfil` | MASTER | Altera perfil do usuário |

Perfis disponíveis: `MASTER`, `USER`

### api-pedidos (`:8081`)
CRUD de tarefas/pedidos do quadro Kanban.

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/tasks` | JWT | Lista todas as tarefas |
| POST | `/api/tasks` | JWT | Cria nova tarefa |
| PATCH | `/api/tasks/{id}` | JWT | Atualiza tarefa |
| DELETE | `/api/tasks/{id}` | JWT | Remove tarefa (com motivo) |

### api-vistos (`:8082`)
Gerenciamento de registros de vistos.

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/vistos` | JWT | Lista vistos |
| POST | `/api/v1/vistos` | JWT | Cria visto |
| DELETE | `/api/v1/vistos/{id}` | MASTER | Remove visto |

### api-agencias (`:8084`)
Cadastro de agências parceiras.

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/api/v1/agencias` | JWT | Lista agências |
| GET | `/api/v1/agencias/{id}` | JWT | Busca agência por ID |
| POST | `/api/v1/agencias` | MASTER | Cadastra agência |
| PUT | `/api/v1/agencias/{id}` | MASTER | Atualiza agência |
| DELETE | `/api/v1/agencias/{id}` | MASTER | Remove agência |

Swagger UI disponível em cada API: `http://localhost:{porta}/swagger-ui/index.html`

---

## Estrutura do projeto

```
.
├── backend/
│   ├── projetoUsuariosApi/   # API de autenticação e usuários
│   ├── apidepedidos/         # API de tarefas do Kanban
│   ├── ApideVistos/          # API de vistos
│   └── api-agencias/         # API de agências
├── frontend/
│   └── front/                # Aplicação Angular 19
├── postgres-init/
│   └── init.sql              # Script de criação dos databases
├── docker-compose.yml
├── .env.example              # Template de variáveis de ambiente
└── .gitignore
```

---

## Desenvolvimento local (sem Docker)

### Backend

Cada API pode ser executada individualmente. Configure as variáveis de ambiente antes:

```bash
export JWT_SECRET_KEY=sua-chave-local
cd backend/projetoUsuariosApi
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend/front
npm install
ng serve
```

O Angular usa `environment.development.ts` em modo dev, apontando para `localhost`.

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_MAIN_USER` | Usuário do banco principal |
| `POSTGRES_MAIN_PASSWORD` | Senha do banco principal |
| `POSTGRES_PEDIDOS_USER` | Usuário do banco de pedidos/logs |
| `POSTGRES_PEDIDOS_PASSWORD` | Senha do banco de pedidos/logs |
| `RABBITMQ_USER` | Usuário do RabbitMQ |
| `RABBITMQ_PASS` | Senha do RabbitMQ |
| `JWT_SECRET_KEY` | Chave secreta JWT (mín. 32 chars) |
| `JWT_SECRET_KEY_BASE64` | JWT_SECRET_KEY em Base64 (para api-pedidos) |

---

## Segurança

- Senhas armazenadas com **BCrypt**
- Tokens JWT assinados com **HMAC-SHA256**, expiração de 2 horas
- Todas as APIs (exceto login/cadastro) exigem token válido
- Operações destrutivas restritas ao perfil **MASTER**
- Credenciais gerenciadas exclusivamente via variáveis de ambiente (`.env`)
