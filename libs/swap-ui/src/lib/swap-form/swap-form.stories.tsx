import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import { useWallets, Web3WalletProvider } from '../hooks/useWallet';
import {
  ConnectedForm,
  ConnectedFormProps,
  SwapFormWithModal,
} from './swap-form-connected';
import {
  useUniswap,
  getUniswapDefaultTokenList,
  usePools,
  queryPools,
} from '@halfoneplusminus/redcross-swap-contract';

import { useTokenList } from '../hooks/useTokenList';
import { useSwapForm } from '../hooks/useSwapForm';
import { useSearch, useSelectToken } from '../hooks/tokenList';
import { InMemoryCache, ApolloClient } from '@apollo/client';

const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  cache: new InMemoryCache(),
});
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
  fetchTokenList: async () => tokens,
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
  fetchTokenList: async () => tokens,
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
Swap.argTypes = {
  swap: { action: 'clicked' },
};
Swap.args = {
  chainId: some(1),
  fetchTokenList: async () => tokens,
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
  onSwap: async (tokenA, tokenB, si, confirmSwap, cancelSwap) => {
    /*     if ((window as any).swapped) {
      setTimeout(() => cancelSwap(), 2000);
      return;
    } */
    if (tokenB.name === 'USDC') {
      cancelSwap();
      return none;
    }
    setTimeout(() => confirmSwap(), 2000);
    return some('x18484844848');
  },
};

const EtherConnectedSwapForm = (props: ConnectedFormProps) => {
  const {
    library,
    connected,
    isConnected,
    connect,
    account,
    chainId,
  } = useWallets();

  const { tokenList } = useTokenList({
    fetchTokenList: getUniswapDefaultTokenList,
    chainId,
  });
  const { pools, tokenList: poolTokenList } = usePools({
    chainId,
    tokens: tokenList,
    fetchPools: queryPools(client),
  });
  const { filteredTokenList, search } = useSearch(poolTokenList);
  const { isSelected, first, last, selectAtIndex, inverse } = useSelectToken({
    commonlyUsed: props.commonBases,
    tokens: filteredTokenList,
    selected: props.selected,
  });
  const { getTokenPrice } = useUniswap({
    tokenA: first,
    tokenB: last,
    provider: library,
    pools,
  });
  const form = useSwapForm({
    ...props,
    tokens: filteredTokenList,
    first,
    last,
    selectAtIndex,
    inverse,
    isSelected,
    search,
    fetchRate: (token) => {
      console.log('here', token);
      return getTokenPrice(token);
    },
  });

  return (
    <SwapFormWithModal
      {...props}
      account={account}
      connectButton={{ isConnected, connect }}
      connected={connected}
      chainId={chainId}
      swapFormProps={form.bindSwapForm()}
      pairPriceDisplayProps={form.bindPriceDisplay()}
      formSubmitButtonProps={form.bindSubmitButton()}
      confirmModalProps={form.bindConfirmModal()}
      confirmSwapProps={form.bindConfirmSwap()}
      waitingForConfirmationModalProps={form.bindWaitingForConfirmationModal()}
      waitingForConfirmationProps={form.bindWaitingForConfirmation()}
      rejectedModalProps={form.bindCancelModal()}
      swapInformationProps={form.bindSwapInformation()}
      swapButtonProps={form.bindSwapButton()}
      submittedModal={form.bindConfirmedSwapModal()}
      submittedSwap={form.bindTransactionConfirmed()}
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
  commonBases: some([]),
  selected: some([none, none]),
  fetchTokenList: async () => some([some(ETH), some(DAI)]),
};
