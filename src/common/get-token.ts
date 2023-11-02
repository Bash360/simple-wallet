import { HttpException, HttpStatus } from "@nestjs/common";

export function getToken(token: string): string {
  if(!token) throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED)
  return token.split(' ')[1];
}
