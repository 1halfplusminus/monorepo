import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import FormSubmitButton, { FormSubmitButtonProps } from './form-submit-button';
import {
  fetchOptionTokenBalance,
  useWallets,
  Web3WalletProvider,
} from '../hooks/useWallet';
import { useSwapForm, UseSwapFormProps } from '../hooks/useSwapForm';

import PairPriceDisplay from './pair-price-display';

export default {
  component: SwapForm,
  title: 'SwapForm/Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);
type ConnectedFormProps = SwapFormProps &
  UseSwapFormProps &
  Pick<FormSubmitButtonProps, 'connectButton' | 'connected'>;
const ConnectedForm = (props: ConnectedFormProps) => {
  const form = useSwapForm({
    ...props,
  });
  return (
    <SwapForm {...props} {...form.bindSwapForm()}>
      <PairPriceDisplay {...form.bindPriceDisplay()} />
      <FormSubmitButton
        loading={some(false)}
        connectButton={props.connectButton}
        tokens={none}
        connected={props.connected}
        {...form.bindSubmitButton()}
      />
    </SwapForm>
  );
};

export const primary: Story<SwapFormProps> = (props) => {
  return <SwapForm {...props} />;
};
export const disconnected: Story<SwapFormProps & UseSwapFormProps> = (
  props
) => {
  return (
    <ConnectedForm
      {...props}
      connectButton={{ isConnected: () => false, connect: () => true }}
      connected={some(false)}
    />
  );
};

disconnected.args = {
  tokens: tokens,
  commonBases,
  selected: some([none, none]),
  account: some('x100000'),
  fetchBalance: () => Promise.resolve('100'),
  balances: some(new Map().set(ETH, 100)),
};
export const EnterAmount: Story<SwapFormProps & UseSwapFormProps> = (props) => {
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
export const Swap: Story<SwapFormProps & UseSwapFormProps> = (props) => {
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
};
const EtherConnectedSwapForm = (props: SwapFormProps & UseSwapFormProps) => {
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
export const WithEtherProviders: Story<SwapFormProps & UseSwapFormProps> = (
  props
) => {
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
