# Tests Directory

This directory contains all tests for the Backlog Pro Backend application.

## Structure

```
test/
├── unit/                    # Unit tests
│   ├── tasks/              # Task module tests
│   ├── users/              # User module tests
│   ├── projects/           # Project module tests
│   ├── sprints/            # Sprint module tests
│   ├── clients/            # Client module tests
│   ├── shared/             # Shared utilities tests
│   └── ...                 # Other modules
│
├── e2e/                    # End-to-end tests
│   ├── auth.e2e-spec.ts
│   ├── users.e2e-spec.ts
│   └── clients-projects.e2e-spec.ts
│
├── jest-unit.json          # Jest config for unit tests
└── jest-e2e.json           # Jest config for e2e tests
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:cov

# Debug unit tests
npm run test:debug
```

### E2E Tests
```bash
# Make sure Docker is running
npm run docker:up

# Run all e2e tests
npm run test:e2e

# Run e2e tests in watch mode
npm run test:e2e:watch
```

### All Tests
```bash
# Run both unit and e2e tests
npm run test:all
```

## Test Types

### Unit Tests (`test/unit/`)
- Test individual functions, classes, and methods in isolation
- Fast execution (milliseconds)
- Use mocks for dependencies
- Located alongside their module structure

### E2E Tests (`test/e2e/`)
- Test complete user flows through GraphQL endpoints
- Slower execution (seconds)
- Use real database connections
- Test authentication, validation, and integration

## Configuration

- **jest-unit.json**: Configuration for unit tests
  - Matches files: `test/unit/**/*.spec.ts`
  - Coverage output: `coverage/unit/`

- **jest-e2e.json**: Configuration for e2e tests
  - Matches files: `test/e2e/**/*.e2e-spec.ts`
  - Timeout: 30 seconds
  - Runs sequentially (maxWorkers: 1)

## Environment

E2E tests use `.env.test` for configuration:
- Connects to PostgreSQL in Docker (localhost:5433)
- Uses test-specific JWT secrets
- NODE_ENV=test

## Best Practices

1. **Unit tests**: Test business logic, calculations, and validations
2. **E2E tests**: Test critical user flows (signup, create project, assign task)
3. **Keep tests isolated**: Each test should be independent
4. **Use descriptive names**: Test names should explain what is being tested
5. **Follow AAA pattern**: Arrange, Act, Assert
