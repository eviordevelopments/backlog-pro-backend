 import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL! Hot reload is working! 🔥';
  }

  @Query(() => String)
  health(): string {
    return 'GraphQL API is running';
  }
}
