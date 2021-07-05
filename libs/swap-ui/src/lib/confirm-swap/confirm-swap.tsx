import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import SwapForm from '../swap-form/swap-form';

import { option as O, task as T } from 'fp-ts';
import { SwapInputProps } from '../swap-input/swap-input';
import { constFalse, constVoid } from 'fp-ts/function';
// eslint-disable-next-line @typescript-eslint/no-empty-interface

type UsedSwapInputProps = Pick<SwapInputProps, 'selected' | 'value'>;

export interface ConfirmSwapProps {
  tokenA: UsedSwapInputProps;
  tokenB: UsedSwapInputProps;
}

const StyledWrapper = styled.div`
  ${tw`flex flex-col gap-1`}
`;

export const ConfirmSwap = ({ tokenA, tokenB }: ConfirmSwapProps) => (
  <StyledWrapper>
    <SwapForm
      tokens={O.none}
      commonBases={O.none}
      onSearch={T.never}
      onInverse={T.never}
      disabled={true}
      inputA={{
        ...tokenA,
        sold: O.none,
        isSelected: constFalse,
        onValueChange: constVoid,
        onSelected: constVoid,
      }}
      inputB={{
        ...tokenB,
        sold: O.none,
        isSelected: constFalse,
        onValueChange: constVoid,
        onSelected: constVoid,
      }}
    />
  </StyledWrapper>
);

export default ConfirmSwap;
