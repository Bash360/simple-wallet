import { Injectable } from '@nestjs/common';
import { DepositsService } from 'src/deposits/deposits.service';
import { Status } from 'src/types/status.type';
import { TransferService } from 'src/wallets/transfer.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly depositService: DepositsService,
    private readonly transferService: TransferService,
  ) {}

  async getAllTransfers() {
    return this.transferService.findAllTransfers();
  }

  async getTransfersForApproval() {
    return this.transferService.transfersForApproval();
  }

  async updateTransfer(transferId: number, status: string) {
    return this.transferService.update(transferId, Status[status]);
  }

  async getTransferByDate(startDate: Date, endDate: Date) {
    return this.transferService.findTransfersByDate(startDate, endDate);
  }

  async getDepositsByDate(startDate: Date, endDate: Date) {
    return this.depositService.findDepositsByDate(startDate, endDate);
  }
}
