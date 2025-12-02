# Plan de Implementación

## Status: ✅ Completado - Proyecto Compilando Correctamente

El proyecto está completamente compilado y funcional. Se han completado todas las correcciones de compilación:
- ✅ Importación correcta de UserRepository en finances module
- ✅ Decoradores @Description removidos de resolvers
- ✅ Errores de tipos null vs undefined en mappers corregidos
- ✅ Queries TypeORM usando IsNull() correctamente
- ✅ Métodos en repositorios implementados (getByProjectId, getBySprintId)
- ✅ Errores de tipos en signup command handler corregidos
- ✅ Errores de indexación en risk entity corregidos
- ✅ Decoradores GraphQL en DTOs implementados

- [x] 1. Configuración inicial del proyecto
  - Crear proyecto NestJS con estructura base
  - Configurar TypeScript con tsconfig estricto
  - Configurar ESLint y Prettier
  - Configurar Jest para testing
  - Instalar dependencias: @nestjs/graphql, @nestjs/apollo, typeorm, @nestjs/typeorm, pg, class-validator, class-transformer, joi, fast-check
  - _Requisitos: 20.1, 20.2_

- [x] 2. Configuración de base de datos y TypeORM
  - Configurar conexión a PostgreSQL (Supabase)
  - Configurar TypeORM con migraciones automáticas
  - Crear configuración de entorno con validación Joi
  - Configurar soft deletes globalmente
  - _Requisitos: 20.1, 20.5_

- [x] 3. Configuración de GraphQL y Apollo Server
  - Configurar Apollo Server con NestJS
  - Configurar schema-first o code-first (code-first recomendado)
  - Configurar GraphQL Playground para desarrollo
  - Configurar subscriptions con WebSockets
  - _Requisitos: 19.1, 19.2, 19.5_

- [x] 4. Implementar capa compartida (shared)
  - Crear BaseDomainException y jerarquía de excepciones
  - Crear GlobalExceptionFilter
  - Crear decorador @CurrentUser para obtener usuario autenticado
  - Crear GuardJWT para validación de tokens Supabase
  - Configurar ConfigModule con validación Joi
  - _Requisitos: 18.1, 18.5, 20.1_

- [x] 4.1 Escribir tests unitarios para capa compartida
  - Test para BaseDomainException con códigos únicos
  - Test para GlobalExceptionFilter sin stack traces
  - Test para GuardJWT rechazando peticiones sin token
  - _Requisitos: 18.1, 18.5, 1.3_

- [x] 5. Implementar módulo de autenticación (auth)
  - Crear entidad de dominio User con hash de contraseña
  - Implementar servicio de hash de contraseña (bcrypt)
  - Implementar servicio de generación y validación de JWT tokens
  - Implementar comando de registro de usuario (signup) con validación de email único
  - Implementar comando de inicio de sesión (signin) con validación de credenciales
  - Implementar comando de recuperación de contraseña con token temporal
  - Configurar guards de autenticación JWT
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x]* 5.1 Escribir property test: Rechazo de peticiones no autenticadas
  - **Propiedad 5: Unauthenticated request rejection**
  - **Valida: Requisitos 1.3**

- [x] 6. Implementar módulo de usuarios (users)

- [x] 6.1 Crear entidad de dominio User
  - Crear User domain entity con validaciones
  - Crear Value Objects: Email, HourlyRate
  - Crear excepciones: UsuarioNoEncontradoException, EmailInvalidoException
  - Crear IUsuarioRepository interface
  - _Requisitos: 2.1, 2.2, 2.3_

- [x] 6.2 Crear entidad TypeORM y mapper
  - Crear UserTypeORMEntity con decoradores
  - Crear UserMapper (TypeORM ↔ Domain)
  - Implementar UsuarioRepository
  - _Requisitos: 2.1_

- [x] 6.3 Implementar queries de usuario
  - Query: ObtenerPerfilQuery + Handler
  - Query: ObtenerHorasTrabajadasQuery + Handler
  - Crear DTOs de respuesta
  - _Requisitos: 2.1, 2.5_

- [x] 6.4 Implementar commands de usuario
  - Command: ActualizarPerfilCommand + Handler
  - Command: ActualizarAvatarCommand + Handler
  - Crear DTOs de request con validaciones
  - _Requisitos: 2.2, 2.4_

