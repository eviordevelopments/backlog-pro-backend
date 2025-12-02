# Docker Architecture

Arquitectura de contenedores del proyecto Backlog Pro Backend.

## Diagrama de Servicios

```
┌────────────────────────────────────────────────────────────┐
│                    Docker Network                          │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │              │  │              │  │              │    │
│  │   NestJS     │  │  PostgreSQL  │  │   Adminer    │    │
│  │     App      │─▶│      15      │  │   (Web UI)   │    │
│  │              │  │              │  │              │    │
│  │  Port: 3001  │  │  Port: 5432  │  │  Port: 8080  │    │
│  │              │  │              │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │            │
└─────────┼─────────────────┼─────────────────┼────────────┘
          │                 │                 │
          │                 │                 │
     localhost:3001    localhost:5432    localhost:8080
          │                 │                 │
          ▼                 ▼                 ▼
     ┌─────────┐        ┌─────────┐     ┌─────────┐
     │ Apollo  │        │   DB    │     │ Adminer │
     │ Sandbox │        │  Data   │     │  (Web)  │
     └─────────┘        └─────────┘     └─────────┘
```

## Componentes

### 1. NestJS App Container

**Imagen**: `node:20-alpine`  
**Dockerfile**: `Dockerfile` (desarrollo) / `Dockerfile.production` (producción)  
**Puerto**: `3001` (desarrollo) / `3002` (producción)

**Características**:
- Hot reload en desarrollo con SWC (10-20x más rápido que webpack)
- Código fuente montado como volumen
- Conecta a PostgreSQL internamente
- Expone puerto 3001 al host (desarrollo)
- Health check cada 30s

**Variables de entorno** (desde `.env.local`):
```env
NODE_ENV=development
PORT=3001
DB_HOST=postgres          # Nombre del servicio Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=backlog_pro
JWT_SECRET=default_jwt_secret
JWT_EXPIRES_IN=24
```

### 2. PostgreSQL Container

**Imagen**: `postgres:15-alpine`  
**Volumen**: `postgres_data` (persistente)  
**Puerto**: `5432`

**Características**:
- Base de datos: `backlog_pro`
- Usuario: `postgres`
- Contraseña: `postgres` (desarrollo)
- Health check cada 10s
- Datos persistentes en volumen nombrado

**Acceso**:
```bash
# Desde host (requiere psql instalado)
psql -h localhost -p 5432 -U postgres -d backlog_pro

# Desde Docker (recomendado)
npm run docker:db

# O manualmente
docker compose -p backlog-pro-dev exec postgres psql -U postgres -d backlog_pro
```

### 3. Adminer Container

**Imagen**: `adminer:latest`  
**Puerto**: `8080`

**Características**:
- Interfaz web para gestionar PostgreSQL
- No requiere instalación local
- Acceso desde navegador

**Acceso**:
```
http://localhost:8080

Servidor: postgres
Usuario: postgres
Contraseña: postgres
Base de datos: backlog_pro
```

## Volúmenes

### Volúmenes Nombrados (Persistentes)

```yaml
volumes:
  postgres_data:    # Datos de PostgreSQL
```

Estos volúmenes persisten incluso después de `docker compose down`.

Para eliminarlos:
```bash
docker compose down -v
```

El código se sincroniza automáticamente para hot reload.

## Redes

### backlog-pro-network (Bridge)

Red privada que conecta todos los servicios.

**Ventajas**:
- Aislamiento de otros contenedores
- Resolución de nombres por servicio (postgres, app)
- Comunicación interna sin exponer puertos

**Comunicación**:
```
app → postgres:5432    (interno)
host → app:3000        (expuesto)
```

## Health Checks

### PostgreSQL
```yml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres -d backlog_pro']
  interval: 10s
  timeout: 5s
  retries: 5
```

### NestJS App
```yml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3001/graphql']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

La app espera a que PostgreSQL esté saludable antes de iniciar (dependencia configurada en `compose.yml`).

## Modos de Operación

### Desarrollo (compose.yml)

```bash
npm run docker:up      # Iniciar servicios
npm run docker:watch   # Iniciar con hot reload
npm run docker:logs    # Ver logs
npm run docker:down    # Detener servicios
```

**Características**:
- Dockerfile con hot reload (SWC)
- Código montado como volumen
- Logs detallados
- PostgreSQL local
- Adminer para gestión de BD
- Puerto 3001 para app

**Archivo**: `compose.yml`

### Producción (compose.production.yml)

```bash
npm run docker:prod:up      # Iniciar
npm run docker:prod:logs    # Ver logs
npm run docker:prod:down    # Detener
```

**Características**:
- Multi-stage build optimizado
- Sin volúmenes de código
- Variables desde `.env.production`
- Restart automático
- Puerto 3002 para app
- Solo app (sin PostgreSQL local)

**Archivo**: `compose.production.yml`

**Nota**: En producción, PostgreSQL debe estar en un servicio externo (Render, AWS RDS, etc.)

## Flujo de Datos

```
1. Request HTTP/GraphQL (desde navegador o cliente)
   ↓
2. NestJS App (Container) - puerto 3001
   ↓
3. TypeORM (ORM)
   ↓
4. PostgreSQL (Container) - puerto 5432
   ↓
5. Response JSON/GraphQL
   ↓
6. Apollo Sandbox o cliente recibe respuesta
```

## Flujo de Desarrollo

```
1. Editar archivo TypeScript en src/
   ↓
