import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SwapInput, SwapInputProps } from './swap-input';
import styled from 'styled-components';
import tw from 'twin.macro';

export default {
  component: SwapInput,
  title: 'SwapInput',
} as Meta;

const Wrapper = styled.div`
  ${tw` h-60 w-96 bg-gray-800 flex flex-col justify-center justify-items-center`}
`;

export const primary: Story<SwapInputProps> = (props) => {
  return (
    <Wrapper>
      <SwapInput {...props} />
    </Wrapper>
  );
};