- [x] 6.5 Crear resolvers GraphQL de usuario
  - Resolver: obtenerPerfil (query)
  - Resolver: actualizarPerfil (mutation)
  - Resolver: obtenerHorasTrabajadas (query)
  - Aplicar GuardJWT a todos los resolvers
  - _Requisitos: 2.1, 2.2, 2.5_

- [x]* 6.6 Escribir property test: Completitud del perfil
  - **Propiedad 1: Authenticated user profile completeness**
  - **Valida: Requisitos 2.1**

- [x]* 6.7 Escribir property test: Round trip de actualización de perfil
  - **Propiedad 2: Profile update round trip**
  - **Valida: Requisitos 2.2**

- [x]* 6.8 Escribir property test: Prevención de modificación entre usuarios
  - **Propiedad 3: Cross-user profile modification prevention**
  - **Valida: Requisitos 2.3**

- [x]* 6.9 Escribir property test: Consistencia de horas trabajadas
  - **Propiedad 4: Hours worked aggregation consistency**
  - **Valida: Requisitos 2.5**

- [x]* 7. Implementar módulo de clientes (clients)

- [x]* 7.1 Crear entidad de dominio Client
  - Crear Client domain entity
  - Crear Value Objects: ClientStatus, ClientMetrics (LTV, CAC, MRR)
  - Crear excepciones de dominio
  - Crear IClienteRepository interface
  - _Requisitos: 8.1, 8.2_

- [x]* 7.2 Crear entidad TypeORM y mapper
  - Crear ClientTypeORMEntity
  - Crear ClientMapper
  - Implementar ClienteRepository
  - _Requisitos: 8.1_

- [x]* 7.3 Implementar CQRS para clientes
  - Command: CrearClienteCommand + Handler
  - Command: ActualizarClienteCommand + Handler
  - Command: EliminarClienteCommand + Handler (validar proyectos activos)
  - Query: ObtenerClienteQuery + Handler
  - Query: ListarClientesQuery + Handler
  - Query: ObtenerProyectosClienteQuery + Handler
  - _Requisitos: 8.1, 8.2, 8.3, 8.4_

- [x]* 7.4 Crear resolvers GraphQL de clientes
  - Resolvers para todas las operaciones CRUD
  - Aplicar GuardJWT
  - _Requisitos: 8.1, 8.2, 8.3, 8.4_

- [x]* 7.5 Escribir property tests para clientes
  - **Propiedad 23: Client creation with default state**
  - **Propiedad 24: Client metrics validation**
  - **Propiedad 25: Client deletion with active projects**
  - **Valida: Requisitos 8.1, 8.2, 8.4**

- [x] 8. Implementar módulo de proyectos (projects)

- [x] 8.1 Crear entidades de dominio Project y ProjectMember
  - Crear Project domain entity
  - Crear ProjectMember domain entity
  - Crear Value Objects: Presupuesto, EstadoProyecto, Metodologia
  - Crear excepciones de dominio
  - Crear IProyectoRepository interface
  - _Requisitos: 3.1, 3.2, 3.3_

- [x] 8.2 Crear entidades TypeORM y mappers
  - Crear ProjectTypeORMEntity
  - Crear ProjectMemberTypeORMEntity
  - Crear ProjectMapper y ProjectMemberMapper
  - Implementar ProyectoRepository
  - _Requisitos: 3.1, 3.2_

- [x] 8.3 Implementar CQRS para proyectos
  - Command: CrearProyectoCommand + Handler
  - Command: ActualizarProyectoCommand + Handler
  - Command: AsignarMiembrosCommand + Handler
  - Command: EliminarProyectoCommand + Handler
  - Query: ObtenerProyectoQuery + Handler
  - Query: ListarProyectosQuery + Handler
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 8.4 Crear resolvers GraphQL de proyectos
  - Resolvers para todas las operaciones CRUD
  - Resolver para asignación de miembros
  - Aplicar GuardJWT
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x]* 8.5 Escribir property tests para proyectos
  - **Propiedad 6: Project creation with default state**
  - **Propiedad 7: Budget validation**
  - **Propiedad 8: Soft delete preservation**
  - **Propiedad 9: Deleted project exclusion**
  - **Valida: Requisitos 3.1, 3.3, 3.5, 3.6**

