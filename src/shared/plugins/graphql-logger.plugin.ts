import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { ApolloServerPlugin, GraphQLRequestListener, GraphQLRequestContext } from '@apollo/server';
import { envs } from '@shared/config';

@Plugin()
export class GraphQLLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL');

  async requestDidStart(
    requestContext: GraphQLRequestContext<any>,
  ): Promise<GraphQLRequestListener<any>> {
    const start = Date.now();
    const { request } = requestContext;
    const logger = this.logger; // Capturar referencia al logger

    // Extraer información de la query
    const operationName = request.operationName || 'Anonymous';
    const query = request.query?.replace(/\s+/g, ' ').trim().substring(0, 100);

    // Ignorar queries de introspección (usadas por Apollo Sandbox)
    const isIntrospection = operationName === 'IntrospectionQuery';
    if (isIntrospection) {
      return {}; // No logear introspection queries
    }

    return {
      async willSendResponse(requestContext) {
        const duration = Date.now() - start;
        const { response, errors } = requestContext;

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
          logger.debug(`   Query: ${query}`);

          // Opcional: Log de variables
          if (request.variables && Object.keys(request.variables).length > 0) {
            logger.debug(`   Variables: ${JSON.stringify(request.variables)}`);
          }
        }
      },

      async didEncounterErrors(requestContext) {
        const { errors } = requestContext;
        logger.error(`Encountered ${errors.length} error(s)`);
      },
    };
  }
}
