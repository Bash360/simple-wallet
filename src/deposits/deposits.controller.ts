import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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

  @Get('redirect')
  async redirect(@Query('reference') ref: string) {
    await this.depositService.redirect(ref);
    return 'wallet funded successfully';
  }
}
