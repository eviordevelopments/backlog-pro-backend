# Backlog Pro Backend

## Descripción del Proyecto

**Backlog Pro Backend** es una plataforma integral de gestión para equipos de desarrollo de software que implementa metodologías ágiles (SCRUM, Kanban) y proporciona herramientas completas para la administración de proyectos, seguimiento de tareas, cálculo de métricas en tiempo real, gestión financiera y sistema de logros.

### ¿Qué hace esta plataforma?

La plataforma permite a los equipos de desarrollo:

- **Gestionar proyectos completos**: Crear y administrar proyectos con presupuestos, equipos asignados, clientes y metodologías ágiles definidas
- **Organizar sprints y tareas**: Planificar iteraciones de desarrollo, crear tareas con estimaciones, asignar responsables y trackear el progreso en tiempo real
- **Calcular métricas automáticamente**: Obtener indicadores de rendimiento como velocidad del equipo, story points completados, tiempo de ciclo, eficiencia y bugs por sprint
- **Controlar finanzas**: Registrar transacciones, calcular salarios basados en horas trabajadas, generar reportes financieros y exportar documentos PDF
- **Gestionar clientes**: Mantener información de clientes con métricas de negocio (LTV, CAC, MRR) y asociar proyectos
- **Trackear tiempo**: Registrar horas trabajadas por tarea y usuario para cálculos precisos de costos y productividad
- **Definir objetivos y riesgos**: Establecer metas medibles y monitorear riesgos potenciales de los proyectos
- **Facilitar colaboración**: Sistema de feedback entre usuarios, notificaciones en tiempo real y gestión de reuniones
- **Gamificar la experiencia**: Sistema de logros desbloqueables basados en el desempeño del equipo

### Arquitectura y Tecnologías

El sistema está construido siguiendo **Clean Architecture** con patrón **CQRS** (Command Query Responsibility Segregation), garantizando separación de responsabilidades, mantenibilidad y escalabilidad:

- **API GraphQL** con Apollo Server 5 para consultas eficientes y subscriptions en tiempo real
- **NestJS 11.x** como framework backend con TypeScript 5.x
- **PostgreSQL 15+** como base de datos relacional
- **TypeORM 0.3.x** para mapeo objeto-relacional y migraciones
- **JWT Authentication** para autenticación segura con tokens
- **Testing dual**: Unit tests con Jest + Property-Based Testing con fast-check (mínimo 100 iteraciones)
- **Docker** para desarrollo y despliegue con PostgreSQL incluido

### Características Principales

✅ **Autenticación segura** con JWT Guards  
✅ **API GraphQL completa** con queries, mutations y subscriptions en tiempo real  
✅ **Cálculo automático de métricas** de rendimiento y progreso  
✅ **Gestión financiera integrada** con reportes y cálculo de salarios  
✅ **Soft deletes** para mantener integridad histórica de datos  
✅ **Validación robusta** con class-validator y Joi  
✅ **Logging estructurado** para diagnóstico y monitoreo  
✅ **Configuración centralizada** con validación de variables de entorno  
✅ **Cobertura de tests** mínima del 80%

Backend GraphQL para plataforma de gestión de equipos de desarrollo construido con NestJS, TypeScript, PostgreSQL y TypeORM.

## Stack Tecnológico

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Compilador**: SWC (10-20x más rápido que webpack)
- **Base de Datos**: PostgreSQL 15+
- **ORM**: TypeORM 0.3.x
- **API**: GraphQL con Apollo Server 5
- **Autenticación**: JWT Guards con @nestjs/jwt
- **Testing**: Jest + fast-check (property-based testing)
- **Validación**: class-validator + Joi (config)

## Instalación

### Opción 1: Desarrollo Local (sin Docker)

Requiere PostgreSQL 15+ instalado localmente.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear base de datos
createdb backlog_pro

# 3. Editar .env con tus credenciales
# DB_HOST=localhost
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# 4. Iniciar la aplicación
npm run start:dev
```

### Opción 2: Con Docker (Recomendado)

No requiere PostgreSQL instalado localmente.
Requiere Docker Desktop instalado y configurado.

```bash
# 1. Instalar dependencias
npm install

