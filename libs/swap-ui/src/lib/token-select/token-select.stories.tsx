import { Meta, Story } from '@storybook/react';
import { some } from 'fp-ts/lib/Option';
import React from 'react';
import { ETH } from '../__mocks__/tokens';
import { TokenSelect, TokenSelectProps } from './token-select';

export default {
  component: TokenSelect,
  title: 'TokenSelect',
} as Meta;

export const primary: Story<TokenSelectProps> = (props) => {
  return <TokenSelect {...props} />;
};
export const selected: Story<TokenSelectProps> = (props) => {
  return <TokenSelect {...props} />;
};

selected.args = {
  selected: some(ETH),
};
export const disabled: Story<TokenSelectProps> = (props) => {
  return <TokenSelect {...props} />;
};
disabled.parameters = {
  backgrounds: {
    default: 'dark',
  },
};
disabled.args = {
  selected: some(ETH),
  disabled: true,
  disabledText: 'From',
};
