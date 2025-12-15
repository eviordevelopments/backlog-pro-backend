import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import type { Request } from 'express';
import type { GraphQLError, GraphQLFormattedError } from 'graphql';

import { envs } from './envs.config';

interface GraphQLContext {
  req?: Request;
  connection?: {
    context?: Record<string, unknown>;
  };
}

const isDevelopment = envs.server.environment !== 'production';

export const graphqlConfig: ApolloDriverConfig = {
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
  playground: false,
  introspection: true, // Necesario para Apollo Sandbox
  // Embedear Apollo Sandbox solo en desarrollo
  ...(isDevelopment && {
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  }),
  // CSRF protection: desactivar en desarrollo local, activar en producción real
  csrfPrevention: !isDevelopment,
  subscriptions: {
    'graphql-ws': true, // Solo usar el protocolo moderno
  },
  // Apollo Sandbox se abre automáticamente cuando introspection está habilitado
  context: ({ req, connection }: GraphQLContext) => {
    // Para queries y mutations, usar req
    if (req) {
      return { req };
    }
    // Para subscriptions, usar connection
    return { req: connection?.context };
  },
  formatError: (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
    // Formatear errores para no exponer detalles internos
    const graphQLError = error as GraphQLError;
    const extensions: Record<string, unknown> = {
      code:
        formattedError.extensions?.code || graphQLError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    };

    // Agregar errores de validación si existen
    if (graphQLError.extensions?.validationErrors) {
      extensions.validationErrors = graphQLError.extensions.validationErrors;
    }

    return {
      message: formattedError.message,
      extensions,
    };
  },
};
