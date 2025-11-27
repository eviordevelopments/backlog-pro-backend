# Requirements Document

## Introduction

Sistema backend para plataforma de gestión de equipos de desarrollo que permite administrar proyectos, sprints, tareas, métricas y finanzas. La plataforma utiliza metodologías ágiles (SCRUM, Kanban, etc.) y proporciona seguimiento en tiempo real del progreso, métricas de rendimiento y reportes financieros automatizados.

## Glossary

- **Sistema**: API backend GraphQL construida con NestJS, TypeScript, PostgreSQL y TypeORM
- **Usuario**: Miembro del equipo de desarrollo con acceso a la plataforma
- **Proyecto**: Iniciativa de desarrollo con presupuesto, equipo asignado y metodología definida
- **Sprint**: Período de tiempo definido dentro de un proyecto para completar un conjunto de tareas
- **Tarea**: Unidad de trabajo asignable con estimación de horas y story points
- **Métrica**: Indicador calculado en tiempo real sobre rendimiento del equipo o proyecto
- **Cliente**: Entidad externa que contrata proyectos
- **Miembro de Proyecto**: Relación entre un usuario y un proyecto con rol específico
- **Entrada de Tiempo**: Registro de horas trabajadas por un usuario en una tarea específica
- **JWT**: Sistema de autenticación basado en tokens JWT generados localmente

## Requirements

### Requirement 1: Autenticación y Gestión de Usuarios

**User Story:** Como usuario de la organización, quiero registrarme y autenticarme en la plataforma, para que pueda acceder de forma segura a las funcionalidades del sistema.

#### Acceptance Criteria

1. WHEN un usuario se registra con email y contraseña, THEN el Sistema SHALL crear una cuenta en la base de datos y enviar un email de verificación
2. WHEN un usuario inicia sesión con credenciales válidas, THEN el Sistema SHALL validar las credenciales contra la base de datos, generar un JWT token y retornar los datos del perfil del usuario
3. WHEN un usuario intenta acceder sin autenticación, THEN el Sistema SHALL rechazar la petición con error 401 Unauthorized
4. WHEN un usuario verifica su email mediante el link enviado, THEN el Sistema SHALL activar la cuenta y permitir el acceso completo
5. WHEN un usuario solicita recuperación de contraseña, THEN el Sistema SHALL generar un token de reseteo, almacenarlo en la base de datos y enviar un email con link de reseteo

### Requirement 2: Gestión de Perfil de Usuario

**User Story:** Como usuario autenticado, quiero gestionar mi perfil personal, para que pueda mantener actualizada mi información profesional.

#### Acceptance Criteria

1. WHEN un usuario consulta su perfil, THEN el Sistema SHALL retornar nombre, email, avatar, skills y hourly_rate del usuario autenticado
2. WHEN un usuario actualiza su propio perfil, THEN el Sistema SHALL validar los datos y persistir los cambios en la base de datos
3. WHEN un usuario intenta modificar el perfil de otro usuario, THEN el Sistema SHALL rechazar la operación con error 403 Forbidden
4. WHEN un usuario actualiza su avatar, THEN el Sistema SHALL validar el formato de imagen y almacenar la URL
5. WHEN un usuario consulta sus horas trabajadas, THEN el Sistema SHALL retornar el total de horas agrupadas por proyecto y período

### Requirement 3: Gestión de Proyectos

**User Story:** Como miembro del equipo, quiero crear y gestionar proyectos, para que pueda organizar el trabajo de desarrollo.

#### Acceptance Criteria

