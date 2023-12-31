import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './wallets/wallets.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DepositsModule } from './deposits/deposits.module';
import { AdminModule } from './admin/admin.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    WalletsModule,
    AuthModule,
    DepositsModule,
    UsersModule,
    AdminModule,
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
