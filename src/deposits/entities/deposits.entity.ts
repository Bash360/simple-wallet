import { Status } from 'src/types/status.type';
import { Wallets } from 'src/wallets/entities/wallets.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Deposits {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  reference: string;
  @OneToMany(() => Wallets, (wallet) => wallet.deposits)
  wallet: Wallets;
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
