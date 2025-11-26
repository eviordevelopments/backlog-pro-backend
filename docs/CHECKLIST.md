# Setup Checklist ✅

Usa este checklist para verificar que tu entorno de desarrollo está correctamente configurado.

## Pre-requisitos

- [ ] Docker Desktop instalado y corriendo
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Docker y Docker Compose instalados

## Configuración Inicial

- [ ] Repositorio clonado
- [ ] Archivo `.env` creado desde `.env.example`
- [ ] Variables de entorno configuradas en `.env`:
  - [ ] `JWT_SECRET`
  - [ ] Configuración de base de datos (DB_HOST, DB_PORT, etc.)

## Docker Setup

- [ ] Servicios iniciados: `npm run docker:up`
- [ ] Todos los contenedores corriendo: `npm run docker:status`
- [ ] App container: ✅ healthy
- [ ] PostgreSQL container: ✅ healthy

## Verificación de Servicios

### App (NestJS)
- [ ] Accesible en http://localhost:3000
- [ ] Health endpoint responde: http://localhost:3000/health
- [ ] GraphQL Playground accesible: http://localhost:3000/graphql
- [ ] Logs sin errores: `npm run docker:logs`

### PostgreSQL
- [ ] Puerto 5432 accesible
- [ ] Conexión exitosa: `npm run docker:db`
- [ ] Base de datos `platform_management` existe

## Tests y Validación

- [ ] Tests unitarios pasan: `npm run docker:test`
- [ ] Linting sin errores: `docker-compose exec app npm run lint`
- [ ] Build exitoso: `docker-compose exec app npm run build`
- [ ] Formato correcto: `docker-compose exec app npm run format`

## Funcionalidad

- [ ] Hot reload funciona (edita un archivo y verifica que se recarga)
- [ ] GraphQL Playground muestra el schema
- [ ] Queries GraphQL funcionan
- [ ] Logs se muestran correctamente

## Desarrollo

- [ ] Editor configurado con ESLint y Prettier
- [ ] Git configurado correctamente
- [ ] `.gitignore` funcionando (node_modules, dist, .env no se commitean)
- [ ] Scripts npm funcionan:
  - [ ] `npm run docker:up`
  - [ ] `npm run docker:logs`
  - [ ] `npm run docker:status`

## Documentación

- [ ] README.md leído
- [ ] docs/SETUP.md revisado
- [ ] docs/DOCKER.md consultado
- [ ] docs/DOCKER_ARCHITECTURE.md entendido

## Troubleshooting Común

Si algo no funciona, verifica:

### Puerto 3000 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - '3001:3000'
```

### Contenedores no inician
```bash
# Ver logs
npm run docker:logs

# Reiniciar
npm run docker:restart

# Reconstruir
npm run docker:build
```

### Base de datos no conecta
```bash
# Verificar variables
docker-compose exec app env | grep DB_

# Verificar PostgreSQL
docker-compose logs postgres
```

### Hot reload no funciona
```bash
# Reiniciar app
npm run docker:restart

# Verificar volúmenes
docker-compose config
```

## Comandos de Verificación Rápida

Ejecuta estos comandos para verificar todo:

```bash
# 1. Estado de servicios
npm run docker:status

# 2. Health check
curl http://localhost:3000/health

# 3. GraphQL
curl http://localhost:3000/graphql

# 4. PostgreSQL
npm run docker:db
# Luego ejecuta: SELECT version();

# 5. Tests
npm run docker:test

# 7. Logs
npm run docker:logs
```

## Resultado Esperado

Si todo está correcto, deberías ver:

✅ 2 contenedores corriendo (app, postgres)  
✅ Health endpoint: `{"status":"ok","timestamp":"..."}`  
✅ GraphQL Playground cargando  
✅ PostgreSQL: `PostgreSQL 15.x on ...`  
✅ Tests: `2 passed, 2 total`  
✅ Logs sin errores críticos  

## Próximos Pasos

Una vez completado el checklist:

1. [ ] Explorar GraphQL Playground
2. [ ] Revisar estructura del proyecto
3. [ ] Leer especificaciones en `.kiro/specs/`
4. [ ] Comenzar con la tarea 2: Configuración de base de datos

## Soporte

Si encuentras problemas:

1. Revisa [DOCKER.md](DOCKER.md) - Troubleshooting
2. Verifica logs: `npm run docker:logs`
3. Limpia y reinicia: `npm run docker:clean && npm run docker:up`
4. Consulta la documentación de NestJS o Docker

---

**¿Todo listo?** 🚀

Si todos los checkboxes están marcados, ¡estás listo para desarrollar!
