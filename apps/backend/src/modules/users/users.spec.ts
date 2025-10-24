// TODO: Update tests to run with postgres

// import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from '../../entities/user.entity';
// import { UserAccount } from '../../entities/user-accounts.entity';
// import { Repository } from 'typeorm';
// import { ClsService } from 'nestjs-cls';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Account } from '../../entities/account.entity';
// import { AuditLog } from '../../entities/audit-log.entity';
// import { Not } from 'typeorm';
// import { App } from 'supertest/types';
// import { Auth0Provider } from './providers/auth0.provider';
// import { AccountsService } from '../accounts/accounts.service';

describe('UsersController (e2e)', () => {
  // let app: INestApplication<App>;
  // let userRepository: Repository<User>;
  // let userAccountRepository: Repository<UserAccount>;
  // let accountRepository: Repository<Account>;
  // let auditLogRepository: Repository<AuditLog>;

  describe('UsersController', () => {
    it('should be defined', () => {
      expect(UsersController).toBeDefined();
    });
  });

  describe('UsersService', () => {
    it('should be defined', () => {
      expect(UsersService).toBeDefined();
    });
  });

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         type: 'sqlite',
  //         database: ':memory:',
  //         entities: [User, UserAccount, Account, AuditLog],
  //         synchronize: true,
  //         dropSchema: true,
  //       }),
  //       TypeOrmModule.forFeature([User, UserAccount, Account, AuditLog]),
  //     ],
  //     controllers: [UsersController],
  //     providers: [
  //       UsersService,
  //       {
  //         provide: ClsService,
  //         useValue: {
  //           get: jest.fn().mockImplementation((key) => {
  //             switch (key) {
  //               case 'accountId':
  //                 return 1;
  //               case 'user':
  //                 return { id: 1 };
  //               case 'transactionId':
  //                 return 'test-transaction';
  //               default:
  //                 return null;
  //             }
  //           }),
  //         },
  //       },
  //       {
  //         provide: Auth0Provider,
  //         useValue: {
  //           createUser: jest.fn(),
  //           updateUser: jest.fn(),
  //           deleteUser: jest.fn(),
  //           getUser: jest.fn(),
  //         },
  //       },
  //       {
  //         provide: AccountsService,
  //         useValue: {
  //           findOne: jest.fn(),
  //           findAll: jest.fn(),
  //         },
  //       },
  //     ],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       transform: true,
  //       whitelist: true,
  //     }),
  //   );
  //   await app.init();

  //   userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  //   userAccountRepository = moduleFixture.get<Repository<UserAccount>>(getRepositoryToken(UserAccount));
  //   accountRepository = moduleFixture.get<Repository<Account>>(getRepositoryToken(Account));
  //   auditLogRepository = moduleFixture.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));

  //   await accountRepository.save([
  //     { name: 'Test Account 1', domain: 'test1.com' },
  //     { name: 'Test Account 2', domain: 'test2.com' },
  //   ]);

  //   await userRepository.save({
  //     name: 'System User',
  //     email: 'system@test.com',
  //   });

  //   await userAccountRepository.save({
  //     userId: '1',
  //     accountId: '1',
  //   });
  // });

  // beforeEach(async () => {
  //   await auditLogRepository.clear();
  //   await userAccountRepository.delete({ userId: Not('1') });
  //   await userRepository.delete({ id: Not('1') });
  // });

  // afterAll(async () => {
  //   await app.close();
  // });

  // describe('POST /users', () => {
  //   it('should create a new user', async () => {
  //     const newUser = {
  //       name: 'John Doe',
  //       email: 'john@example.com',
  //       profileImage: 'image.jpg',
  //     };

  //     const response = await request(app.getHttpServer()).post('/users').send(newUser).expect(201);

  //     expect(response.body).toBeDefined();
  //     expect((response.body as User).name).toBe(newUser.name);
  //     expect((response.body as User).email).toBe(newUser.email);
  //     expect((response.body as User).profileImage).toBe(newUser.profileImage);

  //     const createdUser = await userRepository.findOne({
  //       where: { email: newUser.email },
  //     });
  //     expect(createdUser).toBeDefined();
  //     expect(createdUser?.name).toBe(newUser.name);
  //     expect(createdUser?.email).toBe(newUser.email);
  //   });

  //   it('should fail with invalid email', async () => {
  //     const invalidUser = {
  //       name: 'John Doe',
  //       email: 'invalid-email',
  //       profileImage: 'image.jpg',
  //     };

  //     await request(app.getHttpServer()).post('/users').send(invalidUser).expect(400);

  //     const user = await userRepository.findOne({
  //       where: { email: invalidUser.email },
  //     });
  //     expect(user).toBeNull();
  //   });
  // });

  // describe('GET /users', () => {
  //   it('should return an array of users', async () => {
  //     await userRepository.save([
  //       { name: 'User 1', email: 'user1@example.com' },
  //       { name: 'User 2', email: 'user2@example.com' },
  //     ]);

  //     const response = await request(app.getHttpServer()).get('/users').expect(200);

  //     expect(Array.isArray(response.body)).toBeTruthy();
  //     expect((response.body as User[]).length).toBe(3);
  //     expect((response.body as User[])[1].email).toBe('user1@example.com');
  //     expect((response.body as User[])[2].email).toBe('user2@example.com');
  //   });
  // });

  // describe('PUT /users/:id', () => {
  //   it('should update an existing user', async () => {
  //     const user = await userRepository.save({
  //       name: 'Original Name',
  //       email: 'original@example.com',
  //     });

  //     const updateData = {
  //       name: 'Updated Name',
  //       email: 'updated@example.com',
  //     };

  //     const response = await request(app.getHttpServer()).put(`/users/${user.id}`).send(updateData).expect(200);

  //     expect(response.body).toBeDefined();
  //     expect((response.body as { affected: number }).affected).toBeGreaterThan(0);

  //     const updatedUser = await userRepository.findOne({
  //       where: { id: user.id },
  //     });
  //     expect(updatedUser?.name).toBe(updateData.name);
  //     expect(updatedUser?.email).toBe(updateData.email);
  //   });
  // });

  // describe('DELETE /users/:id', () => {
  //   it('should delete an existing user', async () => {
  //     const user = await userRepository.save({
  //       name: 'To Delete',
  //       email: 'delete@example.com',
  //     });

  //     const response = await request(app.getHttpServer()).delete(`/users/${user.id}`).expect(200);

  //     expect(response.body).toBeDefined();
  //     expect((response.body as { success: boolean }).success).toBeTruthy();

  //     const deletedUser = await userRepository.findOne({
  //       where: { id: user.id },
  //       withDeleted: true,
  //     });
  //     expect(deletedUser?.deletedAt).not.toBeNull();
  //   });
  // });

  // describe('POST /users/accounts', () => {
  //   it('should create user accounts', async () => {
  //     const user = await userRepository.save({
  //       name: 'Account User',
  //       email: 'account@example.com',
  //     });

  //     const accounts = await accountRepository.find();
  //     const userAccounts = [
  //       { userId: user.id, accountId: accounts[0].id },
  //       { userId: user.id, accountId: accounts[1].id },
  //     ];

  //     await request(app.getHttpServer()).post('/users/accounts').send(userAccounts).expect(201);

  //     const createdAccounts = await userAccountRepository.find({
  //       where: { userId: user.id },
  //     });
  //     expect(createdAccounts.length).toBe(2);
  //     expect(createdAccounts[0].accountId).toBe(accounts[0].id);
  //     expect(createdAccounts[1].accountId).toBe(accounts[1].id);
  //   });
  // });

  // describe('DELETE /users/accounts', () => {
  //   it('should delete user accounts', async () => {
  //     const user = await userRepository.save({
  //       name: 'Account User',
  //       email: 'account@example.com',
  //     });

  //     const accounts = await accountRepository.find();
  //     await userAccountRepository.save({
  //       userId: user.id,
  //       accountId: accounts[0].id,
  //     });

  //     await request(app.getHttpServer())
  //       .delete('/users/accounts')
  //       .send([{ userId: user.id, accountId: accounts[0].id }])
  //       .expect(200);

  //     const remainingAccounts = await userAccountRepository.find({
  //       where: { userId: user.id },
  //     });
  //     expect(remainingAccounts.length).toBe(0);
  //   });
  // });
});
