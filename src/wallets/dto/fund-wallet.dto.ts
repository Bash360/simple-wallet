import { IsNumber, IsString } from 'class-validator';

export class FundWalletDTO {
  @IsString()
  walletAddress: string;
  @IsNumber()
  amount: number;
}
