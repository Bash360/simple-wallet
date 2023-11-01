import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallets } from './entities/wallets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallets])],
  controllers: [WalletController],
  providers: [WalletsService],
})
export class WalletsModule {}
