# GraphQL API Examples

Esta documentación contiene ejemplos completos de todas las operaciones GraphQL disponibles en la API de Backlog Pro Backend.

## Tabla de Contenidos

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Projects](#projects)
4. [Clients](#clients)
5. [Tasks](#tasks)
6. [Sprints](#sprints)
7. [Time Entries](#time-entries)
8. [User Stories](#user-stories)
9. [Risks](#risks)
10. [Meetings](#meetings)
11. [Goals](#goals)
12. [Finances](#finances)
13. [Metrics](#metrics)
14. [Feedback](#feedback)
15. [Achievements](#achievements)
16. [Notifications](#notifications)
17. [Subscriptions](#subscriptions)

## 🔄 CRUD Operations Summary

Los siguientes módulos tienen operaciones CRUD completas:

- ✅ **Projects**: Create, Read, Update, Delete + Members Management
- ✅ **Clients**: Create, Read, Update, Delete  
- ✅ **Tasks**: Create, Read, Update, Delete + Assignment & Dependencies
- ✅ **Sprints**: Create, Read, Update, Delete + Complete, Extend, Retrospective
- ✅ **Time Entries**: Create, Read, Update, Delete + Grouped Queries
- ✅ **User Stories**: Create, Read, Update, Delete + Backlog Management
- ✅ **Risks**: Create, Read, Update, Delete + Project-specific Queries
- ✅ **Meetings**: Create, Read, Update, Delete + Sprint-specific Queries
- ✅ **Goals**: Create, Read, Update, Delete + Progress Tracking
- ✅ **Transactions**: Create, Read, Update, Delete + Project Expenses

---

## Authentication

### Signup (Register User)

Registra un nuevo usuario en el sistema. El usuario debe confirmar su email antes de poder iniciar sesión.

**Mutation:**
```graphql
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    userId
    email
    name
    message
    requiresEmailConfirmation
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "John Doe"
  }
}
```

**Response:**
```json
{
  "data": {
    "signup": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "message": "Usuario registrado exitosamente. Por favor, revisa tu email para confirmar tu cuenta.",
      "requiresEmailConfirmation": true
    }
  }
}
```

### Signin (Login)

Inicia sesión con email y contraseña.

**Mutation:**
```graphql
mutation Signin($input: SigninInput!) {
  signin(input: $input) {
    token
    userId
    email
    name
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
}
```

**Response:**
```json
{
  "data": {
    "signin": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Request Password Reset

Solicita un token para resetear la contraseña.

**Mutation:**
```graphql
mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input) {
    resetToken
    expiresIn
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com"
  }
}
```

**Response:**
```json
{
  "data": {
    "requestPasswordReset": {
      "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "1h"
    }
  }
}
```

### Confirm Email

Confirma el email del usuario con el token recibido por correo.

**Mutation:**
```graphql
mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token) {
    success
    message
    token
    userId
    email
    name
  }
}
```

**Variables:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response (Success):**
```json
{
  "data": {
    "confirmEmail": {
      "success": true,
      "message": "Email confirmado exitosamente. Ya puedes usar tu cuenta.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Response (Error):**
```json
{
  "data": {
    "confirmEmail": {
      "success": false,
      "message": "Token de confirmación inválido o expirado.",
      "token": null,
      "userId": null,
      "email": null,
      "name": null
    }
  }
}
```

---

## 📧 Email Confirmation Flow

### Flujo Completo de Registro con Confirmación

El sistema implementa un flujo de registro seguro que requiere confirmación de email:

#### 1. Registro de Usuario
```graphql
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    userId
    email
    name
    message
    requiresEmailConfirmation
  }
}
```

**Resultado**: El usuario se registra pero su cuenta está inactiva hasta confirmar el email.

#### 2. Email de Confirmación
El sistema envía automáticamente un email con:
- Enlace de confirmación con token único
- Token válido por 24 horas
- Instrucciones claras para el usuario

#### 3. Confirmación y Login Automático
```graphql
mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token) {
    success
    message
    token      # JWT para login automático
    userId
    email
    name
  }
}
```

**Resultado**: 
- Email confirmado ✅
- Cuenta activada ✅  
- Usuario logueado automáticamente ✅

#### 4. Casos de Error Comunes

**Token inválido o expirado:**
```json
{
  "data": {
    "confirmEmail": {
      "success": false,
      "message": "Token de confirmación inválido o expirado."
    }
  }
}
```

**Email ya confirmado:**
```json
{
  "data": {
    "confirmEmail": {
      "success": false,
      "message": "El email ya ha sido confirmado anteriormente."
    }
  }
}
```

---

## User Profile

### Get Profile

Obtiene el perfil del usuario autenticado.

**Query:**
```graphql
query GetProfile {
  getProfile {
    id
    userId
    name
    email
    avatar
    skills
    hourlyRate
    createdAt
    updatedAt
  }
}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "getProfile": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "skills": ["TypeScript", "NestJS", "GraphQL"],
      "hourlyRate": 50,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Update Profile

Actualiza el perfil del usuario autenticado.

**Mutation:**
```graphql
mutation UpdateProfile($input: UpdateProfileDto!) {
  updateProfile(input: $input) {
    id
    userId
    name
    email
    avatar
    skills
    hourlyRate
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Jane Doe",
    "skills": ["TypeScript", "NestJS", "GraphQL", "React"],
    "hourlyRate": 60
  }
}
```

**Response:**
```json
{
  "data": {
    "updateProfile": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "skills": ["TypeScript", "NestJS", "GraphQL", "React"],
      "hourlyRate": 60,
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Update Avatar

Actualiza el avatar del usuario autenticado.

**Mutation:**
```graphql
mutation UpdateAvatar($input: UpdateAvatarDto!) {
  updateAvatar(input: $input) {
    id
    userId
    name
    email
    avatar
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
}
```

**Response:**
```json
{
  "data": {
    "updateAvatar": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@example.com",
      "avatar": "https://example.com/new-avatar.jpg",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### List All Users

Lista todos los usuarios registrados (útil para agregar miembros a proyectos).

**Query:**
```graphql
query ListAllUsers {
  listAllUsers {
    id
    userId
    name
    email
    avatar
    skills
    hourlyRate
    createdAt
    updatedAt
  }
}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "listAllUsers": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar1.jpg",
        "skills": ["TypeScript", "NestJS", "GraphQL"],
        "hourlyRate": 50,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://example.com/avatar2.jpg",
        "skills": ["React", "Node.js", "MongoDB"],
        "hourlyRate": 45,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## Projects

### Create Project

Crea un nuevo proyecto.

**Mutation:**
```graphql
mutation CreateProject($input: CreateProjectDto!) {
  createProject(input: $input) {
    id
    name
    description
    clientId
    status
    budget
    spent
    progress
    methodology
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "E-commerce Platform",
    "clientId": "550e8400-e29b-41d4-a716-446655440001",
    "description": "Build a modern e-commerce platform",
    "budget": 50000
  }
}
```

**Response:**
```json
{
  "data": {
    "createProject": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "E-commerce Platform",
      "description": "Build a modern e-commerce platform",
      "clientId": "550e8400-e29b-41d4-a716-446655440001",
      "status": "planning",
      "budget": 50000,
      "spent": 0,
      "progress": 0,
      "methodology": "scrum",
      "startDate": "2025-01-15T00:00:00Z",
      "endDate": null,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Project

Obtiene un proyecto por ID.

**Query:**
```graphql
query GetProject($projectId: String!) {
  getProject(projectId: $projectId) {
    id
    name
    description
    clientId
    status
    budget
    spent
    progress
    methodology
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "getProject": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "E-commerce Platform",
      "description": "Build a modern e-commerce platform",
      "clientId": "550e8400-e29b-41d4-a716-446655440001",
      "status": "planning",
      "budget": 50000,
      "spent": 0,
      "progress": 0,
      "methodology": "scrum",
      "startDate": "2025-01-15T00:00:00Z",
      "endDate": null,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### List Projects

Lista todos los proyectos (opcionalmente filtrados por cliente).

**Query:**
```graphql
query ListProjects($clientId: String) {
  listProjects(clientId: $clientId) {
    id
    name
    description
    clientId
    status
    budget
    spent
    progress
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "clientId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**
```json
{
  "data": {
    "listProjects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "E-commerce Platform",
        "description": "Build a modern e-commerce platform",
        "clientId": "550e8400-e29b-41d4-a716-446655440001",
        "status": "planning",
        "budget": 50000,
        "spent": 0,
        "progress": 0,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Update Project

Actualiza un proyecto existente.

**Mutation:**
```graphql
mutation UpdateProject($projectId: String!, $input: UpdateProjectDto!) {
  updateProject(projectId: $projectId, input: $input) {
    id
    name
    description
    status
    budget
    progress
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002",
  "input": {
    "name": "E-commerce Platform v2",
    "status": "in_progress",
    "progress": 25
  }
}
```

**Response:**
```json
{
  "data": {
    "updateProject": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "E-commerce Platform v2",
      "description": "Build a modern e-commerce platform",
      "status": "in_progress",
      "budget": 50000,
      "progress": 25,
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Delete Project

Elimina un proyecto.

**Mutation:**
```graphql
mutation DeleteProject($projectId: String!) {
  deleteProject(projectId: $projectId)
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "deleteProject": true
  }
}
```

---

## Project Members

### Add Project Member

Agrega un miembro a un proyecto.

**Mutation:**
```graphql
mutation AddProjectMember($projectId: String!, $input: AddMemberDto!) {
  addProjectMember(projectId: $projectId, input: $input) {
    id
    projectId
    userId
    role
    joinedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002",
  "input": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "developer"
  }
}
```

**Response:**
```json
{
  "data": {
    "addProjectMember": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "developer",
      "joinedAt": "2025-01-02T00:00:00Z",
      "createdAt": "2025-01-02T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Get Project Members

Obtiene los miembros de un proyecto.

**Query:**
```graphql
query GetProjectMembers($projectId: String!) {
  getProjectMembers(projectId: $projectId) {
    id
    projectId
    userId
    role
    joinedAt
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "getProjectMembers": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "projectId": "550e8400-e29b-41d4-a716-446655440002",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "developer",
        "joinedAt": "2025-01-02T00:00:00Z",
        "createdAt": "2025-01-02T00:00:00Z",
        "updatedAt": "2025-01-02T00:00:00Z"
      }
    ]
  }
}
```

---

## Worked Hours

### Get Worked Hours

Obtiene las horas trabajadas del usuario autenticado (opcionalmente filtradas por proyecto).

**Query:**
```graphql
query GetWorkedHours($projectId: String) {
  getWorkedHours(projectId: $projectId) {
    userId
    projectId
    totalHours
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "getWorkedHours": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "totalHours": 24.5
    }
  }
}
```


---

## Clients

### Create Client

Crea un nuevo cliente.

**Mutation:**
```graphql
mutation CreateClient($input: CreateClientDto!) {
  createClient(input: $input) {
    id
    name
    email
    phone
    company
    industry
    status
    ltv
    cac
    mrr
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "industry": "Technology"
  }
}
```

### Get Client

Obtiene un cliente por ID.

**Query:**
```graphql
query GetClient($clientId: String!) {
  getClient(clientId: $clientId) {
    id
    name
    email
    phone
    company
    industry
    status
    ltv
    cac
    mrr
    createdAt
    updatedAt
  }
}
```

### List Clients

Lista todos los clientes.

**Query:**
```graphql
query ListClients {
  listClients {
    id
    name
    email
    company
    status
    createdAt
  }
}
```

---

## Tasks

### Create Task

Crea una nueva tarea.

**Mutation:**
```graphql
mutation CreateTask($input: CreateTaskDto!) {
  createTask(input: $input) {
    id
    title
    description
    projectId
    sprintId
    status
    priority
    estimatedHours
    actualHours
    storyPoints
    assignedTo
    tags
    dependencies
    dueDate
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Implement user authentication",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "description": "Implement JWT-based authentication",
    "estimatedHours": 8,
    "storyPoints": 5
  }
}
```

### Assign Task

Asigna una tarea a un usuario.

**Mutation:**
```graphql
mutation AssignTask($taskId: String!, $userId: String!) {
  assignTask(taskId: $taskId, userId: $userId) {
    id
    title
    assignedTo
    status
  }
}
```

### Get Task

Obtiene una tarea por ID.

**Query:**
```graphql
query GetTask($taskId: String!) {
  getTask(taskId: $taskId) {
    id
    title
    description
    projectId
    sprintId
    status
    priority
    assignedTo
    estimatedHours
    actualHours
    storyPoints
    dueDate
    tags
    dependencies
    createdAt
    updatedAt
  }
}
```

### List Tasks by Sprint

Lista todas las tareas de un sprint.

**Query:**
```graphql
query ListTasksBySprint($sprintId: String!) {
  listTasksBySprint(sprintId: $sprintId) {
    id
    title
    description
    status
    priority
    assignedTo
    estimatedHours
    actualHours
    storyPoints
    dueDate
    tags
  }
}
```

### Update Task

Actualiza una tarea.

**Mutation:**
```graphql
mutation UpdateTask($taskId: String!, $input: UpdateTaskDto!) {
  updateTask(taskId: $taskId, input: $input) {
    id
    title
    description
    status
    priority
    estimatedHours
    storyPoints
    dueDate
    tags
    updatedAt
  }
}
```

**Variables:**
```json
{
  "taskId": "550e8400-e29b-41d4-a716-446655440003",
  "input": {
    "title": "Implement JWT authentication with refresh tokens",
    "status": "in_progress",
    "priority": "high",
    "estimatedHours": 12,
    "storyPoints": 8,
    "tags": ["authentication", "security", "jwt"]
  }
}
```

### Add Subtasks

Agrega subtareas a una tarea.

**Mutation:**
```graphql
mutation AddSubtasks($taskId: String!, $subtasks: [String!]!) {
  addSubtasks(taskId: $taskId, subtasks: $subtasks) {
    id
    title
    dependencies
    updatedAt
  }
}
```

### Add Dependency

Agrega una dependencia a una tarea.

**Mutation:**
```graphql
mutation AddDependency($taskId: String!, $dependsOnTaskId: String!) {
  addDependency(taskId: $taskId, dependsOnTaskId: $dependsOnTaskId) {
    id
    title
    dependencies
    updatedAt
  }
}
```

### Delete Task

Elimina una tarea (soft delete).

**Mutation:**
```graphql
mutation DeleteTask($taskId: String!) {
  deleteTask(taskId: $taskId)
}
```

**Variables:**
```json
{
  "taskId": "550e8400-e29b-41d4-a716-446655440003"
}
```

**Response:**
```json
{
  "data": {
    "deleteTask": true
  }
}
```

---

## Sprints

### Create Sprint

Crea un nuevo sprint.

**Mutation:**
```graphql
mutation CreateSprint($input: CreateSprintDto!) {
  createSprint(input: $input) {
    id
    name
    goal
    projectId
    startDate
    endDate
    status
    velocity
    storyPointsCommitted
    storyPointsCompleted
    teamMembers
    dailyStandupTime
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Sprint 1",
    "goal": "Complete authentication module",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "startDate": "2025-01-15",
    "endDate": "2025-01-29",
    "dailyStandupTime": "09:00"
  }
}
```

**Response:**
```json
{
  "data": {
    "createSprint": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "name": "Sprint 1",
      "goal": "Complete authentication module",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "startDate": "2025-01-15T00:00:00Z",
      "endDate": "2025-01-29T00:00:00Z",
      "status": "planning",
      "velocity": 0,
      "storyPointsCommitted": 0,
      "storyPointsCompleted": 0,
      "teamMembers": [],
      "dailyStandupTime": "09:00",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Sprint

Obtiene un sprint por ID.

**Query:**
```graphql
query GetSprint($id: String!) {
  getSprint(id: $id) {
    id
    name
    goal
    projectId
    startDate
    endDate
    status
    velocity
    storyPointsCommitted
    storyPointsCompleted
    teamMembers
    sprintPlanningDate
    sprintReviewDate
    sprintRetrospectiveDate
    dailyStandupTime
    retrospectiveNotes
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005"
}
```

### List Sprints by Project

Lista todos los sprints de un proyecto.

**Query:**
```graphql
query ListSprintsByProject($projectId: String!) {
  listSprintsByProject(projectId: $projectId) {
    id
    name
    goal
    startDate
    endDate
    status
    velocity
    storyPointsCommitted
    storyPointsCompleted
    createdAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### Update Sprint

Actualiza un sprint existente.

**Mutation:**
```graphql
mutation UpdateSprint($id: String!, $input: UpdateSprintDto!) {
  updateSprint(id: $id, input: $input) {
    id
    name
    goal
    endDate
    status
    velocity
    storyPointsCommitted
    storyPointsCompleted
    teamMembers
    dailyStandupTime
    retrospectiveNotes
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "input": {
    "name": "Sprint 1 - Authentication & Security",
    "status": "active",
    "storyPointsCommitted": 25,
    "teamMembers": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
  }
}
```

### Extend Sprint

Extiende la fecha de finalización de un sprint.

**Mutation:**
```graphql
mutation ExtendSprint($id: String!, $newEndDate: String!) {
  extendSprint(id: $id, newEndDate: $newEndDate) {
    id
    name
    endDate
    status
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "newEndDate": "2025-02-05"
}
```

### Complete Sprint

Marca un sprint como completado.

**Mutation:**
```graphql
mutation CompleteSprint($id: String!) {
  completeSprint(id: $id) {
    id
    name
    status
    velocity
    storyPointsCompleted
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005"
}
```

### Register Retrospective

Registra notas de retrospectiva para un sprint.

**Mutation:**
```graphql
mutation RegisterRetrospective($id: String!, $notes: String!) {
  registerRetrospective(id: $id, notes: $notes) {
    id
    name
    retrospectiveNotes
    sprintRetrospectiveDate
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "notes": "Great sprint! Team velocity improved. Need to focus on code reviews."
}
```

### Delete Sprint

Elimina un sprint (soft delete).

**Mutation:**
```graphql
mutation DeleteSprint($id: String!) {
  deleteSprint(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005"
}
```

**Response:**
```json
{
  "data": {
    "deleteSprint": true
  }
}
```

---

## Time Entries

### Register Time

Registra tiempo trabajado en una tarea.

**Mutation:**
```graphql
mutation RegisterTime($input: RegisterTimeDto!) {
  registerTime(input: $input) {
    id
    taskId
    userId
    hours
    date
    description
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "taskId": "550e8400-e29b-41d4-a716-446655440003",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "hours": 4,
    "date": "2025-01-15T00:00:00Z",
    "description": "Implemented JWT token generation"
  }
}
```

### Get Time Entries

Obtiene las entradas de tiempo de una tarea.

**Query:**
```graphql
query GetTimeEntries($taskId: String!) {
  getTimeEntries(taskId: $taskId) {
    id
    taskId
    userId
    hours
    date
    description
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "taskId": "550e8400-e29b-41d4-a716-446655440003"
}
```

**Response:**
```json
{
  "data": {
    "getTimeEntries": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440070",
        "taskId": "550e8400-e29b-41d4-a716-446655440003",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "hours": 4,
        "date": "2025-01-15T00:00:00Z",
        "description": "Implemented JWT token generation",
        "createdAt": "2025-01-15T16:00:00Z",
        "updatedAt": "2025-01-15T16:00:00Z"
      }
    ]
  }
}
```

### Get Grouped Time Entries

Obtiene las entradas de tiempo agrupadas por proyecto, tarea o fecha.

**Query:**
```graphql
query GetGroupedTimeEntries($userId: String!, $groupBy: String) {
  getGroupedTimeEntries(userId: $userId, groupBy: $groupBy)
}
```

**Variables:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "groupBy": "project"
}
```

### Modify Time

Modifica una entrada de tiempo existente.

**Mutation:**
```graphql
mutation ModifyTime($id: String!, $input: ModifyTimeDto!) {
  modifyTime(id: $id, input: $input) {
    id
    taskId
    userId
    hours
    date
    description
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440070",
  "input": {
    "hours": 5,
    "description": "Implemented JWT token generation and validation",
    "date": "2025-01-15T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "data": {
    "modifyTime": {
      "id": "550e8400-e29b-41d4-a716-446655440070",
      "taskId": "550e8400-e29b-41d4-a716-446655440003",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "hours": 5,
      "date": "2025-01-15T00:00:00Z",
      "description": "Implemented JWT token generation and validation",
      "updatedAt": "2025-01-16T10:00:00Z"
    }
  }
}
```

### Delete Time

Elimina una entrada de tiempo.

**Mutation:**
```graphql
mutation DeleteTime($id: String!) {
  deleteTime(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440070"
}
```

**Response:**
```json
{
  "data": {
    "deleteTime": true
  }
}
```

---

## Metrics

### Get Dashboard Metrics

Obtiene las métricas del dashboard.

**Query:**
```graphql
query GetDashboardMetrics {
  getDashboardMetrics {
    totalProjects
    totalTasks
    completedTasks
    overallProgress
    totalBudget
    totalSpent
    remainingBudget
    budgetUtilization
    projects {
      projectId
      projectName
      status
      progress
      budget
      spent
    }
    timestamp
  }
}
```

### Get Project Metrics

Obtiene las métricas de un proyecto.

**Query:**
```graphql
query GetProjectMetrics($projectId: String!) {
  getProjectMetrics(projectId: $projectId) {
    projectId
    projectName
    status
    progress
    totalTasks
    completedTasks
    totalSprints
    completedSprints
    totalStoryPoints
    completedStoryPoints
    averageVelocity
    budget
    spent
    remaining
    budgetUtilization
  }
}
```

---

## Finances

### Transactions

#### Create Transaction

Crea una nueva transacción.

**Mutation:**
```graphql
mutation CreateTransaction($input: CreateTransactionDto!) {
  createTransaction(input: $input) {
    id
    type
    category
    amount
    currency
    date
    description
    clientId
    projectId
    isRecurring
    recurringFrequency
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "type": "expense",
    "category": "salaries",
    "amount": 5000,
    "currency": "USD",
    "date": "2025-01-15T00:00:00Z",
    "description": "Monthly salaries payment",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "isRecurring": true,
    "recurringFrequency": "monthly"
  }
}
```

**Response:**
```json
{
  "data": {
    "createTransaction": {
      "id": "550e8400-e29b-41d4-a716-446655440060": "550e8400-e29b-41d4-a716-446655440060",
      "type": "expense",
      "category": "salaries",
      "amount": 5000,
      "currency": "USD",
      "date": "2025-01-15T00:00:00Z",
      "description": "Monthly salaries payment",
      "clientId": null,
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "isRecurring": true,
      "recurringFrequency": "monthly",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

#### List Transactions

Lista transacciones con filtros opcionales.

**Query:**
```graphql
query ListTransactions($clientId: String, $projectId: String) {
  listTransactions(clientId: $clientId, projectId: $projectId) {
    id
    type
    category
    amount
    currency
    date
    description
    clientId
    projectId
    isRecurring
    recurringFrequency
    createdAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

#### Get Project Expenses

Obtiene los gastos de un proyecto.

**Query:**
```graphql
query GetProjectExpenses($projectId: String!) {
  getProjectExpenses(projectId: $projectId) {
    id
    type
    category
    amount
    currency
    date
    description
    isRecurring
  }
}
```

#### Update Transaction

Actualiza una transacción existente.

**Mutation:**
```graphql
mutation UpdateTransaction($id: String!, $input: UpdateTransactionDto!) {
  updateTransaction(id: $id, input: $input) {
    id
    type
    category
    amount
    currency
    date
    description
    isRecurring
    recurringFrequency
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440060",
  "input": {
    "category": "team_salaries",
    "amount": 5500,
    "description": "Monthly salaries payment with bonus",
    "date": "2025-01-15T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "data": {
    "updateTransaction": {
      "id": "550e8400-e29b-41d4-a716-446655440060",
      "type": "expense",
      "category": "team_salaries",
      "amount": 5500,
      "currency": "USD",
      "date": "2025-01-15T00:00:00Z",
      "description": "Monthly salaries payment with bonus",
      "isRecurring": true,
      "recurringFrequency": "monthly",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

#### Delete Transaction

Elimina una transacción (soft delete).

**Mutation:**
```graphql
mutation DeleteTransaction($id: String!) {
  deleteTransaction(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440060"
}
```

**Response:**
```json
{
  "data": {
    "deleteTransaction": true
  }
}
```

### Invoices

#### Create Invoice

Crea una nueva factura.

**Mutation:**
```graphql
mutation CreateInvoice($input: CreateInvoiceDto!) {
  createInvoice(input: $input) {
    id
    invoiceNumber
    clientId
    projectId
    amount
    tax
    total
    status
    issueDate
    dueDate
    paidDate
    items
    notes
    createdAt
    updatedAt
  }
}
```

#### List Invoices

Lista facturas con filtros opcionales.

**Query:**
```graphql
query ListInvoices($clientId: String, $projectId: String) {
  listInvoices(clientId: $clientId, projectId: $projectId) {
    id
    invoiceNumber
    clientId
    amount
    tax
    total
    status
    issueDate
    dueDate
    paidDate
  }
}
```

### Financial Reports

#### Generate Financial Report

Genera un reporte financiero de un proyecto.

**Query:**
```graphql
query GenerateFinancialReport($projectId: String!) {
  generateFinancialReport(projectId: $projectId) {
    projectId
    projectName
    budget
    spent
    totalIncome
    totalExpenses
    netProfit
    salaries {
      userId
      userName
      salary
      idealHourlyRate
    }
    teamMembers
    transactions
    invoices
  }
}
```

#### Calculate Ideal Hourly Rate

Calcula la tarifa por hora ideal para un proyecto.

**Query:**
```graphql
query CalculateIdealHourlyRate($projectId: String!) {
  calculateIdealHourlyRate(projectId: $projectId)
}
```

#### Calculate Salaries

Calcula los salarios del equipo de un proyecto.

**Query:**
```graphql
query CalculateSalaries($projectId: String!) {
  calculateSalaries(projectId: $projectId) {
    userId
    userName
    salary
    idealHourlyRate
  }
}
```

---

## Goals

### Create Goal

Crea un nuevo objetivo.

**Mutation:**
```graphql
mutation CreateGoal($input: CreateGoalDto!) {
  createGoal(input: $input) {
    id
    title
    description
    type
    category
    period
    targetValue
    currentValue
    progress
    unit
    ownerId
    startDate
    endDate
    status
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Complete 100 story points",
    "description": "Deliver 100 story points in Q1 to improve team velocity",
    "type": "team",
    "category": "productivity",
    "period": "quarterly",
    "targetValue": 100,
    "unit": "story_points",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-03-31T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "data": {
    "createGoal": {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "title": "Complete 100 story points",
      "description": "Deliver 100 story points in Q1 to improve team velocity",
      "type": "team",
      "category": "productivity",
      "period": "quarterly",
      "targetValue": 100,
      "currentValue": 0,
      "progress": 0,
      "unit": "story_points",
      "ownerId": "550e8400-e29b-41d4-a716-446655440000",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-03-31T00:00:00Z",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get User Goals

Obtiene los objetivos de un usuario.

**Query:**
```graphql
query GetUserGoals($ownerId: String!) {
  getUserGoals(ownerId: $ownerId) {
    id
    title
    description
    type
    category
    period
    targetValue
    currentValue
    progress
    unit
    startDate
    endDate
    status
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "ownerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "data": {
    "getUserGoals": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440050",
        "title": "Complete 100 story points",
        "description": "Deliver 100 story points in Q1 to improve team velocity",
        "type": "team",
        "category": "productivity",
        "period": "quarterly",
        "targetValue": 100,
        "currentValue": 25,
        "progress": 25,
        "unit": "story_points",
        "startDate": "2025-01-01T00:00:00Z",
        "endDate": "2025-03-31T00:00:00Z",
        "status": "active",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-15T00:00:00Z"
      }
    ]
  }
}
```

### Update Goal Progress

Actualiza el progreso de un objetivo.

**Mutation:**
```graphql
mutation UpdateGoalProgress($goalId: String!, $currentValue: Float!) {
  updateGoalProgress(goalId: $goalId, currentValue: $currentValue) {
    id
    title
    description
    targetValue
    currentValue
    progress
    status
    updatedAt
  }
}
```

**Variables:**
```json
{
  "goalId": "550e8400-e29b-41d4-a716-446655440050",
  "currentValue": 45
}
```

**Response:**
```json
{
  "data": {
    "updateGoalProgress": {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "title": "Complete 100 story points",
      "description": "Deliver 100 story points in Q1 to improve team velocity",
      "targetValue": 100,
      "currentValue": 45,
      "progress": 45,
      "status": "active",
      "updatedAt": "2025-01-20T00:00:00Z"
    }
  }
}
```

### Delete Goal

Elimina un objetivo (soft delete).

**Mutation:**
```graphql
mutation DeleteGoal($goalId: String!) {
  deleteGoal(goalId: $goalId)
}
```

**Variables:**
```json
{
  "goalId": "550e8400-e29b-41d4-a716-446655440050"
}
```

**Response:**
```json
{
  "data": {
    "deleteGoal": true
  }
}
```

---

## Risks

### Create Risk

Crea un nuevo riesgo.

**Mutation:**
```graphql
mutation CreateRisk($input: CreateRiskDto!) {
  createRisk(input: $input) {
    id
    title
    description
    category
    probability
    impact
    severity
    status
    projectId
    responsibleId
    mitigationStrategy
    isCore
    comments
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Database performance issues",
    "description": "Potential performance bottlenecks in database queries",
    "category": "technical",
    "probability": "medium",
    "impact": "high",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "responsibleId": "550e8400-e29b-41d4-a716-446655440000",
    "mitigationStrategy": "Implement caching and query optimization",
    "isCore": true
  }
}
```

**Response:**
```json
{
  "data": {
    "createRisk": {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "title": "Database performance issues",
      "description": "Potential performance bottlenecks in database queries",
      "category": "technical",
      "probability": "medium",
      "impact": "high",
      "severity": 6,
      "status": "identified",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "responsibleId": "550e8400-e29b-41d4-a716-446655440000",
      "mitigationStrategy": "Implement caching and query optimization",
      "isCore": true,
      "comments": [],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Project Risks

Obtiene los riesgos de un proyecto.

**Query:**
```graphql
query GetProjectRisks($projectId: String!) {
  getProjectRisks(projectId: $projectId) {
    id
    title
    description
    category
    probability
    impact
    severity
    status
    responsibleId
    mitigationStrategy
    isCore
    comments
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "getProjectRisks": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "title": "Database performance issues",
        "description": "Potential performance bottlenecks in database queries",
        "category": "technical",
        "probability": "medium",
        "impact": "high",
        "severity": 6,
        "status": "identified",
        "responsibleId": "550e8400-e29b-41d4-a716-446655440000",
        "mitigationStrategy": "Implement caching and query optimization",
        "isCore": true,
        "comments": [],
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Update Risk

Actualiza un riesgo existente.

**Mutation:**
```graphql
mutation UpdateRisk($id: String!, $input: UpdateRiskDto!) {
  updateRisk(id: $id, input: $input) {
    id
    title
    description
    category
    probability
    impact
    severity
    status
    mitigationStrategy
    responsibleId
    isCore
    comments
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440030",
  "input": {
    "title": "Database performance and scalability issues",
    "status": "mitigating",
    "probability": "low",
    "mitigationStrategy": "Implemented Redis caching and optimized queries. Monitoring performance metrics.",
    "description": "Performance bottlenecks resolved with caching implementation"
  }
}
```

**Response:**
```json
{
  "data": {
    "updateRisk": {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "title": "Database performance and scalability issues",
      "description": "Performance bottlenecks resolved with caching implementation",
      "category": "technical",
      "probability": "low",
      "impact": "high",
      "severity": 3,
      "status": "mitigating",
      "mitigationStrategy": "Implemented Redis caching and optimized queries. Monitoring performance metrics.",
      "responsibleId": "550e8400-e29b-41d4-a716-446655440000",
      "isCore": true,
      "comments": [],
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Delete Risk

Elimina un riesgo (soft delete).

**Mutation:**
```graphql
mutation DeleteRisk($id: String!) {
  deleteRisk(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440030"
}
```

**Response:**
```json
{
  "data": {
    "deleteRisk": true
  }
}
```

---

## Meetings

### Create Meeting

Crea una nueva reunión.

**Mutation:**
```graphql
mutation CreateMeeting($input: CreateMeetingDto!) {
  createMeeting(input: $input) {
    id
    title
    type
    dateTime
    duration
    ownerId
    participants
    agenda
    notes
    projectId
    sprintId
    isRecurring
    recurringPattern
    status
    attendance
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Sprint Planning",
    "type": "planning",
    "dateTime": "2025-01-15T10:00:00Z",
    "duration": 120,
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "agenda": "Review backlog, estimate stories, plan sprint",
    "notes": "Preparation notes for sprint planning",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "sprintId": "550e8400-e29b-41d4-a716-446655440005",
    "participants": ["550e8400-e29b-41d4-a716-446655440001"],
    "isRecurring": false,
    "recurringPattern": null
  }
}
```

**Response:**
```json
{
  "data": {
    "createMeeting": {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "title": "Sprint Planning",
      "type": "planning",
      "dateTime": "2025-01-15T10:00:00Z",
      "duration": 120,
      "ownerId": "550e8400-e29b-41d4-a716-446655440000",
      "participants": ["550e8400-e29b-41d4-a716-446655440001"],
      "agenda": "Review backlog, estimate stories, plan sprint",
      "notes": "Preparation notes for sprint planning",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "sprintId": "550e8400-e29b-41d4-a716-446655440005",
      "isRecurring": false,
      "recurringPattern": null,
      "status": "scheduled",
      "attendance": [],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Sprint Meetings

Obtiene las reuniones de un sprint.

**Query:**
```graphql
query GetSprintMeetings($sprintId: String!) {
  getSprintMeetings(sprintId: $sprintId) {
    id
    title
    type
    dateTime
    duration
    ownerId
    participants
    agenda
    notes
    status
    attendance
    createdAt
  }
}
```

**Variables:**
```json
{
  "sprintId": "550e8400-e29b-41d4-a716-446655440005"
}
```

**Response:**
```json
{
  "data": {
    "getSprintMeetings": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "title": "Sprint Planning",
        "type": "planning",
        "dateTime": "2025-01-15T10:00:00Z",
        "duration": 120,
        "ownerId": "550e8400-e29b-41d4-a716-446655440000",
        "participants": ["550e8400-e29b-41d4-a716-446655440001"],
        "agenda": "Review backlog, estimate stories, plan sprint",
        "notes": "Preparation notes for sprint planning",
        "status": "scheduled",
        "attendance": [],
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Update Meeting

Actualiza una reunión existente.

**Mutation:**
```graphql
mutation UpdateMeeting($id: String!, $input: UpdateMeetingDto!) {
  updateMeeting(id: $id, input: $input) {
    id
    title
    type
    dateTime
    duration
    agenda
    notes
    participants
    status
    isRecurring
    recurringPattern
    attendance
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440040",
  "input": {
    "title": "Sprint Planning - Authentication Module",
    "dateTime": "2025-01-15T14:00:00Z",
    "duration": 90,
    "agenda": "Review authentication stories, estimate complexity, assign tasks",
    "notes": "Focus on security requirements and testing strategy",
    "participants": [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002"
    ],
    "status": "in_progress"
  }
}
```

**Response:**
```json
{
  "data": {
    "updateMeeting": {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "title": "Sprint Planning - Authentication Module",
      "type": "planning",
      "dateTime": "2025-01-15T14:00:00Z",
      "duration": 90,
      "agenda": "Review authentication stories, estimate complexity, assign tasks",
      "notes": "Focus on security requirements and testing strategy",
      "participants": [
        "550e8400-e29b-41d4-a716-446655440001",
        "550e8400-e29b-41d4-a716-446655440002"
      ],
      "status": "in_progress",
      "isRecurring": false,
      "recurringPattern": null,
      "attendance": [],
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Delete Meeting

Elimina una reunión (soft delete).

**Mutation:**
```graphql
mutation DeleteMeeting($id: String!) {
  deleteMeeting(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440040"
}
```

**Response:**
```json
{
  "data": {
    "deleteMeeting": true
  }
}
```

---

## User Stories

### Create User Story

Crea una nueva historia de usuario.

**Mutation:**
```graphql
mutation CreateUserStory($input: CreateUserStoryDto!) {
  createUserStory(input: $input) {
    id
    title
    userType
    action
    benefit
    priority
    storyPoints
    status
    projectId
    sprintId
    acceptanceCriteria
    definitionOfDone
    impactMetrics
    assignedTo
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "User login functionality",
    "userType": "user",
    "action": "login with email and password",
    "benefit": "access my account securely",
    "priority": "high",
    "storyPoints": 5,
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "acceptanceCriteria": [
      "User can enter email and password",
      "System validates credentials",
      "User receives JWT token on success"
    ],
    "definitionOfDone": "Feature is tested and deployed",
    "impactMetrics": "Reduce login time by 50%"
  }
}
```

**Response:**
```json
{
  "data": {
    "createUserStory": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "title": "User login functionality",
      "userType": "user",
      "action": "login with email and password",
      "benefit": "access my account securely",
      "priority": "high",
      "storyPoints": 5,
      "status": "backlog",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "sprintId": null,
      "acceptanceCriteria": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440021",
          "description": "User can enter email and password",
          "completed": false
        }
      ],
      "definitionOfDone": "Feature is tested and deployed",
      "impactMetrics": "Reduce login time by 50%",
      "assignedTo": null,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Project Backlog

Obtiene el backlog de historias de usuario de un proyecto.

**Query:**
```graphql
query GetProjectBacklog($projectId: String!) {
  getProjectBacklog(projectId: $projectId) {
    id
    title
    userType
    action
    benefit
    priority
    storyPoints
    status
    assignedTo
    acceptanceCriteria
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response:**
```json
{
  "data": {
    "getProjectBacklog": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "title": "User login functionality",
        "userType": "user",
        "action": "login with email and password",
        "benefit": "access my account securely",
        "priority": "high",
        "storyPoints": 5,
        "status": "backlog",
        "assignedTo": null,
        "acceptanceCriteria": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440021",
            "description": "User can enter email and password",
            "completed": false
          }
        ],
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Update User Story

Actualiza una historia de usuario existente.

**Mutation:**
```graphql
mutation UpdateUserStory($id: String!, $input: UpdateUserStoryDto!) {
  updateUserStory(id: $id, input: $input) {
    id
    title
    userType
    action
    benefit
    priority
    storyPoints
    status
    sprintId
    assignedTo
    acceptanceCriteria
    definitionOfDone
    impactMetrics
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "input": {
    "title": "Enhanced user login functionality",
    "priority": "critical",
    "storyPoints": 8,
    "status": "ready",
    "sprintId": "550e8400-e29b-41d4-a716-446655440005",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
    "acceptanceCriteria": [
      "User can enter email and password",
      "System validates credentials with 2FA",
      "User receives JWT token on success",
      "Failed attempts are logged"
    ]
  }
}
```

**Response:**
```json
{
  "data": {
    "updateUserStory": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "title": "Enhanced user login functionality",
      "userType": "user",
      "action": "login with email and password",
      "benefit": "access my account securely",
      "priority": "critical",
      "storyPoints": 8,
      "status": "ready",
      "sprintId": "550e8400-e29b-41d4-a716-446655440005",
      "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
      "acceptanceCriteria": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440022",
          "description": "User can enter email and password",
          "completed": false
        },
        {
          "id": "550e8400-e29b-41d4-a716-446655440023",
          "description": "System validates credentials with 2FA",
          "completed": false
        }
      ],
      "definitionOfDone": "Feature is tested and deployed",
      "impactMetrics": "Reduce login time by 50%",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

### Delete User Story

Elimina una historia de usuario (soft delete).

**Mutation:**
```graphql
mutation DeleteUserStory($id: String!) {
  deleteUserStory(id: $id)
}
```

**Variables:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020"
}
```

**Response:**
```json
{
  "data": {
    "deleteUserStory": true
  }
}
```

---

## Feedback

### Send Feedback

Envía feedback a un usuario.

**Mutation:**
```graphql
mutation SendFeedback($input: CreateFeedbackDto!) {
  sendFeedback(input: $input) {
    id
    type
    category
    rating
    comment
    toUserId
    fromUserId
    isAnonymous
    sprintId
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "type": "peer",
    "category": "collaboration",
    "rating": 5,
    "comment": "Great teamwork on the authentication module",
    "toUserId": "550e8400-e29b-41d4-a716-446655440001",
    "isAnonymous": false
  }
}
```

---

## Achievements

### Get Available Achievements

Obtiene los logros disponibles.

**Query:**
```graphql
query GetAvailableAchievements {
  getAvailableAchievements {
    id
    name
    description
    category
    icon
    points
    rarity
    requirement
  }
}
```

### Get User Achievements

Obtiene los logros desbloqueados por el usuario.

**Query:**
```graphql
query GetUserAchievements {
  getUserAchievements {
    id
    userId
    achievementId
    unlockedAt
    achievement {
      name
      description
      points
      icon
    }
  }
}
```

---

## Notifications

### Get User Notifications

Obtiene las notificaciones del usuario.

**Query:**
```graphql
query GetUserNotifications {
  getUserNotifications {
    id
    userId
    type
    title
    message
    isRead
    metadata
    createdAt
  }
}
```

### Mark Notification as Read

Marca una notificación como leída.

**Mutation:**
```graphql
mutation MarkNotificationAsRead($notificationId: String!) {
  markNotificationAsRead(notificationId: $notificationId) {
    id
    isRead
    updatedAt
  }
}
```

---

## Subscriptions

### Dashboard Metrics Updated

Suscripción a actualizaciones de métricas del dashboard.

**Subscription:**
```graphql
subscription DashboardMetricsUpdated {
  dashboardMetricsUpdated {
    totalProjects
    totalTasks
    completedTasks
    overallProgress
    totalBudget
    totalSpent
    remainingBudget
    budgetUtilization
    projects {
      projectId
      projectName
      status
      progress
      budget
      spent
    }
    timestamp
  }
}
```

### Project Metrics Updated

Suscripción a actualizaciones de métricas de un proyecto.

**Subscription:**
```graphql
subscription ProjectMetricsUpdated($projectId: String!) {
  projectMetricsUpdated(projectId: $projectId) {
    projectId
    projectName
    progress
    totalTasks
    completedTasks
    budget
    spent
  }
}
```

---

## 📋 CRUD Operations Summary

### ✅ Complete CRUD Operations

Los siguientes módulos tienen operaciones CRUD completas (Create, Read, Update, Delete):

| Módulo | Create | Read | Update | Delete | Notas |
|--------|--------|------|--------|--------|-------|
| **Projects** | ✅ | ✅ | ✅ | ✅ | Incluye gestión de miembros |
| **Clients** | ✅ | ✅ | ✅ | ✅ | - |
| **Tasks** | ✅ | ✅ | ✅ | ✅ | Incluye asignación y dependencias |
| **Sprints** | ✅ | ✅ | ✅ | ✅ | Incluye extend, complete, retrospective |
| **Time Entries** | ✅ | ✅ | ✅ | ✅ | Incluye agrupación por proyecto/fecha |
| **User Stories** | ✅ | ✅ | ✅ | ✅ | Incluye criterios de aceptación |
| **Risks** | ✅ | ✅ | ✅ | ✅ | Incluye severidad y comentarios |
| **Meetings** | ✅ | ✅ | ✅ | ✅ | Incluye asistencia y recurrencia |
| **Goals** | ✅ | ✅ | ✅ | ✅ | Incluye progreso automático |
| **Transactions** | ✅ | ✅ | ✅ | ✅ | Incluye recurrencia |

### 🔄 Partial CRUD Operations

| Módulo | Create | Read | Update | Delete | Notas |
|--------|--------|------|--------|--------|-------|
| **Auth** | ✅ | ✅ | ❌ | ❌ | Registro, login, confirmación email, reset password |
| **Users** | ❌ | ✅ | ✅ | ❌ | Create se hace en Auth, incluye listAllUsers |
| **Invoices** | ✅ | ✅ | ✅ | ✅ | CRUD completo disponible |
| **Feedback** | ✅ | ✅ | ✅ | ✅ | CRUD completo disponible |
| **Notifications** | ❌ | ✅ | ✅ | ❌ | Create automático, markAsRead disponible |
| **Achievements** | ❌ | ✅ | ❌ | ❌ | Solo lectura (sistema de logros) |
| **Metrics** | ❌ | ✅ | ❌ | ❌ | Solo lectura (calculados automáticamente) |
| **Finances** | ✅ | ✅ | ❌ | ❌ | Reportes y cálculos financieros |

### 🔐 Authentication Required

Todos los endpoints (excepto Auth) requieren autenticación JWT:

```
Headers:
Authorization: Bearer <jwt_token>
```

### 📝 Response Patterns

**Success Response:**
```json
{
  "data": {
    "operationName": { /* result */ }
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Error description",
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

### 🚀 Getting Started

#### Flujo de Registro y Autenticación

1. **Registro**: Use `signup` mutation para crear cuenta
   - El sistema envía un email de confirmación automáticamente
   - El usuario recibe un mensaje indicando que debe confirmar su email

2. **Confirmación de Email**: Use `confirmEmail` mutation con el token del email
   - El sistema confirma el email y devuelve un JWT token
   - El usuario queda automáticamente logueado

3. **Login**: Use `signin` mutation para sesiones posteriores

#### Flujo de Trabajo

4. **Set Headers**: Include `Authorization: Bearer <token>` in all requests
5. **List Users**: Use `listAllUsers` to see available team members
6. **Create Resources**: Start with clients and projects
7. **Add Team Members**: Use project member endpoints with user IDs from `listAllUsers`
8. **Manage Work**: Create sprints, user stories, and tasks
9. **Track Progress**: Use time entries and metrics

Para más detalles sobre la implementación, consulta el código fuente en los resolvers correspondientes.
