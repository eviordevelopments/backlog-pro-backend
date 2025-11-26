# Requirements Document

## Introduction

Este documento define los requisitos para implementar un sistema automatizado de CI/CD que construye y publica imágenes Docker del proyecto backlog-pro-backend a DockerHub usando GitHub Actions, y despliega la aplicación en Render con PostgreSQL como base de datos. El sistema elimina la dependencia de Supabase y Netlify, centralizando el despliegue en Render.

## Glossary

- **DockerHub**: Registro público de imágenes Docker donde se almacenan y distribuyen contenedores
- **GitHub Actions**: Sistema de CI/CD integrado en GitHub para automatizar workflows
- **Render**: Plataforma de hosting cloud para aplicaciones web y bases de datos
- **Sistema**: El conjunto de workflows, scripts, configuraciones y documentación para CI/CD y despliegue
- **Imagen de Producción**: Contenedor Docker optimizado construido con Dockerfile.prod
- **PostgreSQL**: Sistema de base de datos relacional que reemplaza Supabase
- **Workflow**: Archivo YAML que define un proceso automatizado en GitHub Actions
- **Versionado Semántico**: Sistema de numeración de versiones en formato MAJOR.MINOR.PATCH
- **Multi-arquitectura**: Soporte para diferentes arquitecturas de CPU (amd64, arm64)

## Requirements

### Requirement 1

**User Story:** Como desarrollador del proyecto, quiero que GitHub Actions publique automáticamente imágenes Docker a DockerHub cuando hago push a main, para que Render pueda desplegar la última versión automáticamente.

#### Acceptance Criteria

1. WHEN se hace push a la rama main THEN el Sistema SHALL activar el workflow de GitHub Actions automáticamente
2. WHEN el workflow se activa THEN el Sistema SHALL construir la imagen usando Dockerfile.prod
3. WHEN la imagen se construye exitosamente THEN el Sistema SHALL etiquetar la imagen con el número de versión del package.json
4. WHEN la imagen está etiquetada THEN el Sistema SHALL autenticar con DockerHub usando GitHub Secrets
5. WHEN la autenticación es exitosa THEN el Sistema SHALL subir la imagen al repositorio de DockerHub especificado
6. WHEN la imagen se sube a DockerHub THEN el Sistema SHALL etiquetar también con la etiqueta "latest" para que Render detecte la nueva versión

### Requirement 2

**User Story:** Como desarrollador, quiero configurar GitHub Actions con los secretos necesarios, para que el workflow pueda autenticarse y publicar imágenes automáticamente.

#### Acceptance Criteria

1. WHEN se configura el repositorio THEN el Sistema SHALL requerir GitHub Secrets para DOCKERHUB_USERNAME y DOCKERHUB_TOKEN
2. WHEN los secretos no están configurados THEN el Sistema SHALL fallar el workflow con un mensaje claro indicando los secretos faltantes
3. WHEN el workflow se ejecuta THEN el Sistema SHALL usar los secretos para autenticar con DockerHub de forma segura
4. WHEN el workflow se ejecuta THEN el Sistema SHALL mostrar el progreso de cada paso en los logs de GitHub Actions
5. WHEN la publicación finaliza exitosamente THEN el Sistema SHALL mostrar la URL de la imagen en DockerHub en los logs

### Requirement 3

**User Story:** Como administrador de Render, quiero configurar el servicio como "Docker" usando la imagen de DockerHub, para que Render use directamente el contenedor optimizado sin necesidad de reconstruir desde el código fuente.

#### Acceptance Criteria

1. WHEN se crea el servicio en Render THEN el Sistema SHALL configurarse como tipo "Docker" (no "Web Service" desde repositorio)
2. WHEN se configura la imagen THEN el Sistema SHALL apuntar a la imagen de DockerHub con formato username/backlog-pro-backend:latest
3. WHEN se configura la base de datos THEN el Sistema SHALL usar PostgreSQL nativo de Render en lugar de Supabase
4. WHEN la aplicación inicia en Render THEN el Sistema SHALL exponer el puerto 3000 para conexiones externas
5. WHEN se configuran las variables de entorno THEN el Sistema SHALL conectar correctamente con la base de datos PostgreSQL de Render usando la URL interna de Render

### Requirement 4

