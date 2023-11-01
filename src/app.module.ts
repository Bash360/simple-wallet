import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { PaymentsController } from './payments/payments.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './wallets/wallets.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'simple-wallet',
      autoLoadEntities: true,
      synchronize: true,
    }),
    WalletsModule,
    AuthModule,
  ],
  controllers: [AdminController, PaymentsController],
  providers: [],
})
export class AppModule {}
