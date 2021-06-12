export interface Token {
  symbol: string;
  address: string;
  name: string;
  fullName?: string;
  isNative?: boolean;
}

export type WalletProvider =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'fortmatic'
  | 'portis';