**User Story:** Como desarrollador, quiero versionar las imágenes Docker siguiendo semántica de versiones, para que los usuarios puedan elegir versiones específicas o la más reciente.

#### Acceptance Criteria

1. WHEN se publica una imagen THEN el Sistema SHALL usar el número de versión del package.json como etiqueta
2. WHEN se publica una imagen THEN el Sistema SHALL crear también la etiqueta "latest" apuntando a esa versión
3. WHEN se publica una versión mayor THEN el Sistema SHALL crear etiquetas adicionales para MAJOR y MAJOR.MINOR
4. WHEN un usuario consulta las etiquetas disponibles THEN el Sistema SHALL mostrar todas las versiones publicadas
5. WHEN se actualiza la versión en package.json THEN el Sistema SHALL detectar automáticamente el nuevo número de versión

### Requirement 5

**User Story:** Como administrador del proyecto, quiero documentar el proceso de publicación y uso de imágenes Docker, para que cualquier miembro del equipo pueda publicar o usar las imágenes.

#### Acceptance Criteria

1. WHEN se crea la documentación THEN el Sistema SHALL incluir instrucciones paso a paso para configurar DockerHub
2. WHEN se documenta el proceso de publicación THEN el Sistema SHALL explicar cómo ejecutar los scripts npm correspondientes
3. WHEN se documenta el uso THEN el Sistema SHALL proporcionar ejemplos de docker pull y docker run con todas las variables de entorno necesarias
4. WHEN se documenta el uso THEN el Sistema SHALL incluir un archivo docker-compose.yml de ejemplo para usuarios finales
5. WHEN se actualiza la documentación THEN el Sistema SHALL incluir troubleshooting para problemas comunes

### Requirement 6

**User Story:** Como desarrollador, quiero construir imágenes multi-arquitectura, para que la aplicación funcione en diferentes tipos de procesadores (Intel/AMD y ARM).

#### Acceptance Criteria

1. WHEN se construye la imagen THEN el Sistema SHALL usar Docker Buildx para soporte multi-arquitectura
2. WHEN se especifican las arquitecturas THEN el Sistema SHALL construir para linux/amd64 y linux/arm64
3. WHEN se publican imágenes multi-arquitectura THEN el Sistema SHALL crear un manifest que incluya ambas arquitecturas
4. WHEN un usuario descarga la imagen THEN el Sistema SHALL seleccionar automáticamente la arquitectura correcta para su sistema
5. WHEN se ejecuta en diferentes arquitecturas THEN el Sistema SHALL funcionar correctamente sin cambios de configuración

### Requirement 7

**User Story:** Como desarrollador, quiero que GitHub Actions valide la imagen antes de publicarla, para asegurar que funciona correctamente antes de distribuirla.

#### Acceptance Criteria

1. WHEN se construye la imagen en el workflow THEN el Sistema SHALL ejecutar tests automatizados
2. WHEN los tests pasan THEN el Sistema SHALL verificar que la imagen se construye sin errores
3. WHEN la validación falla THEN el Sistema SHALL cancelar el workflow y mostrar el error en GitHub Actions
4. WHEN la validación es exitosa THEN el Sistema SHALL continuar con la publicación a DockerHub
5. WHEN el workflow finaliza THEN el Sistema SHALL limpiar recursos temporales automáticamente

### Requirement 8

**User Story:** Como administrador del proyecto, quiero documentar el proceso de despliegue en Render usando Docker, para que cualquier miembro del equipo pueda configurar y desplegar la aplicación desde DockerHub.

#### Acceptance Criteria

1. WHEN se crea la documentación THEN el Sistema SHALL incluir instrucciones para configurar GitHub Secrets (DOCKERHUB_USERNAME y DOCKERHUB_TOKEN)
2. WHEN se documenta Render THEN el Sistema SHALL explicar cómo crear un servicio tipo "Docker" (no desde repositorio) y una base de datos PostgreSQL
3. WHEN se documenta la configuración THEN el Sistema SHALL incluir cómo configurar la imagen de DockerHub en Render
4. WHEN se documenta la base de datos THEN el Sistema SHALL incluir la configuración de variables de entorno usando la URL interna de PostgreSQL de Render
5. WHEN se actualiza la documentación THEN el Sistema SHALL eliminar todas las referencias a Supabase y Netlify
