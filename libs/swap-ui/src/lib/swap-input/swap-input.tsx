import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat from 'react-number-format';
import TokenSelect, { TokenSelectProps } from '../token-select/token-select';
/* eslint-disable-next-line */
export type SwapInputProps = TokenSelectProps;

const StyledSwapInputWrapper = styled.div`
  ${tw`
  text-blue-700 h-16 bg-gray-700 flex flex-row p-4 rounded-md border-gray-300 border-2`}
  input {
    background-color: transparent;
    border: none;
    text-align: right;
    ${tw`text-2xl text-gray-500`}
    position: relative;
    width: 0;
    flex: 1 1 auto;
  }
`;

export function SwapInput(props: SwapInputProps) {
  return (
    <StyledSwapInputWrapper>
      <TokenSelect {...props} />
      <NumberFormat allowNegative={false} value={'0.0'} />
    </StyledSwapInputWrapper>
  );
}

export default SwapInput;
