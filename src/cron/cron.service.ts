import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminService } from 'src/admin/admin.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CronService {
  constructor(private readonly adminService: AdminService) {}

  @Cron('0 0 * * *')
  async summary() {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endDate = currentDate;

    const transfers = await this.adminService.getTransferByDate(
      startDate,
      endDate,
    );

    const deposits = await this.adminService.getDepositsByDate(
      startDate,
      endDate,
    );

    const data = [...transfers, ...deposits];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Reference', key: 'reference', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    data.forEach((item) => {
      if ('reference' in item) {
        worksheet.addRow({
          id: item.id,
          reference: item.reference || '',
          amount: item.amount,
          status: item.status,
          createdAt: item.createdAt,
          type: 'deposit',
        });
      } else {
        worksheet.addRow({
          id: item.id,
          reference: 'nil',
          amount: item.amount,
          status: item.status,
          createdAt: item.createdAt,
          type: 'transfer',
        });
      }
    });

    const filename = `summary-${currentDate.toISOString()}.xlsx`;

    const rootDirectory = path.join(__dirname, '..', '..');
    const summaryDirectory = path.join(rootDirectory, 'summary');

    if (!fs.existsSync(summaryDirectory)) {
      fs.mkdirSync(summaryDirectory);
    }
    const filePath = path.join(summaryDirectory, filename);

    await workbook.xlsx.writeFile(filePath);
  }
}
