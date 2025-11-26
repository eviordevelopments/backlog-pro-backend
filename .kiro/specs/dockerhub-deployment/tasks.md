# Implementation Plan - GitHub Actions CI/CD & Render Deployment

- [x] 1. Crear workflow de GitHub Actions





  - Crear directorio `.github/workflows/`
  - Crear archivo `docker-publish.yml` con estructura básica del workflow
  - Configurar trigger en push a rama main
  - Configurar trigger manual (workflow_dispatch)
  - _Requirements: 1.1_

- [x] 2. Configurar checkout y setup en workflow



  - Agregar step de checkout del código
  - Agregar step de setup de Docker Buildx
  - Configurar QEMU para soporte multi-arquitectura
  - _Requirements: 1.2, 6.1_

- [x] 3. Implementar extracción de versión en workflow


  - Agregar step para leer version de package.json
  - Generar tags semánticos (X.Y.Z, X.Y, X, latest)
  - Exportar tags como output del step
  - _Requirements: 1.3, 4.1, 4.3, 4.5_

- [ ]* 3.1 Escribir property test para generación de tags
  - **Property 2: Versionado consistente con package.json**
  - **Property 10: Tags semánticos jerárquicos**
  - **Validates: Requirements 1.3, 4.3, 4.5**


- [x] 4. Agregar ejecución de tests en workflow

  - Agregar step de instalación de dependencias (npm ci)
  - Agregar step de ejecución de tests (npm test)
  - Configurar para que el workflow falle si los tests fallan
  - _Requirements: 7.1, 7.2, 7.4_

- [ ]* 4.1 Escribir property test para validación de tests
  - **Property 14: Tests ejecutados antes de build**
  - **Validates: Requirements 7.1, 7.2, 7.4**

- [x] 5. Implementar autenticación con DockerHub


  - Agregar step de login a DockerHub
  - Usar GitHub Secrets para DOCKERHUB_USERNAME y DOCKERHUB_TOKEN
  - Configurar manejo de errores si las credenciales fallan
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [ ]* 5.1 Escribir property test para autenticación
  - **Property 3: Autenticación con GitHub Secrets**
  - **Validates: Requirements 1.4, 2.3**

- [x] 6. Implementar build y push de imagen multi-arquitectura


  - Agregar step de build con Docker Buildx
  - Configurar platforms: linux/amd64, linux/arm64
  - Usar Dockerfile.prod como archivo de construcción
  - Aplicar todos los tags generados (version, major, major.minor, latest)
  - Configurar push automático a DockerHub
  - _Requirements: 1.2, 1.5, 1.6, 6.1, 6.2, 6.3_

- [ ]* 6.1 Escribir property test para build multi-arquitectura
  - **Property 1: Workflow usa Dockerfile.prod**
  - **Property 11: Build multi-arquitectura con Buildx**
  - **Property 12: Arquitecturas amd64 y arm64 incluidas**
  - **Validates: Requirements 1.2, 6.1, 6.2, 6.3**

- [x] 7. Agregar logs y outputs en workflow



  - Agregar step para mostrar tags generados
  - Agregar step para mostrar URL de DockerHub después del push
  - Configurar logs detallados para cada fase
  - _Requirements: 2.4, 2.5_

- [ ]* 7.1 Escribir property test para logs
  - **Property 6: Logs de progreso visibles**
  - **Property 7: URL de DockerHub en logs**
  - **Validates: Requirements 2.4, 2.5**

- [ ] 8. Verificar y optimizar Dockerfile.prod
  - Revisar Dockerfile.prod existente
  - Asegurar que solo incluye dependencias de producción
  - Verificar que el puerto 3000 está expuesto
  - Agregar health check si no existe
  - Optimizar layers para mejor caching
  - _Requirements: 3.4_

- [ ]* 8.1 Escribir property test para Dockerfile
  - **Property 8: Puerto 3000 expuesto**
  - **Validates: Requirements 3.4**

- [ ] 9. Crear documentación de GitHub Secrets
  - Crear archivo `docs/RENDER_DEPLOYMENT.md`
  - Documentar cómo crear cuenta de DockerHub
  - Documentar cómo generar access token de DockerHub
  - Documentar cómo configurar GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
  - Incluir screenshots o pasos detallados
  - _Requirements: 2.1, 8.1_

- [ ] 10. Crear documentación de Render
  - Documentar cómo crear cuenta de Render
  - Documentar cómo crear base de datos PostgreSQL en Render
  - Documentar cómo crear servicio Docker en Render
  - Documentar cómo configurar la imagen de DockerHub en Render
  - Documentar cómo configurar variables de entorno en Render
  - Incluir lista completa de variables de entorno necesarias
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 8.2, 8.3, 8.4_

- [ ] 11. Actualizar .env.example con variables de Render
  - Agregar comentarios explicando variables para Render
  - Incluir ejemplo de DB_HOST con URL interna de Render
  - Documentar DB_SSL=true para producción
  - _Requirements: 3.5_

