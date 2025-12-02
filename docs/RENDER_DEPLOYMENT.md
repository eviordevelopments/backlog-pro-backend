# Guía de Despliegue en Render

Despliega **Backlog Pro Backend** en [Render](https://render.com) usando imágenes Docker desde DockerHub, con una base de datos PostgreSQL nativa. Esta guía reemplaza Supabase + Netlify con un stack completamente gestionado en Render.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Configuración de Secrets en GitHub](#paso-1-configuración-de-secrets-en-github)
3. [Paso 2: Configuración de DockerHub](#paso-2-configuración-de-dockerhub)
4. [Paso 3: Base de Datos PostgreSQL en Render](#paso-3-base-de-datos-postgresql-en-render)
5. [Paso 4: Servicio Docker en Render](#paso-4-servicio-docker-en-render)
6. [Paso 5: Variables de Entorno](#paso-5-variables-de-entorno)
7. [Paso 6: Verificar Despliegue](#paso-6-verificar-despliegue)
8. [Solución de Problemas](#solución-de-problemas)
9. [Actualizar la Aplicación](#actualizar-la-aplicación)

---

## Requisitos Previos

- **Cuenta de GitHub** con el repositorio backlog-pro-backend
- **Cuenta de DockerHub** (tier gratuito disponible en hub.docker.com)
- **Cuenta de Render** (tier gratuito disponible en render.com)
- Git instalado localmente

---

## Paso 1: Configuración de Secrets en GitHub

GitHub Actions usa secrets para almacenar de forma segura tus credenciales de DockerHub. Estos son necesarios para que el workflow de CI/CD publique imágenes automáticamente.

### 1.1 Generar Token de Acceso en DockerHub

1. Inicia sesión en [DockerHub](https://hub.docker.com)
2. Haz clic en tu ícono de perfil → **Account Settings**
3. Ve a la pestaña **Security**
4. Haz clic en **New Access Token**
5. Ingresa un nombre para el token (ej: `github-actions`)
6. Selecciona permisos **Read, Write**
7. Haz clic en **Generate**
8. **Copia el token** (no lo verás de nuevo)

### 1.2 Agregar Secrets en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/eviordevelopments/backlog-pro-backend`
2. Haz clic en **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret**
4. Agrega dos secrets:

   **Secret 1: DOCKERHUB_USERNAME**
   - Nombre: `DOCKERHUB_USERNAME`
   - Valor: Tu nombre de usuario de DockerHub

   **Secret 2: DOCKERHUB_TOKEN**
   - Nombre: `DOCKERHUB_TOKEN`
   - Valor: El token de acceso que copiaste arriba

5. Haz clic en **Add secret** para cada uno

✅ **Resultado:** GitHub Actions ahora puede autenticarse con DockerHub.

---

## Paso 2: Configuración de DockerHub

### 2.1 Crear Repositorio en DockerHub

1. Inicia sesión en [DockerHub](https://hub.docker.com)
2. Haz clic en **Create Repository**
3. Completa:
   - **Name:** `backlog-pro-backend`
   - **Description:** (opcional) "Backlog Pro Backend – API de Gestión de Proyectos y Equipos"
   - **Visibility:** Public (o Private si lo prefieres)
4. Haz clic en **Create**

### 2.2 Verificar URL del Repositorio

Tu URL de imagen será: `TU_USUARIO_DOCKERHUB/backlog-pro-backend`

Ejemplo: `octocat/backlog-pro-backend`

Usarás esta URL en la configuración de Render (ver Paso 4).

### 2.3 Disparar Primera Compilación

Asegúrate de que el workflow de GitHub Actions publique la primera imagen:

```bash
# Desde tu repositorio local, actualiza la versión en package.json
# (si no lo has hecho ya)
npm version patch  # Actualiza la versión en package.json

# Commit y push a main
git add package.json
git commit -m "chore: bump version for Docker build"
git push origin main
```

Ve a la pestaña **GitHub Actions** en tu repositorio para ver el workflow ejecutándose. Una vez completado, verifica DockerHub para confirmar que la imagen fue publicada.

---

## Paso 3: Base de Datos PostgreSQL en Render

### 3.1 Crear Base de Datos PostgreSQL en Render

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **New +** → **PostgreSQL**
3. Completa:
   - **Name:** `backlog-pro-db`
   - **Database:** `backlog_pro` (o tu preferencia)
   - **User:** `postgres` (por defecto)
   - **Region:** Elige la región más cercana a tus usuarios (ej: `Oregon`, `Frankfurt`)
   - **PostgreSQL Version:** `15`
   - **Plan:** `Free` o `Starter`
4. Haz clic en **Create Database**

### 3.2 Obtener Credenciales de la Base de Datos

Una vez que la base de datos se cree (puede tomar 1-2 minutos), verás los detalles de conexión:

- **Internal Connection URL:** `postgresql://postgres:PASSWORD@HOST:5432/backlog_pro`
- **Host:** `HOST`
- **Port:** `5432`
- **Database:** `backlog_pro`
- **Username:** `postgres`
- **Password:** (mostrada en el dashboard)

⚠️ **Importante:** Render proporciona una **URL interna** que funciona solo desde servicios en el mismo entorno de Render. Usa esta URL en tu aplicación, no la URL externa.

---

## Paso 4: Servicio Docker en Render

### 4.1 Crear Servicio Web Docker

1. En el Dashboard de Render, haz clic en **New +** → **Web Service**
2. Elige **Docker** (no "Deploy from a repository")
3. Completa:
   - **Name:** `backlog-pro-backend`
   - **Docker Image URL:** `TU_USUARIO_DOCKERHUB/backlog-pro-backend:latest`
     - Ejemplo: `octocat/backlog-pro-backend:latest`
   - **Port:** `3000`
4. Haz clic en **Create Web Service**

### 4.2 Configurar Health Check

1. Ve a la configuración de tu servicio
2. Encuentra la sección **Health Check**
3. Configura:
   - **Path:** `/graphql`
   - **Poll interval:** `30s` (por defecto)
   - **Timeout:** `10s` (por defecto)

### 4.3 Habilitar Auto-Deploy (Opcional pero Recomendado)

1. Ve a la configuración del servicio
2. Encuentra la sección **Docker Repository**
3. Haz clic en **Connect Docker Registry** (si no está conectado)
4. Selecciona tu cuenta de DockerHub
5. Habilita **Auto-Deploy** para redesplegarse automáticamente cuando se publiquen nuevas imágenes

---

## Paso 5: Variables de Entorno

### 5.1 Agregar Variables de Entorno en Render

1. En el dashboard de tu servicio en Render, desplázate a la sección **Environment**
2. Haz clic en **Add Environment Variable** para cada variable abajo
3. Completa los valores (ver tabla)

| Variable      | Valor de Ejemplo         | Descripción                                    |
| ------------- | ------------------------ | ---------------------------------------------- |
| `NODE_ENV`    | `production`             | Entorno de Node                                |
| `PORT`        | `3000`                   | Puerto de la aplicación                        |
| `DB_HOST`     | (del Paso 3.2)           | Host de la URL interna de PostgreSQL en Render |
| `DB_PORT`     | `5432`                   | Puerto de PostgreSQL                           |
| `DB_USERNAME` | `postgres`               | Usuario de PostgreSQL                          |
| `DB_PASSWORD` | (del Paso 3.2)           | Contraseña de PostgreSQL                       |
| `DB_DATABASE` | `backlog_pro`            | Nombre de la base de datos                     |
| `DB_SSL`      | `true`                   | Habilitar SSL para conexión a base de datos    |
| `JWT_SECRET`  | (generar secret fuerte)  | Secret para firmar JWT                         |

### 5.2 Generar JWT_SECRET

Genera una cadena aleatoria segura (mínimo 32 caracteres):

**Opción 1: Usando Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Opción 2: Usando OpenSSL**

```bash
openssl rand -hex 32
```

**Opción 3: Generador en Línea** (menos seguro para producción)
Usa un generador de cadenas aleatorias en línea y copia una cadena hex de 32+ caracteres.

Copia la cadena generada y pégala en Render como el valor de `JWT_SECRET`.

### 5.3 Cadena de Conexión a Base de Datos (Alternativa)

Si tu PostgreSQL en Render proporciona una variable de entorno `DATABASE_URL`, puedes usar:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/backlog_pro
```

La aplicación usará esto si está disponible, de lo contrario usará las variables individuales `DB_*`.

---

## Paso 6: Verificar Despliegue

### 6.1 Monitorear Logs de Despliegue

1. En el dashboard del servicio en Render, haz clic en la pestaña **Logs**
2. Observa los mensajes de inicio
3. Deberías ver:
   ```
   TypeORM connected to PostgreSQL
   GraphQL server running on port 3000
   ```

### 6.2 Probar Endpoint de GraphQL

Una vez que se complete el despliegue:

1. Obtén la URL de tu servicio desde Render (formato: `https://backlog-pro-backend-xxxx.onrender.com`)
2. Abre en el navegador: `https://backlog-pro-backend-xxxx.onrender.com/graphql`
3. Apollo Sandbox debería cargar
4. Intenta una consulta simple:
   ```graphql
   query {
     __typename
   }
   ```

### 6.3 Verificar Conexión a Base de Datos

En Apollo Sandbox, ejecuta:

```graphql
query {
  health {
    status
    database
  }
}
```

Si usas un endpoint de health (si está implementado), verifica que la respuesta indique que la base de datos está conectada.

### 6.4 Verificar Estado del Servicio

- Marca de verificación verde en el dashboard de Render = servicio está corriendo
- Los logs no muestran errores
- El endpoint de GraphQL responde

✅ **¡Despliegue exitoso!**

---

## Solución de Problemas

### Problema: "Image pull failed" o "Cannot connect to DockerHub"

**Causa:** Credenciales inválidas de DockerHub o URL de imagen incorrecta

**Solución:**

1. Verifica que el secret `DOCKERHUB_USERNAME` en GitHub sea correcto
2. Verifica que la URL de imagen en Render sea: `USERNAME/backlog-pro-backend:latest`
3. Verifica que la imagen exista en DockerHub (ve a hub.docker.com/r/TU_USUARIO/backlog-pro-backend)
4. Re-ejecuta el workflow de GitHub Actions para republicar la imagen

**Comando para verificar localmente:**

```bash
docker pull tu-usuario/backlog-pro-backend:latest
```

---

### Problema: "Failed to connect to database" o "ECONNREFUSED"

**Causa:** Credenciales de base de datos incorrectas o URL de conexión incorrecta

**Solución:**

1. Verifica que `DB_HOST` sea la URL **interna** de PostgreSQL en Render (no la externa)
2. Verifica que `DB_PASSWORD`, `DB_USERNAME`, `DB_PORT` coincidan con la configuración de la base de datos en Render
3. Verifica que `DB_DATABASE` coincida con el nombre de la base de datos creada en Render
4. En el dashboard de Render, ve a tu servicio de base de datos PostgreSQL y confirma que está corriendo (estado verde)

**Prueba la conexión localmente:**

```bash
psql -h TU_DB_HOST -U postgres -d backlog_pro -W
# Ingresa la contraseña cuando se solicite
# Si aparece el prompt, la conexión es válida
```

---

### Problema: "Service keeps crashing" o "Deployment never completes"

**Causa:** Error en la aplicación durante el inicio

**Solución:**

1. Haz clic en **Logs** en el dashboard del servicio en Render
2. Busca mensajes de error
3. Causas comunes:
   - Variables de entorno faltantes → Agrega todas las variables del Paso 5.1
   - Migración de base de datos falló → Ejecuta migraciones manualmente o verifica el estado de la BD
   - Puerto ya en uso → Verifica que PORT=3000 esté configurado
   - Versión de Node incorrecta → Asegúrate de que `package.json` use Node 18+

**Para ejecutar migraciones manualmente en Render:**

Si tienes acceso a shell del servicio, ejecuta:

```bash
npm run migration:run
```

O reconstruye el servicio:

```bash
# En el dashboard de Render, haz clic en "Clear Build Cache" luego "Trigger Redeploy"
```

---

### Problema: "Health check failing"

**Causa:** El endpoint de GraphQL no responde o el servicio no está saludable

**Solución:**

1. Verifica que la aplicación esté corriendo: Revisa los logs para mensajes de inicio
2. Verifica que el puerto sea correcto: Debe ser 3000
3. Verifica que la ruta del health check sea correcta: Debe ser `/graphql` o `/health`
4. Prueba manualmente: Abre el endpoint de GraphQL en el navegador
5. Si sigue fallando, aumenta el timeout en la configuración del health check de Render (10s → 30s)

---

### Problema: "JWT_SECRET not set" o "Authentication failing"

**Causa:** Variable de entorno JWT_SECRET faltante

**Solución:**

1. Genera un nuevo secret (ver Paso 5.2)
2. Agrega la variable de entorno `JWT_SECRET` en Render
3. Reinicia el servicio (o dispara un redeploy manual)

---

### Problema: "Port already in use" o "Cannot bind to port 3000"

**Causa:** Otro proceso usando el puerto 3000, o variable de entorno PORT incorrecta

**Solución:**

1. Verifica que la variable de entorno `PORT` esté configurada a `3000`
2. Verifica que ningún otro servicio esté usando el puerto 3000
3. Reinicia el servicio en el dashboard de Render

---

## Actualizar la Aplicación

### Flujo de Trabajo para Desplegar Actualizaciones

1. **Realiza cambios de código** en tu repositorio local
2. **Actualiza la versión** en `package.json` (opcional pero recomendado):
   ```bash
   npm version patch  # Cambia 1.0.0 → 1.0.1
   ```
3. **Commit y push** a la rama `main`:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
4. **GitHub Actions se ejecuta** automáticamente:
   - Ejecuta pruebas
   - Construye imagen Docker
   - Publica en DockerHub con nueva etiqueta
5. **Render se redespliega automáticamente** (si está habilitado):
   - Descarga la nueva imagen
   - Detiene el contenedor antiguo
   - Inicia el nuevo contenedor
   - Ejecuta health check

### Redeploy Manual en Render

Si auto-deploy está deshabilitado o quieres forzar un redeploy:

1. Ve al dashboard del servicio en Render
2. Haz clic en el botón **Manual Redeploy**
3. Render descargará la última imagen `:latest` y reiniciará

---

## Migraciones de Base de Datos en Render

Si necesitas ejecutar migraciones en la base de datos de producción:

### Opción 1: Comandos Únicos

Render permite ejecutar comandos únicos en un servicio. Desde el dashboard de Render:

1. Haz clic en la pestaña **Shell** en tu servicio
2. Ejecuta:
   ```bash
   npm run migration:run
   ```

### Opción 2: Vía Docker Localmente (más seguro)

Ejecuta migraciones contra la base de datos de Render desde tu máquina local:

```bash
# Configura el entorno para apuntar a la base de datos de Render
export DB_HOST=tu-host-render-db.onrender.com
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=tu-contraseña-render
export DB_DATABASE=backlog_pro
export DB_SSL=true

# Ejecuta migraciones
npm run migration:run
```

⚠️ **¡Siempre haz backup de tu base de datos antes de ejecutar migraciones en producción!**

---

## Escalado y Consejos de Rendimiento

1. **Plan de Base de Datos:** Comienza con Free, actualiza a Starter o Standard conforme crece el tráfico
2. **Plan de Servicio:** El tier gratuito de Render incluye 750 horas de cómputo/mes. Actualiza a pago para producción
3. **Connection Pooling:** TypeORM está configurado con connection pooling
4. **Caching:** Considera Redis para caching (agrega como otro servicio en Render)
5. **Monitoreo:** Habilita métricas de Render para monitorear CPU, memoria y uso de disco

---

## Mejores Prácticas de Seguridad

1. ✅ Usa variables de entorno para todos los secrets (nunca hardcodees)
2. ✅ Habilita DB_SSL=true para conexiones encriptadas a la base de datos
3. ✅ Usa JWT_SECRET fuerte (32+ caracteres, aleatorio)
4. ✅ Mantén el token de DockerHub seguro (usa GitHub Secrets)
5. ✅ No hagas commit de archivos `.env` a Git
6. ✅ Rota regularmente JWT_SECRET y DB_PASSWORD
7. ✅ Usa HTTPS para tu dominio en Render (Render proporciona SSL gratuito)
8. ✅ Habilita rate limiting si manejas alto tráfico

---

## Soporte y Recursos Adicionales

- **Documentación de Render:** https://render.com/docs
- **PostgreSQL en Render:** https://render.com/docs/databases
- **Docker en Render:** https://render.com/docs/docker
- **Docker Hub:** https://hub.docker.com
- **GitHub Actions:** https://docs.github.com/en/actions
- **Repositorio del Proyecto:** https://github.com/eviordevelopments/backlog-pro-backend

---

**Última Actualización:** 26 de Noviembre de 2025
