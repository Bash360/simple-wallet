import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallets } from './entities/wallets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateAddress } from 'src/utils/generate-wallet-address';
import { WalletCurrency } from 'src/types/wallet.type';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { getToken } from 'src/common/get-token';
import { TransferService } from './transfer/transfer.service';
import { DepositsService } from 'src/deposits/deposits.service';
import { Mutex } from 'async-mutex';

@Injectable()
export class WalletsService {
  private walletMutex = new Mutex();
  constructor(
    @InjectRepository(Wallets)
    private readonly walletRepository: Repository<Wallets>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly depositsService: DepositsService,
  ) {}

  async createWallet(currency: string, auth: string): Promise<Wallets> {
    const walletAddress = generateAddress(WalletCurrency[currency]);
    const payload = await this.authService.extract(getToken(auth));
    const user = await this.usersService.findOne(payload.id);
    if (user) {
      const hasWallet = this.hasWalletCurrency(
        await this.findWallets(user.id),
        currency,
      );

      if (hasWallet)
        throw new HttpException(
          'wallet for this currency already exist',
          HttpStatus.BAD_REQUEST,
        );

      const walletEntity = await this.walletRepository.create({
        address: walletAddress,
        currency: WalletCurrency[currency],
        user,
      });
      const wallet = await this.walletRepository.save(walletEntity);
      delete wallet.user;
      return wallet;
    }
  }

  private async findWallets(userId: number) {
    const wallets: Wallets[] = await this.walletRepository.findBy({
      user: { id: userId },
    });
    return wallets;
  }

  private hasWalletCurrency(wallets: Wallets[], currency: string): boolean {
    if (wallets.length === 0) return false;
    const wallet = wallets.find(
      (wallet) => wallet.currency === WalletCurrency[currency],
    );

    return wallet ? true : false;
  }

  async findByAddress(address: string): Promise<Wallets> {
    const wallet = await this.walletRepository.findOneBy({ address });
    if (!wallet) {
      throw new HttpException('wallet invalid', HttpStatus.BAD_REQUEST);
    }
    return wallet;
  }

  async debitWallet(wallet: Wallets, amount: number) {
    const release = await this.walletMutex.acquire();
    try {
      wallet.balance -= amount;
      await this.walletRepository.save(wallet);
    } catch (error) {
      console.log(error);
    } finally {
      release();
    }
  }

  async creditWallet(wallet: Wallets, amount: number) {
    const release = await this.walletMutex.acquire();
    try {
      wallet.balance += amount;
      await this.walletRepository.save(wallet);
    } catch (error) {
      console.log(error);
    } finally {
      release();
    }
  }

  async fundWallet(amount: number, walletAddress: string) {
    const wallet = await this.findByAddress(walletAddress);
    if (!wallet) {
      throw new NotFoundException('Invalid wallet address');
    }

    return this.depositsService.makeDeposit(amount, wallet);
  }
}
