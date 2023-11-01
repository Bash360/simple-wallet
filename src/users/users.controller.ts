import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDTO } from './dto/create-users.dto';
import { LoginDTO } from './dto/login-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  addUser(@Body() createUsersDTO: CreateUsersDTO) {
    const { phoneNumber, password } = createUsersDTO;

    return this.usersService.createUser(phoneNumber, password);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO) {
    const { phoneNumber, password } = loginDTO;
    return this.usersService.authenticateUser(phoneNumber, password);
  }
}
