import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallets } from './entities/wallets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateAddress } from 'src/utils/generate-wallet-address';
import { WalletCurrency } from 'src/types/wallet.type';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallets)
    private readonly walletRepository: Repository<Wallets>,
  ) {}

  // async createWallet(currency: string): Promise<Wallets> {
  //   const walletAddress = generateAddress(WalletCurrency[currency]);



  // }
}