1. WHEN un usuario crea un proyecto con nombre y cliente, THEN el Sistema SHALL validar los datos requeridos y crear el proyecto con estado "planning"
2. WHEN un usuario asigna miembros a un proyecto, THEN el Sistema SHALL crear las relaciones ProjectMember con roles específicos
3. WHEN un usuario actualiza el presupuesto de un proyecto, THEN el Sistema SHALL validar que sea un número positivo y actualizar el valor
4. WHEN un usuario consulta un proyecto, THEN el Sistema SHALL retornar todos los datos incluyendo miembros asignados, progreso y gastos
5. WHEN un usuario elimina un proyecto, THEN el Sistema SHALL realizar soft delete marcando deleted_at sin eliminar físicamente el registro
6. WHEN un usuario consulta proyectos, THEN el Sistema SHALL retornar solo proyectos no eliminados ordenados por fecha de creación

### Requirement 4: Gestión de Sprints

**User Story:** Como miembro del equipo, quiero crear y gestionar sprints dentro de proyectos, para que pueda organizar el trabajo en iteraciones.

#### Acceptance Criteria

1. WHEN un usuario crea un sprint con nombre, proyecto, fechas de inicio y fin, THEN el Sistema SHALL validar que las fechas sean coherentes y crear el sprint con estado "planning"
2. WHEN un usuario extiende la fecha de fin de un sprint activo, THEN el Sistema SHALL validar que la nueva fecha sea posterior a la actual y actualizar el sprint
3. WHEN un usuario completa un sprint, THEN el Sistema SHALL cambiar el estado a "completed" y calcular la velocidad basada en story points completados
4. WHEN un usuario registra notas de retrospectiva, THEN el Sistema SHALL almacenar las notas y la fecha de retrospectiva
5. WHEN un usuario consulta sprints de un proyecto, THEN el Sistema SHALL retornar todos los sprints con sus métricas calculadas

### Requirement 5: Gestión de Tareas

**User Story:** Como miembro del equipo, quiero crear y gestionar tareas, para que pueda organizar y trackear el trabajo específico.

#### Acceptance Criteria

1. WHEN un usuario crea una tarea con título y proyecto, THEN el Sistema SHALL validar los datos requeridos y crear la tarea con estado "todo"
2. WHEN un usuario asigna una tarea a un miembro del proyecto, THEN el Sistema SHALL validar que el usuario pertenezca al proyecto y crear la asignación
3. WHEN un usuario actualiza el estado de una tarea, THEN el Sistema SHALL validar que el estado sea válido y actualizar la tarea
4. WHEN un usuario registra horas trabajadas en una tarea, THEN el Sistema SHALL crear una entrada de tiempo y actualizar actual_hours de la tarea
5. WHEN un usuario crea subtareas, THEN el Sistema SHALL almacenar las subtareas como array embebido en la tarea principal
6. WHEN un usuario define dependencias entre tareas, THEN el Sistema SHALL validar que no existan ciclos y almacenar las referencias
7. WHEN un usuario consulta tareas de un sprint, THEN el Sistema SHALL retornar todas las tareas con sus asignaciones y progreso

### Requirement 6: Cálculo de Métricas en Tiempo Real

**User Story:** Como miembro del equipo, quiero visualizar métricas de rendimiento en tiempo real, para que pueda monitorear el progreso y tomar decisiones.

#### Acceptance Criteria

1. WHEN un usuario consulta métricas de un sprint, THEN el Sistema SHALL calcular velocidad, story points committed, story points completed y tiempo de ciclo
2. WHEN un usuario consulta métricas de un proyecto, THEN el Sistema SHALL calcular progreso, presupuesto gastado, eficiencia y bugs por sprint
3. WHEN un usuario consulta el dashboard general, THEN el Sistema SHALL retornar métricas agregadas de todos los proyectos activos
4. WHEN se actualiza una tarea o sprint, THEN el Sistema SHALL recalcular las métricas afectadas inmediatamente
5. WHEN un usuario consulta métricas históricas, THEN el Sistema SHALL retornar datos agrupados por período especificado

### Requirement 7: Gestión Financiera y Reportes

**User Story:** Como miembro del equipo, quiero gestionar transacciones financieras y generar reportes, para que pueda controlar el presupuesto y calcular salarios.

#### Acceptance Criteria

