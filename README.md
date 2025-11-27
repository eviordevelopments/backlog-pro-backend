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

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno para desarrollo local
npm run env:local
# O manualmente: copy .env.local .env

# 3. Editar .env con tus credenciales
# Asegúrate de tener PostgreSQL instalado localmente

# 4. Iniciar la aplicación
npm run start:dev
```

### Opción 2: Con Docker (Recomendado)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno para Docker
npm run env:docker
# O manualmente: copy .env.docker .env

# 3. Editar .env con tus credenciales

# 4. Iniciar todos los servicios (PostgreSQL, App)
npm run docker:up

# 5. Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down

# Detener y eliminar volúmenes (datos)
npm run docker:clean
```

### Opción 3: Producción

```bash
# 1. Configurar variables de entorno para producción
npm run env:prod
# O manualmente: copy .env.production .env

# 2. Editar .env con tus credenciales de producción

# 3. Construir y ejecutar
npm run build
npm run start:prod
```

## Configuración

### Variables de Entorno

El proyecto usa un sistema centralizado de configuración en `src/shared/config/envs.config.ts` y soporta múltiples archivos de entorno:

| Archivo           | Uso                           | DB_HOST               |
| ----------------- | ----------------------------- | --------------------- |
| `.env.local`      | Desarrollo local sin Docker   | `localhost`           |
| `.env.docker`     | Desarrollo con Docker Compose | `postgres`            |
| `.env.production` | Producción                    | Tu host de producción |
| `.env.example`    | Plantilla de referencia       | -                     |

**Cambiar entre entornos:**

```bash
# Para desarrollo local
npm run env:local

# Para desarrollo con Docker
npm run env:docker

# Para producción
npm run env:prod
```

Edita el archivo `.env` correspondiente con tus credenciales:

```env
NODE_ENV=development
PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost  # 'postgres' para Docker, 'localhost' para local
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=backlog_pro
DB_SSL=false  # 'true' para producción

# JWT
JWT_SECRET=your_jwt_secret
```

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

### Sin Docker

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Linting y Formato
npm run lint
npm run format
```

### Con Docker

```bash
# Iniciar servicios
npm run docker:up

# Ver logs
npm run docker:logs

# Ver estado
npm run docker:status

# Ejecutar tests
npm run docker:test

# Acceder a PostgreSQL
npm run docker:db

# Reconstruir después de cambios en package.json
npm run docker:build

# Detener servicios
npm run docker:down

# Limpiar todo (incluyendo volúmenes)
npm run docker:clean
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

## Apollo Sandbox

Una vez iniciada la aplicación, accede a:

- http://localhost:3000/graphql

Apollo Server detectará que es un navegador y te redirigirá automáticamente a Apollo Sandbox.

## Docker

El proyecto incluye configuración completa de Docker con PostgreSQL.

**📖 Ver [docs/DOCKER.md](docs/DOCKER.md) para documentación completa de Docker**

### Inicio Rápido con Docker:

```bash
# 1. Configurar variables de entorno
cp .env.docker .env

# 2. Iniciar todos los servicios
npm run docker:up

# 3. Ver logs
npm run docker:logs

# 4. Acceder a la aplicación
# http://localhost:3000
# http://localhost:3000/graphql
```

### Servicios incluidos:

- **app**: Aplicación NestJS (puerto 3000)
- **postgres**: PostgreSQL 15 (puerto 5432)

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

## Documentación Adicional

- 📖 [docs/SETUP.md](docs/SETUP.md) - **Guía completa de setup (local y Docker)**
- 🚀 [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) - **Despliegue en Render con DockerHub (sin Supabase)**
- 🌍 [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md) - Gestión de entornos y variables (.env)
- ⚡ [docs/SWC_SETUP.md](docs/SWC_SETUP.md) - SWC: Hot reload ultra-rápido
- ⚙️ [docs/CONFIGURATION.md](docs/CONFIGURATION.md) - Configuraciones del sistema (GraphQL, TypeORM)
- 🏗️ [docs/DOCKER_ARCHITECTURE.md](docs/DOCKER_ARCHITECTURE.md) - Arquitectura de contenedores
- ✅ [docs/CHECKLIST.md](docs/CHECKLIST.md) - Checklist de verificación

## Despliegue en Producción

La aplicación está completamente lista para despliegue en **Render** usando imágenes Docker de **DockerHub**.

### Quick Start - Despliegue en Render

1. **Setup GitHub Secrets** con credenciales de DockerHub → [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md#step-1-github-secrets-setup)
2. **Crear PostgreSQL en Render** → [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md#step-3-render-postgresql-database)
3. **Configurar Docker Service en Render** → [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md#step-4-render-docker-service)
4. **Agregar variables de entorno** → [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md#step-5-environment-variables)

📋 Ver guía completa: **[docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)**

### Ejecutar Localmente con Docker

Usa `docker-compose.yml` para levantar la aplicación localmente:

```bash
# Copiar configuración de ejemplo
cp .env.example .env
# Editar .env con tus valores (DB_USERNAME, DB_PASSWORD, JWT_SECRET, DOCKER_USERNAME, etc.)

# Ejecutar con docker-compose
docker-compose up
```

**Nota:** Asegúrate de que `DOCKER_USERNAME` en `.env` apunta a tu imagen de DockerHub (ej: `octocat/backlog-pro-backend`), o usa una imagen local si prefieres.

Ver archivo: **[docker-compose.yml](docker-compose.yml)**

## Licencia

MIT
