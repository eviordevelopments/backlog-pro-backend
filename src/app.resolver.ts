import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { HealthCheck } from './app.types';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL! Hot reload is working! 🔥';
  }

  @Query(() => HealthCheck)
  async health(): Promise<HealthCheck> {
    return this.appService.getHealth();
  }
}
