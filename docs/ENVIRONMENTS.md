# Gestión de Entornos

## Descripción

Backlog Pro Backend soporta múltiples entornos de ejecución con configuraciones específicas para cada uno. Este documento explica cómo gestionar las variables de entorno correctamente.

## Archivos de Entorno

### `.env.local` - Desarrollo con Docker
Usa este archivo cuando ejecutes la aplicación con Docker Compose.

**Características:**
- `DB_HOST=postgres` (contenedor Docker)
- `PORT=3001`
- No requiere instalación local de PostgreSQL

**Uso:**
```bash
npm run docker:up
```

### `.env` - Desarrollo Local
Usa este archivo cuando ejecutes la aplicación directamente en tu máquina sin Docker.

**Características:**
- `DB_HOST=localhost` (PostgreSQL local)
- `PORT=3000`
- Requiere PostgreSQL instalado localmente

**Uso:**
```bash
npm run start:dev
```

### `.env.production` - Producción
Usa este archivo para despliegues en producción.

**Características:**
- Hosts de producción configurables
- Secrets fuertes y seguros

**Uso:**
```bash
npm run docker:prod:up
```

### `.env.example` - Plantilla
Archivo de referencia que documenta todas las variables disponibles. No se usa directamente.

## Comandos Rápidos

### Desarrollo Local

```bash
# Iniciar aplicación en modo watch
npm run start:dev

# Iniciar en modo debug
npm run start:debug
```

### Desarrollo con Docker

```bash
# Iniciar contenedores
npm run docker:up

# Modo watch
npm run docker:watch

# Ver logs
npm run docker:logs

# Detener contenedores
npm run docker:down

# Reiniciar
npm run docker:restart
```

### Producción con Docker

```bash
# Iniciar contenedores
npm run docker:prod:up

# Ver logs
npm run docker:prod:logs

# Detener contenedores
npm run docker:prod:down

# Reiniciar
npm run docker:prod:restart
```

### Verificar Configuración Actual

```bash
# Ver qué host de base de datos está configurado
findstr DB_HOST .env | findstr DB_HOST .env.local | findstr DB_HOST .env.production
```

## Flujo de Trabajo Recomendado

### Desarrollo Local (sin Docker)

1. Instala PostgreSQL localmente
2. Crea la base de datos:
   ```bash
   createdb backlog_pro
   ```
3. Verifica que `.env` tenga `DB_HOST=localhost`
4. Inicia la aplicación:
   ```bash
   npm run start:dev
   ```

### Desarrollo con Docker (Recomendado)

1. Verifica que `.env.local` tenga `DB_HOST=postgres`
2. Inicia los contenedores:
   ```bash
   npm run docker:up
   ```
3. La aplicación estará disponible en `http://localhost:3001`
4. Adminer estará disponible en `http://localhost:8080`

### Cambiar entre Local y Docker

```bash
# Detener Docker si está corriendo
npm run docker:down

# Cambiar a local
npm run start:dev

# O cambiar a Docker
npm run docker:up
```

## Variables de Entorno Disponibles

### Aplicación
- `NODE_ENV`: Entorno de ejecución (`development`, `production`)
- `PORT`: Puerto del servidor (default: 3000)

### Base de Datos
- `DB_HOST`: Host de PostgreSQL
- `DB_PORT`: Puerto de PostgreSQL (default: 5432)
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `DB_SSL`: Habilitar SSL (`true`/`false`)

### JWT
- `JWT_SECRET`: Secret para firmar tokens JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración de tokens JWT en días (default: 1d)

## Seguridad

### ⚠️ Importante

1. **Nunca** commitees archivos `.env` al repositorio
2. Los archivos `.env.*` están en `.gitignore` por seguridad
3. Solo `.env.example` debe estar en el repositorio
4. Usa secrets fuertes en producción
5. Cambia `JWT_SECRET` en cada entorno

### Buenas Prácticas

- Usa diferentes credenciales para cada entorno
- Rota los secrets regularmente en producción
- No compartas archivos `.env` por email o chat
- Usa gestores de secrets en producción (AWS Secrets Manager, etc.)

## Troubleshooting

### Error: "ENOTFOUND postgres" al usar Docker

**Problema:** Tienes configurado `DB_HOST=localhost` en `.env.local` pero estás usando Docker.

**Solución:**
```bash
# Verifica que .env.local tenga DB_HOST=postgres
cat .env.local | findstr DB_HOST

# Reinicia los contenedores
npm run docker:restart
```

### Error: "ECONNREFUSED localhost:5432" sin Docker

**Problema:** Tienes configurado `DB_HOST=postgres` en `.env` pero estás corriendo localmente.

**Solución:**
```bash
# Verifica que .env tenga DB_HOST=localhost
cat .env | findstr DB_HOST

# Asegúrate de que PostgreSQL está corriendo localmente
# Luego inicia la aplicación
npm run start:dev
```

### Error: "Connection refused" al conectar a la base de datos

**Problema:** PostgreSQL no está corriendo o las credenciales son incorrectas.

**Solución:**
```bash
# Si usas Docker, verifica que los contenedores estén corriendo
npm run docker:status

# Si usas local, verifica que PostgreSQL esté corriendo
# En Windows: Services > PostgreSQL

# Verifica las credenciales en .env o .env.local
```

### Adminer no está disponible

**Problema:** Adminer solo está disponible cuando usas Docker.

**Solución:**
```bash
# Inicia Docker
npm run docker:up

# Accede a Adminer en http://localhost:8080
# Servidor: postgres
# Usuario: postgres
# Contraseña: postgres
# Base de datos: backlog_pro
```

## Integración Continua (CI/CD)

Para CI/CD, configura las variables de entorno directamente en tu plataforma:

- **GitHub Actions**: Usa secrets del repositorio
- **GitLab CI**: Usa variables de entorno protegidas
- **AWS**: Usa Parameter Store o Secrets Manager
- **Render**: Usa Environment Variables en el dashboard del servicio

No uses archivos `.env` en CI/CD, configura las variables directamente en la plataforma.

### Render (Producción)

En Render, configura estas variables en el dashboard del servicio:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:5432/backlog_pro
JWT_SECRET=tu_secret_fuerte_32_caracteres
JWT_EXPIRES_IN=1d
```

La aplicación usará automáticamente `DATABASE_URL` si está configurada.

Para más detalles sobre el despliegue en Render, consulta [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).
