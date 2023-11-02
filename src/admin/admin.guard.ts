import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/auth/auth.service';
import { getToken } from 'src/common/get-token';
import { Role } from 'src/types/role.type';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers['authorization'];

    return this.authService
      .extract(getToken(auth))
      .then((payload) => payload.role == Role.ADMIN);
  }
}
