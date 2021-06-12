import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SwapInput, SwapInputProps } from './swap-input';
import styled from 'styled-components';
import tw from 'twin.macro';
import { getOrElse, useTokenValues } from '../hooks/useTokenValue';
import { none, some } from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ETH } from '../__mocks__/tokens';

export default {
  component: SwapInput,
  title: 'SwapInput',
  parameters: { actions: { argTypesRegex: '^on.*' } },
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
primary.args = {
  selected: none,
};
export const withSold: Story<SwapInputProps> = (props) => {
  return (
    <Wrapper>
      <SwapInput {...props} />
    </Wrapper>
  );
};

withSold.args = {
  sold: some('10'),
  selected: some(ETH),
};
export const WithState: Story<SwapInputProps> = (props) => {
  const { lookup, modifyAt } = useTokenValues({
    valueByToken: some(new Map()),
  });
  return (
    <Wrapper>
      <SwapInput
        {...props}
        value={getOrElse(lookup(props.selected))}
        onValueChange={modifyAt}
      />
    </Wrapper>
  );
};

WithState.args = {
  selected: some(ETH),
};
