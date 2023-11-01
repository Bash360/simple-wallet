import {
  Controller,
  UseGuards,
  Headers,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { Wallets } from './entities/wallets.entity';
import { FundWalletDTO } from './dto/fund-wallet.dto';

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
  @UseGuards(JwtAuthGuard)
  @Post('fund')
  @HttpCode(HttpStatus.OK)
  async creditWallet(@Body() fundWalletDTO: FundWalletDTO) {
    return this.walletService.fundWallet(
      fundWalletDTO.amount,
      fundWalletDTO.walletAddress,
    );
  }
}