1. WHEN un usuario crea una transacción, THEN el Sistema SHALL validar tipo, categoría y monto, y actualizar el campo spent del proyecto relacionado
2. WHEN un usuario genera un reporte de salarios de un proyecto, THEN el Sistema SHALL calcular la tasa hora ideal dividiendo presupuesto entre horas totales del equipo
3. WHEN el Sistema calcula salarios individuales, THEN el Sistema SHALL multiplicar las horas trabajadas de cada usuario por la tasa hora ideal
4. WHEN un usuario solicita exportar un reporte a PDF, THEN el Sistema SHALL generar el documento con todos los datos financieros del proyecto
5. WHEN un usuario consulta gastos de un proyecto, THEN el Sistema SHALL retornar todas las transacciones y expenses agrupadas por categoría
6. WHEN un usuario crea una factura, THEN el Sistema SHALL validar los datos requeridos y calcular el total sumando amount y tax

### Requirement 8: Gestión de Clientes

**User Story:** Como miembro del equipo, quiero gestionar información de clientes, para que pueda mantener registro de las entidades que contratan proyectos.

#### Acceptance Criteria

1. WHEN un usuario crea un cliente con nombre, THEN el Sistema SHALL validar los datos y crear el cliente con estado "active"
2. WHEN un usuario actualiza métricas de cliente (LTV, CAC, MRR), THEN el Sistema SHALL validar que sean números no negativos y actualizar los valores
3. WHEN un usuario consulta proyectos de un cliente, THEN el Sistema SHALL retornar todos los proyectos asociados al client_id
4. WHEN un usuario elimina un cliente, THEN el Sistema SHALL realizar soft delete y validar que no tenga proyectos activos

### Requirement 9: Gestión de Reuniones

**User Story:** Como miembro del equipo, quiero programar y registrar reuniones, para que pueda organizar ceremonias ágiles y reuniones de equipo.

#### Acceptance Criteria

1. WHEN un usuario crea una reunión con título, tipo y fecha, THEN el Sistema SHALL validar los datos requeridos y crear la reunión con estado "scheduled"
2. WHEN un usuario registra asistencia a una reunión, THEN el Sistema SHALL actualizar el array de attendance con el user_id y estado de asistencia
3. WHEN un usuario crea una reunión recurrente, THEN el Sistema SHALL almacenar el patrón de recurrencia para futuras instancias
4. WHEN un usuario consulta reuniones de un sprint, THEN el Sistema SHALL retornar todas las reuniones asociadas al sprint_id

### Requirement 10: Gestión de Objetivos

**User Story:** Como miembro del equipo, quiero definir y trackear objetivos, para que pueda medir el progreso hacia metas específicas.

#### Acceptance Criteria

1. WHEN un usuario crea un objetivo con título, tipo y valor objetivo, THEN el Sistema SHALL validar los datos requeridos y crear el objetivo con estado "active"
2. WHEN un usuario actualiza el valor actual de un objetivo, THEN el Sistema SHALL calcular el porcentaje de progreso automáticamente
3. WHEN un objetivo alcanza el target_value, THEN el Sistema SHALL cambiar el estado a "achieved" automáticamente
4. WHEN un objetivo supera su end_date sin alcanzar el target, THEN el Sistema SHALL cambiar el estado a "missed"

### Requirement 11: Gestión de Riesgos

**User Story:** Como miembro del equipo, quiero identificar y monitorear riesgos de proyectos, para que pueda mitigar problemas potenciales.

#### Acceptance Criteria

1. WHEN un usuario crea un riesgo con título, proyecto, categoría, probabilidad e impacto, THEN el Sistema SHALL validar los datos y crear el riesgo con estado "identified"
2. WHEN un usuario agrega comentarios a un riesgo, THEN el Sistema SHALL almacenar el comentario con user_id y timestamp en el array de comments
3. WHEN un usuario actualiza el estado de un riesgo a "resolved", THEN el Sistema SHALL registrar la fecha de resolución
4. WHEN un usuario consulta riesgos de un proyecto, THEN el Sistema SHALL retornar todos los riesgos ordenados por impacto y probabilidad

