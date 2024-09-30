import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from 'src/strategies/jwt-access.strategy';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from 'src/strategies/jwt-refresh.strategy';
import { GoogleAuthStrategy } from 'src/strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy, GoogleAuthStrategy],
  exports: [AuthService]
})
export class AuthModule { }
