import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallets } from './wallets.entity';
import { Status } from 'src/types/status.type';

@Entity()
export class Transfers {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Wallets, (wallet) => wallet.sentTransfers, {
    cascade: ['insert', 'update'],
  })
  sendersWallet: Wallets;
  @ManyToOne(() => Wallets, (wallet) => wallet.receivedTransfers, {
    cascade: ['insert', 'update'],
  })
  recipientWallet: Wallets;
  @Column()
  amount: number;
  @Column({ default: Status.PENDING })
  status: Status;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
