import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import SwapInput, { SwapInputProps } from '../swap-input/swap-input';
import SwapIcon from './swap-icon';
import { PropsWithChildren } from 'react';
import { Option, some } from 'fp-ts/Option';
import { Maybe } from '../../core/maybe/maybe';
import StyledSwapSurface from '../core/styled-surface';

/* eslint-disable-next-line */
type UsedSwapInputProps = Omit<SwapInputProps, 'commonBases' | 'tokens'>;

export type SwapFormProps = {
  inputA: UsedSwapInputProps;
  inputB: UsedSwapInputProps;
  tokens: SwapInputProps['tokens'];
  commonBases: SwapInputProps['commonBases'];
  onSearch: SwapInputProps['onSearch'];
  onInverse: () => void;
  disabled?: boolean;
  title?: Option<string>;
};

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
  onInverse,
  children,
  disabled = false,
  title = some('Permuter'),
}: PropsWithChildren<SwapFormProps>) {
  return (
    <StyledSwapSurface>
      <Maybe option={title}>{(title) => <Title>{title}</Title>}</Maybe>

      <FormInputWrapper>
        <SwapInput
          {...inputA}
          onSearch={onSearch}
          tokens={tokens}
          commonBases={commonBases}
          disabled={disabled}
          disabledText="From"
        />
        <SwapIconWrapper height={50}>
          <SwapIcon onClick={onInverse} />
        </SwapIconWrapper>
        <SwapInput
          {...inputB}
          onSearch={onSearch}
          tokens={tokens}
          commonBases={commonBases}
          disabled={disabled}
          disabledText="To"
        />
        {children}
      </FormInputWrapper>
    </StyledSwapSurface>
  );
}

export default SwapForm;
