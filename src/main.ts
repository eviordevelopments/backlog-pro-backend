import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters';
import { envs } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Apollo Sandbox
  app.enableCors({
    origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envs.server.port);

  if (envs.server.environment === 'production') {
    console.log('🚀 Application started successfully');
    console.log(`📍 Environment: ${envs.server.environment}`);
    console.log(`🔌 Port: ${envs.server.port}`);
  } else {
    console.log(`Application is running on: http://localhost:${envs.server.port}`);
    console.log(`GraphQL endpoint: http://localhost:${envs.server.port}/graphql`);
    console.log('Apollo Sandbox: https://studio.apollographql.com/sandbox/explorer');
  }
}

void bootstrap();
