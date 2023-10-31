import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(phoneNumber: string, password: string) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        phoneNumber,
        password: passwordHash,
      });

      return this.usersRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'user with Phone Number already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async loginUser(phoneNumber: string, password: string): Promise<Users> {
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

    return user;
  }
}
