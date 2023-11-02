import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposits } from './entities/deposits.entity';
import { Between, Repository, SelectQueryBuilder } from 'typeorm';
import Paystack from '@paystack/paystack-sdk';
import { generateRandomChar } from 'src/utils/generate-char';
import { Wallets } from 'src/wallets/entities/wallets.entity';
import * as crypto from 'crypto';
import { Status } from 'src/types/status.type';
import { WalletsService } from 'src/wallets/wallets.service';
const paystack = new Paystack(process.env.PAYSTACK_SECRET);
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
      callback_url: 'http://localhost:3000/api/v1/deposits/redirect',
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
      .createHmac('sha512', process.env.PAYSTACK_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash === signature) {
    }

    const event = body.event;
    const data = body.data;
    switch (event) {
      case 'charge.success':
        const deposit = await this.getDepositByReference(data.reference);
        deposit.status = Status.ACCEPTED;
        await this.depositsRepository.save(deposit);
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

  private async getDepositByReference(reference: string) {
    const queryBuilder: SelectQueryBuilder<Deposits> = this.depositsRepository
      .createQueryBuilder('deposit')
      .where('deposit.reference = :reference', { reference })
      .leftJoinAndSelect('deposit.wallet', 'wallet');

    return queryBuilder.getOne();
  }

  async redirect(ref: string) {
    const deposit = await this.getDepositByReference(ref);
    if (deposit.status === Status.ACCEPTED) {
      throw new HttpException(
        'invalid reference cant fund twice',
        HttpStatus.BAD_REQUEST,
      );
    }
    deposit.status = Status.ACCEPTED;
    await this.depositsRepository.save(deposit);
    await this.walletService.creditWallet(deposit.wallet, deposit.amount);
  }

  async findDepositsByDate(startDate, endDate) {
    const deposits = await this.depositsRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    return deposits;
  }
}