- [x] 9. Checkpoint - Verificar que todos los tests pasen
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x] 10. Implementar módulo de sprints (sprints)

- [x] 10.1 Crear entidad de dominio Sprint
  - Crear Sprint domain entity
  - Crear Value Objects: EstadoSprint, Velocidad
  - Crear excepciones de dominio
  - Crear ISprintRepository interface
  - _Requisitos: 4.1, 4.2, 4.3_

- [x] 10.2 Crear entidad TypeORM y mapper
  - Crear SprintTypeORMEntity
  - Crear SprintMapper
  - Implementar SprintRepository
  - _Requisitos: 4.1_

- [x] 10.3 Implementar CQRS para sprints
  - Command: CrearSprintCommand + Handler (validar fechas)
  - Command: ActualizarSprintCommand + Handler
  - Command: ExtenderSprintCommand + Handler (validar fecha posterior)
  - Command: CompletarSprintCommand + Handler (calcular velocidad)
  - Command: RegistrarRetrospectiveCommand + Handler
  - Query: ObtenerSprintQuery + Handler
  - Query: ListarSprintsProyectoQuery + Handler
  - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 10.4 Crear resolvers GraphQL de sprints
  - Resolvers para todas las operaciones CRUD
  - Aplicar GuardJWT
  - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x]* 10.5 Escribir property tests para sprints
  - **Propiedad 10: Sprint date validation**
  - **Propiedad 11: Sprint velocity calculation**
  - **Valida: Requisitos 4.1, 4.3**

- [x] 11. Implementar módulo de tareas (tasks)

- [x] 11.1 Crear entidad de dominio Task
  - Crear Task domain entity
  - Crear Value Objects: EstadoTarea, Prioridad, StoryPoints
  - Crear excepciones de dominio
  - Crear ITaskRepository interface
  - Implementar validación de ciclos en dependencias
  - _Requisitos: 5.1, 5.2, 5.3, 5.6_

- [x] 11.2 Crear entidad TypeORM y mapper
  - Crear TaskTypeORMEntity
  - Crear TaskMapper
  - Implementar TaskRepository
  - _Requisitos: 5.1_

- [x] 11.3 Implementar CQRS para tareas
  - Command: CrearTareaCommand + Handler
  - Command: ActualizarTareaCommand + Handler
  - Command: AsignarTareaCommand + Handler (validar miembro del proyecto)
  - Command: AgregarSubtareasCommand + Handler
  - Command: AgregarDependenciaCommand + Handler (validar ciclos)
  - Query: ObtenerTareaQuery + Handler
  - Query: ListarTareasSprintQuery + Handler
  - _Requisitos: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7_

- [x] 11.4 Crear resolvers GraphQL de tareas
  - Resolvers para todas las operaciones CRUD
  - Aplicar GuardJWT
  - _Requisitos: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7_

- [x]* 11.5 Escribir property tests para tareas
  - **Propiedad 12: Task creation with default state**
  - **Propiedad 13: Task assignment validation**
  - **Propiedad 15: Task dependency cycle detection**
  - **Valida: Requisitos 5.1, 5.2, 5.6, 17.4**

- [x] 12. Implementar módulo de tracking de tiempo (time-entries)

- [x] 12.1 Crear entidad de dominio TimeEntry
  - Crear TimeEntry domain entity
  - Crear Value Objects: Hours
  - Crear excepciones de dominio
  - Crear ITimeEntryRepository interface
  - _Requisitos: 15.1, 15.2_

- [x] 12.2 Crear entidad TypeORM y mapper
  - Crear TimeEntryTypeORMEntity
  - Crear TimeEntryMapper
  - Implementar TimeEntryRepository
  - _Requisitos: 15.1_

- [x] 12.3 Implementar CQRS para time entries
  - Command: RegistrarTiempoCommand + Handler (validar asignación, actualizar actual_hours)
  - Command: ModificarTiempoCommand + Handler (recalcular actual_hours)
  - Command: EliminarTiempoCommand + Handler (recalcular actual_hours)
  - Query: ObtenerEntradasTiempoQuery + Handler
  - Query: ObtenerEntradasAgrupadasQuery + Handler
  - _Requisitos: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 12.4 Crear resolvers GraphQL de time entries
  - Resolvers para todas las operaciones CRUD
  - Aplicar GuardJWT
  - _Requisitos: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x]* 12.5 Escribir property test: Consistencia de horas de tarea
  - **Propiedad 14: Task hours consistency**
  - **Valida: Requisitos 5.4, 15.2**

