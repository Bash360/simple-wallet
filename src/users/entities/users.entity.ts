import { Role } from 'src/types/role.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  phoneNumber: string;
  @Column()
  password: string;
  @Column({ default: Role.USER })
  userRole: Role;
}
