import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(user: Users) {
    const payLoad = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return { access_token: await this.jwtService.signAsync(payLoad) };
  }

  async extract(token) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
    } catch (error) {
      throw new HttpException('token expired', HttpStatus.BAD_REQUEST);
    }
  }
}