### Requirement 12: Gestión de Historias de Usuario

**User Story:** Como miembro del equipo, quiero crear y gestionar historias de usuario, para que pueda definir requisitos desde la perspectiva del usuario final.

#### Acceptance Criteria

1. WHEN un usuario crea una historia con proyecto, título, user_type, action y benefit, THEN el Sistema SHALL validar los datos requeridos y crear la historia con estado "backlog"
2. WHEN un usuario asigna una historia a un sprint, THEN el Sistema SHALL actualizar el sprint_id y cambiar el estado a "ready"
3. WHEN un usuario define criterios de aceptación, THEN el Sistema SHALL almacenar el array de acceptance_criteria
4. WHEN un usuario consulta el backlog de un proyecto, THEN el Sistema SHALL retornar todas las historias con estado "backlog" ordenadas por prioridad

### Requirement 13: Gestión de Feedback entre Usuarios

**User Story:** Como miembro del equipo, quiero dar y recibir feedback de otros miembros, para que pueda mejorar continuamente mi desempeño.

#### Acceptance Criteria

1. WHEN un usuario envía feedback a otro usuario con comentario, THEN el Sistema SHALL validar que ambos usuarios existan y crear el registro de feedback
2. WHEN un usuario marca feedback como anónimo, THEN el Sistema SHALL ocultar el from_user_id al destinatario
3. WHEN un usuario consulta feedback recibido, THEN el Sistema SHALL retornar todos los feedbacks donde to_user_id coincida con el usuario autenticado
4. WHEN un usuario consulta feedback de un sprint, THEN el Sistema SHALL retornar todos los feedbacks asociados al sprint_id

### Requirement 14: Sistema de Logros

**User Story:** Como miembro del equipo, quiero desbloquear logros basados en mi desempeño, para que pueda gamificar mi experiencia y motivarme.

#### Acceptance Criteria

1. WHEN el Sistema evalúa logros de un usuario, THEN el Sistema SHALL verificar los requisitos de cada logro contra las métricas del usuario
2. WHEN un usuario cumple los requisitos de un logro, THEN el Sistema SHALL crear una relación UserAchievement con la fecha de desbloqueo
3. WHEN un usuario consulta sus logros, THEN el Sistema SHALL retornar todos los logros desbloqueados con puntos totales acumulados
4. WHEN un usuario consulta logros disponibles, THEN el Sistema SHALL retornar todos los logros con indicador de desbloqueado o bloqueado

### Requirement 15: Tracking de Tiempo

**User Story:** Como miembro del equipo, quiero registrar el tiempo trabajado en tareas, para que el sistema pueda calcular métricas y salarios precisos.

#### Acceptance Criteria

1. WHEN un usuario registra una entrada de tiempo con tarea, horas y fecha, THEN el Sistema SHALL validar que el usuario esté asignado a la tarea y crear el registro
2. WHEN se crea una entrada de tiempo, THEN el Sistema SHALL actualizar el campo actual_hours de la tarea sumando las horas registradas
3. WHEN un usuario consulta sus entradas de tiempo, THEN el Sistema SHALL retornar todas las entradas agrupadas por proyecto y período
4. WHEN un usuario modifica una entrada de tiempo, THEN el Sistema SHALL recalcular el actual_hours de la tarea afectada
5. WHEN un usuario elimina una entrada de tiempo, THEN el Sistema SHALL realizar soft delete y recalcular el actual_hours de la tarea

### Requirement 16: Notificaciones del Sistema

**User Story:** Como usuario, quiero recibir notificaciones sobre eventos relevantes, para que pueda estar informado de cambios importantes.

#### Acceptance Criteria

