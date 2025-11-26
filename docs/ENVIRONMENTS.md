# Gestión de Entornos

## Descripción

Backlog Pro Backend soporta múltiples entornos de ejecución con configuraciones específicas para cada uno. Este documento explica cómo gestionar las variables de entorno correctamente.

## Archivos de Entorno

### `.env.local` - Desarrollo Local
Usa este archivo cuando ejecutes la aplicación directamente en tu máquina sin Docker.

**Características:**
- `DB_HOST=localhost` (PostgreSQL local)
- Requiere PostgreSQL instalado localmente

**Uso:**
```bash
npm run env:local
npm run start:dev
```

### `.env.docker` - Desarrollo con Docker
Usa este archivo cuando ejecutes la aplicación con Docker Compose.

**Características:**
- `DB_HOST=postgres` (contenedor Docker)
- No requiere instalación local de PostgreSQL

**Uso:**
```bash
npm run env:docker
npm run docker:up
```

### `.env.production` - Producción
Usa este archivo para despliegues en producción.

**Características:**
- Hosts de producción configurables
- `DB_SSL=true` (conexiones seguras)
- Secrets fuertes y seguros

**Uso:**
```bash
npm run env:prod
npm run build
npm run start:prod
```

### `.env.example` - Plantilla
Archivo de referencia que documenta todas las variables disponibles. No se usa directamente.

## Comandos Rápidos

### Cambiar de Entorno

```bash
# Desarrollo local (sin Docker)
npm run env:local

# Desarrollo con Docker
npm run env:docker

# Producción
npm run env:prod
```

Estos comandos copian el archivo correspondiente a `.env`, que es el archivo que la aplicación lee.

### Verificar Configuración Actual

```bash
# Ver el contenido del .env activo
type .env

# Ver qué host de base de datos está configurado
findstr DB_HOST .env
```

## Flujo de Trabajo Recomendado

### Desarrollo Local

1. Instala PostgreSQL localmente
2. Configura el entorno local:
   ```bash
   npm run env:local
   ```
3. Edita `.env` con tus credenciales
4. Inicia la aplicación:
   ```bash
   npm run start:dev
   ```

### Desarrollo con Docker

1. Configura el entorno Docker:
   ```bash
   npm run env:docker
   ```
2. Edita `.env` con tus credenciales de tu base de datos
3. Inicia los contenedores:
   ```bash
   npm run docker:up
   ```

### Cambiar entre Local y Docker

```bash
# Detener Docker si está corriendo
npm run docker:down

# Cambiar a local
npm run env:local
npm run start:dev

# O cambiar a Docker
npm run env:docker
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

### Error: "Connection refused" al conectar a la base de datos

**Problema:** Estás usando el archivo `.env` incorrecto para tu entorno.

**Solución:**
```bash
# Si estás corriendo localmente
npm run env:local

# Si estás usando Docker
npm run env:docker
```

### Error: "ENOTFOUND postgres" sin Docker

**Problema:** Tienes configurado `DB_HOST=postgres` pero estás corriendo localmente.

**Solución:**
```bash
npm run env:local
npm run start:dev
```

### Error: "ECONNREFUSED localhost:5432" con Docker

**Problema:** Tienes configurado `DB_HOST=localhost` pero estás usando Docker.

**Solución:**
```bash
npm run env:docker
npm run docker:restart
```

## Integración Continua (CI/CD)

Para CI/CD, configura las variables de entorno directamente en tu plataforma:

- **GitHub Actions**: Usa secrets del repositorio
- **GitLab CI**: Usa variables de entorno protegidas
- **AWS**: Usa Parameter Store o Secrets Manager
- **Heroku**: Usa Config Vars
- **Render**: Usa Environment Variables en el dashboard del servicio

No uses archivos `.env` en CI/CD, configura las variables directamente en la plataforma.
