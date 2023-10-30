import { IsString } from 'class-validator';
import { Role } from 'src/types/role.type';

export class CreateUsersDTO {
  @IsString()
  readonly phoneNumber: string;
  @IsString()
  readonly password: string;
}
