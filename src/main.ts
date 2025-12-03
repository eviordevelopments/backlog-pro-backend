import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, GraphQLExceptionFilter } from '@shared/filters';
import { envs } from '@shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = [
    'https://studio.apollographql.com', // Apollo Server
    'http://localhost:3000', // Frontend local
    'http://localhost:3001', // Frontend local (alt)
    'http://localhost:3002', // Frontend local (alt)
  ];

  // En producción, agregar origen del frontend si está configurado
  if (envs.server.environment === 'production' && envs.frontend?.url) {
    corsOrigins.push(envs.frontend.url);
  }

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter(), new GraphQLExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envs.server.port, '0.0.0.0');

  if (envs.server.environment !== 'production') {
    console.log('🚀 Application started successfully');
    console.log(`📍 Environment: ${envs.server.environment}`);
    console.log(`🔌 Port: ${envs.server.port}`);
    console.log(`🅰️ Apollo Server: http://localhost:${envs.server.port}/graphql`);
    console.log('💾 Adminer: http://localhost:8080');
  } else {
    console.log('Application started successfully');
  }
}

void bootstrap();
