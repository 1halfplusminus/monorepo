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
import { DAI, ETH } from '../__mocks__/tokens';
import { surface } from '../core/classes';
import { useSelectToken } from '../hooks/tokenList';
import { selected } from '../token-select/token-select.stories';

export default {
  component: SwapInput,
  title: 'SwapInput',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const Wrapper = styled.div`
  ${surface}
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
  const selectToken = useSelectToken({
    tokens: props.tokens,
    selected: some([props.selected]),
  });
  return (
    <Wrapper>
      <SwapInput
        {...props}
        value={getOrElse(lookup(selectToken.first))}
        onValueChange={modifyAt}
        onSelected={(token) => selectToken.selectAtIndex(token, 0)}
        selected={selectToken.first}
        isSelected={(t) => selectToken.isSelected(t)}
      />
    </Wrapper>
  );
};

WithState.args = {
  sold: none,
  selected: none,
  valueByToken: some(new Map().set(ETH, 100)),
  fiatPrice: some('1000'),
  tokens: some([some(ETH), some(DAI)]),
};
