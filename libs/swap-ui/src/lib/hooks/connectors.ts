import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletProvider } from '../types';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
export const connectors: Partial<{ [key in WalletProvider]: unknown }> = {
  metamask: injected,
};
