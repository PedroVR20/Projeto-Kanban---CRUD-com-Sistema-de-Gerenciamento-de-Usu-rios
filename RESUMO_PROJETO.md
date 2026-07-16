# 📋 Resumo do Projeto Kanban — CRUD com Sistema de Gerenciamento de Usuários

## O que é este projeto?

Aplicação **web fullstack** para gestão de vistos e pedidos usando um **quadro Kanban interativo**. Sistema completo de autenticação com **JWT**, controle de perfis (**MASTER/USER**), e infraestrutura containerizada com **Docker**. Arquitetura baseada em **4 microserviços independentes** no backend, cada um com seu próprio banco de dados PostgreSQL.

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Angular 19** — Framework principal com tipagem forte
- **Angular Material** — Componentes de UI prontos para produção
- **CDK Drag & Drop** — Suporte para arrastar e soltar tarefas entre colunas
- **TypeScript 5.7** — Tipagem estática
- **RxJS 7.8** — Programação reativa

### **Backend**
- **Java 21** — Linguagem principal
- **Spring Boot 3.5** — Framework web com autoconfiguration
- **Spring Data JPA** — ORM para persistência
- **Spring Security** — Autenticação e autorização
- **Spring AMQP** — Integração com RabbitMQ
- **JWT (io.jsonwebtoken)** — Tokens de autenticação segura
- **Lombok** — Redução de boilerplate (getters, setters, construtores)
- **Springdoc OpenAPI** — Swagger/OpenAPI automático

### **Infraestrutura & Banco de Dados**
- **PostgreSQL 16** — Banco de dados relacional
- **RabbitMQ 3** — Message broker para comunicação assíncrona
- **Docker** — Containerização
- **Docker Compose** — Orquestração de containers

---

## 📁 Estrutura do Projeto

```
📦 Projeto-Kanban---CRUD-com-Sistema-de-Gerenciamento-de-Usuários/
│
├── 🔧 backend/                          # APIs Spring Boot independentes
│   ├── projetoUsuariosApi/              # API de Autenticação & Usuários (porta 8083)
│   │   ├── pom.xml                      # Dependências Maven
│   │   ├── src/main/java/              # Código-fonte Java
│   │   └── Dockerfile                   # Imagem Docker
│   │
│   ├── apidepedidos/                    # API de Tarefas/Pedidos (porta 8081)
│   │   ├── pom.xml
│   │   ├── src/main/java/
│   │   └── Dockerfile
│   │
│   ├── ApideVistos/                     # API de Vistos (porta 8082)
│   │   ├── pom.xml
│   │   ├── src/main/java/
│   │   └── Dockerfile
│   │
│   └── api-agencias/                    # API de Agências (porta 8084)
│       ├── pom.xml
│       ├── src/main/java/
│       └── Dockerfile
│
├── 🎨 frontend/
│   └── front/                           # Aplicação Angular (porta 4200)
│       ├── package.json
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/          # Componentes reutilizáveis
│       │   │   │   ├── kanban-board/   # Quadro principal
│       │   │   │   ├── column/         # Coluna do Kanban
│       │   │   │   ├── task-card/      # Card de tarefa
│       │   │   │   ├── task-modal/     # Modal de criar tarefa
│       │   │   │   └── delete-modal/   # Modal de confirmação
│       │   │   ├── models/              # Interfaces TypeScript
│       │   │   ├── services/            # Lógica de negócio
│       │   │   └── app.component.ts    # Componente raiz
│       │   ├── assets/
│       │   └── styles.css
│       └── Dockerfile
│
├── 🗄️ postgres-init/
│   └── init.sql                         # Script de inicialização dos databases
│
├── 🐳 docker-compose.yml                # Orquestração completa da infraestrutura
├── .env.example                         # Variáveis de ambiente (exemplo)
├── .gitignore
└── README.md
```

---

## 🚀 Como Executar

### **Pré-requisitos**
- Docker Desktop instalado
- Git

### **Passo 1: Clonar o Repositório**
```bash
git clone https://github.com/PedroVR20/Projeto-Kanban---CRUD-com-Sistema-de-Gerenciamento-de-Usu-rios.git
cd Projeto-Kanban---CRUD-com-Sistema-de-Gerenciamento-de-Usu-rios
```

### **Passo 2: Configurar Variáveis de Ambiente**
```bash
cp .env.example .env
```

Editar o arquivo `.env` e trocar as senhas padrão:

```env
# Banco principal
POSTGRES_MAIN_USER=admin
POSTGRES_MAIN_PASSWORD=sua_senha_forte

# Banco de pedidos
POSTGRES_PEDIDOS_USER=postgres
POSTGRES_PEDIDOS_PASSWORD=sua_senha_forte

# RabbitMQ
RABBITMQ_USER=seu_usuario
RABBITMQ_PASS=sua_senha_forte

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET_KEY=sua-chave-secreta-forte-com-minimo-32-chars
JWT_SECRET_KEY_BASE64=$(echo -n "sua-chave-aqui" | base64)
```

