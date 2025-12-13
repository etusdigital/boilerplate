import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { AppDataSource } from './database/ormconfig';
import { AccountMiddleware } from './middlewares/account.middleware';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    EventsModule, // Event emitter for domain events
    AuthModule,
    AccountsModule,
    UsersModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: false,
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, AccountMiddleware)
      .exclude('users/login')
      .forRoutes('*');
  }
}
