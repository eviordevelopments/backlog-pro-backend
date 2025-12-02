# GraphQL API Examples

## Tabla de Contenidos

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [User Profile](#user-profile)
4. [Projects](#projects)
5. [Project Members](#project-members)
6. [Worked Hours](#worked-hours)

---

## Health Check

### Verificar Estado del Servicio

Verifica que la aplicación y la base de datos estén funcionando correctamente.

**Query:**
```graphql
query {
  health {
    status
    service
    database {
      connected
      database
      type
    }
    timestamp
  }
}
```

**Response:**
```json
{
  "data": {
    "health": {
      "status": "ok",
      "service": "Backlog Pro Backend",
      "database": {
        "connected": true,
        "type": "postgres",
        "database": "backlog_pro"
      },
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
}
```

---

## Authentication

### Signup (Register User)

Registra un nuevo usuario en el sistema.

**Mutation:**
```graphql
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
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
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
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
