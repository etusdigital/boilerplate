import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { UsersModule } from '../src/modules/users/users.module';
import { AccountsModule } from '../src/modules/accounts/accounts.module';
import { AuthModule } from '../src/auth/auth.module';
import {
  createTestUser,
  createTestAccount,
  createTestJwt,
  createAuthHeader,
} from '../src/test';
import { User } from '../src/entities/user.entity';
import { Account } from '../src/entities/account.entity';
import { UserAccount } from '../src/entities/user-accounts.entity';
import { DataSource } from 'typeorm';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              JWKS_URI:
                'https://test-issuer.example.com/.well-known/jwks.json',
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
          entities: [User, Account, UserAccount],
          logging: false,
        }),
        ClsModule.forRoot({
          global: true,
          middleware: { mount: false },
        }),
        UsersModule,
        AccountsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear tables before each test
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('DELETE FROM users_accounts');
    await queryRunner.query('DELETE FROM users');
    await queryRunner.query('DELETE FROM accounts');
    await queryRunner.release();
  });

  describe('Factory functions', () => {
    it('should create a test user with default values', () => {
      const user = createTestUser();

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toContain('@example.com');
      expect(user.name).toBe('Test User');
      expect(user.status).toBe('accepted');
      expect(user.isSuperAdmin).toBe(false);
    });

    it('should create a test user with custom values', () => {
      const user = createTestUser({
        email: 'custom@test.com',
        name: 'Custom User',
        isSuperAdmin: true,
      });

      expect(user.email).toBe('custom@test.com');
      expect(user.name).toBe('Custom User');
      expect(user.isSuperAdmin).toBe(true);
    });

    it('should create a test account with default values', () => {
      const account = createTestAccount();

      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.name).toContain('Test Account');
      expect(account.description).toBe('Test account description');
    });
  });

  describe('Auth helper functions', () => {
    it('should create a valid JWT token', () => {
      const token = createTestJwt({
        sub: 'user-123',
        email: 'test@example.com',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create a proper Authorization header', () => {
      const token = createTestJwt({ sub: 'user-123' });
      const header = createAuthHeader(token);

      expect(header).toStartWith('Bearer ');
      expect(header).toContain(token);
    });
  });

  describe('GET /users', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(401);
    });
  });
});
