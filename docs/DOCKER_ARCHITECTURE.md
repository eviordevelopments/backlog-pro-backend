# Docker Architecture

Arquitectura de contenedores del proyecto Backlog Pro Backend.

## Diagrama de Servicios

```
┌──────────────────────────────────────────────────────┐
│                  Docker Network                       │
│               (backlog-pro-network)                   │
│                                                       │
│  ┌──────────────┐           ┌──────────────┐        │
│  │              │           │              │        │
│  │   NestJS     │──────────▶│  PostgreSQL  │        │
│  │     App      │           │      15      │        │
│  │              │           │              │        │
│  │  Port: 3000  │           │  Port: 5432  │        │
│  │              │           │              │        │
│  └──────┬───────┘           └──────┬───────┘        │
│         │                          │                 │
└─────────┼──────────────────────────┼─────────────────┘
          │                          │
          │                          │
     localhost:3000             localhost:5432
          │                          │
          ▼                          ▼
    ┌─────────┐                ┌─────────┐
    │  Apollo │                │   DB    │
    │ Sandbox │                │  Data   │
    └─────────┘                └─────────┘
```

## Componentes

### 1. NestJS App Container

**Imagen**: `node:20-alpine`  
**Dockerfile**: `Dockerfile.dev` (desarrollo) / `Dockerfile` (producción)

**Características**:
- Hot reload en desarrollo
- Código fuente montado como volumen
- Conecta a PostgreSQL internamente
- Expone puerto 3000 al host

**Variables de entorno**:
```env
NODE_ENV=development
DB_HOST=postgres          # Nombre del servicio Docker
DB_PORT=5432
```

### 2. PostgreSQL Container

**Imagen**: `postgres:15-alpine`  
**Volumen**: `postgres_data` (persistente)

**Características**:
- Base de datos: `backlog_pro`
- Usuario: `postgres`
- Health check cada 10s
- Datos persistentes en volumen nombrado

**Acceso**:
```bash
# Desde host
psql -h localhost -p 5432 -U postgres -d backlog_pro

# Desde Docker
npm run docker:db
# O manualmente: docker-compose exec postgres psql -U postgres -d backlog_pro
```

## Volúmenes

### Volúmenes Nombrados (Persistentes)

```yaml
volumes:
  postgres_data:    # Datos de PostgreSQL
```

Estos volúmenes persisten incluso después de `docker-compose down`.

Para eliminarlos:
```bash
docker-compose down -v
```

### Volúmenes de Código (Desarrollo)

```yaml
volumes:
  - .:/app                    # Código fuente
  - /app/node_modules         # node_modules del contenedor
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
```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 10s
  timeout: 5s
  retries: 5
```

La app espera a que PostgreSQL esté saludable antes de iniciar.

## Modos de Operación

### Desarrollo (docker-compose.yml)

```bash
docker-compose up -d
```

**Características**:
- Dockerfile.dev con hot reload
- Código montado como volumen
- Logs detallados
- PostgreSQL local

### Producción (docker-compose.prod.yml)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Características**:
- Multi-stage build optimizado
- Sin volúmenes de código
- Variables desde .env
- Restart automático

## Flujo de Datos

```
1. Request HTTP/GraphQL
   ↓
2. NestJS App (Container)
   ↓
3. TypeORM
   ↓
4. PostgreSQL (Container)
   ↓
5. Response
```

## Seguridad

### Desarrollo
- Passwords por defecto (postgres/postgres)
- Puertos expuestos al host
- Logs detallados

### Producción
- Variables desde .env (no hardcoded)
- Secrets management recomendado
- Puertos solo expuestos necesarios
- Logs sin información sensible

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
docker-compose logs -f

# Servicio específico
docker-compose logs -f app
docker-compose logs -f postgres
```

### Métricas
```bash
# Uso de recursos
docker stats

# Estado de servicios
docker-compose ps
```

### Health Checks
```bash
# Verificar salud
docker-compose ps

# Inspeccionar contenedor
docker inspect backlog-pro-app
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
docker-compose logs app

# Verificar health
docker-compose ps

# Reiniciar
docker-compose restart app
```

### Base de datos no conecta
```bash
# Verificar red
docker network inspect backlog-pro-backend_backlog-pro-network

# Verificar variables
docker-compose exec app env | grep DB_

# Test de conexión
docker-compose exec app nc -zv postgres 5432
```

### Volúmenes corruptos
```bash
# Eliminar y recrear
docker-compose down -v
docker-compose up -d
```

## Mejores Prácticas

1. ✅ Usar volúmenes nombrados para datos persistentes
2. ✅ Implementar health checks
3. ✅ Usar redes privadas
4. ✅ Multi-stage builds para producción
5. ✅ Variables de entorno para configuración
6. ✅ .dockerignore para optimizar builds
7. ✅ Restart policies para recuperación
8. ✅ Logs estructurados
9. ✅ Limitar recursos en producción
10. ✅ Backups regulares

## Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Networking](https://docs.docker.com/compose/networking/)
- [NestJS Docker](https://docs.nestjs.com/recipes/docker)
