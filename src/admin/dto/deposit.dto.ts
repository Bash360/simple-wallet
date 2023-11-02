import { IsDate } from "class-validator";

export class GetDepositDTO {
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
}