- [ ] 12. Agregar sección de troubleshooting a documentación
  - Documentar problemas comunes de GitHub Actions
  - Documentar problemas comunes de DockerHub
  - Documentar problemas comunes de Render
  - Incluir soluciones para errores de autenticación
  - Incluir soluciones para errores de build
  - Incluir soluciones para errores de conexión a base de datos
  - _Requirements: 8.5_

- [ ] 13. Actualizar README.md principal
  - Agregar badge de GitHub Actions con status del workflow
  - Agregar sección sobre despliegue en Render
  - Agregar link a documentación de RENDER_DEPLOYMENT.md
  - Eliminar referencias a Supabase y Netlify
  - _Requirements: 8.5_

- [ ] 14. Checkpoint - Prueba del workflow localmente
  - Validar sintaxis YAML del workflow con GitHub CLI o herramientas online
  - Revisar que todos los steps están correctamente configurados
  - Verificar que los secretos necesarios están documentados
  - _Requirements: Todos_

- [ ] 15. Configurar GitHub Secrets en el repositorio
  - Ir a Settings > Secrets and variables > Actions en GitHub
  - Agregar secret DOCKERHUB_USERNAME
  - Agregar secret DOCKERHUB_TOKEN
  - Verificar que los secretos están configurados correctamente
  - _Requirements: 2.1, 2.2_

- [ ] 16. Hacer push a main para activar workflow
  - Actualizar version en package.json (ej: 1.0.0)
  - Commit y push a rama main
  - Verificar que el workflow se activa automáticamente
  - Monitorear logs en GitHub Actions
  - _Requirements: 1.1_

- [ ] 17. Verificar imagen en DockerHub
  - Ir a DockerHub y verificar que la imagen se subió
  - Verificar que todos los tags están presentes (version, major, major.minor, latest)
  - Verificar que ambas arquitecturas están en el manifest (amd64, arm64)
  - Descargar imagen localmente para probar
  - _Requirements: 1.5, 1.6, 4.3, 6.2, 6.3_

- [ ]* 17.1 Escribir property test para tags en imagen
  - **Property 4: Push tras autenticación exitosa**
  - **Property 5: Tag "latest" siempre presente**
  - **Validates: Requirements 1.5, 1.6**

- [ ] 18. Configurar PostgreSQL en Render
  - Crear nueva base de datos PostgreSQL en Render
  - Seleccionar región apropiada
  - Copiar URL interna de conexión
  - Verificar que la base de datos está activa
  - _Requirements: 3.3_

- [ ] 19. Configurar servicio Docker en Render
  - Crear nuevo servicio tipo "Docker" (no desde repositorio)
  - Configurar imagen: username/backlog-pro-backend:latest
  - Configurar puerto: 3000
  - Configurar health check path: /graphql
  - Habilitar auto-deploy
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 20. Configurar variables de entorno en Render
  - Agregar NODE_ENV=production
  - Agregar PORT=3000
  - Agregar DB_HOST (URL interna de PostgreSQL de Render)
  - Agregar DB_PORT=5432
  - Agregar DB_USERNAME (de Render)
  - Agregar DB_PASSWORD (de Render)
  - Agregar DB_DATABASE (de Render)
  - Agregar DB_SSL=true
  - Agregar JWT_SECRET (generar secreto fuerte)
  - _Requirements: 3.5_

- [ ]* 20.1 Escribir property test para variables de entorno
  - **Property 9: Aplicación inicia con variables de entorno de Render**
  - **Validates: Requirements 3.5**

- [ ] 21. Checkpoint - Verificar despliegue en Render
  - Esperar a que Render descargue y despliegue la imagen
  - Verificar logs de Render para confirmar que la aplicación inició
  - Verificar que la aplicación se conectó a PostgreSQL
  - Probar endpoint GraphQL en la URL de Render
  - _Requirements: Todos_

- [ ]* 21.1 Escribir property test para compatibilidad multi-arquitectura
  - **Property 13: Compatibilidad multi-arquitectura**
  - **Validates: Requirements 6.5**

- [ ] 22. Crear archivo docker-compose.public.yml (opcional)
  - Crear archivo simplificado para usuarios que quieran ejecutar localmente
  - Configurar servicio app usando imagen de DockerHub
  - Configurar servicio postgres con configuración básica
  - Incluir todas las variables de entorno necesarias con valores de ejemplo
  - Agregar comentarios explicativos
  - _Requirements: 5.3, 5.4_

- [ ] 23. Agregar ejemplos de uso a documentación
  - Documentar cómo hacer pull de la imagen desde DockerHub
  - Documentar cómo ejecutar la imagen localmente con docker run
  - Documentar cómo usar docker-compose.public.yml
  - Incluir ejemplos de comandos completos
  - _Requirements: 5.2, 5.3, 5.4_

- [ ] 24. Final checkpoint - Validación completa
  - Revisar toda la documentación para claridad y completitud
  - Hacer un cambio en el código y push a main
  - Verificar que el workflow se ejecuta correctamente
  - Verificar que Render despliega la nueva versión automáticamente
  - Probar la aplicación en Render end-to-end
  - Validar que no hay referencias a Supabase o Netlify en el proyecto
  - _Requirements: Todos_