2. SWC detecta cambio (< 100ms)
   ↓
3. Recompila incrementalmente
   ↓
4. NestJS reinicia módulos afectados
   ↓
5. Cambios reflejados en http://localhost:3001/graphql
```

## Seguridad

### Desarrollo
- ⚠️ Passwords por defecto (postgres/postgres)
- ⚠️ Puertos expuestos al host (solo localhost)
- ✅ Logs detallados para debugging
- ✅ Aislamiento en red privada Docker

### Producción
- ✅ Variables desde `.env.production` (no hardcoded)
- ✅ Secrets management en Render
- ✅ DB_SSL=true para conexiones encriptadas
- ✅ JWT_SECRET fuerte (32+ caracteres)
- ✅ Puertos solo expuestos necesarios
- ✅ Logs sin información sensible
- ✅ Health checks para recuperación automática

## Escalabilidad

### Horizontal Scaling

Para escalar la app:
```bash
docker-compose up -d --scale app=3
```

Requiere:
- Load balancer (nginx, traefik)
- Database connection pooling

### Vertical Scaling

Limitar recursos:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoreo

### Logs
```bash
# Todos los servicios
npm run docker:logs

# Servicio específico
docker compose -p backlog-pro-dev logs -f app
docker compose -p backlog-pro-dev logs -f postgres
docker compose -p backlog-pro-dev logs -f adminer

# Últimas 20 líneas
npm run docker:logs
```

### Estado de Servicios
```bash
# Ver estado
npm run docker:status

# O manualmente
docker compose -p backlog-pro-dev ps
```

### Métricas
```bash
# Uso de recursos en tiempo real
docker stats

# Inspeccionar contenedor específico
docker inspect backlog-pro-dev-app-1
```

### Health Checks
```bash
# Ver estado de health checks
docker compose -p backlog-pro-dev ps

# Verificar salud de PostgreSQL
docker compose -p backlog-pro-dev exec postgres pg_isready -U postgres

# Verificar salud de app
curl http://localhost:3001/graphql
```

## Backup y Restore

### PostgreSQL Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres backlog_pro > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres -d backlog_pro < backup.sql
```



## Troubleshooting

### Contenedor no inicia
```bash
# Ver logs
npm run docker:logs

# Verificar health
npm run docker:status

# Reiniciar
npm run docker:restart

# Reconstruir
npm run docker:build
```

### Base de datos no conecta
```bash
# Verificar que PostgreSQL esté saludable
docker compose -p backlog-pro-dev ps

# Verificar variables de entorno
docker compose -p backlog-pro-dev exec app env | grep DB_

# Test de conexión desde app
docker compose -p backlog-pro-dev exec app nc -zv postgres 5432

# Conectar directamente a PostgreSQL
npm run docker:db
```

### Hot reload no funciona
```bash
# Verificar que estés usando docker:watch
npm run docker:watch

# Ver logs de compilación
npm run docker:logs

# Reiniciar si es necesario
npm run docker:restart
```

### Volúmenes corruptos o datos inconsistentes
```bash
# Eliminar volúmenes y recrear
npm run docker:clean

# O manualmente
docker compose -p backlog-pro-dev down -v
docker compose -p backlog-pro-dev up -d
```

### Puerto ya en uso
```bash
# Ver qué usa el puerto 3001
lsof -i :3001              # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Cambiar puerto en .env.local
PORT=3100
npm run docker:restart
```

## Mejores Prácticas

### Desarrollo
1. ✅ Usar `npm run docker:watch` para hot reload
2. ✅ Usar volúmenes nombrados para datos persistentes
3. ✅ Implementar health checks
4. ✅ Usar redes privadas (Docker bridge)
5. ✅ Variables de entorno en `.env.local`
6. ✅ Logs detallados para debugging
7. ✅ Limpiar volúmenes periódicamente (`npm run docker:clean`)

### Producción
1. ✅ Multi-stage builds para optimizar tamaño
2. ✅ Variables de entorno desde secrets (Render)
3. ✅ Health checks para recuperación automática
4. ✅ Restart policies (`restart: always`)
5. ✅ Logs estructurados sin información sensible
6. ✅ Limitar recursos (CPU, memoria)
7. ✅ Backups regulares de base de datos
8. ✅ Monitoreo y alertas
9. ✅ DB_SSL=true para conexiones encriptadas
10. ✅ Usar servicios externos para BD (Render PostgreSQL)

## Comandos Rápidos

```bash
# Desarrollo
npm run docker:up           # Iniciar
npm run docker:watch        # Iniciar con hot reload
npm run docker:logs         # Ver logs
npm run docker:status       # Ver estado
npm run docker:restart      # Reiniciar
npm run docker:build        # Reconstruir
npm run docker:down         # Detener
npm run docker:clean        # Limpiar todo

# Base de datos
npm run docker:db           # Conectar a PostgreSQL
npm run docker:migration:generate  # Generar migración
npm run docker:migration:run       # Ejecutar migraciones

# Producción
npm run docker:prod:up      # Iniciar
npm run docker:prod:logs    # Ver logs
npm run docker:prod:down    # Detener
```

## Referencias

- 📖 [docs/SETUP.md](../SETUP.md) - Guía completa de setup
- 📖 [docs/ENVIRONMENTS.md](../ENVIRONMENTS.md) - Gestión de entornos
- 🚀 [docs/RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) - Despliegue en Render
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Networking](https://docs.docker.com/compose/networking/)
- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
