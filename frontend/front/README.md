# Kanban App Refatorado

## Visão Geral

Este projeto é uma versão refatorada do Kanban App original, onde todo o código foi reorganizado seguindo as melhores práticas de arquitetura Angular, separando responsabilidades em componentes, serviços e modelos distintos.

## Estrutura do Projeto Refatorado

### 📁 Modelos (`src/app/models/`)
- **`task.model.ts`** - Interface que define a estrutura de uma tarefa
- **`column.model.ts`** - Interface que define a estrutura de uma coluna do kanban
- **`index.ts`** - Arquivo de índice para exportação centralizada dos modelos

### 🔧 Serviços (`src/app/services/`)
- **`local-storage.service.ts`** - Gerencia o armazenamento local das colunas
- **`task-api.service.ts`** - Gerencia as chamadas HTTP para a API de tarefas
- **`kanban.service.ts`** - Serviço principal que orquestra toda a lógica de negócio do kanban
- **`index.ts`** - Arquivo de índice para exportação centralizada dos serviços

### 🧩 Componentes (`src/app/components/`)

#### **KanbanBoard** (`kanban-board/`)
- Componente principal que orquestra todo o quadro kanban
- Gerencia os estados dos modais e interações entre componentes
- Responsável pela comunicação com o KanbanService

#### **Column** (`column/`)
- Representa uma coluna individual do kanban
- Exibe o cabeçalho da coluna com nome e contador de tarefas
- Renderiza as tarefas usando o componente TaskCard

#### **TaskCard** (`task-card/`)
- Representa uma tarefa individual
- Exibe título, descrição, data e responsável
- Gerencia estados de hover e ações de exclusão

#### **TaskModal** (`task-modal/`)
- Modal para criação de novas tarefas
- Formulário com validação para título, descrição, data e coluna
- Interface responsiva para desktop e mobile

#### **DeleteModal** (`delete-modal/`)
- Modal de confirmação para exclusão de tarefas
- Exibe informações da tarefa a ser excluída
- Interface de confirmação com botões de ação

## Principais Melhorias da Refatoração

### 🏗️ **Separação de Responsabilidades**
- **Antes**: Todo o código estava concentrado no `app.component.ts` (mais de 300 linhas)
- **Depois**: Código distribuído em componentes especializados e serviços dedicados

### 📦 **Modularização**
- **Modelos**: Interfaces TypeScript bem definidas para tipagem forte
- **Serviços**: Lógica de negócio separada da apresentação
- **Componentes**: Componentes reutilizáveis e focados em uma única responsabilidade

### 🔄 **Gerenciamento de Estado**
- **Antes**: Estado gerenciado diretamente no componente principal
- **Depois**: Estado centralizado no `KanbanService` usando RxJS Observables

### 🎨 **Interface do Usuário**
- **Componentes Reutilizáveis**: TaskCard, Column, Modals
- **Responsividade**: Design adaptável para diferentes tamanhos de tela
- **Acessibilidade**: Melhor estrutura semântica e navegação

### 🧪 **Testabilidade**
- **Antes**: Difícil de testar devido ao código monolítico
- **Depois**: Cada componente e serviço possui seus próprios testes unitários

### 🔧 **Manutenibilidade**
- **Código Limpo**: Funções pequenas e focadas
- **Tipagem Forte**: Uso extensivo de TypeScript
- **Documentação**: Código autodocumentado com interfaces claras

## Estrutura de Arquivos

```
src/app/
├── components/
│   ├── kanban-board/
│   │   ├── kanban-board.component.ts
│   │   ├── kanban-board.component.html
│   │   ├── kanban-board.component.css
│   │   └── kanban-board.component.spec.ts
│   ├── column/
│   │   ├── column.component.ts
│   │   ├── column.component.html
│   │   ├── column.component.css
│   │   └── column.component.spec.ts
│   ├── task-card/
│   │   ├── task-card.component.ts
│   │   ├── task-card.component.html
│   │   ├── task-card.component.css
│   │   └── task-card.component.spec.ts
│   ├── task-modal/
│   │   ├── task-modal.component.ts
│   │   ├── task-modal.component.html
│   │   ├── task-modal.component.css
│   │   └── task-modal.component.spec.ts
│   ├── delete-modal/
│   │   ├── delete-modal.component.ts
│   │   ├── delete-modal.component.html
│   │   ├── delete-modal.component.css
│   │   └── delete-modal.component.spec.ts
│   └── index.ts
├── models/
│   ├── task.model.ts
│   ├── column.model.ts
│   └── index.ts
├── services/
│   ├── local-storage.service.ts
│   ├── task-api.service.ts
│   ├── kanban.service.ts
│   └── index.ts
├── app.component.ts
├── app.component.html
├── app.component.css
└── app.config.ts
```

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   ng serve
   ```

3. **Executar testes:**
   ```bash
   ng test
   ```

4. **Build para produção:**
   ```bash
   ng build
   ```

## Funcionalidades

- ✅ **Criação de Tarefas**: Modal intuitivo para adicionar novas tarefas
- ✅ **Visualização em Colunas**: 9 colunas predefinidas para diferentes estados
- ✅ **Exclusão de Tarefas**: Modal de confirmação para exclusão segura
- ✅ **Persistência Local**: Dados salvos automaticamente no localStorage
- ✅ **Integração com API**: Sincronização com backend (quando disponível)
- ✅ **Tarefas Vencidas**: Movimentação automática para coluna "Vencido"
- ✅ **Interface Responsiva**: Funciona em desktop e dispositivos móveis

## Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **Angular Material** - Componentes de UI
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **CSS3** - Estilização
- **Jasmine/Karma** - Testes unitários

## Benefícios da Refatoração

1. **Manutenibilidade**: Código mais fácil de entender e modificar
2. **Escalabilidade**: Estrutura preparada para crescimento do projeto
3. **Reutilização**: Componentes podem ser reutilizados em outras partes da aplicação
4. **Testabilidade**: Cada parte pode ser testada independentemente
5. **Performance**: Melhor detecção de mudanças e otimizações
6. **Colaboração**: Estrutura clara facilita trabalho em equipe

---

**Desenvolvido com ❤️ usando Angular e boas práticas de desenvolvimento**

