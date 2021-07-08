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
import Information from '../icon/information';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  SwapInformation,
  SwapInformationProps,
  TooltipWrapper,
} from '../swap-information/swap-information';
import Tooltip from '../core/tooltip';
import { DarkModal } from '../popup/popup';
import ConfirmSwap from '../confirm-swap/confirm-swap';
import Button from 'antd/lib/button/button';

export default {
  component: SwapForm,
  title: 'SwapForm/Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;
const Row = styled.div`
  ${tw`flex-row inline-flex justify-end gap-2`}
`;
const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);
type ConnectedFormProps = SwapFormProps &
  UseSwapFormProps &
  Pick<FormSubmitButtonProps, 'connectButton' | 'connected'> &
  Pick<
    SwapInformationProps,
    | 'liquidityProviderFee'
    | 'minimumReceived'
    | 'priceImpact'
    | 'slippageTolerance'
  >;
const ConnectedForm = (props: ConnectedFormProps) => {
  const form = useSwapForm({
    ...props,
  });
  const swapFormProps = form.bindSwapForm();
  return (
    <SwapForm {...props} {...swapFormProps}>
      <Row>
        <PairPriceDisplay {...form.bindPriceDisplay()} />
        <Tooltip
          placement="left"
          title={
            <TooltipWrapper>
              <SwapInformation
                tokenA={swapFormProps.inputA}
                tokenB={swapFormProps.inputB}
                {...props}
              />
            </TooltipWrapper>
          }
        >
          <Information />
        </Tooltip>
      </Row>

      <FormSubmitButton
        loading={some(false)}
        connectButton={props.connectButton}
        tokens={none}
        connected={props.connected}
        {...form.bindSubmitButton()}
      />
      <DarkModal
        title={'Confirm Swap'}
        okText={'Confirm Swap'}
        cancelText={''}
        footer={
          <>
            <Button onClick={form.confirmSwapModal.handleCancel}>
              Confirm Swap
            </Button>
          </>
        }
        {...form.bindConfirmModal()}
      >
        <ConfirmSwap {...props} {...form.bindConfirmSwap()} />
      </DarkModal>
    </SwapForm>
  );
};

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
  liquidityProviderFee: some('0.000007977'),
  priceImpact: some(0.0),
  minimumReceived: some('55246.1'),
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
