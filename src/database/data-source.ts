// Must be imported first to load .env file for process.env
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource, DataSourceOptions } from 'typeorm';

import 'reflect-metadata';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  schema: 'public',
  dropSchema: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // factories: [__dirname + '/../**/*.factory{.ts,.js}'],
  // seeds: [__dirname + '/../**/*.seed{.ts,.js}'],
  // cli: {
  //   entitiesDir: 'src',
  //   migrationsDir: 'src/database/migrations',
  //   subscribersDir: 'subscriber',
  // },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: parseInt(process.env.DATABASE_MAX_CONNECTIONS ?? '100', 10),
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
          rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
        }
        : undefined,
  },
} as DataSourceOptions);
