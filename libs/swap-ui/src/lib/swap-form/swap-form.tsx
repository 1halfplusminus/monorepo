import React from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import SwapInput, { SwapInputProps } from '../swap-input/swap-input';
import SwapIcon from './swap-icon';
import { PropsWithChildren } from 'react';
/* eslint-disable-next-line */
type UsedSwapInputProps = Omit<SwapInputProps, 'commonBases' | 'tokens'>;

export type SwapFormProps = {
  inputA: UsedSwapInputProps;
  inputB: UsedSwapInputProps;
  tokens: SwapInputProps['tokens'];
  commonBases: SwapInputProps['commonBases'];
  onSearch: SwapInputProps['onSearch'];
  onInserse: () => void;
};

const StyledSwapSurface = styled.div`
  background-color: --surface-background-color;
  ${tw`bg-gray-900 p-2 flex flex-col gap-2`}
  position: relative;
`;

const Title = styled.h2`
  color: surface-color;
  ${tw`text-lg text-white`}
`;

const SwapIconWrapper = styled.div<{ height: number }>`
  position: relative;
  top: -${({ height }) => height / 2}px;
  margin: auto auto;
  svg {
    position: absolute;
    z-index: 1;
    height: ${({ height }) => height}px;
    ${tw`cursor-pointer`}
  }
`;

const FormInputWrapper = styled.div`
  ${tw` flex flex-col gap-1`}
`;

export function SwapForm({
  inputA,
  inputB,
  tokens,
  commonBases,
  onSearch,
  onInserse,
  children,
}: PropsWithChildren<SwapFormProps>) {
  return (
    <StyledSwapSurface>
      <Title>Permuter</Title>
      <FormInputWrapper>
        <SwapInput
          {...inputA}
          onSearch={onSearch}
          tokens={tokens}
          commonBases={commonBases}
        />
        <SwapIconWrapper height={50}>
          <SwapIcon onClick={onInserse} />
        </SwapIconWrapper>
        <SwapInput
          {...inputB}
          onSearch={onSearch}
          tokens={tokens}
          commonBases={commonBases}
        />
        {children}
      </FormInputWrapper>
    </StyledSwapSurface>
  );
}

export default SwapForm;
