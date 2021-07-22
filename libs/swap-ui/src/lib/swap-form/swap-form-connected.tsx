import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { none, some } from 'fp-ts/lib/Option';
import FormSubmitButton, { FormSubmitButtonProps } from './form-submit-button';

import { useSwapForm, UseSwapFormProps } from '../hooks/useSwapForm';

import PairPriceDisplay from './pair-price-display';
import Information from '../icon/information';
import {
  SwapInformation,
  SwapInformationProps,
  TooltipWrapper,
} from '../swap-information/swap-information';
import Tooltip from '../core/tooltip';
import { DarkModal } from '../popup/popup';
import ConfirmSwap from '../confirm-swap/confirm-swap';
import Button from 'antd/lib/button/button';
import Maybe from '../../core/maybe/maybe';
import styled from 'styled-components';
import tw from 'twin.macro';
import { UseSwapInformationProps } from '../hooks/useFetchSwapInformation';
import { WaitingForConfirmationSwap } from '../waiting-for-confirmation/waiting-for-confirmation';
import { TransactionRejected } from '../transaction-rejected/transaction-rejected';
import { TransactionSubmitted } from '../transaction-submitted/transaction-submitted';
import type { Option } from 'fp-ts/Option';

const Row = styled.div`
  ${tw`flex-row inline-flex justify-end gap-2`}
`;

export type ConnectedFormProps = SwapFormProps &
  UseSwapInformationProps &
  UseSwapFormProps &
  Pick<FormSubmitButtonProps, 'connectButton' | 'connected'> &
  Pick<
    SwapInformationProps,
    | 'liquidityProviderFee'
    | 'minimumReceived'
    | 'priceImpact'
    | 'slippageTolerance'
  > & { provider: Option<string> };

export const ConnectedForm = (props: ConnectedFormProps) => {
  const form = useSwapForm({
    ...props,
  });
  const swapFormProps = form.bindSwapForm();
  return (
    <SwapForm {...props} {...swapFormProps}>
      <Row>
        <PairPriceDisplay {...form.bindPriceDisplay()} />
        <Maybe option={swapFormProps.inputA.selected}>
          {() => (
            <Maybe option={swapFormProps.inputB.selected}>
              {() => (
                <Tooltip
                  placement="left"
                  title={
                    <TooltipWrapper>
                      <SwapInformation {...form.bindSwapInformation()} />
                    </TooltipWrapper>
                  }
                >
                  <Information />
                </Tooltip>
              )}
            </Maybe>
          )}
        </Maybe>
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
        footer={<Button {...form.bindSwapButton()}>Confirm Swap</Button>}
        {...form.bindConfirmModal()}
      >
        <ConfirmSwap {...props} {...form.bindConfirmSwap()} />
      </DarkModal>
      <DarkModal
        title={''}
        {...form.bindWaitingForConfirmationModal()}
        footer={null}
      >
        <WaitingForConfirmationSwap {...form.bindWaitingForConfirmation()} />
      </DarkModal>
      <DarkModal
        footer={
          <Button onClick={() => form.bindCancelModal().onCancel()}>
            Dismiss
          </Button>
        }
        {...form.bindCancelModal()}
      >
        <TransactionRejected />
      </DarkModal>
      <DarkModal
        {...form.bindConfirmedSwapModal()}
        footer={
          <Button onClick={form.bindConfirmedSwapModal().onCancel}>
            Close
          </Button>
        }
      >
        <TransactionSubmitted
          provider={props.provider}
          {...form.bindTransactionConfirmed()}
          onClickExplorer={() => {}}
        />
      </DarkModal>
    </SwapForm>
  );
};
