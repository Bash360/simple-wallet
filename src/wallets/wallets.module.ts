import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallets } from './entities/wallets.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Transfers } from './entities/transfer.entity';
import { TransferService } from './transfer.service';
import { DepositsModule } from 'src/deposits/deposits.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallets, Transfers]),
    UsersModule,
    AuthModule,
    DepositsModule,
  ],
  controllers: [WalletController],
  providers: [WalletsService, TransferService],
  exports: [WalletsService, TransferService],
})
export class WalletsModule {}