# 2. Editar .env.local con tus credenciales (opcional)
# DB_HOST=postgres (ya configurado)
# DB_USERNAME=postgres
# DB_PASSWORD=postgres

# 3. Iniciar todos los servicios (PostgreSQL, App, Adminer)
npm run docker:up
#  Para iniciar en modo Watch (los cambios se reflejan automaticamente)
npm run docker:watch

# 4. Acceder a la aplicación
# Apollo Server: http://localhost:3001/graphql
# Adminer: http://localhost:8080

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down

# Limpiar todo (incluyendo volúmenes)
npm run docker:clean
```

### Opción 3: Producción en Render

Ver guía completa: **[docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)**

```bash
# 1. Configurar GitHub Secrets con credenciales de DockerHub
# DOCKERHUB_USERNAME
# DOCKERHUB_TOKEN

# 2. Crear PostgreSQL en Render

# 3. Crear Web Service Docker en Render

# 4. Configurar variables de entorno en Render

# 5. Verificar despliegue
# https://backlog-pro-backend-xxxx.onrender.com/graphql
```

## Configuración

### Variables de Entorno

El proyecto soporta múltiples archivos de entorno:

| Archivo           | Uso                        | DB_HOST               | PORT |
| ----------------- | -------------------------- | --------------------- | ---- |
| `.env`            | Desarrollo local           | `localhost`           | 3000 |
| `.env.local`      | Desarrollo con Docker      | `postgres`            | 3001 |
| `.env.production` | Producción (Render)        | Tu host de producción | 3002 |
| `.env.example`    | Plantilla de referencia    | -                     | -    |

**Edita el archivo `.env` correspondiente con tus credenciales:**

```env
NODE_ENV=development
PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=backlog_pro
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24
```

📖 Ver documentación completa: **[docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md)**

## Rendimiento de Desarrollo

Este proyecto usa **SWC** (Speedy Web Compiler) en lugar de webpack para hot reload ultra-rápido:

- ⚡ **10-20x más rápido** que webpack
- 🔥 **Hot reload instantáneo** (< 300ms)
- 🐳 **Funciona perfecto con Docker**
- 🚀 **Compilación incremental**

Ejemplo de velocidad:

```
Webpack: ~12 segundos
SWC:     ~300 milisegundos
```

## Comandos de Desarrollo

### Desarrollo Local

```bash
# Iniciar en modo watch (hot reload con SWC)
npm run start:dev

# Iniciar en modo debug
npm run start:debug

# Tests
npm run test
npm run test:watch
npm run test:cov

# Linting y Formato
npm run lint
npm run format

# Build para producción
npm run build
npm run start:prod
```

### Desarrollo con Docker

```bash
# Iniciar servicios
npm run docker:up

# Iniciar con hot reload (watch mode)
npm run docker:watch

# Ver logs en tiempo real
npm run docker:logs

# Ver estado de contenedores
npm run docker:status

# Ejecutar tests dentro del contenedor
npm run docker:test

# Acceder a PostgreSQL
npm run docker:db

# Reconstruir después de cambios en package.json
npm run docker:build

# Reiniciar servicios
npm run docker:restart

# Detener servicios
npm run docker:down

# Limpiar todo (incluyendo volúmenes)
npm run docker:clean
```

### Migraciones de Base de Datos

```bash
# Generar migración (detecta cambios en entidades)
npm run docker:migration:generate src/database/migrations/NombreMigracion

# Ejecutar migraciones pendientes
npm run docker:migration:run

# Revertir última migración
npm run docker:migration:revert

