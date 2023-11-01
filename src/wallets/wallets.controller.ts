import { Controller, UseGuards, Headers, Body, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { Wallets } from './entities/wallets.entity';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async addWallet(
    @Body() creatWalletDTO: CreateWalletDTO,
    @Headers('authorization') auth: string,
  ): Promise<Wallets> {
    return this.walletService.createWallet(creatWalletDTO.currency, auth);
  }
}
