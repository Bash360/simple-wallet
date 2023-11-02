import { WalletCurrency } from 'src/types/wallet.type';
import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transfers } from './transfer.entity';
import { Deposits } from 'src/deposits/entities/deposits.entity';
@Entity()
export class Wallets {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  address: string;
  @ManyToOne((type) => Users, (user) => user.wallets)
  user: Users;
  @Column()
  currency: WalletCurrency;
  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Transfers, (transfer) => transfer.sendersWallet)
  sentTransfers: Transfers[];

  @OneToMany(() => Transfers, (transfer) => transfer.recipientWallet)
  receivedTransfers: Transfers[];
  @OneToMany(() => Deposits, (deposit) => deposit.wallet)
  deposits: Deposits[];
}
