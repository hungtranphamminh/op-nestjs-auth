import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './config/typeorm.service';
import dbConfig from './config/database.configuration';
import jwtConfig from './config/jwt.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, jwtConfig],
      envFilePath: './config/.env.development',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options!).initialize();
      },
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,     // enable global jwt guard
    //   useClass: JwtAuthGuard,
    // }
  ],
})
export class AppModule { }
