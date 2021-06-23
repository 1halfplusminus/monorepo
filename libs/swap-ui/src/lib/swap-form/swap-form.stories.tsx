import React, { useEffect } from 'react';
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

export default {
  component: SwapForm,
  title: 'SwapForm/Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);

const ConnectedForm = (
  props: SwapFormProps &
    UseSwapFormProps &
    Pick<FormSubmitButtonProps, 'connectButton' | 'connected'>
) => {
  const form = useSwapForm({
    ...props,
  });
  return (
    <SwapForm {...props} {...form.bindSwapForm()}>
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

export const EnterAmount: Story<SwapFormProps & UseSwapFormProps> = (props) => {
  return (
    <Web3WalletProvider>
      <ConnectedForm
        {...props}
        fetchBalance={() => Promise.resolve('100')}
        connectButton={{ isConnected: () => true, connect: () => true }}
        connected={some(true)}
        account={some('x100000')}
      />
    </Web3WalletProvider>
  );
};

EnterAmount.args = {
  tokens: tokens,
  commonBases,
  selected: some([none, none]),
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
