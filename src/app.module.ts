import { Module } from '@nestjs/common';
import { WalletController } from './wallets/wallets.controller';
import { AdminController } from './admin/admin.controller';
import { PaymentsController } from './payments/payments.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'simple-wallet',
      autoLoadEntities: true,
      synchronize: true,
    }),
    WalletsModule,
  ],
  controllers: [AdminController, PaymentsController],
  providers: [],
})
export class AppModule {}
