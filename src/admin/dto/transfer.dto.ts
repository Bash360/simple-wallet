import { IsDate } from 'class-validator';

export class GetTransferDTO {
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
}
