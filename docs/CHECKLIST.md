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
  - [ ] Configuración de base de datos (DB_HOST, DB_PORT, etc.)
  - [ ] Configuración de JWT

## Docker Setup

- [ ] Archivo `.env.local` creado desde `.env.example`
- [ ] Variables de entorno configuradas en `.env.local`:
  - [ ] Configuración de base de datos (DB_HOST, DB_PORT, etc.)
  - [ ] Configuración de JWT
- [ ] Servicios iniciados: `npm run docker:up`
- [ ] Todos los contenedores corriendo: `npm run docker:status`
- [ ] App container: ✅ healthy
- [ ] PostgreSQL container: ✅ healthy
- [ ] Adminer container

## Verificación de Servicios

### App (NestJS)
- [ ] Accesible en http://localhost:3000
- [ ] Health endpoint responde: http://localhost:3000/graphql/health
- [ ] Apollo Server accesible: http://localhost:3000/graphql
- [ ] Logs sin errores

### App (NestJS) desde Docker
- [ ] Accesible en http://localhost:3001
- [ ] Health endpoint responde: http://localhost:3001/graphql/health
- [ ] Apollo Server accesible: http://localhost:3001/graphql
- [ ] Logs sin errores: `npm run docker:logs`

### PostgreSQL
- [ ] Puerto 5432 accesible
- [ ] Conexión exitosa: `psql -U postgres -d backlog_pro` o `npm run docker:db`
- [ ] Base de datos `backlog_pro` existe

## Tests y Validación

- [ ] Tests unitarios pasan: `npm run test`
- [ ] Linting sin errores: `npm run lint`
- [ ] Build exitoso: `npm run build`
- [ ] Formato correcto: `npm run format`

## Funcionalidad

- [ ] Hot reload funciona (edita un archivo y verifica que se recarga)
- [ ] Apollo Server muestra el schema
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
- [ ] docs/ENVIRONMENTS.md consultado
- [ ] docs/DOCKER_ARCHITECTURE.md entendido

## Próximos Pasos

Una vez completado el checklist:

1. [ ] Explorar Apollo Server
2. [ ] Revisar estructura del proyecto
3. [ ] Leer especificaciones en `.kiro/specs/`

## Soporte

Si encuentras problemas:

1. Revisa [SETUP.md](SETUP.md) - Troubleshooting
2. Verifica logs: `npm run docker:logs`
3. Limpia y reinicia: `npm run docker:clean && npm run docker:up`
4. Consulta la documentación de NestJS o Docker

---

**¿Todo listo?** 🚀

Si todos los checkboxes están marcados, ¡estás listo para desarrollar!
