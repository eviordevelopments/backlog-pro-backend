import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@shared/filters';
import { envs } from '@shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Apollo Sandbox
  app.enableCors({
    origin: ['https://studio.apollographql.com'],
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

  if (envs.server.environment !== 'production') {
    console.log('🚀 Application started successfully');
    console.log(`📍 Environment: ${envs.server.environment}`);
    console.log(`🔌 Port: ${envs.server.port}`);
    console.log(`🅰️ Apollo Server: http://localhost:${envs.server.port}/graphql`);
    console.log(`💾 Adminer: http://localhost:8080`);
  } else {
    console.log('Application started successfully');
  }
}

void bootstrap();
