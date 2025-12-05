# Cronitor Monitoring Setup

Cronitor está configurado para monitorear el backend de Backlog Pro, incluyendo eventos, errores y jobs programados.

## Configuración

### 1. Variables de Entorno

Agrega tu API key de Cronitor en el archivo `.env`:

```env
CRONITOR_API_KEY=your_api_key_here
```

### 2. Obtener API Key

1. Ve a [Cronitor.io](https://cronitor.io)
2. Crea una cuenta o inicia sesión
3. Ve a Settings → API Keys
4. Copia tu API key

## Uso

### Trackear Eventos

```typescript
import { cronitorService } from './shared/services';

// Trackear un evento simple
cronitorService.trackEvent('user-registered', {
  userId: user.id,
  email: user.email,
});
```

### Trackear Errores

```typescript
import { cronitorService } from './shared/services';

try {
  // Tu código
} catch (error) {
  cronitorService.trackError('payment-processing-error', error, {
    userId: user.id,
    amount: payment.amount,
  });
  throw error;
}
```

### Monitorear Jobs/Tareas Programadas

```typescript
import { cronitorService } from './shared/services';

async function sendDailyReport() {
  const jobName = 'daily-report-job';
  
  try {
    cronitorService.startJob(jobName);
    
    // Tu lógica del job
    await generateReport();
    await sendEmails();
    
    cronitorService.completeJob(jobName, {
      reportsGenerated: 10,
      emailsSent: 50,
    });
  } catch (error) {
    cronitorService.failJob(jobName, error);
    throw error;
  }
}
```

### Ejemplo en un Resolver de GraphQL

```typescript
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { cronitorService } from '../shared/services';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    try {
      const user = await this.userService.create(input);
      
      // Trackear evento exitoso
      cronitorService.trackEvent('user-created', {
        userId: user.id,
        email: user.email,
      });
      
      return user;
    } catch (error) {
      // Trackear error
      cronitorService.trackError('user-creation-failed', error, {
        email: input.email,
      });
      throw error;
    }
  }
}
```

## Monitoreo Automático

Los siguientes eventos se monitorean automáticamente:

- **Startup de la aplicación**: `app-startup`
- **Errores no manejados**: `unhandled-exception` (configurado en `GlobalExceptionFilter`)

## Dashboard de Cronitor

Una vez configurado, puedes ver:

- Eventos en tiempo real
- Alertas cuando fallan jobs
- Métricas de rendimiento
- Historial de errores

## Desactivar Monitoreo

Para desactivar Cronitor (por ejemplo, en desarrollo local):

1. Comenta o elimina `CRONITOR_API_KEY` del archivo `.env`
2. El servicio detectará automáticamente que no hay API key y no enviará datos

## Mejores Prácticas

1. **Nombres descriptivos**: Usa nombres claros para eventos y jobs
2. **Metadata útil**: Incluye información relevante en los metadatos
3. **No enviar datos sensibles**: Evita enviar contraseñas, tokens, etc.
4. **Monitorear jobs críticos**: Especialmente procesos en background
5. **Configurar alertas**: En el dashboard de Cronitor para recibir notificaciones

## Recursos

- [Documentación de Cronitor](https://cronitor.io/docs)
- [Node.js SDK](https://github.com/cronitorio/cronitor-js)