### **Passo 3: Iniciar o Docker Compose**
```bash
docker-compose up --build
```

Aguardar que todos os health checks passem (cerca de 1-2 minutos na primeira vez).

### **Passo 4: Acessar a Aplicação**
- **Frontend:** http://localhost:4200
- **Swagger APIs:**
  - Usuários: http://localhost:8083/swagger-ui/index.html
  - Pedidos: http://localhost:8081/swagger-ui/index.html
  - Vistos: http://localhost:8082/swagger-ui/index.html
  - Agências: http://localhost:8084/swagger-ui/index.html
- **RabbitMQ Management:** http://localhost:15672 (usuário/senha: veja `.env`)

---

## 📡 APIs Disponíveis

### **API Usuários (porta 8083)**
Autenticação e gerenciamento de contas.

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `POST` | `/api/v1/usuarios/criar` | Cadastro de novo usuário | Público |
| `POST` | `/api/v1/usuarios/autenticar` | Login, retorna JWT | Público |
| `GET` | `/api/v1/usuarios/pendentes` | Lista usuários pendentes | MASTER |
| `PUT` | `/api/v1/usuarios/{id}/aprovar` | Aprova usuário | MASTER |
| `PUT` | `/api/v1/usuarios/{id}/rejeitar` | Rejeita usuário | MASTER |
| `PUT` | `/api/v1/usuarios/{id}/perfil` | Altera perfil de usuário | MASTER |

### **API Pedidos (porta 8081)**
CRUD das tarefas do quadro Kanban.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/tasks` | Lista todas as tarefas |
| `POST` | `/api/tasks` | Cria nova tarefa |
| `PATCH` | `/api/tasks/{id}` | Atualiza tarefa (coluna, status) |
| `DELETE` | `/api/tasks/{id}` | Remove tarefa (motivo obrigatório) |

### **API Vistos (porta 8082)**
Gerenciamento de vistos.

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/api/v1/vistos` | Lista vistos | Autenticado |
| `POST` | `/api/v1/vistos` | Cria novo visto | Autenticado |
| `DELETE` | `/api/v1/vistos/{id}` | Remove visto | MASTER |

### **API Agências (porta 8084)**
Gestão de agências (localidades).

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| `GET` | `/api/v1/agencias` | Lista agências | Autenticado |
| `GET` | `/api/v1/agencias/{id}` | Busca agência por ID | Autenticado |
| `POST` | `/api/v1/agencias` | Cadastra agência | MASTER |
| `PUT` | `/api/v1/agencias/{id}` | Atualiza agência | MASTER |
| `DELETE` | `/api/v1/agencias/{id}` | Remove agência | MASTER |

---

## 🏗️ Como Funciona

### **Fluxo da Aplicação**

```
Usuário acessa http://localhost:4200
    ↓
[Frontend Angular]
    ↓ (Login/Cadastro)
    ↓ (JWT Token armazenado no localStorage)
    ↓
[API Usuários - Autenticação]
    ↓ (Token retornado)
    ↓
[Quadro Kanban]
    ↓ (Requisições HTTP com Token)
    ├→ [API Pedidos] → Busca/Cria/Atualiza tarefas
    ├→ [API Vistos] → Gerencia vistos
    └→ [API Agências] → Busca agências
    ↓
[PostgreSQL Múltiplo]
    ├→ usuarios_db (usuários, autenticação)
    ├→ pedidos_db (tarefas)
    ├→ vistos_db (vistos)
    └→ agencias_db (agências)
    ↓
[RabbitMQ - Fila de Mensagens]
    (Comunicação assíncrona entre APIs)
```

### **Arquitetura de Microserviços**

Cada API é **independente**:
- Seu próprio banco de dados PostgreSQL
- Seu próprio Dockerfile
- Seu próprio port
- Comunica via HTTP REST + JWT
- Usa RabbitMQ para eventos assíncronos

**Vantagens:**
- ✅ Escalabilidade horizontal (rodar múltiplas instâncias)
- ✅ Deploy independente (não quebra tudo se uma API falha)
- ✅ Stack compartilhado (Spring Boot, Java) mas contextos separados
- ✅ Fácil de testar (cada API isolada)

---

## 🔐 Segurança

### **Autenticação & Autorização**
- **JWT (JSON Web Tokens)** com HMAC-SHA256
- **Tokens expiram em 2 horas**
- **Senhas criptografadas com BCrypt**
- **Rotas protegidas** — token obrigatório (exceto `/criar` e `/autenticar`)
- **Dois perfis:** 
  - `USER` — operações de leitura e criação
  - `MASTER` — operações destrutivas (delete, aprovar/rejeitar)

### **Boas Práticas**
- ✅ `.env` nunca é commitado (veja `.gitignore`)
- ✅ Variáveis sensíveis em variáveis de ambiente
- ✅ Spring Security integrado
- ✅ CORS configurado (frontend:4200 × backend:8080+)

