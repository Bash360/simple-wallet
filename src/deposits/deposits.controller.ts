import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositService: DepositsService) {}
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webHook(
    @Body() body,
    @Headers('x-paystack-signature') signature: string,
  ) {
    this.depositService.updateDeposit(body, signature);
  }
}
