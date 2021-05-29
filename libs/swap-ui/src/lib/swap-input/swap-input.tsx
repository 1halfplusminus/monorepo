import React from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat from 'react-number-format';
/* eslint-disable-next-line */
export interface SwapInputProps {}

const StyledSwapInputWrapper = styled.div`
  ${tw`text-blue-700 h-16 bg-gray-700 flex-row p-4 rounded-md border-gray-300 border-2`}
  input {
    background-color: transparent;
    border: none;
    height: 100%;
    width: 100%;
    text-align: right;
    ${tw`text-2xl text-gray-500`}
  }
`;

export function SwapInput(props: SwapInputProps) {
  return (
    <StyledSwapInputWrapper>
      <NumberFormat allowNegative={false} value={'0.0'} />
    </StyledSwapInputWrapper>
  );
}

export default SwapInput;
