import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SwapInput, SwapInputProps } from './swap-input';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  getOrElse,
  useTokenValues,
  UseTokenValueProps,
} from '../hooks/useTokenValue';
import { none, some } from 'fp-ts/Option';
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
  sold: none,
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

export const withFiatPrice: Story<SwapInputProps> = (props) => {
  return (
    <Wrapper>
      <SwapInput {...props} />
    </Wrapper>
  );
};

withFiatPrice.args = {
  sold: none,
  selected: some(ETH),
  fiatPrice: some('1000'),
  value: '10',
};
export const disabled: Story<SwapInputProps> = (props) => {
  return (
    <Wrapper>
      <SwapInput {...props} />
    </Wrapper>
  );
};

disabled.args = {
  sold: none,
  selected: some(ETH),
  fiatPrice: some('1000'),
  value: '10',
  disabled: true,
  disabledText: 'From',
};
export const WithState: Story<SwapInputProps & UseTokenValueProps> = (
  props
) => {
  const { lookup, modifyAt } = useTokenValues({
    valueByToken: props.valueByToken,
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
  sold: none,
  selected: some(ETH),
  valueByToken: some(new Map().set(ETH, 100)),
  fiatPrice: some('1000'),
};
