import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const E2E_DIR = join(__dirname, '..', 'test', 'e2e');
const files = readdirSync(E2E_DIR).filter(file => file.endsWith('.e2e-spec.ts'));

const oldImports = `import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';`;

const newImports = `import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../setup/test-app.setup';`;

const oldSetup = /beforeAll\(async \(\) => \{[\s\S]*?const moduleFixture: TestingModule = await Test\.createTestingModule\(\{[\s\S]*?imports: \[AppModule\],[\s\S]*?\}\)\.compile\(\);[\s\S]*?app = moduleFixture\.createNestApplication\(\);[\s\S]*?app\.useGlobalPipes\([\s\S]*?new ValidationPipe\(\{[\s\S]*?whitelist: true,[\s\S]*?forbidNonWhitelisted: true,[\s\S]*?transform: true,[\s\S]*?\}\),[\s\S]*?\);[\s\S]*?await app\.init\(\);/;

const newSetup = `beforeAll(async () => {
    app = await createTestApp();`;

console.log(`Found ${files.length} e2e test files to update:`);

files.forEach(file => {
  if (file === 'auth.e2e-spec.ts') {
    console.log(`Skipping ${file} (already updated)`);
    return;
  }

  const filePath = join(E2E_DIR, file);
  let content = readFileSync(filePath, 'utf8');
  
  // Replace imports
  if (content.includes(oldImports)) {
    content = content.replace(oldImports, newImports);
    console.log(`✅ Updated imports in ${file}`);
  }
  
  // Replace setup
  if (oldSetup.test(content)) {
    content = content.replace(oldSetup, newSetup);
    console.log(`✅ Updated setup in ${file}`);
  }
  
  writeFileSync(filePath, content);
});

console.log('✅ All e2e tests updated to use mocked EmailService');