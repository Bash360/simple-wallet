import { IsEnum, IsNotEmpty } from 'class-validator';
import { WalletCurrency } from 'src/types/wallet.type';

export class CreateWalletDTO {
  @IsNotEmpty()
  @IsEnum(WalletCurrency, {
    message:
      'Invalid currency. Supported currencies are: NGN, USD, EUR, JPY, GBP, AUD, CAD, CHF',
  })
  currency: WalletCurrency;
}