---

## 🧪 Executar Localmente (sem Docker)

Se quiser rodar sem Docker, vai precisar de:
- Java 21 JDK
- Node.js 20+
- Angular CLI 19
- PostgreSQL 16
- RabbitMQ local

### **Backend (Cada API separadamente)**
```bash
cd backend/projetoUsuariosApi
export JWT_SECRET_KEY=sua-chave
./mvnw spring-boot:run
```

### **Frontend**
```bash
cd frontend/front
npm install
ng serve
```

Acesse http://localhost:4200

---

## 📊 Composição de Linguagens

| Linguagem | Percentual | Uso |
|-----------|-----------|-----|
| **Java** | 38.2% | Backend (4 APIs Spring Boot) |
| **TypeScript** | 37.2% | Frontend (Angular 19) |
| **HTML** | 12.7% | Templates Angular |
| **CSS/SCSS** | 10.4% | Estilos (Material + custom) |
| **Dockerfile** | 1.5% | Configuração de containers |

---

## 📋 Variáveis de Ambiente Importantes

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `POSTGRES_MAIN_USER` | Usuário do banco principal | `admin` |
| `POSTGRES_MAIN_PASSWORD` | Senha do banco principal | `senha_forte_123` |
| `POSTGRES_PEDIDOS_USER` | Usuário do banco pedidos | `postgres` |
| `POSTGRES_PEDIDOS_PASSWORD` | Senha do banco pedidos | `senha_forte_456` |
| `RABBITMQ_USER` | Usuário do RabbitMQ | `guest` |
| `RABBITMQ_PASS` | Senha do RabbitMQ | `guest` |
| `JWT_SECRET_KEY` | Chave JWT (32+ chars) | Qualquer string forte |
| `JWT_SECRET_KEY_BASE64` | Chave JWT em base64 | `base64_encoded_key` |

---

## 🧩 Estrutura do Frontend Refatorado

O Angular foi refatorado seguindo **best practices**:

### **Componentes**
- `KanbanBoard` — Quadro principal, orquestra tudo
- `Column` — Representa uma coluna do Kanban
- `TaskCard` — Cartão individual de tarefa
- `TaskModal` — Modal para criar/editar tarefa
- `DeleteModal` — Confirmação de exclusão

### **Serviços**
- `KanbanService` — Lógica de negócio central
- `TaskApiService` — Comunicação com backend
- `LocalStorageService` — Persistência local

### **Modelos**
- `Task` — Interface da tarefa
- `Column` — Interface da coluna

**Benefícios da refatoração:**
- ✅ Separação clara de responsabilidades
- ✅ Reutilização de componentes
- ✅ Fácil de testar (Jasmine/Karma)
- ✅ State management com RxJS Observables
- ✅ Performance otimizada

---

## 🚦 Portas da Aplicação

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **Frontend** | `4200` | Angular app |
| **API Usuários** | `8083` | Autenticação, gerenciamento de usuários |
| **API Pedidos** | `8081` | Tarefas/Pedidos do Kanban |
| **API Vistos** | `8082` | Gerenciamento de vistos |
| **API Agências** | `8084` | Gerenciamento de agências |
| **RabbitMQ AMQP** | `5672` | Message broker (porta nativa) |
| **RabbitMQ Admin** | `15672` | Dashboard gerenciamento RabbitMQ |
| **PostgreSQL Principal** | `5432` | Banco usuarios_db, vistos_db, agencias_db |
| **PostgreSQL Pedidos** | `5434` | Banco pedidos_db |
| **PostgreSQL Logs** | `5433` | Banco logs_db |

---

## 📚 Recursos Adicionais

- **Swagger/OpenAPI** — Documentação automática disponível em `/swagger-ui/index.html` de cada API
- **Spring Boot Actuator** — Health checks integrados
- **Docker Healthchecks** — Verifica saúde de cada container
- **Git Hooks** — `.gitattributes` configurado para eol=lf

---

## 👨‍💻 Desenvolvedor

- **GitHub:** [@PedroVR20](https://github.com/PedroVR20)
- **Repositório:** [Projeto-Kanban---CRUD-com-Sistema-de-Gerenciamento-de-Usuários](https://github.com/PedroVR20/Projeto-Kanban---CRUD-com-Sistema-de-Gerenciamento-de-Usu-rios)

---

## 📝 Notas Importantes

- ⚠️ **Nunca commite o arquivo `.env`** com valores reais
- ✅ **Use valores fortes para JWT_SECRET_KEY** (mínimo 32 caracteres)
- 🔄 **RabbitMQ é opcional** — algumas APIs funcionam sem mensageria
- 🐳 **Docker é recomendado** — evita problemas de compatibilidade
- 🔒 **JWT expira em 2 horas** — implemente refresh token para sessões longas
- 📱 **Frontend é responsivo** — funciona em mobile também

---

**Última atualização:** 2026-07-16  
**Status:** ✅ Funcional e em produção
