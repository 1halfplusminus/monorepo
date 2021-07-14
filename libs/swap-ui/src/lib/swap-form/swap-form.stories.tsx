import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import {
  fetchOptionTokenBalance,
  useWallets,
  Web3WalletProvider,
} from '../hooks/useWallet';
import { ConnectedForm, ConnectedFormProps } from './swap-form-connected';

const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);

export default {
  component: SwapForm,
  title: 'SwapForm/Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

export const primary: Story<SwapFormProps> = (props) => {
  return <SwapForm {...props} />;
};
export const disconnected: Story<ConnectedFormProps> = (props) => {
  return (
    <ConnectedForm
      {...props}
      connectButton={{ isConnected: () => false, connect: () => true }}
      connected={some(false)}
    />
  );
};
export const disabled: Story<ConnectedFormProps> = (props) => {
  return (
    <ConnectedForm
      {...props}
      connectButton={{ isConnected: () => false, connect: () => true }}
      connected={some(false)}
    />
  );
};
disabled.args = {
  tokens: tokens,
  commonBases,
  selected: some([some(DAI), some(ETH)]),
  account: some('x100000'),
  fetchBalance: () => Promise.resolve('100'),
  balances: some(new Map().set(ETH, 100)),
  disabled: true,
};
export const EnterAmount: Story<ConnectedFormProps> = (props) => {
  return (
    <Web3WalletProvider>
      <ConnectedForm
        {...props}
        connectButton={{ isConnected: () => true, connect: () => true }}
        connected={some(true)}
      />
    </Web3WalletProvider>
  );
};

EnterAmount.args = {
  tokens: tokens,
  commonBases,
  selected: some([none, none]),
  account: some('x100000'),
  fetchBalance: () => Promise.resolve('100'),
  balances: some(new Map().set(ETH, 100)),
  fetchRate: () => Promise.resolve(some(0.001899)),
};
export const Swap: Story<ConnectedFormProps> = (props) => {
  return (
    <Web3WalletProvider>
      <ConnectedForm
        {...props}
        connectButton={{ isConnected: () => true, connect: () => true }}
        connected={some(true)}
      />
    </Web3WalletProvider>
  );
};

Swap.args = {
  tokens: tokens,
  commonBases,
  selected: some([some(ETH), some(DAI)]),
  account: some('x100000'),
  fetchBalance: () => Promise.resolve('100'),
  fetchRate: () => Promise.resolve(some(0.001899)),
  amounts: some(new Map().set(ETH, 100)),
  fetchSwapInformation: async () => ({
    liquidityProviderFee: some('0.000007977'),
    priceImpact: some(0.1),
    minimumReceived: some('55246.1'),
    routes: some([some(ETH), some(USDC), some(DAI)]),
  }),
  slippageTolerance: 0.5,
};

const EtherConnectedSwapForm = (props: ConnectedFormProps) => {
  const { library, connected, isConnected, connect, account } = useWallets();
  return (
    <ConnectedForm
      {...props}
      account={account}
      connectButton={{ isConnected, connect }}
      connected={connected}
      fetchBalance={fetchOptionTokenBalance(library)}
    />
  );
};
export const WithEtherProviders: Story<ConnectedFormProps> = (props) => {
  return (
    <Web3WalletProvider>
      <EtherConnectedSwapForm {...props} />
    </Web3WalletProvider>
  );
};

WithEtherProviders.args = {
  tokens: tokens,
  commonBases,
  selected: some([none, none]),
};
