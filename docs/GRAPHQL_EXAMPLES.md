# GraphQL API Examples

## Tabla de Contenidos

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Projects](#projects)
4. [Clients](#clients)
5. [Tasks](#tasks)
6. [Sprints](#sprints)
7. [Time Entries](#time-entries)
8. [Metrics](#metrics)
9. [Finances](#finances)
10. [Goals](#goals)
11. [Risks](#risks)
12. [Meetings](#meetings)
13. [User Stories](#user-stories)
14. [Feedback](#feedback)
15. [Achievements](#achievements)
16. [Notifications](#notifications)
17. [Subscriptions](#subscriptions)

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

### Update Task

Actualiza una tarea.

**Mutation:**
```graphql
mutation UpdateTask($taskId: String!, $input: UpdateTaskDto!) {
  updateTask(taskId: $taskId, input: $input) {
    id
    title
    status
    priority
    updatedAt
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
    createdAt
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
    "endDate": "2025-01-29"
  }
}
```

### Get Sprint Metrics

Obtiene las métricas de un sprint.

**Query:**
```graphql
query GetSprintMetrics($sprintId: String!) {
  getSprintMetrics(sprintId: $sprintId) {
    sprintId
    sprintName
    status
    completedTasks
    totalTasks
    completionRate
    velocity
    storyPointsCommitted
    storyPointsCompleted
    averageCycleTime
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

### Create Transaction

Crea una nueva transacción.

**Mutation:**
```graphql
mutation CreateTransaction($input: CreateTransactionDto!) {
  createTransaction(input: $input) {
    id
    type
    amount
    currency
    category
    date
    description
    projectId
    clientId
    isRecurring
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "type": "expense",
    "amount": 5000,
    "currency": "USD",
    "category": "salaries",
    "date": "2025-01-15T00:00:00Z",
    "description": "Monthly salaries",
    "projectId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

### Generate Financial Report

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

### Calculate Salaries

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
    targetValue
    currentValue
    unit
    period
    startDate
    endDate
    status
    progress
    ownerId
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Complete 100 story points",
    "type": "team",
    "category": "productivity",
    "targetValue": 100,
    "unit": "story_points",
    "period": "quarterly",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-03-31T00:00:00Z",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000"
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
    currentValue
    targetValue
    progress
    status
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
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Database performance issues",
    "category": "technical",
    "probability": "medium",
    "impact": "high",
    "projectId": "550e8400-e29b-41d4-a716-446655440002",
    "responsibleId": "550e8400-e29b-41d4-a716-446655440000",
    "mitigationStrategy": "Implement caching and query optimization"
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
    category
    probability
    impact
    severity
    status
    mitigationStrategy
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
    status
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Sprint Planning",
    "type": "sprint_planning",
    "dateTime": "2025-01-15T10:00:00Z",
    "duration": 2,
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "participants": ["550e8400-e29b-41d4-a716-446655440001"],
    "projectId": "550e8400-e29b-41d4-a716-446655440002"
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
    createdAt
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
    ]
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
 dMetricsUpdated   totalProjects
    totalTasks
    completedTasks
    overallProgress
    timestamp
  }
```

### Project Metrics Updated

Suscripción a actualizaciones de métricas de un proyecto.

**Subscription:**
```graphql
subscription ProjectMetricsUpdated($projectId: String!) {
  projectMetricsUpdatId: $projectId) {ectId
    projectName
    progress
    totalTasks
    completedTasks
    budget
    spent
  }
}
```
