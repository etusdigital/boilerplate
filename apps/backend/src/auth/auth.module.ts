import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleProvider } from './providers';
import { JwtTokenService, SelfIssuedJwtStrategy } from './jwt';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  providers: [
    JwtStrategy,
    SelfIssuedJwtStrategy,
    JwtTokenService,
    {
      provide: GoogleProvider,
      useFactory: (configService: ConfigService) => {
        const googleClientId = configService.get<string>('GOOGLE_CLIENT_ID');
        if (googleClientId) {
          return new GoogleProvider(configService);
        }
        return null;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PassportModule, UsersModule, JwtTokenService, GoogleProvider],
})
export class AuthModule {}
