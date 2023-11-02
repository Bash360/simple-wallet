import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [ScheduleModule.forRoot(), AdminModule],
  providers: [CronService],
})
export class CronModule {}
