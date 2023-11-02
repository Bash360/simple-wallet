import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/types/role.type';


export const IS_Admin_KEY = 'isAdmin';
export const Admin = () => SetMetadata(IS_Admin_KEY, Role.ADMIN);
