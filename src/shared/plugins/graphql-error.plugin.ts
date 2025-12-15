import { Plugin } from '@nestjs/apollo';
import { GraphQLError } from 'graphql';

import { BaseDomainException } from '../exceptions/base-domain.exception';

@Plugin()
export class GraphQLErrorPlugin {
  didResolveOperation(requestContext: { errors?: GraphQLError[] }): void {
    const { errors } = requestContext;

    if (errors) {
      requestContext.errors = errors.map((error: GraphQLError) => {
        const originalError = error.originalError;

        if (originalError instanceof BaseDomainException) {
          return new GraphQLError(originalError.mensaje, {
            nodes: error.nodes,
            source: error.source,
            positions: error.positions,
            path: error.path,
            originalError,
            extensions: {
              code: originalError.codigo,
              timestamp: new Date().toISOString(),
            },
          });
        }

        // No exponer stack traces al cliente
        if (originalError && !(originalError instanceof GraphQLError)) {
          return new GraphQLError('Error interno del servidor', {
            nodes: error.nodes,
            source: error.source,
            positions: error.positions,
            path: error.path,
            originalError,
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              timestamp: new Date().toISOString(),
            },
          });
        }

        return error;
      });
    }
  }
}
