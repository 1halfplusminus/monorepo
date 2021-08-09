import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { none, some } from 'fp-ts/Option';
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
import {
  WaitingForConfirmationSwap,
  WaitingForConfirmationSwapProps,
} from '../waiting-for-confirmation/waiting-for-confirmation';
import {
  TransactionRejected,
  TransactionRejectedProps,
} from '../transaction-rejected/transaction-rejected';
import {
  TransactionSubmitted,
  TransactionSubmittedProps,
} from '../transaction-submitted/transaction-submitted';
import type { Option } from 'fp-ts/Option';
import { useTokenList, UseTokenList } from '../hooks/useTokenList';
import { never } from 'fp-ts/Task';
import { PairPriceDisplayProps } from './pair-price-display';
import type { ButtonProps } from 'antd/lib/button';
import { ConfirmSwapProps } from '../confirm-swap/confirm-swap';
import type { ModalProps } from 'antd/lib/modal';
import { useSearch, useSelectToken } from '../hooks/tokenList';

const Row = styled.div`
  ${tw`flex-row inline-flex justify-end gap-2`}
`;

export type ConnectedFormProps = Omit<SwapFormProps, 'tokens'> &
  Omit<UseSwapInformationProps, 'tokens'> &
  Omit<UseSwapFormProps, 'tokens'> &
  Pick<FormSubmitButtonProps, 'connectButton' | 'connected'> &
  Pick<UseTokenList, 'fetchTokenList'> &
  Pick<
    SwapInformationProps,
    | 'liquidityProviderFee'
    | 'minimumReceived'
    | 'priceImpact'
    | 'slippageTolerance'
  > & { provider: Option<string> } & { chainId: Option<number> };

export const SwapFormWithModal = (
  props: ConnectedFormProps & {
    pairPriceDisplayProps: PairPriceDisplayProps;
  } & {
    swapFormProps: SwapFormProps;
  } & {
    swapInformationProps: SwapInformationProps;
  } & {
    formSubmitButtonProps: Omit<
      FormSubmitButtonProps,
      'loading' | 'tokens' | 'connected'
    >;
  } & {
    swapButtonProps: ButtonProps;
  } & { confirmModalProps: ModalProps } & {
    confirmSwapProps: Omit<ConfirmSwapProps, 'slippageTolerance'>;
  } & { waitingForConfirmationModalProps: ModalProps } & {
    waitingForConfirmationProps: WaitingForConfirmationSwapProps;
  } & { rejectedModalProps: ModalProps } & { submittedModal: ModalProps } & {
    submittedSwap: Omit<
      TransactionSubmittedProps,
      'provider' | 'onClickExplorer'
    >;
  }
) => {
  return (
    <SwapForm
      {...props}
      {...props.swapFormProps}
      tokens={props.swapFormProps.tokens}
    >
      <Row>
        <PairPriceDisplay {...props.pairPriceDisplayProps} />
        <Maybe option={props.swapFormProps.inputA.selected}>
          {() => (
            <Maybe option={props.swapFormProps.inputB.selected}>
              {() => (
                <Tooltip
                  placement="left"
                  title={
                    <TooltipWrapper>
                      <SwapInformation {...props.swapInformationProps} />
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
        {...props.formSubmitButtonProps}
      />
      <DarkModal
        title={'Confirm Swap'}
        footer={<Button {...props.swapButtonProps}>Confirm Swap</Button>}
        {...props.confirmModalProps}
      >
        <ConfirmSwap {...props} {...props.confirmSwapProps} />
      </DarkModal>
      <DarkModal
        title={''}
        {...props.waitingForConfirmationModalProps}
        footer={null}
      >
        <WaitingForConfirmationSwap {...props.waitingForConfirmationProps} />
      </DarkModal>
      <DarkModal
        footer={
          <Button
            onClick={(e) =>
              props.rejectedModalProps.onCancel &&
              props.rejectedModalProps.onCancel(e)
            }
          >
            Dismiss
          </Button>
        }
        {...props.rejectedModalProps}
      >
        <TransactionRejected />
      </DarkModal>
      <DarkModal
        {...props.submittedModal}
        footer={<Button onClick={props.submittedModal.onCancel}>Close</Button>}
      >
        <TransactionSubmitted
          provider={props.provider}
          {...props.submittedSwap}
          onClickExplorer={never}
        />
      </DarkModal>
    </SwapForm>
  );
};
export const ConnectedForm = (props: ConnectedFormProps) => {
  const { tokenList } = useTokenList({
    fetchTokenList: props.fetchTokenList,
    chainId: props.chainId,
  });
  const { filteredTokenList, search } = useSearch(tokenList);
  const { isSelected, first, last, selectAtIndex, inverse } = useSelectToken({
    commonlyUsed: props.commonBases,
    tokens: filteredTokenList,
    selected: props.selected,
  });
  const form = useSwapForm({
    ...props,
    tokens: tokenList,
    search,
    isSelected,
    first,
    last,
    selectAtIndex,
    inverse,
  });

  return (
    <SwapFormWithModal
      {...props}
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
