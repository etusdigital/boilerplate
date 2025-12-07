import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { getTestJwtSecret } from './auth.helper';

/**
 * Test application helper utilities.
 * Provides utilities for creating and configuring test NestJS applications.
 */

export interface TestAppOptions {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
}

/**
 * Create a test module with common test configuration
 */
export async function createTestModule(
  options: TestAppOptions = {},
): Promise<TestingModule> {
  const moduleBuilder = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
        load: [
          () => ({
            JWT_SECRET: getTestJwtSecret(),
            JWKS_URI: 'https://test-issuer.example.com/.well-known/jwks.json',
            IDP_ISSUER: 'https://test-issuer.example.com/',
            IDP_AUDIENCE: 'test-audience',
            AUTH0_DOMAIN: 'test.auth0.com',
            AUTH0_CLIENT_ID: 'test-client-id',
            AUTH0_CLIENT_SECRET: 'test-client-secret',
            AUTH0_ROLES_NAME: 'https://bri.us/roles',
          }),
        ],
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        dropSchema: true,
        entities: ['src/**/*.entity.ts'],
        logging: false,
      }),
      ClsModule.forRoot({
        global: true,
        middleware: {
          mount: false,
        },
      }),
      ...(options.imports ?? []),
    ],
    providers: [...(options.providers ?? [])],
    controllers: [...(options.controllers ?? [])],
  });

  return moduleBuilder.compile();
}

/**
 * Create a test NestJS application with common configuration
 */
export async function createTestApp(
  options: TestAppOptions = {},
): Promise<INestApplication> {
  const moduleFixture = await createTestModule(options);
  const app = moduleFixture.createNestApplication();

  // Apply common pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

/**
 * Close test application and cleanup
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  await app.close();
}

/**
 * Create test application with specific modules for integration testing
 */
export async function createIntegrationTestApp(
  moduleImports: any[],
): Promise<INestApplication> {
  return createTestApp({
    imports: moduleImports,
  });
}