# Ver estado de migraciones
npm run docker:migration:show
```

## Estructura del Proyecto

```
src/
├── auth/                    # Autenticación JWT
├── users/                   # Gestión de usuarios
├── projects/                # Gestión de proyectos
├── sprints/                 # Gestión de sprints
├── tasks/                   # Gestión de tareas
├── metrics/                 # Cálculo de métricas
├── finances/                # Transacciones y reportes
├── clients/                 # Gestión de clientes
├── shared/                  # Utilidades compartidas
│   ├── guards/              # Auth guards
│   ├── filters/             # Exception filters
│   ├── decorators/          # Custom decorators
│   └── config/              # Configuración
└── database/                # Migraciones TypeORM
```

## Acceso a la Aplicación

### Desarrollo Local

```
GraphQL: http://localhost:3000/graphql
```

### Desarrollo con Docker

```
GraphQL: http://localhost:3001/graphql
Adminer: http://localhost:8080
```

Apollo Server detectará que es un navegador y te redirigirá automáticamente a Apollo Sandbox.

**Credenciales Adminer:**
- Servidor: `postgres`
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `backlog_pro`

## Docker

El proyecto incluye configuración completa de Docker con PostgreSQL y Adminer.

### Servicios incluidos:

- **app**: Aplicación NestJS (puerto 3001)
- **postgres**: PostgreSQL 15 (puerto 5432)
- **adminer**: Herramienta web para gestionar BD (puerto 8080)

📖 Ver documentación completa: **[docs/SETUP.md](docs/SETUP.md)** y **[docs/DOCKER_ARCHITECTURE.md](docs/DOCKER_ARCHITECTURE.md)**

## Arquitectura

El proyecto sigue Clean Architecture con CQRS:

- **Capa de Presentación**: GraphQL Resolvers + DTOs
- **Capa de Aplicación**: Commands/Queries + Handlers
- **Capa de Dominio**: Entidades + Value Objects + Interfaces
- **Capa de Infraestructura**: TypeORM Entities + Mappers + Repositorios

## Testing

El proyecto implementa dos tipos de testing:

- **Unit Tests**: Casos específicos y edge cases
- **Property-Based Tests**: Propiedades universales con fast-check (mínimo 100 iteraciones)

Cobertura mínima requerida: 80%

## Documentación

### Guías de Setup y Configuración

- 📖 **[docs/SETUP.md](docs/SETUP.md)** - Guía completa de setup (local y Docker)
- 🌍 **[docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md)** - Gestión de entornos y variables (.env)
- ⚡ **[docs/SWC_SETUP.md](docs/SWC_SETUP.md)** - SWC: Hot reload ultra-rápido (10-20x más rápido que webpack)
- ⚙️ **[docs/CONFIGURATION.md](docs/CONFIGURATION.md)** - Configuraciones del sistema (GraphQL, TypeORM)

### Docker y Despliegue

- 🏗️ **[docs/DOCKER_ARCHITECTURE.md](docs/DOCKER_ARCHITECTURE.md)** - Arquitectura de contenedores
- 🚀 **[docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)** - Despliegue en Render con DockerHub

### Ejemplos y Referencia

- 📚 **[docs/GRAPHQL_EXAMPLES.md](docs/GRAPHQL_EXAMPLES.md)** - Ejemplos de queries y mutations GraphQL
- ✅ **[docs/CHECKLIST.md](docs/CHECKLIST.md)** - Checklist de verificación pre-deploy
- 🔧 **[docs/ADMINER_SETUP.md](docs/ADMINER_SETUP.md)** - Configuración de Adminer para gestión de BD

## Despliegue en Producción

La aplicación está completamente lista para despliegue en **Render** usando imágenes Docker de **DockerHub**.

### Flujo de Despliegue Automático

1. **Push a `main`** → GitHub Actions se ejecuta automáticamente
2. **Tests pasan** → Imagen Docker se construye
3. **Imagen se publica** en DockerHub con tags: `latest`, `major.minor`, `major`, `major.minor.patch`
4. **Render se redespliega** automáticamente (si auto-deploy está habilitado)

### Quick Start - Despliegue en Render

1. **Configurar GitHub Secrets** con credenciales de DockerHub
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`

2. **Crear PostgreSQL en Render**

3. **Crear Web Service Docker en Render**
   - Imagen: `tu-usuario/backlog-pro-backend:latest`
   - Puerto: `3000`

4. **Configurar variables de entorno en Render**
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...` (desde Render PostgreSQL)
   - `JWT_SECRET=...` (generar con `openssl rand -hex 32`)

5. **Verificar despliegue**
   - https://backlog-pro-backend-xxxx.onrender.com/graphql

📋 Ver guía completa: **[docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)**

### Workflows de GitHub Actions

- **docker-publish.yml**: Construye y publica imagen en DockerHub en cada push a `main`
- **keep-alive.yml**: Mantiene el servicio de Render activo (ping cada 14 minutos)

## Licencia

MIT
