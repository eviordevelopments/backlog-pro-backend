import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';

import { envs } from '../config/index';

@Plugin()
export class GraphQLLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL');

  requestDidStart(
    requestContext: GraphQLRequestContext<Record<string, unknown>>,
  ): Promise<GraphQLRequestListener<Record<string, unknown>>> {
    const start = Date.now();
    const { request } = requestContext;
    const logger = this.logger; // Capturar referencia al logger

    // Extraer información de la query
    const operationName = request.operationName;

    return Promise.resolve(this.createListener(start, request, operationName, logger));
  }

  private createListener(
    start: number,
    request: { operationName?: string; query?: string; variables?: Record<string, unknown> },
    operationName: string | undefined,
    logger: Logger,
  ): GraphQLRequestListener<Record<string, unknown>> {
    // Si no hay operationName, intentar extraerlo del query string
    if (!operationName && request.query) {
      // Primero intentar extraer nombre de operación explícito: mutation NombreOp { ... }
      let match = request.query.match(/(?:query|mutation|subscription)\s+(\w+)\s*[({]/i);

      if (match) {
        operationName = match[1];
      } else {
        // Si no hay nombre explícito, extraer el primer campo: mutation { nombreCampo(...) }
        match = request.query.match(/(?:query|mutation|subscription)\s*\{\s*(\w+)/i);
        operationName = match ? match[1] : 'Anonymous';
      }
    }

    operationName = operationName || 'Anonymous';
    const query = request.query?.replace(/\s+/g, ' ').trim().substring(0, 100);

    // Ignorar queries de introspección (usadas por Apollo Sandbox)
    const isIntrospection = operationName === 'IntrospectionQuery';
    if (isIntrospection) {
      return {}; // No logear introspection queries
    }

    return {
      async willSendResponse(requestContext) {
        const duration = Date.now() - start;
        const { errors } = requestContext;

        if (errors && errors.length > 0) {
          // Log de errores
          logger.error(`❌ ${operationName} - ${duration}ms - Errors: ${errors.length}`);
          errors.forEach((error) => {
            logger.error(`   └─ ${error.message}`);
          });
        } else {
          // Log exitoso
          const statusEmoji = duration < 100 ? '⚡' : duration < 500 ? '✅' : '⏱️';
          logger.log(`${statusEmoji} ${operationName} - ${duration}ms`);
        }

        // Log detallado en desarrollo
        if (envs.server.environment !== 'production') {
          logger.debug(`Query: ${query}`);

          // Opcional: Log de variables
          if (request.variables && Object.keys(request.variables).length > 0) {
            logger.debug(`Variables: ${JSON.stringify(request.variables)}`);
          }
        }

        return Promise.resolve();
      },

      async didEncounterErrors(requestContext) {
        const { errors } = requestContext;
        logger.error(`Encountered ${errors.length} error(s)`);
        return Promise.resolve();
      },
    };
  }
}
