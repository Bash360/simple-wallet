import { IsNumber, IsPositive, IsString } from 'class-validator';

export class FundWalletDTO {
  @IsString()
  walletAddress: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}
