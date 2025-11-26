# Configuraciones del Sistema

Este directorio contiene todas las configuraciones centralizadas del sistema para mantener una mejor separación de responsabilidades.

## Archivos de Configuración

### `envs.config.ts`
Configuración de variables de entorno del sistema.

### `config.validation.ts`
Esquema de validación Joi para variables de entorno requeridas.

### `typeorm.config.ts`
Configuración de TypeORM para conexión a PostgreSQL y migraciones.

### `graphql.config.ts`
Configuración de Apollo Server 5 y GraphQL con las siguientes características:

- **Code-first approach**: Schema generado automáticamente desde decoradores TypeScript
- **Apollo Sandbox**: Interfaz moderna para desarrollo (Playground deprecado)
- **Introspection**: Habilitado para exploración del schema
- **Subscriptions**: Soporte para WebSockets con `graphql-ws` (protocolo moderno)
- **Context**: Manejo de contexto para queries/mutations (req) y subscriptions (connection)
- **Error Formatting**: Formateo de errores sin exponer detalles internos

**Nota:** Se usa `graphql-ws` en lugar de `subscriptions-transport-ws` (deprecado).

## Uso

Las configuraciones se importan en `app.module.ts`:

```typescript
import { graphqlConfig } from './shared/config/graphql.config';
import { typeorm } from './shared/config/typeorm.config';
import envsConfig from './shared/config/envs.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envsConfig],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig,
    }),
    TypeOrmModule.forRoot(typeorm),
  ],
})
export class AppModule {}
```

## Apollo Sandbox

Una vez iniciada la aplicación, accede a:
```
http://localhost:3000/graphql
```

Apollo Server detectará que es un navegador y te redirigirá automáticamente a Apollo Sandbox.

También puedes acceder directamente a: https://studio.apollographql.com/sandbox/explorer

## Subscriptions

Las subscriptions están configuradas con `graphql-ws` (protocolo moderno). Ejemplo de uso:

```typescript
@Resolver()
export class MetricsResolver {
  @Subscription(() => ProjectMetrics)
  projectMetricsUpdated(@Args('projectId') projectId: string) {
    return this.pubSub.asyncIterator(`projectMetrics.${projectId}`);
  }
}
```
