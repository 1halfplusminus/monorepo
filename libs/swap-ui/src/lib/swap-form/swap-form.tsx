import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import SwapInput, { SwapInputProps } from '../swap-input/swap-input';

/* eslint-disable-next-line */
type UsedSwapInputProps = Omit<SwapInputProps, 'commonBases' | 'tokens'>;
export interface SwapFormProps {
  inputA: UsedSwapInputProps;
  inputB: UsedSwapInputProps;
  tokens: SwapInputProps['tokens'];
  commonBases: SwapInputProps['commonBases'];
}

const StyledSwapSurface = styled.div`
  background-color: --surface-background-color;
  ${tw`bg-gray-900 p-2 flex flex-col gap-2`}
`;

const Title = styled.h2`
  color: surface-color;
  ${tw`text-lg text-white`}
`;

export function SwapForm({
  inputA,
  inputB,
  tokens,
  commonBases,
}: SwapFormProps) {
  return (
    <StyledSwapSurface>
      <Title>Permuter</Title>
      <SwapInput {...inputA} tokens={tokens} commonBases={commonBases} />
      <SwapInput {...inputB} tokens={tokens} commonBases={commonBases} />
    </StyledSwapSurface>
  );
}

export default SwapForm;
