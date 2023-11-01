import { Role } from 'src/types/role.type';
import { Wallets } from 'src/wallets/entities/wallets.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  phoneNumber: string;
  @Column()
  password: string;
  @Column({ default: Role.USER })
  role: Role;

  @OneToMany((type) => Wallets, (wallet) => wallet.user)
  wallets: Wallets[];
}
