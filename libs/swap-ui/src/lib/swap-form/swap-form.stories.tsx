import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import { useSelectToken } from '../hooks/tokenList';

export default {
  component: SwapForm,
  title: 'SwapForm',
} as Meta;

const commonBases = some([ETH, DAI]);
const tokens = [ETH, DAI, USDC];
export const primary: Story<SwapFormProps> = (props) => {
  return <SwapForm {...props} />;
};

export const WithState: Story<SwapFormProps> = (props) => {
  const { isSelected, first, last, selectAtIndex } = useSelectToken({
    commonlyUsed: commonBases,
    tokens: tokens,
    selected: none,
  });
  return (
    <SwapForm
      {...props}
      inputA={{
        isSelected,
        selected: first,
        onSelected: (token) => {
          selectAtIndex(token, 0);
        },
      }}
      inputB={{
        isSelected,
        selected: last,
        onSelected: (token) => {
          console.log('here');
          selectAtIndex(token, 1);
        },
      }}
    />
  );
};
WithState.args = {
  tokens: tokens,
  commonBases,
};
