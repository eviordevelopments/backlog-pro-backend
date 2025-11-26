# Guía de Setup - Backlog Pro Backend

## Tabla de Contenidos
1. [Setup Local (sin Docker)](#setup-local-sin-docker)
2. [Setup con Docker](#setup-con-docker)
3. [Archivos Docker](#archivos-docker)
4. [Desarrollo vs Producción](#desarrollo-vs-producción)
5. [Comandos Útiles](#comandos-útiles)
6. [Migraciones de Base de Datos](#migraciones-de-base-de-datos)
7. [Troubleshooting](#troubleshooting)

---

## Setup Local (sin Docker)

### Requisitos
- Node.js 20+
- PostgreSQL 15+
- Git

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backlog-pro-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar PostgreSQL**
```bash
# Crear base de datos
createdb backlog_pro
```

4. **Configurar variables de entorno**
```bash
npm run env:local
```

Edita `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=backlog_pro

JWT_SECRET=your_secret_key
```

5. **Iniciar servicios externos**
```bash
# Asegúrate de que PostgreSQL esté corriendo
# Windows: Servicios de Windows
# Linux: systemctl status postgresql
# Mac: brew services list
```

6. **Iniciar aplicación**
```bash
npm run start:dev
```

7. **Verificar**
- App: http://localhost:3000
- GraphQL: http://localhost:3000/graphql
- Health: http://localhost:3000/health

---

## Setup con Docker

### Requisitos
- Docker Desktop instalado
- Git

### Setup en 3 pasos

```bash
# 1. Configurar variables de entorno
npm run env:docker

# 2. Editar .env con tus credenciales
# JWT_SECRET y configuración de base de datos

# 3. Iniciar servicios
npm run docker:up
```

### Verificar

- App: http://localhost:3000
- GraphQL: http://localhost:3000/graphql
- PostgreSQL: localhost:5432

```bash
# Ver logs
npm run docker:logs

# Ver estado
npm run docker:status
```

---

## Archivos Docker

| Archivo | Propósito | Cuándo Usar |
|---------|-----------|-------------|
| `Dockerfile.dev` | Desarrollo con hot reload | Desarrollo diario |
| `Dockerfile` | Build optimizado multi-stage | Producción |
| `docker-compose.yml` | Orquestación desarrollo | Desarrollo local |
| `docker-compose.prod.yml` | Orquestación producción | Servidor producción |

---

## Desarrollo vs Producción

### Desarrollo (`Dockerfile.dev` + `docker-compose.yml`)

**Características:**
- ✅ Hot reload (cambios se reflejan automáticamente)
- ✅ Volúmenes montados (código local sincronizado)
- ✅ Todas las dependencias de desarrollo
- ✅ Logs detallados
- ⚠️ Imagen más grande (~500-800 MB)

**Uso:**
```bash
npm run env:docker
npm run docker:up
npm run docker:logs
```

**Dockerfile.dev:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install              # Todas las dependencias
COPY . .
CMD ["npm", "run", "start:dev"]  # Modo watch
```

### Producción (`Dockerfile` + `docker-compose.prod.yml`)

**Características:**
- ✅ Build multi-stage (imagen pequeña ~200-300 MB)
- ✅ Solo dependencias de producción
- ✅ Código compilado (TypeScript → JavaScript)
- ✅ Optimizado para rendimiento
- ❌ Sin hot reload
- ❌ Sin código fuente TypeScript

**Uso:**
```bash
npm run env:prod
# Editar .env con credenciales de producción
npm run docker:prod:up
npm run docker:prod:logs
```

**Dockerfile (Multi-stage):**
```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
```

---

## Comandos Útiles

### Desarrollo Local (sin Docker)

```bash
# Iniciar en modo desarrollo
npm run start:dev

# Ejecutar tests
npm run test
npm run test:watch
npm run test:cov

# Linting y formato
npm run lint
npm run format

# Build
npm run build
```

### Desarrollo con Docker

```bash
# Gestión de servicios
npm run docker:up           # Iniciar
npm run docker:down         # Detener
npm run docker:restart      # Reiniciar
npm run docker:build        # Reconstruir
npm run docker:clean        # Limpiar todo (incluyendo volúmenes)
npm run docker:status       # Ver estado
npm run docker:logs         # Ver logs

# Desarrollo
npm run docker:shell        # Acceder al contenedor
npm run docker:test         # Ejecutar tests

# Base de datos
npm run docker:db           # Conectar a PostgreSQL

# Migraciones (ver sección completa abajo)
npm run docker:migration:generate  # Generar migración
npm run docker:migration:run       # Ejecutar migraciones
npm run docker:migration:revert    # Revertir migración
npm run docker:migration:show      # Ver estado
```

### Producción

```bash
npm run docker:prod:up      # Iniciar
npm run docker:prod:down    # Detener
npm run docker:prod:build   # Reconstruir
npm run docker:prod:logs    # Ver logs
npm run docker:prod:ps      # Ver estado
```

---

## Migraciones de Base de Datos

### Con Docker (Recomendado)

Las migraciones se ejecutan dentro del contenedor Docker, usando automáticamente `DB_HOST=postgres`:

```bash
# Generar migración (detecta cambios en entidades)
npm run docker:migration:generate src/database/migrations/NombreDeLaMigracion

# Ejecutar migraciones pendientes
npm run docker:migration:run

# Revertir la última migración
npm run docker:migration:revert

# Ver estado de migraciones
npm run docker:migration:show
```

### Sin Docker (Local)

Si ejecutas desde tu máquina local:

1. Asegúrate de que PostgreSQL esté corriendo:
   ```bash
   docker-compose up -d postgres
   ```

2. Usa `.env` con `DB_HOST=localhost`:
   ```bash
   npm run env:local
   ```

3. Ejecutar comandos:
   ```bash
   npm run migration:generate src/database/migrations/NombreDeLaMigracion
   npm run migration:run
   npm run migration:revert
   npm run migration:show
   ```

### Flujo de Trabajo

1. Crear/modificar entidad TypeORM (ej: `user.typeorm-entity.ts`)
2. Generar migración: `npm run docker:migration:generate src/database/migrations/CreateUserTable`
3. Revisar la migración generada en `src/database/migrations/`
4. Ejecutar migración: `npm run docker:migration:run`
5. Si hay problemas, revertir: `npm run docker:migration:revert`

### Notas Importantes

- En desarrollo, `synchronize: true` aplica cambios automáticamente
- En producción, `synchronize: false` - debes ejecutar migraciones manualmente
- Todas las entidades usan el sufijo `.typeorm-entity.ts`
- Las migraciones se almacenan en `src/database/migrations/`
- Configuración en `src/shared/config/typeorm.config.ts`

---

## Servicios Incluidos (Docker)

### App (NestJS)
- **Puerto**: 3000
- **Hot Reload**: Sí (desarrollo) / No (producción)
- **Volúmenes**: Código montado (desarrollo) / Solo datos (producción)

### PostgreSQL
- **Puerto**: 5432
- **Usuario**: postgres
- **Password**: postgres (cambiar en producción)
- **Base de datos**: backlog_pro
- **Volumen**: postgres_data (persistente)

---

## Flujos de Trabajo

### Desarrollo Diario (Local)

```bash
# Día 1: Setup
npm run env:local
npm install
npm run start:dev

# Días siguientes
npm run start:dev
# Hacer cambios → Hot reload automático con SWC
```

### Desarrollo Diario (Docker)

```bash
# Día 1: Setup
npm run env:docker
npm run docker:up

# Días siguientes
npm run docker:up
# Hacer cambios → Hot reload automático

# Si cambias package.json
npm run docker:build
```

### Antes de Producción

```bash
# 1. Probar build de producción localmente
docker build -f Dockerfile -t backlog-pro:test .

# 2. Ejecutar imagen de prueba
docker run -p 3000:3000 --env-file .env.production backlog-pro:test

# 3. Verificar
curl http://localhost:3000/health
```

### Despliegue en Servidor

```bash
# En el servidor
git clone <repo-url>
cd backlog-pro-backend

# Configurar
cp .env.production .env
nano .env  # Editar credenciales

# Iniciar
npm run docker:prod:up

# Verificar
npm run docker:prod:logs
curl http://localhost:3000/health
```

---

## Troubleshooting

### Puerto 3000 ocupado

```bash
# Ver qué usa el puerto
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Cambiar puerto en .env
PORT=3001

# O en docker-compose.yml
ports:
  - '3001:3000'
```

### PostgreSQL no conecta (Local)

```bash
# Verificar que PostgreSQL esté corriendo
# Windows: Servicios de Windows
# Linux: systemctl status postgresql
# Mac: brew services list

# Verificar credenciales en .env
cat .env | grep DB_
```

### PostgreSQL no conecta (Docker)

```bash
# Verificar salud
npm run docker:status

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar variables
docker-compose exec app env | grep DB_
```

### Hot reload no funciona

```bash
# Local: Verificar que SWC esté configurado
cat nest-cli.json

# Docker: Verificar que usas docker-compose.yml (no prod)
docker-compose ps
npm run docker:logs
npm run docker:restart
```

### node_modules not found (Docker)

```bash
# Reconstruir imagen
npm run docker:build
```

### Limpiar todo y empezar de nuevo (Docker)

```bash
# Detener y eliminar todo
npm run docker:clean

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar sistema completo
docker system prune -a --volumes
```

---

## Base de Datos

### Conectar a PostgreSQL

**Local:**
```bash
psql -U postgres -d backlog_pro
```

**Docker:**
```bash
npm run docker:db
# O manualmente
docker-compose exec postgres psql -U postgres -d backlog_pro
```

### Backup y Restore

**Local:**
```bash
# Backup
pg_dump -U postgres backlog_pro > backup.sql

# Restore
psql -U postgres -d backlog_pro < backup.sql
```

**Docker:**
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres backlog_pro > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres -d backlog_pro < backup.sql

# Ver tablas
docker-compose exec postgres psql -U postgres -d backlog_pro -c "\dt"
```

---

## Mejores Prácticas

### Desarrollo
✅ Usa setup local para desarrollo más rápido
✅ Usa Docker si no quieres instalar PostgreSQL
✅ Monta volúmenes para hot reload (Docker)
✅ Usa archivos `.env` correctos por entorno
✅ Ejecuta tests regularmente
✅ Limpia volúmenes periódicamente (Docker)

### Producción
✅ Usa `Dockerfile` multi-stage
✅ Nunca incluyas `.env` en imagen
✅ Usa secrets management
✅ Configura health checks
✅ Usa `restart: always`
✅ Monitorea logs
✅ Haz backups de volúmenes

### Seguridad
⚠️ Nunca commitees `.env`
⚠️ Usa credenciales diferentes por entorno
⚠️ Rota secrets regularmente
⚠️ Limita puertos expuestos
⚠️ Usa redes Docker para aislar
⚠️ Mantén dependencias actualizadas

---

## Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [GraphQL Documentation](https://graphql.org/)
