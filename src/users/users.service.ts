import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly authService: AuthService,
  ) {}

  async createUser(phoneNumber: string, password: string) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.usersRepository.create({
        phoneNumber,
        password: passwordHash,
      });

      const newUser = await this.usersRepository.save(user);
      return this.authService.login(newUser);
    } catch (error) {
      throw new HttpException(
        'user with Phone Number already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async authenticateUser(phoneNumber: string, password: string) {
    const user = await this.usersRepository.findOneBy({ phoneNumber });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      throw new HttpException(
        'authentication failed, invalid password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.login(user);
  }

  async findOne(id: number): Promise<Users> {
    return await this.usersRepository.findOneBy({ id });
  }
}
