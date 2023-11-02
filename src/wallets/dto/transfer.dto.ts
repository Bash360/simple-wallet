import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TransferDTO {
  @IsString()
  sendersWalletAddress: string;
  @IsString()
  recipientsWalletAddress: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}
