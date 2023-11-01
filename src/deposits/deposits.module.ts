import { Module, forwardRef } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposits } from './entities/deposits.entity';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposits]),
    forwardRef(() => WalletsModule),
  ],
  providers: [DepositsService],
  controllers: [DepositsController],
  exports: [DepositsService],
})
export class DepositsModule {}
