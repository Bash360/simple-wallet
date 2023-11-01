import { WalletCurrency } from 'src/types/wallet.type';
import { generateRandomChar } from './generate-char';

export function generateAddress(currencyCode: WalletCurrency): string {
  const address = `${currencyCode}${generateRandomChar()}`;

  return address;
}
