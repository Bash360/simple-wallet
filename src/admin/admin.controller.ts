import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Status } from 'src/types/status.type';
import { GetTransferDTO } from './dto/transfer.dto';
import { GetDepositDTO } from './dto/deposit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post('transfers/approve/:transferId')
  async approveTransfer(@Param('transferId', ParseIntPipe) transferId: number) {
    return this.adminService.updateTransfer(transferId, Status.ACCEPTED);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post('transfers/reject/:transferId')
  async rejectTransfer(@Param('transferId', ParseIntPipe) transferId: number) {
    return this.adminService.updateTransfer(transferId, Status.REJECTED);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('transfers/forapproval')
  async getTransfersForApproval() {
    return this.adminService.getTransfersForApproval();
  }
  @Post('transfers/bydate')
  async getTransfersbByDate(@Body() getTransferDTO: GetTransferDTO) {
    const { startDate, endDate } = getTransferDTO;
    return this.adminService.getTransferByDate(startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post('deposits/bydate')
  async getDepositsByDate(@Body() getDepositDTO: GetDepositDTO) {
    const { startDate, endDate } = getDepositDTO;
    this.adminService.getDepositsByDate(startDate, endDate);
  }
}
