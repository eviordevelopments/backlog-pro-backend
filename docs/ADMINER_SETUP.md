# Configuración de Adminer

Adminer es una herramienta web de código abierto para gestionar bases de datos. Permite visualizar, editar y ejecutar consultas SQL directamente desde el navegador.

## Acceso

Una vez que los contenedores estén corriendo, accede a Adminer en:

```
http://localhost:8080
```

## Credenciales de Conexión

Usa las siguientes credenciales para conectarte a la base de datos PostgreSQL:

- **Sistema**: PostgreSQL
- **Servidor**: `postgres` (nombre del servicio en Docker)
- **Usuario**: `postgres` (o el valor de `DB_USERNAME` en `.env.local`)
- **Contraseña**: `postgres` (o el valor de `DB_PASSWORD` en `.env.local`)
- **Base de datos**: `backlog_pro` (o el valor de `DB_DATABASE` en `.env.local`)

## Características

- **Visualizar tablas**: Explora la estructura de todas las tablas
- **Editar datos**: Modifica registros directamente desde la interfaz
- **Ejecutar SQL**: Escribe y ejecuta consultas SQL personalizadas
- **Exportar datos**: Descarga datos en diferentes formatos
- **Importar datos**: Carga datos desde archivos

## Iniciar los Contenedores

```bash
docker compose up
```

Adminer se iniciará automáticamente junto con PostgreSQL y la aplicación.

## Notas de Desarrollo

- Adminer solo está disponible en desarrollo (no incluido en `compose.production.yml`)
- El puerto 8080 debe estar disponible en tu máquina local
- Adminer se reinicia automáticamente si falla
- Depende de que PostgreSQL esté saludable antes de iniciar

## Solución de Problemas

Si no puedes acceder a Adminer:

1. Verifica que los contenedores estén corriendo:
   ```bash
   docker compose ps
   ```

2. Revisa los logs de Adminer:
   ```bash
   docker compose logs adminer
   ```

3. Asegúrate de que el puerto 8080 no esté en uso:
   ```bash
   # En Windows
   netstat -ano | findstr :8080
   
   # En macOS/Linux
   lsof -i :8080
   ```

4. Si el puerto está en uso, puedes cambiar el puerto en `compose.yml`:
   ```yaml
   ports:
     - '8081:8080'  # Accede en http://localhost:8081
   ```
