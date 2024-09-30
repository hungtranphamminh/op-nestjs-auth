import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      // schema: 'public',
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.name'),
      synchronize: true,
      // dropSchema: false,
      logging: this.configService.get('nodeEnv') !== 'production',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],   // for yarn start:dev-og
      entities: ["dist/**/*.entity.js"],                       // for yarn start:dev after yarn start:dev-og or yarn build

      // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      // cli: {
      //   entitiesDir: 'src',
      //   migrationsDir: 'src/db/migrations',
      //   subscribersDir: 'subscriber',
      // },
      // extra: {
      //   // based on https://node-postgres.com/api/pool
      //   // max connection pool size
      //   max: this.configService.get('db.maxConnections'),
      //   ssl: this.configService.get('db.sslEnabled')
      //     ? {
      //       rejectUnauthorized: this.configService.get('db.rejectUnauthorized'),
      //     }
      //     : undefined,
      // },
    } as TypeOrmModuleOptions;
  }
}
