import { WalletCurrency } from 'src/types/wallet.type';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