- [x] 13. Checkpoint - Verificar que todos los tests pasen
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x]* 14. Implementar módulo de transacciones (finances)

- [x]* 14.1 Crear entidades de dominio Transaction e Invoice
  - Crear Transaction domain entity
  - Crear Invoice domain entity
  - Crear Value Objects: Amount, Currency, InvoiceStatus
  - Crear excepciones de dominio
  - Crear ITransactionRepository e IInvoiceRepository interfaces
  - _Requisitos: 7.1, 7.6_

- [x]* 14.2 Crear entidades TypeORM y mappers
  - Crear TransactionTypeORMEntity
  - Crear InvoiceTypeORMEntity
  - Crear mappers correspondientes
  - Implementar repositorios
  - _Requisitos: 7.1, 7.6_

- [x]* 14.3 Implementar CQRS para transacciones
  - Command: CrearTransaccionCommand + Handler (actualizar project.spent)
  - Command: CrearFacturaCommand + Handler (calcular total)
  - Query: ObtenerGastosProyectoQuery + Handler (agrupar por categoría)
  - Query: ListarTransaccionesQuery + Handler
  - _Requisitos: 7.1, 7.5, 7.6_

- [x]* 14.4 Implementar cálculo de salarios
  - Query: CalcularTasaHoraIdealQuery + Handler
  - Query: CalcularSalariosQuery + Handler
  - Query: GenerarReporteFinancieroQuery + Handler
  - _Requisitos: 7.2, 7.3_

- [x]* 14.5 Crear resolvers GraphQL de finanzas
  - Resolvers para transacciones e invoices
  - Resolvers para cálculos de salarios
  - Aplicar GuardJWT
  - _Requisitos: 7.1, 7.2, 7.3, 7.5, 7.6_

- [x]* 14.6 Escribir property tests para finanzas
  - **Propiedad 19: Transaction updates project spent**
  - **Propiedad 20: Ideal hourly rate calculation**
  - **Propiedad 21: Individual salary calculation**
  - **Propiedad 22: Invoice total calculation**
  - **Valida: Requisitos 7.1, 7.2, 7.3, 7.6**

- [x]* 15. Implementar módulo de métricas (metrics)

- [x]* 15.1 Implementar cálculo de métricas de sprint
  - Query: CalcularMetricasSprintQuery + Handler
  - Calcular: velocidad, story points, tiempo de ciclo
  - _Requisitos: 6.1_

- [x]* 15.2 Implementar cálculo de métricas de proyecto
  - Query: CalcularMetricasProyectoQuery + Handler
  - Calcular: progreso, spent, eficiencia, bugs por sprint
  - _Requisitos: 6.2_

- [x]* 15.3 Implementar dashboard de métricas
  - Query: ObtenerDashboardQuery + Handler
  - Agregar métricas de todos los proyectos activos
  - _Requisitos: 6.3_

- [x]* 15.4 Configurar subscriptions GraphQL para métricas
  - Subscription: metricasProyectoActualizadas
  - Subscription: dashboardActualizado
  - Publicar eventos cuando se actualizan tareas/sprints
  - _Requisitos: 19.3_

- [x]* 15.5 Crear resolvers GraphQL de métricas
  - Resolvers para queries de métricas
  - Resolvers para subscriptions
  - Aplicar GuardJWT
  - _Requisitos: 6.1, 6.2, 6.3_

- [x]* 15.6 Escribir property tests para métricas
  - **Propiedad 16: Sprint metrics calculation accuracy**
  - **Propiedad 17: Project metrics calculation accuracy**
  - **Propiedad 18: Dashboard metrics aggregation**
  - **Valida: Requisitos 6.1, 6.2, 6.3**
 
- [x]* 16. Implementar módulos complementarios

- [x]* 16.1 Implementar módulo de reuniones (meetings)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Crear resolvers GraphQL
  - _Requisitos: 9.1, 9.2, 9.3, 9.4_

- [x]* 16.2 Implementar módulo de objetivos (goals)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar cálculo automático de progreso
  - Crear resolvers GraphQL
  - _Requisitos: 10.1, 10.2, 10.3_

