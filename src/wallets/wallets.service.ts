import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallets } from './entities/wallets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateAddress } from 'src/utils/generate-wallet-address';
import { WalletCurrency } from 'src/types/wallet.type';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { getToken } from 'src/common/get-token';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallets)
    private readonly walletRepository: Repository<Wallets>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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

  async fundWallet(amount){}
}