1. WHEN ocurre un evento relevante (asignación de tarea, mención, deadline), THEN el Sistema SHALL crear una notificación para los usuarios afectados
2. WHEN un usuario consulta sus notificaciones, THEN el Sistema SHALL retornar todas las notificaciones no leídas ordenadas por fecha
3. WHEN un usuario marca una notificación como leída, THEN el Sistema SHALL actualizar el campo is_read a true
4. WHEN un usuario consulta notificaciones antiguas, THEN el Sistema SHALL retornar notificaciones con paginación

### Requirement 17: Validación de Integridad de Datos

**User Story:** Como sistema, quiero validar la integridad de los datos, para que se mantenga la consistencia en toda la base de datos.

#### Acceptance Criteria

1. WHEN se crea una relación entre entidades, THEN el Sistema SHALL validar que ambas entidades existan antes de crear la relación
2. WHEN se elimina una entidad con relaciones, THEN el Sistema SHALL realizar soft delete y mantener las relaciones intactas
3. WHEN se valida un Value Object, THEN el Sistema SHALL lanzar una excepción de dominio si los datos son inválidos
4. WHEN se detecta un ciclo en dependencias de tareas, THEN el Sistema SHALL rechazar la operación con error de validación

### Requirement 18: Manejo de Errores y Logging

**User Story:** Como desarrollador del sistema, quiero que los errores se manejen consistentemente y se registren, para que pueda diagnosticar problemas.

#### Acceptance Criteria

1. WHEN ocurre un error de dominio, THEN el Sistema SHALL lanzar una excepción de dominio con código único
2. WHEN ocurre un error en un handler, THEN el Sistema SHALL registrar el error con stack trace y contexto usando Logger de NestJS
3. WHEN un handler inicia una operación, THEN el Sistema SHALL registrar un log de nivel INFO con el nombre de la operación
4. WHEN un handler completa una operación exitosamente, THEN el Sistema SHALL registrar un log de nivel INFO con el resultado
5. WHEN se retorna un error al cliente, THEN el Sistema SHALL transformar excepciones de dominio a HttpException sin exponer stack traces

### Requirement 19: GraphQL API y Subscriptions

**User Story:** Como cliente frontend, quiero consumir una API GraphQL con subscriptions, para que pueda obtener datos eficientemente y recibir actualizaciones en tiempo real.

#### Acceptance Criteria

1. WHEN un cliente ejecuta una query GraphQL, THEN el Sistema SHALL resolver la query y retornar los datos solicitados en formato GraphQL
2. WHEN un cliente ejecuta una mutation GraphQL, THEN el Sistema SHALL ejecutar el comando correspondiente y retornar el resultado
3. WHEN un cliente se suscribe a métricas de un proyecto, THEN el Sistema SHALL enviar actualizaciones en tiempo real cuando cambien las métricas
4. WHEN un cliente se suscribe a cambios de tareas, THEN el Sistema SHALL notificar cuando se creen, actualicen o eliminen tareas
5. WHEN se genera documentación GraphQL, THEN el Sistema SHALL incluir descripciones de todos los tipos, queries, mutations y subscriptions

### Requirement 20: Configuración y Seguridad

**User Story:** Como administrador del sistema, quiero que la configuración sea segura y validada, para que el sistema opere correctamente en todos los entornos.

#### Acceptance Criteria

1. WHEN el Sistema inicia, THEN el Sistema SHALL validar todas las variables de entorno requeridas usando Joi schema
2. WHEN el Sistema inicia sin variables requeridas, THEN el Sistema SHALL fallar con mensaje de error descriptivo
3. WHEN un cliente hace una petición sin JWT válido, THEN el Sistema SHALL rechazar con error 401 Unauthorized
4. WHEN se exponen datos al cliente, THEN el Sistema SHALL usar DTOs de respuesta sin exponer datos sensibles de entidades
5. WHEN se almacenan secretos, THEN el Sistema SHALL usar variables de entorno sin hardcodear valores en el código
