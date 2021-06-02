export interface Token {
  symbol: string;
  address: string;
  name: string;
  fullName?: string;
}

export type WalletProvider =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'fortmatic'
  | 'portis';
