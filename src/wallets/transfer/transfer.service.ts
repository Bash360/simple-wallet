import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WalletsService } from '../wallets.service';
import { Transfers } from '../entities/transfer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallets } from '../entities/wallets.entity';
import { Status } from 'src/types/status.type';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfers)
    private readonly transferRepository: Repository<Transfers>,
    private readonly walletService: WalletsService,
  ) {}

  async addTransfer(
    sendWalletAddress: string,
    receiversWalletAddress: string,
    amount: number,
  ) {
    const sendersWallet = await this.walletService.findByAddress(
      sendWalletAddress,
    );
    const receiversWallet = await this.walletService.findByAddress(
      receiversWalletAddress,
    );
    this.canTransfer(sendersWallet, receiversWallet, amount);
    const status = this.allowedAmount(amount)
      ? Status.ACCEPTED
      : Status.PENDING;

    const transferEntity = this.transferRepository.create({
      sendersWallet,
      recipientWallet: receiversWallet,
      amount,
      status,
    });
    return this.transferRepository.save(transferEntity);
  }

  private sameCurrency(
    sendersWallet: Wallets,
    receiversWallet: Wallets,
  ): boolean {
    return sendersWallet.currency === receiversWallet.currency;
  }
  private hasFunds(balance: number, amount: number): boolean {
    return amount <= balance ? true : false;
  }

  private canTransfer(
    sendersWallet: Wallets,
    receiversWallet: Wallets,
    amount: number,
  ): boolean {
    if (!this.sameCurrency(sendersWallet, receiversWallet)) {
      throw new HttpException(
        'can not transfer to an incompatible wallet must be the same currency',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.hasFunds(sendersWallet.balance, amount)) {
      throw new HttpException(
        'balance too low for transfer',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  private allowedAmount(amount: number) {
    return amount <= 1_000_000;
  }
}
