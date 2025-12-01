import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ProjectsModule } from '@projects/projects.module';
import { SprintsModule } from '@sprints/sprints.module';
import { TasksModule } from '@tasks/tasks.module';
import { TimeEntriesModule } from '@time-entries/time-entries.module';
import { databaseConfig, envsConfig, graphqlConfig, validationSchemaConfig } from '@shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
      validationSchema: validationSchemaConfig,
      load: [envsConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    SharedModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    SprintsModule,
    TasksModule,
    TimeEntriesModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
