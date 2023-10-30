import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletsService],
})
export class WalletsModule {}
