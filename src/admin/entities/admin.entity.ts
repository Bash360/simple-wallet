import { Role } from 'src/types/role.type';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Admin extends Users {
  @Column({ default: Role.ADMIN })
  role: Role;
}