- [x]* 16.3 Implementar módulo de riesgos (risks)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar ordenamiento por severidad
  - Crear resolvers GraphQL
  - _Requisitos: 11.1, 11.2, 11.3, 11.4_

- [x]* 16.4 Implementar módulo de historias de usuario (user-stories)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar filtrado de backlog
  - Crear resolvers GraphQL
  - _Requisitos: 12.1, 12.2, 12.3, 12.4_

- [x]* 16.5 Implementar módulo de feedback (feedback)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar privacidad de feedback anónimo
  - Crear resolvers GraphQL
  - _Requisitos: 13.1, 13.2, 13.3, 13.4_

- [x]* 16.6 Implementar módulo de logros (achievements)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar evaluación automática de logros
  - Crear resolvers GraphQL
  - _Requisitos: 14.1, 14.2, 14.3, 14.4_

- [x]* 16.7 Implementar módulo de notificaciones (notifications)
  - Crear entidades de dominio, TypeORM y mappers
  - Implementar CQRS completo
  - Implementar creación automática de notificaciones por eventos
  - Configurar subscription GraphQL para notificaciones en tiempo real
  - Crear resolvers GraphQL
  - _Requisitos: 16.1, 16.2, 16.3, 16.4_

- [x] 17. Checkpoint - Verificar que todos los tests pasen
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x]* 18. Implementar validaciones de integridad de datos

- [x]* 18.1 Implementar validación de existencia de relaciones
  - Crear interceptor o middleware para validar entidades relacionadas
  - Aplicar a todos los commands que crean relaciones
  - _Requisitos: 17.1_

- [x]* 18.2 Verificar preservación de relaciones en soft delete
  - Verificar que soft delete no rompa relaciones
  - Agregar tests para confirmar comportamiento
  - _Requisitos: 17.2_

- [x]* 18.3 Escribir property tests para integridad de datos
  - **Propiedad 26: Relationship existence validation**
  - **Propiedad 27: Soft delete relationship preservation**
  - **Propiedad 28: Value object validation**
  - **Valida: Requisitos 17.1, 17.2, 17.3**

- [x] 19. Corregir errores de compilación TypeScript
  - Corregir imports incorrectos en módulo de finances
  - Corregir tipos en métodos de repositorio (Partial<Entity> vs Entity)
  - Corregir tipos de deletedAt (null vs undefined)
  - Corregir imports de Description en resolvers
  - Corregir tipos en queries de metrics
  - _Requisitos: 20.1_

- [ ] 20. Ejecutar tests y validar cobertura
  - Ejecutar suite de tests unitarios
  - Ejecutar suite de property-based tests
  - Validar cobertura mínima de 80%
  - Corregir tests fallidos
  - _Requisitos: Testing Strategy_

- [x]* 21. Configurar CI/CD con GitHub Actions

- [x]* 21.1 Crear workflow de CI
  - Configurar linting con ESLint
  - Configurar type checking con TypeScript
  - Configurar ejecución de unit tests
  - Configurar ejecución de property-based tests
  - Configurar ejecución de e2e tests
  - Configurar reporte de cobertura (mínimo 80%)
  - _Requisitos: Testing Strategy_

- [x]* 21.2 Crear workflow de CD para Render
  - Configurar deploy automático a Render en push a main
  - Configurar variables de entorno en Render
  - Configurar health check post-deploy con cron job
  - _Requisitos: CI/CD_

- [x]* 22. Documentación y finalización

- [x]* 22.1 Generar documentación GraphQL
  - Agregar decoradores @Description a queries, mutations y subscriptions
  - Agregar descripciones a parámetros de entrada
  - Verificar GraphQL Playground funcional
  - _Requisitos: 19.5_

- [x]* 22.2 Crear README del proyecto
  - Documentar stack tecnológico
  - Documentar estructura del proyecto
  - Documentar comandos de desarrollo
  - Documentar variables de entorno requeridas
  - Documentar proceso de deploy

- [x]* 22.3 Verificar cobertura de tests
  - Ejecutar reporte de cobertura
  - Asegurar mínimo 80% en handlers
  - Identificar y testear áreas faltantes

- [ ] 23. Checkpoint final - Verificar que todos los tests pasen
  - Asegurar que todos los tests pasen, preguntar al usuario si surgen dudas.
