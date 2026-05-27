# Kanban CRUD

Aplicacao web fullstack para gestao de vistos e pedidos usando um quadro Kanban. Tem autenticacao JWT, controle de perfis (MASTER/USER) e roda tudo com Docker.

O backend e dividido em 4 APIs Spring Boot independentes, cada uma com seu proprio dominio. O frontend e Angular 19.

## Stack

- **Frontend:** Angular 19 + Angular Material + CDK Drag & Drop
- **Backend:** Java 21 + Spring Boot 3.5 (4 APIs separadas)
- **Banco:** PostgreSQL 16
- **Mensageria:** RabbitMQ 3
- **Auth:** JWT com HMAC-SHA256
- **Infra:** Docker Compose

## Como rodar

Precisa ter o Docker Desktop instalado.

```bash
cp .env.example .env
```

Edita o `.env` com senhas seguras. Pra gerar o `JWT_SECRET_KEY_BASE64`:

```bash
echo -n "sua-chave-secreta-aqui" | base64
```

Depois sobe tudo:

```bash
docker-compose up --build
```

Demora um pouco na primeira vez. Espera os health checks passarem e acessa `http://localhost:4200`.

## Portas

| Servico | Porta |
|---------|-------|
| Frontend | 4200 |
| API Usuarios | 8083 |
| API Pedidos | 8081 |
| API Vistos | 8082 |
| API Agencias | 8084 |
| RabbitMQ (dashboard) | 15672 |

Todas as APIs tem Swagger em `http://localhost:{porta}/swagger-ui/index.html`.

## APIs

### Usuarios (`:8083`)

Autenticacao e gerenciamento de contas.

- `POST /api/v1/usuarios/criar` - cadastro (publico)
- `POST /api/v1/usuarios/autenticar` - login, retorna JWT (publico)
- `GET /api/v1/usuarios/pendentes` - lista pendentes (MASTER)
- `PUT /api/v1/usuarios/{id}/aprovar` - aprova usuario (MASTER)
- `PUT /api/v1/usuarios/{id}/rejeitar` - rejeita usuario (MASTER)
- `PUT /api/v1/usuarios/{id}/perfil` - altera perfil (MASTER)

### Pedidos (`:8081`)

CRUD das tarefas do quadro Kanban.

- `GET /api/tasks` - lista tarefas
- `POST /api/tasks` - cria tarefa
- `PATCH /api/tasks/{id}` - atualiza tarefa
- `DELETE /api/tasks/{id}` - remove tarefa (precisa informar motivo)

### Vistos (`:8082`)

- `GET /api/v1/vistos` - lista vistos
- `POST /api/v1/vistos` - cria visto
- `DELETE /api/v1/vistos/{id}` - remove visto (MASTER)

### Agencias (`:8084`)

- `GET /api/v1/agencias` - lista agencias
- `GET /api/v1/agencias/{id}` - busca por ID
- `POST /api/v1/agencias` - cadastra (MASTER)
- `PUT /api/v1/agencias/{id}` - atualiza (MASTER)
- `DELETE /api/v1/agencias/{id}` - remove (MASTER)

## Estrutura

```
backend/
  projetoUsuariosApi/   -> autenticacao e usuarios
  apidepedidos/         -> tarefas do kanban
  ApideVistos/          -> vistos
  api-agencias/         -> agencias
frontend/
  front/                -> app Angular
postgres-init/
  init.sql              -> cria os databases no startup
docker-compose.yml
.env.example
```

## Dev local (sem Docker)

Se quiser rodar sem Docker, vai precisar de Java 21, Node 20+ e Angular CLI 19.

Backend (cada API separada):
```bash
export JWT_SECRET_KEY=sua-chave
cd backend/projetoUsuariosApi
./mvnw spring-boot:run
```

Frontend:
```bash
cd frontend/front
npm install
ng serve
```

## Variaveis de ambiente

Veja o `.env.example` pra lista completa. Basicamente: credenciais dos bancos Postgres, usuario/senha do RabbitMQ, e a chave JWT (normal + base64).

**Nunca commite o `.env` com valores reais.**

## Seguranca

- Senhas com BCrypt
- JWT expira em 2h
- Rotas protegidas por token (exceto login/cadastro)
- Operacoes destrutivas so pra MASTER
