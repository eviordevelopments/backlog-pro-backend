# GraphQL API Examples

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

## User Profile

### Get Profile

Obtiene el perfil del usuario autenticado.

**Query:**
```graphql
query GetProfile {
  obtenerPerfil {
    id
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
    "obtenerPerfil": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
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
mutation UpdateProfile($input: UpdateProfileInput!) {
  actualizarPerfil(input: $input) {
    id
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
    "avatar": "https://example.com/new-avatar.jpg",
    "skills": ["TypeScript", "NestJS", "GraphQL", "React"],
    "hourlyRate": 60
  }
}
```

**Response:**
```json
{
  "data": {
    "actualizarPerfil": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "email": "user@example.com",
      "avatar": "https://example.com/new-avatar.jpg",
      "skills": ["TypeScript", "NestJS", "GraphQL", "React"],
      "hourlyRate": 60,
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  }
}
```

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
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

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

**Response:**
```json
{
  "data": {
    "createClient": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "company": "Acme Corp",
      "industry": "Technology",
      "status": "active",
      "ltv": 0,
      "cac": 0,
      "mrr": 0,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

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

**Response:**
```json
{
  "data": {
    "createTask": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "title": "Implement user authentication",
      "description": "Implement JWT-based authentication",
      "projectId": "550e8400-e29b-41d4-a716-446655440002",
      "sprintId": null,
      "status": "todo",
      "priority": "medium",
      "estimatedHours": 8,
      "actualHours": 0,
      "storyPoints": 5,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

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
    updatedAt
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
    "date": "2025-01-01",
    "description": "Implemented JWT token generation"
  }
}
```

**Response:**
```json
{
  "data": {
    "registerTime": {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "taskId": "550e8400-e29b-41d4-a716-446655440003",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "hours": 4,
      "date": "2025-01-01",
      "description": "Implemented JWT token generation",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```
