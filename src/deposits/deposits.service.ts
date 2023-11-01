import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposits } from './entities/deposits.entity';
import { Repository } from 'typeorm';
import Paystack from '@paystack/paystack-sdk';
import { generateRandomChar } from 'src/utils/generate-char';
import { Wallets } from 'src/wallets/entities/wallets.entity';
import * as crypto from 'crypto';
import { Status } from 'src/types/status.type';
import { WalletsService } from 'src/wallets/wallets.service';
const paystack = new Paystack(
  'sk_test_42fdc90a9a9b790706ea416e40bc1a2817e31263',
);
@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposits)
    private readonly depositsRepository: Repository<Deposits>,
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
  ) {}

  async makeDeposit(amount: number, wallet: Wallets) {
    const reference = generateRandomChar(8);
    const response = await paystack.transaction.initialize({
      email: 'example@gmail.com',
      amount: amount * 100,
      reference,
    });
    if (response.status) {
      const depositEntity = this.depositsRepository.create({
        wallet,
        reference,
        amount,
      });

      await this.depositsRepository.save(depositEntity);
      return { paymentUrl: response.data.authorization_url };
    }
  }

  async updateDeposit(body, signature: string) {
    const hash = crypto
      .createHmac('sha512', 'sk_test_42fdc90a9a9b790706ea416e40bc1a2817e31263')
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash === signature) {
    }

    const event = body.event;
    const data = body.data;
    switch (event) {
      case 'charge.success':
        const depositPreload = await this.depositsRepository.preload({
          reference: data.reference,
          status: Status.ACCEPTED,
        });
        const deposit = await this.depositsRepository.save(depositPreload);
        await this.walletService.creditWallet(deposit.wallet, deposit.amount);
        break;
      case 'charge.failure':
        const depositPre = await this.depositsRepository.preload({
          reference: data.reference,
          status: Status.REJECTED,
        });
        await this.depositsRepository.save(depositPre);
        break;
      default:
        break;
    }
  }
}
